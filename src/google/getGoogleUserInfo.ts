import type { GoogleConfig, GoogleUserInfo } from './type'


export async function getGoogleUserInfo(
  googleConfig: GoogleConfig
): Promise<GoogleUserInfo | undefined> {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  if (!code) {
    return
  }

  const { clientSecret, redirectUri, clientId } = googleConfig
  /** 用授权码交换访问令牌地址 */
  const tokenEndpoint = 'https://oauth2.googleapis.com/token'
  const requestBody = new URLSearchParams()

  requestBody.append('code', code)
  /** 你的 Google OAuth 客户端 ID */
  requestBody.append('client_id', clientId)
  /** 你的Google OAuth 客户端密钥 */
  requestBody.append('client_secret', clientSecret)
  requestBody.append('redirect_uri', redirectUri)
  requestBody.append('grant_type', 'authorization_code')

  const data = await fetch(
    tokenEndpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody
    }
  )
    .then(response => response.json())
    .then(data => {
      /** 获得token令牌的信息 */
      const accessToken = data.access_token
      /** 调用获取用户信息接口 */
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(userInfo => userInfo)
    })

  return data as GoogleUserInfo | undefined
}
