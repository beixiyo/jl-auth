# Web 集成各大平台一键登录

**安装**
```bash
npm i @jl-org/auth
```

---


## 谷歌登录

[点击到谷歌官网创建凭据](https://console.cloud.google.com/apis)

```ts
import { googleLogin, getGoogleUserInfo } from '@jl-org/auth'


/**
 * 点击登录
 */
document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
  googleLogin({
    clientId: 'your-client-id',
    redirectUri: 'your-redirect-uri',
  })
})


/**
 * 在你的 redirectUri 页面中获取用户信息
 */
getGoogleUserInfo({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'your-redirect-uri'
})
  .then(userInfo => {
    console.log(userInfo)
  })
```