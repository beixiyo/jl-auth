# Web 集成各大平台一键登录

**安装**
```bash
npm i @jl-org/auth
```

**node 版本 >= 18**

---


## 谷歌登录

[点击到谷歌官网创建凭据](https://console.cloud.google.com/apis)


### 纯浏览器实现

```ts
import { googleRedirectLogin, clientGetGoogleUserInfo } from '@jl-org/auth'

/**
 * 点击登录
 */
document.getElementById('googleRedirectBtn')?.addEventListener('click', () => {
  googleRedirectLogin({
    client_id: 'your-client-id',
    redirect_uri: 'your-redirect-uri',
  })
})

/**
 * ## 注意，此方式会暴露你的 client_secret
 * 在你的 redirect_uri 前端页面中获取用户信息
 */
clientGetGoogleUserInfo({
  client_id: 'your-client-id',
  client_secret: 'your-client-secret',
  redirect_uri: 'your-redirect-uri'
})
  .then(userInfo => {
    console.log(userInfo)
  })
```

### GIS 弹窗方式（推荐）

```ts
import { googlePopupLogin } from '@jl-org/auth'

document.getElementById('googlePopupBtn')?.addEventListener('click', async () => {
  const result = await googlePopupLogin({
    client_id: 'your-client-id',
    redirect_uri: 'your-redirect-uri',
    scope: 'email profile',
    state: 'your-state',
  })

  // 将 result.code 发送到你的后端换取 token
  await fetch('/api/auth/google/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: result.code, state: result.state }),
  })
})
```

> 弹窗模式基于 Google Identity Services 的 `initCodeClient`，用户完成授权后会把授权码返回给当前页面，再交给后端使用 client secret 换取 token，避免将密钥暴露在前端。

### 服务器端实现

```ts
import { serverGetGoogleUserInfo } from '@jl-org/auth'

/**
 * 省略服务器处理请求...
 * 服务器从谷歌请求的参数中获取信息填入 code
 */
serverGetGoogleUserInfo({
  client_id: 'your-client-id',
  client_secret: 'your-client-secret',
  redirect_uri: 'your-redirect-uri',
  code: 'your-code'
})
  .then(userInfo => {
    console.log(userInfo)
  })
```

## Apple 登录

[点击到 Apple Developer 创建服务 ID](https://developer.apple.com/account/resources/identifiers/list)

### 纯浏览器实现

```ts
import { appleRedirectLogin, clientGetAppleUserInfo } from '@jl-org/auth'

document.getElementById('appleRedirectBtn')?.addEventListener('click', () => {
  appleRedirectLogin({
    client_id: 'your-service-id',
    redirect_uri: 'your-redirect-uri',
    scope: 'name email',
    response_mode: 'query',
  })
})

clientGetAppleUserInfo({
  client_id: 'your-service-id',
  client_secret: 'your-client-secret-jwt',
  redirect_uri: 'your-redirect-uri',
})
  .then(userInfo => {
    console.log(userInfo)
  })
```

### 使用 Apple 官方脚本（弹窗）


```ts
import { applePopupLogin } from '@jl-org/auth'

document.getElementById('applePopupBtn')?.addEventListener('click', async () => {
  const result = await applePopupLogin({
    client_id: 'your-service-id',
    redirect_uri: 'your-redirect-uri',
    scope: 'name email',
    state: 'your-state',
    usePopup: true,
  })

  // 使用 usePopup 则可以直接拿到结果
  console.log(result)
})
```

### 服务器端实现

```ts
import { serverGetAppleUserInfo } from '@jl-org/auth'

serverGetAppleUserInfo({
  client_id: 'your-service-id',
  client_secret: 'your-client-secret-jwt',
  redirect_uri: 'your-redirect-uri',
  code: 'your-code',
  scope: 'name email',
})
  .then(userInfo => {
    console.log(userInfo)
  })
```
