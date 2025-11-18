import type {
  GoogleLoginConfig,
  GooglePopupLoginConfig,
  GooglePopupLoginResult,
} from './type'
import { genOAuthUrl } from '@/utils'
import { loadScript } from '@/utils/loadScript'


const GOOGLE_GIS_SDK_URL = 'https://accounts.google.com/gsi/client'

/**
 * 浏览器跳转到谷歌登录（重定向模式）
 */
export function googleRedirectLogin(googleLoginConfig: GoogleLoginConfig) {
  const query = {
    scope: 'email profile',
    ...googleLoginConfig,
  }

  window.location.href = genOAuthUrl(
    'https://accounts.google.com/o/oauth2/v2/auth',
    query,
  )
}

/**
 * 通过 Google Identity Services SDK 弹窗登录
 */
export async function googlePopupLogin(
  config: GooglePopupLoginConfig
): Promise<GooglePopupLoginResult> {
  if (typeof window === 'undefined') {
    throw new Error('googlePopupLogin 仅能在浏览器环境中使用')
  }

  const google = await loadGoogleSdk()
  const scope = config.scope ?? 'email profile'

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initCodeClient({
      client_id: config.client_id,
      scope,
      redirect_uri: config.redirect_uri,
      state: config.state,
      prompt: config.prompt,
      hint: config.hint,
      hosted_domain: config.hosted_domain,
      enable_serial_consent: config.enable_serial_consent,
      include_granted_scopes: config.include_granted_scopes,
      ux_mode: 'popup',
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

        if (!response.code) {
          reject(new Error('Google 登录未返回授权 code'))
          return
        }

        const result: GooglePopupLoginResult = {
          code: response.code,
          scope: response.scope,
          state: response.state,
          authuser: response.authuser,
          prompt: response.prompt,
        }

        resolve(result)
      },
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
      initCodeClient: (
        config: GoogleInitCodeClientConfig
      ) => GoogleCodeClient
    }
  }
}

type GoogleCodeClient = {
  requestCode: () => void
}

type GoogleInitCodeClientConfig = {
  client_id: string
  scope: string
  redirect_uri: string
  state?: string
  prompt?: GoogleLoginConfig['prompt']
  hint?: string
  hosted_domain?: string
  enable_serial_consent?: boolean
  include_granted_scopes?: boolean
  ux_mode: 'popup'
  callback: (response: GoogleCodeResponse) => void
}

type GoogleCodeResponse = {
  code?: string
  scope?: string
  state?: string
  authuser?: string
  prompt?: string
  error?: string
  error_description?: string
  error_uri?: string
}

declare global {
  interface Window {
    google?: GoogleNamespace
  }
}
