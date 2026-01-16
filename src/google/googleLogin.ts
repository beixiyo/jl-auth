import type {
  GoogleLoginConfig,
  GooglePopupLoginConfig,
  GooglePopupLoginResult,
  GooglePopupCodeResult,
  GooglePrompt,
} from './type'
import { buildOAuthUrl } from '@/utils'
import { loadScript } from '@/utils/loadScript'
import { GOOGLE_GIS_SDK_URL, GOOGLE_OAUTH_URL } from './constants'


/**
 * 浏览器跳转到谷歌登录（重定向模式）
 *
 * @deprecated 此方式需要后端使用 client_secret，推荐使用 googlePopupLogin（无需 secret）
 * @see googlePopupLogin
 */
export function googleRedirectLogin(googleLoginConfig: GoogleLoginConfig) {
  const query = {
    scope: 'email profile',
    ...googleLoginConfig,
  }

  window.location.href = buildOAuthUrl(
    GOOGLE_OAUTH_URL,
    query,
  )
}

/**
 * 通过 Google Identity Services SDK 弹窗登录（Implicit Flow）
 * 使用 initTokenClient 获取 access_token，无需 client_secret
 */
export async function googlePopupLogin(
  config: GooglePopupLoginConfig
): Promise<GooglePopupLoginResult> {
  if (typeof window === 'undefined') {
    throw new Error('googlePopupLogin 仅能在浏览器环境中使用')
  }

  const google = await loadGoogleSdk()
  const scope = config.overrideScope
    ? config.scope || ''
    : `openid email profile ${config.scope || ''}`.trim()

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: config.client_id,
      scope,
      state: config.state,
      prompt: config.prompt,
      hint: config.hint,
      hosted_domain: config.hosted_domain,
      enable_serial_consent: config.enable_serial_consent,
      include_granted_scopes: config.include_granted_scopes,
      callback: response => {
        if (response.error) {
          reject(
            new Error(
              response.error_description ??
                response.error ??
                'Google 登录失败'
            )
          )
          return
        }

        if (!response.access_token) {
          reject(new Error('Google 登录未返回 access_token'))
          return
        }

        const result: GooglePopupLoginResult = {
          access_token: response.access_token,
          expires_in: Number(response.expires_in),
          hd: response.hd,
          prompt: response.prompt!,
          token_type: response.token_type!,
          scope: response.scope!,
          state: response.state,
        }

        resolve(result)
      },
      error_callback: (error) => {
        reject(new Error(error.type === 'popup_closed' ? '用户关闭了登录窗口' : `Google 登录异常: ${error.type}`))
      }
    })

    client.requestAccessToken()
  })
}

/**
 * 通过 Google Identity Services SDK 弹窗获取授权码 (Auth Code Flow)
 * 得到 code 后需传给后端，由后端使用 client_secret 换取 token
 */
export async function googlePopupCodeLogin(
  config: GooglePopupLoginConfig
): Promise<GooglePopupCodeResult> {
  if (typeof window === 'undefined') {
    throw new Error('googlePopupCodeLogin 仅能在浏览器环境中使用')
  }

  const google = await loadGoogleSdk()
  const scope = config.overrideScope
    ? config.scope || ''
    : `openid email profile ${config.scope || ''}`.trim()

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: config.client_id,
      scope,
      state: config.state,
      hint: config.hint,
      hosted_domain: config.hosted_domain,
      callback: response => {
        if (response.error) {
          reject(
            new Error(
              response.error_description ??
                response.error ??
                'Google 授权失败'
            )
          )
          return
        }

        if (!response.code) {
          reject(new Error('Google 登录未返回 authorization_code'))
          return
        }

        resolve({
          code: response.code,
          scope: response.scope,
          state: response.state,
        })
      },
      error_callback: (error) => {
        reject(new Error(error.type === 'popup_closed' ? '用户关闭了登录窗口' : `Google 登录异常: ${error.type}`))
      }
    })

    client.requestCode()
  })
}

function loadGoogleSdk(): Promise<GoogleNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new Error('googlePopupLogin 仅能在浏览器环境中使用')
    )
  }

  return loadScript<GoogleNamespace>({
    src: GOOGLE_GIS_SDK_URL,
    getResult: () =>
      window.google?.accounts?.oauth2 ? window.google : undefined,
    attributes: {
      async: true,
      defer: true,
    },
    errorMessage: 'Google Identity Services SDK 加载失败',
  })
}


type GoogleNamespace = {
  accounts: {
    oauth2: {
      initTokenClient: (
        config: GoogleInitTokenClientConfig
      ) => GoogleTokenClient
      initCodeClient: (
        config: GoogleInitCodeClientConfig
      ) => GoogleCodeClient
    }
  }
}

type GoogleTokenClient = {
  requestAccessToken: (config?: { prompt?: GooglePrompt; state?: string }) => void
}

type GoogleCodeClient = {
  requestCode: () => void
}

type GoogleInitTokenClientConfig = {
  client_id: string
  scope: string
  state?: string
  prompt?: GooglePrompt
  hint?: string
  hosted_domain?: string
  enable_serial_consent?: boolean
  include_granted_scopes?: boolean
  callback: (response: GoogleTokenResponse) => void
  error_callback?: (error: { type: 'popup_failed_to_open' | 'popup_closed' | 'unknown' }) => void
}

type GoogleInitCodeClientConfig = {
  client_id: string
  scope: string
  state?: string
  hint?: string
  hosted_domain?: string
  callback: (response: GoogleCodeResponse) => void
  error_callback?: (error: { type: 'popup_failed_to_open' | 'popup_closed' | 'unknown' }) => void
}

type GoogleTokenResponse = {
  access_token?: string
  token_type?: string
  expires_in?: number | string
  scope?: string
  state?: string
  hd?: string
  authuser?: string
  prompt?: string
  error?: string
  error_description?: string
  error_uri?: string
}

type GoogleCodeResponse = {
  code?: string
  scope: string
  state?: string
  error?: string
  error_description?: string
  error_uri?: string
}

declare global {
  interface Window {
    google?: GoogleNamespace
  }
}
