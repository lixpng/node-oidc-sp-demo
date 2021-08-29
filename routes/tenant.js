var express = require('express')
const { tenantService } = require('../models/tenant.repository')
const { userService } = require('../models/user.repository')
var router = express.Router()

// 创建企业界面（本示例创建企业时需要同时创建企业管理员）
router.get('/tenant', async (req, res) => {
  // 已登录，先退出登录
  if (req.session.user) {
    req.session.destroy()
    return res.redirect('/tenant')
  }

  res.render('create-tenant')
})

// 创建企业接口（本示例创建企业时需要同时创建企业管理员）
router.post('/api/tenant', async (req, res) => {
  // 已登录，先退出登录
  if (req.session.user) {
    req.session.destroy()
    return res.redirect('/tenant')
  }

  const {
    tenantName,
    tenantLogo,
    adminName,
    adminPassword,
    adminEmail,
    adminAvatar,
    adminPhone,
    adminGender,
  } = req.body

  const tenantExist = await tenantService.findByName(tenantName)
  if (tenantExist) {
    return res.status(400).json({
      code: 400,
      message: '企业名已存在',
    })
  }

  const userExist = await userService.findByEmail(adminEmail)
  if (userExist) {
    return res.status(400).json({
      code: 400,
      message: '管理员邮箱已存在',
    })
  }

  const newTenant = await tenantService.insert({
    name: tenantName,
    logo: tenantLogo,
  })

  const newUser = await userService.insert({
    name: adminName,
    password: adminPassword,
    avatar: adminAvatar,
    phone: adminPhone,
    gender: adminGender,
    email: adminEmail,
    isAdmin: true,
    tenant: newTenant.id,
  })

  res.json({
    code: 200,
    data: {
      user: newUser,
      tenant: newTenant,
    },
  })
})

module.exports = router
