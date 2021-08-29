const { Strategy, Issuer } = require('openid-client')
const passport = require('passport')

// passport 是一个用来处理认证流程的库，可以定义不同的 strategy，openid-client 是其中一个用来处理 OIDC 登录流程的
const applyStrategy = async (config) => {
  const issuer = await Issuer.discover(config.configurationEndpoint) // 连接 oidc 应用

  // 初始化 issuer 信息
  const client = new issuer.Client({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    id_token_signed_response_alg: 'HS256',
    token_endpoint_auth_method: 'client_secret_post',
    issuer: config.issuer,
    configInfo: config.configurationEndpoint,
  })
  const params = {
    redirect_uri: config.callbackUrl,
    scope: 'openid profile email phone',
    grant_type: 'authorization_code',
    response_type: 'code',
  }

  passport.use(
    'oidc',
    new Strategy({ client, params }, (tokenset, userInfo, done) => {
      return done(null, userInfo) // 返回用户信息
    })
  )
}

module.exports = {
  applyStrategy,
}
