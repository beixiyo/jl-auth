import type {
  AppleLoginConfig,
  ApplePopupLoginConfig,
  ApplePopupLoginResult,
} from './type'
import { buildOAuthUrl } from '@/utils'
import { loadScript } from '@/utils/loadScript'
import { APPLE_JS_SDK_URL, APPLE_OAUTH_URL } from './constants'


/**
 * 浏览器跳转到 Apple 登录（重定向模式）
 */
export function appleRedirectLogin(appleLoginConfig: AppleLoginConfig) {
  const query = {
    scope: 'name email',
    response_mode: 'query' as const,
    ...appleLoginConfig,
  }

  window.location.href = buildOAuthUrl(
    APPLE_OAUTH_URL,
    query,
  )
}

/**
 * 通过 Apple 官方脚本触发登录（弹窗模式）
 */
export async function applePopupLogin(
  loginConfig: ApplePopupLoginConfig
): Promise<ApplePopupLoginResult> {
  if (typeof window === 'undefined') {
    throw new Error('applePopupLogin 仅能在浏览器环境中使用')
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
    return Promise.reject(new Error('applePopupLogin 仅能在浏览器环境中使用'))
  }

  return loadScript<AppleIDNamespace>({
    src: APPLE_JS_SDK_URL,
    getResult: () => window.AppleID,
    attributes: {
      async: true,
    },
    errorMessage: 'Apple Sign in with Apple SDK 加载失败',
  })
}


type AppleIDNamespace = {
  auth: {
    init: (config: AppleIdInitConfig) => void
    signIn: (config?: Partial<AppleIdInitConfig>) => Promise<ApplePopupLoginResult>
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
