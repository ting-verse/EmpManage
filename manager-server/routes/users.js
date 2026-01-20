const router = require('koa-router')()
const User = require('../models/userSchema')
const utils = require('../utils/util')
const jwt = require('jsonwebtoken')
router.prefix('/users')

router.post('/login',async ctx => {
  try {
    const {userName,userPwd} = ctx.request.body
    const res = await User.findOne({userName,userPwd},'userId userName userEmail state role deptId roleList')
    const data = res._doc
    const token = jwt.sign({data:'footbar'},'ting',{expiresIn:'1h'})
    if (res) {
      data.token = token
      ctx.body = utils.success(data)
    } else {
      ctx.body = utils.fail('用户名或密码错误')
    }
  } catch (error) {
    ctx.body = utils.fail(error.message)
  }
  
})

module.exports = router
