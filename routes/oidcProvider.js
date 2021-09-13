var express = require('express')
const { oidcProviderService } = require('../models/oidcProvider.repository')
var router = express.Router()

// 添加 OIDC 配置界面
router.get('/oidc-provider', async (req, res) => {
  var user = req.session.user
  // 未登录
  if (!user) {
    return res.redirect('/login')
  }
  // 已登录，但不是管理员
  if (!user.isAdmin) {
    req.session.destroy()
    return res.redirect('/login')
  }

  res.render('oidc-config', { isLogin: !!req.session.user })
})

// 添加 OIDC 配置接口
router.post('/api/oidc-provider', async (req, res) => {
  const user = req.session.user
  const tenant = req.session.tenant

  // 未登录
  if (!user) {
    return res.redirect('/login')
  }
  // 已登录，但不是管理员
  if (!user.isAdmin) {
    req.session.destroy()
    return res.redirect('/login')
  }

  const { name, clientId, clientSecret, issuer } = req.body
  const trimedIssuer = issuer.trim()
  const callbackUrl = `http://localhost:5000/api/oidc/${tenant.id}/callback`

  const config = await oidcProviderService.insert({
    name,
    clientId: clientId.trim(),
    clientSecret: clientSecret.trim(),
    issuer: trimedIssuer,
    configurationEndpoint: new URL(
      './.well-known/openid-configuration',
      trimedIssuer.endsWith('/') ? trimedIssuer : trimedIssuer + '/'
    ).toString(),
    tenant: tenant.id,
    callbackUrl,
  })

  res.json({
    code: 200,
    message: '配置成功',
    data: config,
  })
})

module.exports = router
