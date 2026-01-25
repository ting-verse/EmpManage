const router = require('koa-router')()
const User = require('../models/userSchema')
const Counter = require('../models/counterSchema')
const utils = require('../utils/util.js')
const jwt = require('jsonwebtoken')
const Menu = require('../models/menuSchema')
const Role = require('../models/roleSchema')
// const md5 = require('md5')
router.prefix('/users')

// 用户登录
router.post('/login', async ctx => {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({ userName, userPwd }, 'userId userName userEmail state role deptId roleList')

    if (res) {
      const data = res._doc
      const token = jwt.sign({ data }, 'ting', { expiresIn: '10h' })
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

// 用户创建与编辑
router.post('/operate', async (ctx) => {
  const { userId, userName, userEmail, mobile, job, state, roleList, deptId, action } = ctx.request.body
  if (action === "add") {
    if (!userName || !userEmail || !deptId) {
      ctx.body = utils.fail('参数错误', utils.CODE.PARAM_ERROR)
      return
    }
    // 新增用户
    const res = await User.findOne({ $or: [{ userName }, { userEmail }] }, '_id userName userEmail')
    if (res) {
      ctx.body = utils.fail('用户名或邮箱已存在')
      return
    } else {
      try {
        const doc = await Counter.findByIdAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } })
        const user = new User({
          userId: doc.sequence_value,
          userName,
          userPwd: '123456',
          userEmail,
          role: 1,
          roleList,
          state,
          job,
          mobile,
          deptId,
        })
        user.save()
        ctx.body = utils.success({}, "用户创建成功")
      } catch (error) {
        ctx.fail(error, stack, '用户创建失败')
      }
    }
  } else if (action === "edit") {
    if (!deptId) {
      ctx.body = utils.fail('部门不能为空', utils.CODE.PARAM_ERROR)
      return
    }
    try {
      const res = await User.findOneAndUpdate({ userId }, { mobile, job, state, roleList, deptId }, { new: true })
      ctx.body = utils.success(res, "更新成功")
    }
    catch (error) {
      ctx.body = utils.fail('更新失败')
    }
  }
})

// 获取所有用户列表
router.get('/all/list', async ctx => {
  try {
    const list = await User.find({}, "userId userName userEmail")
    ctx.body = utils.success(list)
  } catch (error) {
    ctx.body = utils.fail(error.message)
  }
})

router.get('/getPermissionList', async ctx => {
  try {
    const authorization = ctx.request.headers.authorization
    const { data } = utils.decoded(authorization)
    const rootList = await getMenuList(data.role, data.roleList)
    ctx.body = utils.success(rootList)
  } catch (error) {
    ctx.body = utils.fail(error.message)
  }
})

async function getMenuList(userRole, roleKeys) {
  let rootList = [], permissionList = []
  if (userRole == 0) {
    rootList = await Menu.find({}) || []
  } else {
    let roleList = await Role.find({ _id: { $in: roleKeys } })
    roleList.map(role => {
      let {checkedKeys = [], halfCheckedKeys = []} = role.permissionList || {}
      permissionList = checkedKeys.concat(halfCheckedKeys)
    })
    permissionList = [...new Set(permissionList)]
    rootList = await Menu.find({ _id: { $in: permissionList } }) || []
  }

  return utils.getTree(rootList, null, [])
}

module.exports = router
