const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const users = require('./routes/users')
const menus = require('./routes/menus')
const log4js = require('./utils/log4j')
const utils = require('./utils/util')
const router = require('koa-router')()
// const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')

// error handler（保持在最前面）
onerror(app)
require('./config/db')

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger 中间件（在路由之前）
app.use(async (ctx, next) => {
  // 服务端 希望看到前端请求过来的数据
  log4js.info(`get params: ${JSON.stringify(ctx.request.query)}`)
  log4js.info(`post params: ${JSON.stringify(ctx.request.body)}`)
  // const start = new Date()
  await next().catch(err => {
    if (err.status === 401) {
      ctx.status = 200
      ctx.body = utils.fail('Token认证失败',utils.CODE.AUTH_ERROR)
    } else {
      throw err
    }
  })
  // const ms = new Date() - start
  // log4js.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(koajwt({secret:'ting'}).unless({path:[/^\/api\/users\/login/]}))
router.prefix('/api')
// router.get('/leave/count', ctx => {
//   const token = ctx.request.headers.authorization.split(' ')[1]
//   const payload = jwt.verify(token, 'ting')
//   ctx.body = payload
//   // 拿到前端携带过来的 token 进行验证
// })
router.use(users.routes(), users.allowedMethods())
router.use(menus.routes(), menus.allowedMethods())
// routes
app.use(router.routes(), router.allowedMethods())

// error-handling（在最后）
app.on('error', (err, ctx) => {
  log4js.error(`错误信息: ${err.message}\n错误堆栈: ${err.stack}`)
})

module.exports = app