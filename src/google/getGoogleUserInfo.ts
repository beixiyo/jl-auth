import { GRANT_TYPE, RESPONSE_TYPE } from '@/constants'
import type { GoogleUserInfo } from './type'
import type { AuthData, OAuthServerConfig } from '@/types'


/**
 * 浏览器获取谷歌用户信息
 */
export async function clientGetGoogleUserInfo(
  oAuthClientConfig: Omit<OAuthServerConfig, 'code' | 'state'>
) {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get(RESPONSE_TYPE)
  if (!code) {
    return
  }

  const state = urlParams.get('state')
  return serverGetGoogleUserInfo({
    ...oAuthClientConfig,
    code,
    ...(state && { state }),
  })
}

/**
 * 服务端获取谷歌登录用户信息
 */
export async function serverGetGoogleUserInfo(
  oAuthServerConfig: OAuthServerConfig
): Promise<GoogleUserInfo | undefined> {
  /** 用授权码交换访问令牌地址 */
  const tokenEndpoint = 'https://oauth2.googleapis.com/token'
  const requestBody = {
    ...oAuthServerConfig,
    grant_type: GRANT_TYPE,
  }

  let authData: AuthData

  return fetch(
    tokenEndpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    }
  )
    .then(response => response.json())
    .then(async (data: AuthData) => {
      authData = data
      const accessToken = data.access_token

      /** 调用获取用户信息接口 */
      return fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `${data.token_type} ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(userInfo => {
          const res: GoogleUserInfo = {
            ...userInfo,
            authData
          }

          return res
        })
    })
}
