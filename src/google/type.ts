import type { AuthData, OAuthClientLoginConfig } from '@/types'


export type GoogleUserInfo = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  authData: AuthData
}

export type GooglePrompt =
  | ''
  | 'none'
  | 'consent'
  | 'select_account'

export type GoogleLoginConfig =
  OAuthClientLoginConfig & {
    /**
     * 影响登录体验的 prompt 参数
     */
    prompt?: GooglePrompt
  }

export type GooglePopupLoginConfig = Omit<GoogleLoginConfig, 'redirect_uri'> & {
  /**
   * 弹出层登录不需要 redirect_uri，设为可选以匹配基类并保持兼容性
   */
  redirect_uri?: string
  /**
   * 是否启用串行授权（Google 官方 experimental）
   */
  enable_serial_consent?: boolean
  /**
   * 是否包含用户已授权的 scope
   */
  include_granted_scopes?: boolean
  /**
   * 登录提示，比如邮箱
   */
  hint?: string
  /**
   * 企业域过滤
   */
  hosted_domain?: string
  /**
   * 是否覆盖默认 scope。
   * 如果为 false (默认)，则会自动添加 'openid email profile'
   * 如果为 true，则仅使用传入的 scope
   */
  overrideScope?: boolean
}

export type GooglePopupLoginResult = {
  access_token: string
  expires_in: number
  hd?: string
  prompt: string
  token_type: string
  scope: string
  state?: string
}

export type GooglePopupCodeResult = {
  code: string
  scope: string
  state?: string
}
