import { RESPONSE_TYPE } from '@/constants'
import type { OAuthClientLoginConfig } from '@/types'


/**
 * 生成 OAuth2 URL
 */
export function genOAuthUrl(
  url: string,
  params: OAuthClientLoginConfig
) {
  let query = ''
  const data = {
    ...params,
    response_type: RESPONSE_TYPE,
  }
  
  for (const key in data) {
    query += `${key}=${(data as any)[key] ?? ''}&`
  }

  return `${url}?${query.slice(0, -1)}`
}
