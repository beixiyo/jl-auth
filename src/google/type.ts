
export type GoogleUserInfo = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

export type GoogleConfig = {
  clientId: string
  clientSecret: string
  redirectUri: string
}

export type GoogleLoginConfig = {
  /** 你的Google OAuth 客户端 ID */
  clientId: string
  /** 重定向 URI */
  redirectUri: string
  /** 
   * 请求的权限范围，可以根据需求修改
   * @default 'email profile'
   */
  scope?: string
  /** 
   * 用于防止跨站请求伪造（CSRF）攻击
   * @default ''
   */
  state?: string
  /** 
   * 授权响应类型，表示要求返回授权码
   * @default 'code'
   */
  responseType?: string
}