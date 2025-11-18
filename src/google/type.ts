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
  | 'none'
  | 'consent'
  | 'select_account'
  | 'login'

export type GoogleLoginConfig =
  OAuthClientLoginConfig & {
    /**
     * 影响登录体验的 prompt 参数
     */
    prompt?: GooglePrompt
  }

export type GooglePopupLoginConfig = GoogleLoginConfig & {
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
}

export type GooglePopupLoginResult = {
  code: string
  scope?: string
  state?: string
  authuser?: string
  prompt?: string
}
