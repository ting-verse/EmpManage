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
            <el-button size="mini" @click="handlePermission(scope.row)">
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
    <el-dialog title="设置权限" v-model="showPermission" :before-close="handlePermissionCancelDialog">
      <el-form label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限" prop="remark">
          <el-tree ref="permissionTree" style="max-width: 600px" :data="menuList" :props="{ label: 'menuName' }"
            node-key="_id" show-checkbox default-expand-all />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取 消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确 定</el-button>
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
      showPermission: false,
      curRoleName: '',
      curRoleId: '',
      queryForm: {
        roleName: ''
      },
      roleForm: {
        roleName: '',
        remark: ''
      },
      roleList: [],
      menuList: [],
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
          prop: 'permissionList',
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            console.log(this.actionMap, 'actionMap')
            list.map((key) => {
              let name = this.actionMap[key];
              if (key && name) names.push(name);
            });
            return names.join(",");
          },

        },
        {
          label: '创建时间',
          prop: 'createTime',
          formatter(row, column, value) {
            return formateDate(value)
          }
        }
      ],
      actionMap: {}
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
      let res = await this.$api.roleOperate({ _id, action: 'delete' })
      if (res) {
        this.$message.success('删除成功！')
        this.getRoleList()
      }
    },
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          let { roleForm, action } = this
          let params = { ...roleForm, action }
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
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    handleClose() {
      this.showModel = false
      this.handleReset('dialogForm')
    },
    handleCloseDialog() {
      this.showModel = false
      this.handleReset('dialogForm')
    },
    handlePermissionCancelDialog() {
      this.showPermission = false
    },
    handlePermission(row) {
      this.showPermission = true
      this.curRoleName = row.roleName
      this.curRoleId = row._id
      const { checkedKeys } = row.permissionList
      setTimeout(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys)
      })
    },
    async getMenuList() {
      const res = await this.$api.menuList()
      this.menuList = res
      this.getActionMap(res)
    },
    getActionMap(list) {
      let actionMap = {};
      console.log(list, 'list')
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.action) {
            actionMap[item._id] = item.menuName;
          }
          if (item.children) {
            deep(item.children);
          }
        }
      };
      deep(JSON.parse(JSON.stringify(list)));
      console.log(actionMap, 'actionMap')
      this.actionMap = actionMap;

    },
    async handlePermissionSubmit() {
      let nodes = this.$refs.permissionTree.getCheckedNodes();  // 获取所有选中的节点对象数组
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys();  // 获取半选中的节点ID数组
      let checkedKeys = []; // 存储按钮级别权限（叶子节点）
      let parentKeys = [];  // 存储父节点（分类）
      nodes.map((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });
      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys, 
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      await this.$api.updatePermission(params);
      this.showPermission = false;
      this.$message.success("设置成功");
      this.getRoleList();

    }
  },
  mounted() {
    this.getRoleList()
    this.getMenuList()
  }
}
</script>