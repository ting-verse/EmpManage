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
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleAdd(2,scope.row)">
              新增
            </el-button>
            <el-button size="mini" @click="handleEdit(scope.row)">
              编辑
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
    <!-- <el-dialog title="菜单新增" v-model="showModel" :before-close="handleCancelDialog">
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
    </el-dialog> -->
  </div>
</template>

<script>
import { formateDate } from '../utils/utils'
export default {
  name: 'Menu',
  data() {
    return {
      queryForm: {
        roleName: ''
      },
      roleList: [],
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
      const {list, page} = await this.$api.roleList(this.queryForm)
      this.roleList = list
      this.page = page
    }
  },
  mounted() {
    this.getRoleList()
  }
}
</script>