const router = require('koa-router')()
const util = require('../utils/util')
const Dept = require('../models/deptSchema')
// const md5 = require('md5')
router.prefix('/dept')

// 递归拼接树形列表
function getTreeDept(rootList, parentId, list) {
  for (let i = 0; i < rootList.length; i++) {
    let item = rootList[i]
    // 处理 parentId 可能是数组、单个值或 null 的情况
    let itemParentId = null
    if (item.parentId) {
      if (Array.isArray(item.parentId)) {
        itemParentId = item.parentId.length > 0 ? String(item.parentId[item.parentId.length - 1]) : null
      } else {
        itemParentId = String(item.parentId)
      }
    }
    
    // 匹配父级ID，parentId 为 null 表示顶级部门
    if ((parentId === null && itemParentId === null) || 
        (parentId !== null && itemParentId === String(parentId))) {
      let itemData = item._doc || item
      list.push(itemData)
    }
  }
  
  // 递归处理子节点
  list.forEach(item => {
    item.children = []
    getTreeDept(rootList, item._id, item.children)
    if (item.children.length == 0) {
      delete item.children
    }
  })
  
  return list
}

// 部门列表
router.get('/list', async ctx => {
  const {deptName} = ctx.request.query
  const params = {}
  if (deptName) {
    params.deptName = deptName
  }
  let rootList = await Dept.find(params) || []
  // 转换为普通对象数组
  rootList = rootList.map(item => item.toObject ? item.toObject() : item)
  // 构建树形结构
  let treeList = getTreeDept(rootList, null, [])
  ctx.body = util.success(treeList)
})

router.post('/operate', async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  let res, info;
  try {
    // 处理 parentId：如果是 null 或单个值，转换为数组格式
    if (params.parentId !== undefined) {
      if (params.parentId === null || params.parentId === '') {
        params.parentId = []
      } else if (!Array.isArray(params.parentId)) {
        params.parentId = [params.parentId]
      }
    }
    
    if (action == 'create') {
      res = await Dept.create(params)
      info = '创建成功'
    } else if (action == 'edit') {
      params.updateTime = new Date()
      await Dept.findByIdAndUpdate(_id, params)
      info = '编辑成功'
    } else {
      await Dept.findByIdAndRemove(_id)
      await Dept.deleteMany({ parentId: { $all: [_id] } })
      info = '删除成功'
    }
    ctx.body = util.success({}, info)
  } catch (error) {
    ctx.body = util.fail({}, error.stack)
  }
})



module.exports = router
