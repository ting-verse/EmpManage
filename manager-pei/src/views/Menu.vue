<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="menuForm" ref="form">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="menuForm.menuState">
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
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleAdd(scope.row)">
              新增
            </el-button>
            <el-button type="danger" size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <el-dialog title="新增用户" v-model="showModel" :before-close="handleCancel">
      <el-form :model="userForm" :rules="rules" ref="dialogForm" label-width="100px" >
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
    </el-dialog> -->
  </div>
</template>

<script>
  import { formateDate } from '../utils/utils'
  export default {
    name: 'Menu',
    data() {
      return {
        menuForm: {
          menuState:1
        },
        menuList: [],
        columns:[
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
            formatter(row,column,value) {
              return {
                1: '正常',
                2: '停用'
              }[value]
            }
          },
          {
            label: '创建时间',
            prop: 'createTime',
            formatter(row,column,value) {
              return formateDate(value)
            }
          },
          {
            label: '更新时间',
            prop: 'updateTime',
            formatter(row,column,value) {
              return formateDate(value)
            }
          }
        ]
      }
    },
    methods: {
      handleQuery() {
        console.log(this.menuForm)
      },
      handleReset() {
        this.menuForm = {}
      },
      handleAdd(row) {
        console.log('创建')
      },
      handleEdit(row) {
        console.log(row)
      },
      async getMenuList(params) {
        const res = await this.$api.menuList(params)
        this.menuList = res
      }
    },
    mounted() {
      this.getMenuList()
    }
  }
</script>