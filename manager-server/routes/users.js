const router = require('koa-router')()
const User = require('../models/userSchema')
const utils = require('../utils/util.js')
const jwt = require('jsonwebtoken')
router.prefix('/users')

// 用户登录
router.post('/login', async ctx => {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({ userName, userPwd }, 'userId userName userEmail state role deptId roleList')
    const data = res._doc
    const token = jwt.sign({ data: 'footbar' }, 'ting', { expiresIn: '1h' })
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

// 用户列表
router.get('/list', async (ctx) => {
  const { userId, userName, state } = ctx.request.query
  const { page, skipIndex } = utils.pager(ctx.request.query)

  const params = {}
  if (userId) {
    params.userId = userId
  }
  if (userName) {
    params.userName = userName
  }
  // state 为 0 或 "0" 时表示查询所有状态，不添加到查询条件中
  if (state && state !== '0' && Number(state) !== 0) {
    params.state = Number(state)
  }

  try {
    const query = User.find(params, { _id: 0, userPwd: 0 })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)

    ctx.body = utils.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = utils.fail(error.message)
  }
})

// 用户删除
router.post('/delete', async (ctx) => {
  const { userIds } = ctx.request.body
  try {
    const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 })
    if (res.modifiedCount > 0) {
      ctx.body = utils.success(res, `共删除${res.modifiedCount}个用户`)
    } else {
      ctx.body = utils.fail('删除失败')
    }
  } catch (error) {
    ctx.body = utils.fail('删除失败')
  }
})
module.exports = router
