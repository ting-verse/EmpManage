const mongoose = require('mongoose')
const log4js = require('../utils/log4j')
const config = require('./index')

// 设置 strictQuery 以准备 Mongoose 7 的变化
mongoose.set('strictQuery', false)

mongoose.connect(config.URL)
const db = mongoose.connection

db.on('error', (e) => {
  log4js.error('***数据库连接失败***:' + e)
})

db.on('open', () => {
  log4js.info('***数据库连接成功***')
})

module.exports = db