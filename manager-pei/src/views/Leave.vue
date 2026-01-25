<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
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
        <el-button type="primary" @click="handleApply">申请休假</el-button>
      </div>
      <el-table :data="applyList" style="width: 100%">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter" />
        <el-table-column label="操作" width="150">
          <template>
            <el-button type="primary" size="mini">
              查看
            </el-button>
            <el-button type="danger" size="mini">
              作废
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="pager.total" @current-change="handleCurrentChange"
        class="pagination" />
    </div>
    <el-dialog title="新增用户" v-model="showModel" :before-close="handleClose">
      <el-form :model="leaveForm" :rules="rules" label-width="100px" ref="leaveFormRef">
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假日期" required>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="startTime" required>
                <el-date-picker v-model="leaveForm.startTime" type="date" placeholder="选择开始日期" />
              </el-form-item>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8">
              <el-form-item prop="endTime" required>
                <el-date-picker v-model="leaveForm.endTime" type="date" placeholder="选择结束日期"
                  @change="(val) => handleChange('endTime', val)" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="休假时长" prop="leaveTime" required>
          {{ leaveForm.leaveTime }}
        </el-form-item>
        <el-form-item label="休假原因" prop="reason" required>
          <el-input v-model="leaveForm.reason" type="textarea" placeholder="请输入休假原因" :rows="3" />
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
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { formateDate } from '../utils/utils'
export default {
  name: 'Leave',
  setup() {
    // 获取代理对象
    const { proxy } = getCurrentInstance()
    const showModel = ref(false)
    const queryForm = reactive({
      applyState: 0
    })
    // 申请表单
    const leaveForm = reactive({
      applyType: 1,
      startTime: '',
      endTime: '',
      leaveTime: '0天',
      reason: ''
    })
    // 申请表单规则
    const rules = reactive({
      startTime: [{ type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }],
      endTime: [{ type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }],
      leaveTime: [{ required: true, message: '请选择休假时长', trigger: 'change' }],
      reason: [{ required: true, message: '请输入休假原因', trigger: ['blur', 'change'] }]
    })
    // 申请表单引用
    const leaveFormRef = ref(null)
    // 申请列表
    const applyList = ref([])
    // 表格列配置
    const columns = reactive([
      {
        label: '单号',
        prop: 'orderNo'
      },
      {
        label: '休假时间',
        prop: 'createTime',
        formatter: (row, column, value) => {
          return formateDate(value)
        }
      },
      {
        label: '休假时长',
        prop: 'leaveTime',
      },
      {
        label: '休假类型',
        prop: 'applyType',
        formatter: (row, column, value) => {
          return {
            0: '事假',
            1: '调休',
            2: '年假',
          }[value]
        }
      },
      {
        label: '休假原因',
        prop: 'reason',
      },
      {
        label: '申请时间',
        prop: 'createTime',
        formatter: (row, column, value) => {
          return formateDate(value)
        }
      },
      {
        label: '审批人',
        prop: 'auditUsers',
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName',
      },
      {
        label: '审批状态',
        prop: 'applyState',
        formatter: (row, column, value) => {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4: '审批通过',
            5: '作废',
          }[value]
        }
      },
    ])
    // 分页配置
    const pager = reactive({
      pageNum: 1,  // 当前页码
      pageSize: 10,  // 每页条数
      total: 10  // 总条数
    })

    // 查询
    const handleQuery = () => {
      // TODO: 实现查询请假列表
    }
    // 重置查询表单
    const handleReset = () => {
      form.value.resetFields()
      handleQuery()
    }
    // 取消申请
    const handleCancel = () => {
      showModel.value = false
      leaveFormRef.value.resetFields()
    }
    // 分页点击
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      handleQuery()
    }
    // 申请休假
    const action = ref('create')
    const handleApply = () => {
      showModel.value = true
      action.value = 'create'
    }
    // 获取申请列表
    const getApplyList = async () => {
      let params = { ...queryForm, ...pager }
      let { list, page } = await proxy.$api.getApplyList(params)
      pager.total = page.total
      applyList.value = list
    }
    // 提交申请
    const handleSubmit = () => {
      leaveFormRef.value.validate(async (valid) => {
        if (valid) {
          let params = {
            ...leaveForm,
            action: action.value
          }
          let res = await proxy.$api.leaveOperate(params)
          if (res) {
            proxy.$message.success('创建成功')
            handleCancel()
            getApplyList()
          } else {
            ElMessage.error(res.msg)
          }
        }
      })
    }
    // 日期选择变化
    const handleChange = (key, val) => {
      const { startTime, endTime } = leaveForm
      if (!startTime || !endTime) return
      if (startTime > endTime) {
        proxy.$message.error('开始日期不能大于结束日期')
        leaveForm.leaveTime = '0天'
        leaveForm[key] = ''
        return
      } else {
        leaveForm.leaveTime = (endTime - startTime) / (1000 * 60 * 60 * 24) + 1 + '天'
      }
    }

    // 组件挂载
    onMounted(() => {
      getApplyList()
    })

    return {
      rules,
      leaveForm,
      queryForm,
      showModel,
      action,
      leaveFormRef,
      applyList,
      columns,
      pager,
      handleApply,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleCancel,
      handleSubmit,
      handleChange
    }
  }
}
</script>