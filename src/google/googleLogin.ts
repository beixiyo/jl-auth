import type { GoogleLoginConfig } from './type'


/**
 * 跳转到谷歌登录
 */
export function googleLogin(googleLoginConfig: GoogleLoginConfig) {
  const {
    clientId,
    redirectUri,
    state = '',
    scope = 'email profile',
    responseType = 'code',
  } = googleLoginConfig

  // &prompt=login 把它加到 authUrl 的末尾可以让用户每次都需要重新输入账号和密码
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&response_type=${responseType}`
  window.location.href = authUrl
}