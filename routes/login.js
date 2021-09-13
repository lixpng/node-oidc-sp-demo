var express = require('express')
const passport = require('passport')
const { oidcProviderService } = require('../models/oidcProvider.repository')
const { tenantService } = require('../models/tenant.repository')
const { userService } = require('../models/user.repository')
const { applyStrategy } = require('../utils/applyStrategy')
var router = express.Router()

// 登录界面，当有 tenantId 时会展示企业配置的 OIDC 登录按钮
router.get('/login/:tenantId?', async (req, res) => {
  const tenantId = Number(req.params.tenantId)

  let oidcList = []
  let tenant
  if (tenantId || tenantId === 0) {
    oidcList = await oidcProviderService.listByTenant(tenantId)
    tenant = await tenantService.findById(tenantId)
  }

  res.render('login', {
    oidcList,
    tenant,
  })
})

// 退出登录
router.get('/api/logout', async (req, res) => {
  const tenant = req.session.tenant

  req.session.destroy()

  /**
   * 规范的 OIDC 身份提供商还会有退出登录地址，可以在此重定向到 OIDC 身份提供商地址，本示例只在本系统中登出
   * */
  res.redirect('/login/' + tenant.id)
})

// 邮箱密码登录接口
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = await userService.findByEmail(email)

  if (!user || user.password !== password) {
    return res.status(401).json({
      code: 401,
      message: '邮箱或密码错误',
    })
  }

  req.session.user = user
  req.session.tenant = await tenantService.findById(Number(user.tenant))

  res.json({
    code: 200,
    message: '登录成功',
  })
})

// 使用 OIDC 登录
router.get('/api/oidc-login/:id', async (req, res, next) => {
  const oidcConfig = await oidcProviderService.findById(Number(req.params.id))

  await applyStrategy(oidcConfig)
  passport.authenticate('oidc')(req, res, next)
})

// 处理 OIDC 回调，每一个企业的登录回调 URL 都应该是唯一的
router.get('/api/oidc/:tenantId/callback', async (req, res, next) => {
  passport.authenticate('oidc', async (err, userInfo) => {
    const tenantId = Number(req.params.tenantId)
    let user = await userService.findByEmail(userInfo.email)

    // 本系统中不存在此用户，创建
    if (!user) {
      user = {
        name: userInfo.name,
        password: null,
        email: userInfo.email,
        avatar: userInfo.picture,
        gender: userInfo.gender,
        phone: userInfo.phone,
        isAdmin: false,
        tenant: tenantId,
      }
      userService.insert(user)
    }

    req.session.user = user
    req.session.tenant = await tenantService.findById(Number(user.tenant))

    res.redirect('/console/dashboard')
  })(req, res, next)
})

module.exports = router
