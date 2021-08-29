var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

const session = require('express-session')
var indexRouter = require('./routes/index')
var oidcConfigRouter = require('./routes/oidcProvider')
var loginRouter = require('./routes/login')
var tenantRouter = require('./routes/tenant')
const passport = require('passport')
const { sequelize } = require('./models/getConnection')
const { initExampleData } = require('./utils/initExampleData')

// 测试数据库连接
sequelize
  .authenticate()
  .then(() => {
    console.log('>>>>>>>>>>数据库连接成功<<<<<<<<<<')
    // 初始化示例数据
    initExampleData()
  })
  .catch(() => console.log('>>>>>>>数据库连接失败，请重试<<<<<<<<<'))

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'a very long random string',
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 99999,
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/', oidcConfigRouter)
app.use('/', loginRouter)
app.use('/', tenantRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// 处理用户信息
passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (id, done) {
  done(null, { client_id: id })
})

module.exports = app
