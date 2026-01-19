const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const index = require('./routes/index')
const users = require('./routes/users')
const log4js = require('./utils/log4j')


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
  const start = new Date()
  await next()
  const ms = new Date() - start
  log4js.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling（在最后）
app.on('error', (err, ctx) => {
  log4js.error(`错误信息: ${err.message}\n错误堆栈: ${err.stack}`)
})

module.exports = app