const router = require('koa-router')()
const util = require('../utils/util')
const Menu = require('../models/menuSchema')

router.prefix('/menu')
// 菜单列表查询
router.get('/list', async (ctx) => {
  const { menuName, menuState } = ctx.request.query;
  console.log(menuName, menuState)
  const params = {}
  if (menuName) params.menuName = menuName;
  if (menuState) params.menuState = menuState;
  let rootList = await Menu.find(params) || []
  const permissionList = getTreeMenu(rootList, null, [],params.menuName)
  ctx.body = util.success(permissionList);
})

// 递归拼接树形列表
function getTreeMenu(rootList, id, list, menuName = null) {
  for (let i = 0; i < rootList.length; i++) {
    let item = rootList[i]
    let itemParentId = item.parentId
    
    // 处理 parentId 为 null、空数组或未定义的情况
    if (!itemParentId || (Array.isArray(itemParentId) && itemParentId.length === 0)) {
      // 根节点：parentId 为 null 或空数组，且当前查找的也是根节点（id === null）
      if (id === null || menuName) {
        list.push(item._doc)
      }
    } else if (Array.isArray(itemParentId) && itemParentId.length > 0) {
      // 有父节点：取最后一个父节点ID进行比较
      const lastParentId = itemParentId[itemParentId.length - 1]
      if (String(lastParentId) == String(id) || menuName) {
        list.push(item._doc)
      }
    }
  }
  
  list.map(item => {
    item.children = []
    getTreeMenu(rootList, item._id, item.children)
    if (item.children.length == 0) {
      delete item.children;
    } else if (item.children.length > 0 && item.children[0].menuType == 2) {
      // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
      item.action = item.children;
    }
  })
  return list;
}

router.post('/operate', async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  let res, info;

  try {
    if (action == 'add') {
      res = await Menu.create(params)
      info = '创建成功'
    } else if (action == 'edit') {
      params.updateTime = new Date()
      // console.log(_id);
      await Menu.findByIdAndUpdate(_id, params)
      info = '编辑成功'
    } else {
      await Menu.findByIdAndRemove(_id)
      await Menu.deleteMany({ parentId: { $all: [_id] } })
      info = '删除成功'
    }
    ctx.body = util.success({}, info)
  } catch (error) {
    ctx.body = util.fail({}, error.stack)
  }
})

module.exports = router