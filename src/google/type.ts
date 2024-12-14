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

export type GoogleLoginConfig =
  OAuthClientLoginConfig &
  {
    /**
     * 'login' 让用户每次都需要重新输入账号和密码
     */
    prompt?: 'login' & {}
  }