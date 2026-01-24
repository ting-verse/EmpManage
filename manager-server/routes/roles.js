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
    if (action === 'create') {
      res = await Role.create({ roleName, remark })
      info = '新增成功'
    } else if (action === 'update') {
      if (_id) {
        let params = { roleName, remark }
        params.update = new Date()
        res = await Role.findByIdAndUpdate( _id , params)
        info = '更新成功'
      } else {
        ctx.body = utils.fail(`缺少参数params:${_id}`)
      }
    } else {
      if (_id) {
        res = await Role.findByIdAndDelete( _id )
        info = '删除成功'
      } else {
        ctx.body = utils.fail(`删除失败,缺少参数params:${_id}`)
      }
    }
    ctx.body = utils.success(res, info)
  } catch (error) {
    ctx.body = utils.fail(`操作失败${error.stack}`)
  }
})

module.exports = router
