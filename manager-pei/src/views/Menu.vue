<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
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
        <el-button type="primary" @click="handleAdd(1)" v-has="'menu_add'">创建</el-button>
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleAdd(2,scope.row)" v-has="'menu_add'">
              新增
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.row)" v-has="'menu_edit'">
              编辑
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row._id)" v-has="'menu_delete'">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="菜单新增" v-model="showModel" :before-close="handleCancelDialog">
      <el-form :model="menuForm" :rules="rules" ref="dialogForm" label-width="100px">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader :options="menuList" v-model="menuForm.parentId" :props="{ checkStrictly: true, value: '_id', label: 'menuName' }" clearable/>
          <span>不选择默认是创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType === 2">
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component" v-show="menuForm.menuType === 1">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType === 1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
import { formateDate } from '../utils/utils'
export default {
  name: 'Menu',
  data() {
    return {
      showModel: false,
      action: 'add',
      queryForm: {
        menuName: '',
        menuState: 1
      },
      menuForm: {
        parentId: [],
        menuType: 1,
        menuName: '',
        icon: '',
        path: '',
        menuCode: '',
        component: '',
        menuState: 1
      },
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在2-8个字符之间', trigger: 'blur' }
        ],
      },
      menuList: [],
      columns: [
        {
          label: '菜单名称',
          prop: 'menuName'
        },
        {
          label: '图标',
          prop: 'menuIcon'
        },
        {
          label: '权限标识',
          prop: 'menuCode'
        },
        {
          label: '路由地址',
          prop: 'path'
        },
        {
          label: '组件路径',
          prop: 'component'
        },
        {
          label: '菜单状态',
          prop: 'menuState',
          formatter(row, column, value) {
            return {
              1: '正常',
              2: '停用'
            }[value]
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return formateDate(value)
          }
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          formatter(row, column, value) {
            return formateDate(value)
          }
        }
      ]
    }
  },
  methods: {
    handleQuery() {
      this.menuForm.menuState = this.queryForm.menuState
      this.menuForm.menuName = this.queryForm.menuName
      this.getMenuList()
    },
    handleReset() {
      this.$refs.form.resetFields()
      this.getMenuList()
    },
    handleAdd(type,row) {
      this.showModel = true
      this.action = 'add'
      if (type === 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(item => item)
      }
    },
    handleEdit(row) {
      this.showModel = true
      this.action = 'edit'
      this.$nextTick(() => {
        Object.assign(this.menuForm, row)
      })
    },
    async handleDelete(id) {
      await this.$api.menuSubmit({_id: id, action: 'delete'})
      this.$message.success('删除成功')
      this.getMenuList()
    },
    handleCancelDialog() {
      this.showModel = false
      this.$refs.dialogForm?.resetFields()
    },
    handleCancel() {
      this.handleCancelDialog()
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let {action,menuForm} = this
          let params = {
            action,
            ...menuForm
          }
          await this.$api.menuSubmit(params)
          this.showModel = false
          this.$message.success('操作成功')
          this.$refs.dialogForm.resetFields()
          this.getMenuList()
        }      
      })
    },
    async getMenuList() {
      const res = await this.$api.menuList(this.menuForm)
      this.menuList = res || []
    }
  },
  mounted() {
    this.getMenuList()
  }
}
</script>