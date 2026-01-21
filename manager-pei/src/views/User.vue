<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增用户</el-button>
        <el-button type="danger" @click="handlePatchDelete">批量删除用户</el-button>
      </div>
      <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="pager.total" @current-change="handleCurrentChange"
        class="pagination" />
    </div>
    <el-dialog title="新增用户" v-model="showModel">
      <el-form :model="userForm" :rules="rules" ref="dialogForm" label-width="100px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" :disabled="action === 'edit'" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱" :disabled="action === 'edit'">
            <template #append>
              @gmail.com
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList" placeholder="请选择系统角色">
          <el-select v-model="userForm.roleList" multiple>
            <el-option v-for="role in roleList" :key="role._id" :value="role._id" :label="role.roleName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader v-model="userForm.deptId" :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable placeholder="请选择部门" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted, getCurrentInstance, toRaw } from 'vue'
import { formateDate } from '../utils/utils'
export default {
  name: 'User',
  setup() {
    // 获取代理对象
    const { proxy } = getCurrentInstance()
    const form = ref(null)
    const dialogForm = ref(null)
    const user = reactive({
      userId: '',
      userName: '',
      state: 0,
    })
    const showModel = ref(false)
    // 用户列表
    const userList = ref([])
    // 表格列配置
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail'
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter: (row, column, value) => {
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter: (row, column, value) => {
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[value] || '未知'
        }
      },
      {
        label: '用户创建时间',
        prop: 'createTime',
        formatter: (row, column, value) => {
          return formateDate(value)
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        formatter: (row, column, value) => {
          return formateDate(value)
        }
      }
    ])
    // 新增用户表单
    const userForm = reactive({
      userName: '',
      userEmail: '',
      mobile: '',
      job: '',
      state: 1,
      roleList: [],
      deptId: []
    })
    // 分页配置
    const pager = reactive({
      pageNum: 1,  // 当前页码
      pageSize: 10,  // 每页条数
      total: 10  // 总条数
    })
    // 新增用户表单验证规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }
      ],
      userEmail: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请选择部门',
          trigger: 'blur'
        }
      ],
      mobile: [
        {
          pattern: /^1[3-9]\d{9}$/,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }
      ],
    })

    // 获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager }
      const { page, list } = await proxy.$api.userList(params)
      userList.value = list
      pager.total = page.total
    }
    // 查询
    const handleQuery = () => {
      getUserList()
    }
    // 重置查询表单
    // 说明：这个方法用于重置查询表单
    // 在 Vue 3 Composition API 中，ref 对象通过 .value 访问，不需要使用 proxy.$refs
    const handleReset = () => {
      form.value.resetFields()  // form 是 ref 对象，通过 .value 访问表单实例
      getUserList()
    }
    // 分页
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 用户单个删除
    const handleDelete = async (row) => {
      const res = await proxy.$api.userDelete({ userIds: [row.userId] })
      if (res.nModified > 0) {
        proxy.$message.success('删除成功')
        getUserList()
      } else {
        proxy.$message.error('删除失败')
      }
    }
    // 用户批量删除
    const checkedUsersIds = ref([])
    const handlePatchDelete = async () => {
      if (checkedUsersIds.value.length === 0) {
        proxy.$message.warning('请选择要删除的用户')
        return
      }
      const res = await proxy.$api.userDelete({ userIds: checkedUsersIds.value })
      if (res.nModified > 0) {
        proxy.$message.success('删除成功')
        getUserList()
      } else {
        proxy.$message.error('删除失败')
      }
    }
    // 选择用户
    const handleSelectionChange = (list) => {
      let arr = []
      list.forEach(item => {
        arr.push(item.userId)
      })
      checkedUsersIds.value = arr
    }
    // 获取角色列表
    const roleList = ref([])
    const getRoleList = async () => {
      const res = await proxy.$api.getRoleList()
      roleList.value = res
    }
    // 获取部门列表
    const deptList = ref([])
    const getDeptList = async () => {
      const res = await proxy.$api.getDeptList()
      deptList.value = res
    }
    // 提交表单（带验证）
    const action = ref('add')
    const handleSubmit = () => {
      dialogForm.value.validate(async (valid) => {
        if (valid) {
          let params = toRaw(userForm)
          params.userEmail += '@gmail.com'
          params.action = action.value
          let res = await proxy.$api.userSubmit(params)
          if (res) {
            showModel.value = false
            proxy.$message.success('新增用户成功')
            dialogForm.value.resetFields()
            getUserList()
          } else {
            proxy.$message.error(res.msg)
          }
        }
      })
    }
    // 取消新增用户
    const handleCancel = () => {
      showModel.value = false
      dialogForm.value.resetFields()
    }
    // 新增用户
    const handleCreate = () => {
      action.value = 'add'
      showModel.value = true
    }
    // 编辑用户
    const handleEdit = (row) => {
      action.value = 'edit'
      showModel.value = true
      proxy.$nextTick(() => {
        Object.assign(userForm, row)
      })
      
    }

    // 组件挂载
    onMounted(() => {
      getUserList()
      getRoleList()
      getDeptList()
    })

    return {
      showModel,
      form,
      dialogForm,
      user,
      userList,
      columns,
      pager,
      checkedUsersIds,
      userForm,
      rules,
      roleList,
      deptList,
      action,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDelete,
      handleSelectionChange,
      handleCreate,
      handleSubmit,
      handleCancel,
      getRoleList,
      handleEdit
    }
  }
}
</script>