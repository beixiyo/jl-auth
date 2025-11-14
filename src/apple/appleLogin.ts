import type {
  AppleLoginConfig,
  AppleScriptLoginConfig,
  AppleScriptLoginResult,
} from './type'
import { genOAuthUrl } from '@/utils'

const APPLE_JS_SDK_URL =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js'

type AppleIDNamespace = {
  auth: {
    init: (config: AppleIdInitConfig) => void
    signIn: (config?: Partial<AppleIdInitConfig>) => Promise<AppleScriptLoginResult>
  }
}

type AppleIdInitConfig = {
  clientId: string
  scope: string
  redirectURI: string
  state?: string
  nonce?: string
  usePopup?: boolean
  responseMode?: 'query' | 'fragment' | 'form_post'
  responseType?: 'code' | 'id_token' | 'code id_token'
  codeChallenge?: string
  codeChallengeMethod?: 'plain' | 'S256'
}

declare global {
  interface Window {
    AppleID?: AppleIDNamespace
  }
}

let loadAppleSdkPromise: Promise<AppleIDNamespace> | undefined


/**
 * 浏览器跳转到 Apple 登录
 */
export function appleLogin(appleLoginConfig: AppleLoginConfig) {
  const query = {
    scope: 'name email',
    response_mode: 'query' as const,
    ...appleLoginConfig,
  }

  window.location.href = genOAuthUrl(
    'https://appleid.apple.com/auth/authorize',
    query,
  )
}


/**
 * 通过 Apple 官方脚本触发登录
 */
export async function appleScriptLogin(
  loginConfig: AppleScriptLoginConfig
): Promise<AppleScriptLoginResult> {
  if (typeof window === 'undefined') {
    throw new Error('appleScriptLogin 仅能在浏览器环境中使用')
  }

  const AppleID = await loadAppleSdk()

  const initConfig: AppleIdInitConfig = {
    clientId: loginConfig.client_id,
    scope: loginConfig.scope ?? 'name email',
    redirectURI: loginConfig.redirect_uri,
    state: loginConfig.state,
    nonce: loginConfig.nonce,
    usePopup: loginConfig.usePopup ?? true,
    responseMode: loginConfig.response_mode ?? 'form_post',
    responseType: 'code',
    codeChallenge: loginConfig.codeChallenge,
    codeChallengeMethod: loginConfig.codeChallengeMethod,
  }

  AppleID.auth.init(initConfig)
  return AppleID.auth.signIn()
}


function loadAppleSdk(): Promise<AppleIDNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('appleScriptLogin 仅能在浏览器环境中使用'))
  }

  if (window.AppleID) {
    return Promise.resolve(window.AppleID)
  }

  if (loadAppleSdkPromise) {
    return loadAppleSdkPromise
  }

  loadAppleSdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${APPLE_JS_SDK_URL}"]`
    )

    const onLoad = () => {
      if (window.AppleID) {
        resolve(window.AppleID)
      } else {
        reject(new Error('Apple Sign in with Apple SDK 加载失败'))
      }
    }

    const onError = () => {
      reject(new Error('Apple Sign in with Apple SDK 脚本加载失败'))
    }

    if (existingScript) {
      existingScript.addEventListener('load', onLoad, { once: true })
      existingScript.addEventListener('error', onError, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = APPLE_JS_SDK_URL
    script.async = true
    script.onload = onLoad
    script.onerror = onError
    document.head.appendChild(script)
  })

  return loadAppleSdkPromise
}

