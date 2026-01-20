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
        <el-button type="primary">新增用户</el-button>
        <el-button type="danger" @click="handlePatchDelete">批量删除用户</el-button>
      </div>
      <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="mini">
              编辑
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="pager.total"  @current-change="handleCurrentChange" class="pagination"/>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted ,getCurrentInstance} from 'vue'
export default {
  name: 'User',
  setup() {
    // 获取代理对象
    const { proxy } = getCurrentInstance()
    const form = ref(null)
    const user = reactive({
      userId: '',
      userName: '',
      state: 0,
    })
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
        prop: 'createTime'
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime'
      }
    ])

    // 分页配置
    const pager = reactive({
      pageNum:1,  // 当前页码
      pageSize:10,  // 每页条数
      total:10  // 总条数
    })
    // 获取用户列表
    const getUserList = async () => {
      let params = {...user, ...pager}
      const {page, list} = await proxy.$api.userList(params)
      userList.value = list
      pager.total = page.total
    }
    // 查询
    const handleQuery = () => {
      getUserList()
    }
    // 重置
    const handleReset = () => {
      form.value.resetFields()
      getUserList()
    }
    // 分页
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 用户单个删除
    const handleDelete = async (row) => {
      const res = await proxy.$api.userDelete({userIds:[row.userId]})
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
      const res = await proxy.$api.userDelete({userIds:checkedUsersIds.value})
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

    // 组件挂载
    onMounted(() => {
      getUserList()
    })

    return {
      form,
      user,
      userList,
      columns,
      pager,
      checkedUsersIds,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDelete,
      handlePatchDelete,
      handleSelectionChange
    }
  }
}
</script>