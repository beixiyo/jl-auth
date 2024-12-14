import type { GoogleLoginConfig } from './type'
import { genOAuthUrl } from '@/utils'


/**
 * 浏览器跳转到谷歌登录
 */
export function googleLogin(googleLoginConfig: GoogleLoginConfig) {
  const query = {
    scope: 'email profile',
    ...googleLoginConfig,
  }

  window.location.href = genOAuthUrl(
    'https://accounts.google.com/o/oauth2/v2/auth',
    query,
  )
}