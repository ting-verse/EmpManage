import request from '../utils/request'

export default {
  // 登录
  login(params){
    return request({
      url:'/users/login',
      method:'post',
      data:params,
      // mock:true
    })
  },
  // 获取菜单列表
  menuList() {
    return request({
      url:'/menu/list',
      method:'get',
      data:{},
      // mock:true
    })
  },
  // 获取用户列表
  userList(params) {
    return request({
      url:'/users/list',
      method:'get',
      data:params,
      // mock:true
    })
  },
  // 获取所有用户列表
  userAllList() {
    return request({
      url:'/users/all/list',
      method:'get',
      data:{},
      // mock:true
    })
  },
  // 删除用户
  userDelete(params) {
    return request({
      url:'/users/delete',
      method:'post',
      data:params,
      // mock:true
    })
  },
  // 获取所有角色列表
  getRoleAllList() {
    return request({
      url:'/roles/allList',
      method:'get',
      data:{},
      // mock:true
    })
  },
  // 获取部门列表
  getDeptList(params) {
    return request({
      url:'/dept/list',
      method:'get',
      data: params,
      // mock:true
    })
  },
  // 用户操作
    userSubmit(params) {
    return request({
      url:'/users/operate',
      method:'post',
      data:params,
      // mock:true
    })
  },
  // 菜单操作
  menuSubmit(params) {
    return request({
      url:'/menu/operate',
      method:'post',
      data:params,
      // mock:true
    })
  },
  // 获取角色列表
  roleList(params) {
    return request({
      url:'/roles/list',
      method:'get',
      data: params,
      // mock:true
    })
  },
  // 角色操作
  roleOperate(params) {
    return request({
      url:'/roles/operate',
      method:'post',
      data:params,
      // mock:true
    })
  },
  // 更新权限
  updatePermission(params) {
    return request({
      url:'/roles/update/permission',
      method:'post',
      data:params,
      // mock:true
    })
  },
  // 部门操作
  deptOperate(params) {
    return request({
      url:'/dept/operate',
      method:'post',
      data:params,
      // mock:true
    })
  }, 
  // 获取权限列表
  permissionList() {
    return request({
      url:'/users/getPermissionList',
      method:'get',
      data:{},
      // mock:true
    })
  },
  // 获取通知数量
  noticeCount() {
    return request({
      url:'/leave/count',
      method:'get',
      data:{},
      // mock:true
    })
  },
  // 审批列表
  getApplyList(params) {
    return request({
      url:'/leave/list',
      method:'get',
      data:params,
      // mock:true
    })
  },
  // 申请单操作
  leaveOperate(params) {
    return request({
      url:'/leave/operate',
      method:'post',
      data:params,
      // mock:true
    })
  },
  // 审批申请单
  leaveApprove(params) {
    return request({
        url: '/leave/approve',
        method: 'post',
        data: params,
        mock: false
    })
}
}