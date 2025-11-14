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
import { googleLogin, clientGetGoogleUserInfo } from '@jl-org/auth'

/**
 * 点击登录
 */
document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
  googleLogin({
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
import {
  appleLogin,
  clientGetAppleUserInfo,
} from '@jl-org/auth'

document.getElementById('appleLoginBtn')?.addEventListener('click', () => {
  appleLogin({
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

### 使用 Apple 官方脚本

```html
<script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
```

```ts
import { appleScriptLogin } from '@jl-org/auth'

document.getElementById('applePopBtn')?.addEventListener('click', async () => {
  const result = await appleScriptLogin({
    client_id: 'your-service-id',
    redirect_uri: 'your-redirect-uri',
    scope: 'name email',
    state: 'your-state',
    usePopup: true,
  })

  // result.authorization.code => 交换 token
  // result.user => 首次授权才会包含 name/email
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