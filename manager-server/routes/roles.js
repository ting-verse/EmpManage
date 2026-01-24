/**
 * 角色管理模块
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

// 获取角色列表
router.get('/list', async (ctx) => {
  const{roleName} = ctx.request.query
  const {page, skipIndex} = utils.pager(ctx.request.query)
  try {
    let params = {}
    if(roleName) {
      params.roleName = roleName
    }
    const query = Role.find(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Role.countDocuments(params)
    ctx.body = utils.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = utils.fail(`查询失败${error.stack}`)
  }
})

// 操作角色
router.post('/operate', async ctx => {
  const { _id, roleName, remark, action } = ctx.request.body
  let res, info
  try {
    if (action === 'add') {
      res = await Role.create({ roleName, remark })
      info = '新增成功'
    } else if (action === 'edit') {
      if (_id) {
        let params = { roleName, remark }
        params.updateTime = new Date()
        res = await Role.findByIdAndUpdate(_id, params, { new: true })
        info = '更新成功'
      } else {
        ctx.body = utils.fail(`缺少参数params:${_id}`)
        return
      }
    } else if (action === 'delete') {
      if (_id) {
        res = await Role.findByIdAndDelete(_id)
        info = '删除成功'
      } else {
        ctx.body = utils.fail(`删除失败,缺少参数params:${_id}`)
        return
      }
    } else {
      ctx.body = utils.fail(`未知操作类型:${action}`)
      return
    }
    ctx.body = utils.success(res, info)
  } catch (error) {
    ctx.body = utils.fail(`操作失败${error.stack}`)
  }
})

// 权限设置
router.post('/update/permission', async ctx => {
  const { _id, permissionList } = ctx.request.body
  try {
    let params = { permissionList, updateTime: new Date() }
    let res = await Role.findByIdAndUpdate(_id, params, { new: true })
    ctx.body = utils.success(res, '权限设置成功')
  } catch (error) {
    ctx.body = utils.fail(`权限设置失败:${error.stack}`)
  }
})

module.exports = router
