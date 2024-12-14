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