const mongoose = require('mongoose')
const menuSchema = mongoose.Schema({
  menuType: Number,
  menuName: String,
  menuCode: String,
  path: String,
  icon: String,
  component: String,
  menuState: Number,
  parentId: {
    type: [mongoose.Types.ObjectId],
    default: []
  }, // 父级菜单ID数组，默认为空数组（根菜单）
  "createTime": {
    type: Date,
    default: Date.now()
  },//创建时间
  "updateTime": {
    type: Date,
    default: Date.now()
  },//更新时间
})

module.exports = mongoose.model("menu", menuSchema, "menus")