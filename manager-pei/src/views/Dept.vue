<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :model="queryForm" label-width="100px" :inline="true">
        <el-form-item label="部门名称">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset('queryForm')">重置</el-button>
       </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="deptList" style="width: 100%" row-key="_id" :tree-props="{children: 'children'}" stripe>
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dept',
  data() {
    return {
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
      }
    }
  },
  methods: {
    async getDeptList() {
      let list = await this.$api.getDeptList(this.queryForm)
      this.deptList = list
    },
    handleQuery() {
      console.log(this.queryForm)
    },
    handleReset(formName) {
      this.$refs[formName].resetFields()
    },
    handleAdd() {
      console.log('新增')
    },
    handleEdit(row) {
      console.log(row)
    },
    handleDelete(row) {
      console.log(row)
    }
  },
  mounted() {
    this.getDeptList()
  }
}
</script>