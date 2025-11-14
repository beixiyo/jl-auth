import { GRANT_TYPE, RESPONSE_TYPE } from '@/constants'
import type { OAuthServerConfig } from '@/types'
import type {
  AppleAuthData,
  AppleTokenResponse,
  AppleUserInfo,
  RawAppleJwtPayload,
} from './type'


/**
 * 浏览器获取 Apple 用户信息
 */
export async function clientGetAppleUserInfo(
  oAuthClientConfig: Omit<OAuthServerConfig, 'code' | 'state'>
) {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get(RESPONSE_TYPE)
  if (!code) {
    return
  }

  const state = urlParams.get('state')
  return serverGetAppleUserInfo({
    ...oAuthClientConfig,
    code,
    ...(state && { state }),
  })
}


/**
 * 服务端获取 Apple 登录用户信息
 */
export async function serverGetAppleUserInfo(
  oAuthServerConfig: OAuthServerConfig
): Promise<AppleUserInfo | undefined> {
  const tokenEndpoint = 'https://appleid.apple.com/auth/token'
  const requestBody = new URLSearchParams({
    ...oAuthServerConfig,
    grant_type: GRANT_TYPE,
  })

  const data: AppleTokenResponse = await fetch(
    tokenEndpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody.toString(),
    }
  ).then(response => response.json())

  const authData: AppleAuthData = {
    access_token: data.access_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token,
    scope: data.scope ?? oAuthServerConfig.scope ?? 'name email',
    id_token: data.id_token,
  }

  const payload = decodeJwtPayload<RawAppleJwtPayload>(data.id_token)
  const userInfo: AppleUserInfo = {
    sub: payload.sub,
    email: payload.email,
    email_verified: normalizeBoolean(payload.email_verified),
    is_private_email: normalizeBoolean(payload.is_private_email),
    auth_time: payload.auth_time,
    nonce_supported: payload.nonce_supported,
    authData,
  }

  return userInfo
}


function normalizeBoolean(
  value?: boolean | string
) {
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    return value === 'true'
  }
  return undefined
}


function decodeJwtPayload<T>(idToken: string): T {
  const [, payload = ''] = idToken.split('.')
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
  const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  const runtime = globalThis as typeof globalThis & {
    Buffer?: {
      from: (input: string, encoding: string) => {
        toString: (encoding: string) => string
      }
    }
  }

  if (typeof runtime.atob === 'function') {
    return JSON.parse(runtime.atob(paddedBase64))
  }

  if (runtime.Buffer) {
    return JSON.parse(runtime.Buffer.from(paddedBase64, 'base64').toString('utf-8'))
  }

  throw new Error('当前运行环境无法解析 Apple id_token')
}

