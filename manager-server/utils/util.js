const log4js = require('./log4j')
const jwt = require('jsonwebtoken')

const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 10001,// 参数错误
  USER_ACCOUNT_ERROR: 20001,// 账号或者密码错误
  USER_LOGIN_ERROR: 30001,// 用户未登录
  BUSINESS_ERROR: 40001,// 业务请求失败
  AUTH_ERROR: 50001,// 认证失败或者token过期
}

module.exports = {
  CODE,
  pager ({pageNum = 1, pageSize = 10}) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: {
        pageNum,
        pageSize
      },
      skipIndex,
    }
  },
  success (data = "", msg = "", code=CODE.SUCCESS) {
    log4js.debug(data)
    return {
      code,
      data,
      msg
    }
  },
  fail (data = "", msg = "", code=CODE.BUSINESS_ERROR) {
    log4js.debug(msg)
    return {
      code,
      data,
      msg
    }
  },
  decoded(authorization) {
    if(authorization) {
      let token = authorization.split(' ')[1]
      return jwt.verify(token, 'ting')
    }
    return ""
  },
  getTree(rootList, id, list) {
    for (let i = 0; i < rootList.length; i++) {
      let item = rootList[i]
      // 处理 parentId 可能是数组、单个值或 null 的情况
      let itemParentId = null
      if (item.parentId) {
        if (Array.isArray(item.parentId)) {
          // 如果是数组，取最后一个值
          itemParentId = item.parentId.length > 0 ? String(item.parentId[item.parentId.length - 1]) : null
        } else {
          // 如果是单个值，直接转换
          itemParentId = String(item.parentId)
        }
      }
      
      // 匹配父级ID，parentId 为 null 表示顶级节点
      if ((id === null && itemParentId === null) || 
          (id !== null && itemParentId === String(id))) {
        list.push(item._doc || item)
      }
    }
    list.map(item => {
      item.children = []
      this.getTree(rootList, item._id, item.children)
      if (item.children.length == 0) {
        delete item.children;
      } else if (item.children.length > 0 && item.children[0].menuType == 2) {
        // 快速区分按钮和菜单，用于后期做菜单按钮权限控制
        item.action = item.children;
      }
    })
    return list;
  },
  formateDate(date, rule) {
    let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
    }
    const o = {
      // 'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const val = o[k] + '';
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
      }
    }
    return fmt;
  },

}