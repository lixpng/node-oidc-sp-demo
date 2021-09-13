var express = require('express')
var router = express.Router()

// 控制台首页
router.get('/console/dashboard', async (req, res) => {
  var user = req.session.user
  // 未登录
  if (!user) {
    return res.redirect('/login')
  }

  res.render('console/dashboard', { user: req.session.user })
})

// 企业设置页
router.get('/console/configuration', async (req, res) => {
  var user = req.session.user
  // 未登录
  if (!user) {
    return res.redirect('/login')
  }

  res.render('console/configuration', { user: req.session.user })
})

module.exports = router
