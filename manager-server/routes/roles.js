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

module.exports = router
