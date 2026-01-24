<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :model="queryForm" label-width="100px" :inline="true">
        <el-form-item label="部门名称">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button  @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="deptList" style="width: 100%" row-key="_id" :tree-props="{ children: 'children' }" stripe>
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="showDialog" :title="action === 'create' ? '创建部门' : '编辑部门'" width="500px">
      <el-form :model="deptForm" label-width="100px" ref="deptForm" :rules="rules">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader placeholder="请选择部门" :options="deptList" v-model="deptForm.parentId"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }" clearable :show-all-levels="true" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="deptForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select v-model="deptForm.userName" placeholder="请选择部门负责人">
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="deptForm.userEmail" placeholder="请输入邮箱" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Dept',
  data() {
    return {
      action: '',
      showDialog: false,
      queryForm: {
        deptName: ''
      },
      columns: [
        {
          label: '部门名称',
          prop: 'deptName'
        },
        {
          label: '部门负责人',
          prop: 'userName'
        },
        {
          label: '更新时间',
          prop: 'updateTime'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ],
      deptList: [],
      pager: {
        pageNum: 1,
        pageSize: 12,
      },
      userList: [],
      deptForm: {
        parentId: null,
        deptName: '',
        userName: '',
        userEmail: ''
      },
      rules: {}
    }
  },
  methods: {
    async getDeptList() {
      let list = await this.$api.getDeptList(this.queryForm)
      this.deptList = list
    },
    async getAllUserList() {
      let list = await this.$api.userAllList()
      this.userList = list
    },
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleClose(){
      this.handleReset('deptForm')
      this.showDialog = false
    },
    handleAdd() {
      this.action = "create"
      this.showDialog = true
    },
    handleEdit(row) {
      this.action = "edit"
      this.showDialog = true
    },
    handleDelete(_id) {
      this.action = "delete"
    },
    handleSubmit() {
      this.showDialog = false
    }
  },
  mounted() {
    this.getDeptList()
    this.getAllUserList()
  }
}
</script>