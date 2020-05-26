<template>
  <div class="custom_style">
    <el-container>
      <!-- 头部容器 -->
      <el-header style="margin-top:20px">
        <el-card class="filter">
          <user-filter
            ref="userFilter"
            :classifyList="classifyList"
            :recordClassifyOption="recordClassifyOption"
            :urgentGradeOption="urgentGradeOption"
            :branchRecordOption="branchRecordOption"
            :receiptSourceOption="receiptSourceOption"
            :recordFlowOption="recordFlowOption"
            :getPersonalPage="getPersonalPage"
          ></user-filter>
        </el-card>
      </el-header>

      <!-- 主内容容器 -->
      <el-main>
        <el-tabs
          v-model="currTabPane"
          type="border-card"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="item in tabMapOptions"
            :key="item.key"
            :label="item.label"
            :name="item.key"
          >
            <span slot="label"
              ><i :class="item.icon"></i> {{ item.label }}</span
            >
          </el-tab-pane>
          <user-table
            ref="userTable"
            :workOrderList="workOrderList"
            :total="total"
            :getPersonalPage="getPersonalPage"
            :urgentGradeOption="urgentGradeOption"
            :branchRecordOption="branchRecordOption"
            :receiptSourceOption="receiptSourceOption"
            :recordFlowOption="recordFlowOption"
            :recordFlow="recordFlow"
            :operationWidth="operationWidth"
          ></user-table>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import userFilter from '../component/userFilter.vue'
import userTable from '../component/userTable.vue'
export default {
  components: {
    userFilter,
    userTable,
  },
  data() {
    return {
      tabMapOptions: [
        { label: '正在处理', key: 'pending', icon: 'el-icon-edit-outline' },
        { label: '处理完成', key: 'processed', icon: 'el-icon-finished' },
        { label: '确认撤单', key: 'Recall', icon: 'el-icon-refresh-right' },
        { label: '确认完成', key: 'confirm', icon: 'el-icon-circle-check' },
      ],
      workOrderList: [],
      classifyList: [], //分类树
      recordClassifyOption: [], //大类
      recordClassifySmallOption: [], //小类
      urgentGradeOption: [], //优先级列表
      branchRecordOption: [], //是否子单列表
      receiptSourceOption: [], //工单来源列表
      recordFlowOption: [], //流程进度列表
      currTabPane: 'pending', //当前所在的tab
      recordFlow: 'C,D,S,J,H,Z', //工单流程进度条件
      operationWidth: '250px', //操作栏宽度
      total: 0,
    }
  },
  mounted() {},
  created() {
    this.getPersonalPage()
    this.getListPar()
    this.getClassifyList()
  },
  methods: {
    //查询方法
    getPersonalPage(type = 'passive') {
      const _this = this
      this.$nextTick(() => {
        const filter = _this.$refs.userFilter
        const table = _this.$refs.userTable
        let params = {
          condition: { ...filter.searchParams, recordFlow: _this.recordFlow },
          page: { ...table.pageInfo },
          rule: {},
        }
        if (_this.timeValue) {
          params.condition.createDtStart = filter.timeValue[0]
          params.condition.createDtEnd = filter.timeValue[1]
          params.rule.createDt = 'T'
        }
        if (filter.searchParams.recordName) {
          params.rule.recordName = 'like'
        }
        if (filter.searchParams.createName) {
          params.rule.createName = 'like'
        }
        if (_this.recordFlow.indexOf(',') > -1) {
          params.rule.recordFlow = 'in'
        }
        type == 'passive'
          ? (table.workOrderLoading = true)
          : (filter.searchLoading = true)
        this.$api.record
          .getPersonalPage(params)
          .then((res) => {
            _this.workOrderList = res.content.list
            _this.total = res.content.total
            type == 'passive'
              ? (table.workOrderLoading = false)
              : (filter.searchLoading = false)
          })
          .catch((error) => {
            type == 'passive'
              ? (table.workOrderLoading = false)
              : (filter.searchLoading = false)
          })
      })
    },
    //查询分类
    getClassifyList() {
      const _this = this
      this.$api.parameter
        .getTree()
        .then((res) => {
          _this.classifyList = res.content
          return res.content
        })
        .then((content) => {
          //完成大类的转换
          let recordClassifyOption = []
          for (let [index, item] of content.entries()) {
            recordClassifyOption.push({
              value: item.classifyName,
              label: item.classifyName,
            })
          }
          _this.recordClassifyOption = recordClassifyOption
        })
        .catch((error) => {})
    },
    //查询字典值  优先级,是否子单,工单来源,流程进度
    getListPar() {
      const _this = this
      const params = {
        keys: 'URGENT_GRADE,BRANCH_RECORD,RECEIPT_SOURCE,RECORD_FLOW',
      }
      this.$api.parameter
        .getListPar(params)
        .then((res) => {
          _this.urgentGradeOption = res.content.URGENT_GRADE
          _this.branchRecordOption = res.content.BRANCH_RECORD
          _this.receiptSourceOption = res.content.RECEIPT_SOURCE
          _this.recordFlowOption = res.content.RECORD_FLOW
        })
        .catch((error) => {})
    },
    handleClick() {
      const _this = this
      const currTabPane = _this.currTabPane
      if (currTabPane == 'pending') {
        _this.recordFlow = 'C,D,S,J,H,Z' //处理中 待处理 审批中 接单中 撤单中 暂缓中
        _this.operationWidth = '250px'
        _this.getPersonalPage()
      } else if (currTabPane == 'processed') {
        _this.recordFlow = 'Y' //已处理
        _this.operationWidth = '250px'
        _this.getPersonalPage()
      } else if (currTabPane == 'Recall') {
        _this.recordFlow = 'W' //已撤单
        _this.operationWidth = '150px'
        _this.getPersonalPage()
      } else if (currTabPane == 'confirm') {
        _this.recordFlow = 'Q' //已确定
        _this.operationWidth = '150px'
        _this.getPersonalPage()
      } else {
        console.warn('标签页不存在')
      }
    },
  },
}
</script>

<style scoped></style>
