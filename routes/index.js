var express = require('express')
var router = express.Router()

// 首页，展示用户信息、公司信息，是公司管理员能够通过首页进入 OIDC 配置界面
router.get('/', function (req, res, next) {
  res.render('index', {
    isLogin: !!req.session.user,
    user: JSON.stringify(req.session.user, null, 2),
    isAdmin: req.session.user && req.session.user.isAdmin,
    tenant: req.session.tenant,
  })
})

module.exports = router
