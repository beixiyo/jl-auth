export type OAuthClientLoginConfig = {
  /**
   * OAuth 客户端 ID
   */
  client_id: string
  /**
   * 重定向 URI
   */
  redirect_uri: string
  /**
   * 请求的权限范围，可以根据需求修改
   * @default 'email profile'
   */
  scope?: string
  /**
   * 表示客户端的当前状态，可以指定任意值，认证服务器会原封不动地返回这个值
   * @default ''
   */
  state?: string
  /**
   * Apple 登录可选参数，指定授权结果的返回模式
   */
  response_mode?: 'query' | 'fragment' | 'form_post'
}


export type OAuthServerConfig = {
  client_secret: string
  /**
   * OAuth 客户端 ID
   */
  client_id: string
  /**
   * 重定向 URI
   */
  redirect_uri: string
  code: string
  state?: string
  /**
   * Apple 登录可选
   * @default 'name email'
   */
  scope?: string
}

export type AuthData = {
  /**
   * 访问令牌
   */
  access_token: string
  /**
   * 令牌类型，该值大小写不敏感，必选项，可以是 bearer 或 mac
   */
  token_type: string
  /**
   * 过期时间，单位为秒
   */
  expires_in: number
  /**
   * 更新令牌，用来获取下一次的访问令牌
  */
  refresh_token?: string
  scope: string
}