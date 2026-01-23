<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="menuName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="roleList" style="width: 100%" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="mini">
              设置权限
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row._id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="pager.total" @current-change="handleCurrentChange"
        class="pagination" />
    </div>
    <el-dialog title="角色新增" v-model="showModel" :before-close="handleCancelDialog">
      <el-form :model="roleForm" :rules="rules" ref="dialogForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="text-area" :rows="2" v-model="roleForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { formateDate } from '../utils/utils'
export default {
  name: 'Menu',
  data() {
    return {
      showModel: false,
      queryForm: {
        roleName: ''
      },
      roleForm: {
        roleName: '',
        remark: ''
      },
      roleList: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
      },
      pager: {
        total: 0,
        page: 1,
        pageSize: 10
      },
      columns: [
        {
          label: '角色名称',
          prop: 'roleName'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '权限列表',
          prop: 'menuType',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return formateDate(value)
          }
        }
      ]
    }
  },
  methods: {
    async getRoleList() {
      const { list, page } = await this.$api.roleList(this.queryForm)
      this.roleList = list
      this.page = page
    },
    handleAdd() {
      this.showModel = true
      this.action = 'add'
    },
    handleEdit(row) {
      this.showModel = true
      this.action = 'edit'
      this.$nextTick(() => {
        this.roleForm = row
      })
    },
    async handleDelete(_id) {
      let res = await this.$api.roleOperate({_id, action: 'delete'})
      if (res) {
        this.$message.success('删除成功！')
        this.getRoleList()
      }
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let {roleForm, action} = this
          let params = {...roleForm, action}
          let res = await this.$api.roleOperate(params)
          if (res) {
            this.showModel = false
            this.$message.success('创建成功！')
            this.getRoleList()
            this.handleReset('dialogForm')
          }
        }
      })
    },
    handleReset(form){
      this.$refs[form].resetFields()
    },
    handleClose(){
      this.showModel = false
      this.handleReset('dialogForm')
    },
    handleCloseDialog(){
      this.showModel = false
      this.handleReset('dialogForm')
    }
  },
  mounted() {
    this.getRoleList()
  }
}
</script>