# Web 集成各大平台一键登录

**安装**
```bash
npm i @jl-org/auth
```

**node 版本 >= 18**


---

## 谷歌登录

[点击到谷歌官网创建凭据](https://console.cloud.google.com/apis)


### GIS 弹窗方式（推荐）⭐

```ts
import { googlePopupLogin } from '@jl-org/auth'

document.getElementById('googlePopupBtn')?.addEventListener('click', async () => {
  const result = await googlePopupLogin({
    client_id: 'your-client-id',
    scope: 'email profile',
    state: 'your-state',
  })

  // result.access_token 可以直接调用 Google API
  console.log('Access Token:', result.access_token)

  // 或者将 token 发送到后端验证
  await fetch('/api/auth/google/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: result.access_token, state: result.state }),
  })
})
```

> 弹窗模式基于 Google Identity Services 的 `initTokenClient`，使用 Implicit Flow 直接返回 access_token，**无需 client_secret**。

---

### ~~纯浏览器实现~~ ⚠️ 已弃用

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
 * ## ⚠️ 此方式会暴露你的 client_secret，存在安全风险
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

> **推荐使用**: `googlePopupLogin`（无需 secret）

---

### ~~服务器端实现~~ ⚠️ 已弃用

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

> **推荐使用**: `googlePopupLogin`（无需 secret）

---

## Apple 登录

[点击到 Apple Developer 创建服务 ID](https://developer.apple.com/account/resources/identifiers/list)

### 使用 Apple 官方脚本（弹窗）⭐ 推荐

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

> Apple 官方弹窗模式，**无需 client_secret**，推荐使用。

---

### ~~纯浏览器实现~~ ⚠️ 已弃用

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

> **推荐使用**: `applePopupLogin`（无需 secret）

---

### ~~服务器端实现~~ ⚠️ 已弃用

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

> **推荐使用**: `applePopupLogin`（无需 secret）