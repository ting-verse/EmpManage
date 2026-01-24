/**
 * 用户管理模块
 */

const router = require('koa-router')()
const Role = require('../models/roleSchema')
const utils = require('../utils/util.js')
router.prefix('/roles')


// 获取所有角色列表
router.get('/allList', async (ctx) => {
  try {
    // 查询所有角色
    const list = await Role.find({}, "_id roleName")
    ctx.body = utils.success(list)
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
module.exports = router
