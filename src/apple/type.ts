import type { AuthData, OAuthClientLoginConfig } from '@/types'


export type AppleLoginConfig = OAuthClientLoginConfig & {
  response_mode?: 'query' | 'fragment' | 'form_post'
}

export type AppleScriptLoginConfig = AppleLoginConfig & {
  /**
   * 是否使用 Apple 官方弹窗
   * @default true
   */
  usePopup?: boolean
  nonce?: string
  codeChallenge?: string
  codeChallengeMethod?: 'plain' | 'S256'
}

export type AppleScriptLoginResult = {
  authorization: {
    code?: string
    id_token?: string
    state?: string
  }
  user?: {
    email?: string
    name?: {
      firstName?: string
      lastName?: string
    }
  }
}

export type AppleAuthData = AuthData & {
  id_token: string
}

export type RawAppleJwtPayload = {
  sub: string
  email?: string
  email_verified?: boolean | string
  is_private_email?: boolean | string
  auth_time?: number
  nonce_supported?: boolean
}

export type AppleUserInfo = {
  sub: string
  email?: string
  email_verified?: boolean
  is_private_email?: boolean
  auth_time?: number
  nonce_supported?: boolean
  authData: AppleAuthData
}

export type AppleTokenResponse = {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token?: string
  token_type: string
  scope?: string
}

