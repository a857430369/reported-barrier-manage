<template>
  <div class="custom_style">
    <el-container>
      <!-- 头部容器 -->
      <el-header style="margin-top:20px">
        <el-card class="filter">
          <FilterTable
            ref="filter"
            :classifyList="classifyList"
            :recordClassifyOption="recordClassifyOption"
            :urgentGradeOption="urgentGradeOption"
            :branchRecordOption="branchRecordOption"
            :receiptSourceOption="receiptSourceOption"
            :recordFlowOption="recordFlowOption"
            :findWorkOrderList="findWorkOrderList"
            :recordFlow="recordFlow"
          ></FilterTable>
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
          <TableList
            ref="table"
            :workOrderList="workOrderList"
            :findWorkOrderList="findWorkOrderList"
            :urgentGradeOption="urgentGradeOption"
            :branchRecordOption="branchRecordOption"
            :receiptSourceOption="receiptSourceOption"
            :recordFlowOption="recordFlowOption"
            :recordFlow="recordFlow"
            :operationWidth="operationWidth"
          ></TableList>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import FilterTable from '../component/filter.vue'
import TableList from '../component/table.vue'
export default {
  data() {
    return {
      tabMapOptions: [
        { label: '接单中', key: 'pending', icon: 'el-icon-edit-outline' },
        { label: '处理中', key: 'being', icon: 'el-icon-finished' },
        { label: '已处理', key: 'processed', icon: 'el-icon-circle-check' },
      ],
      recordFlow: 'J,D', //待处理
      isCollapse: true,
      workOrderList: [], //工单列表
      classifyList: [], //分类树
      recordClassifyOption: [], //大类列表
      urgentGradeOption: [], //优先级列表
      branchRecordOption: [], //是否子单列表
      receiptSourceOption: [], //工单来源列表
      recordFlowOption: [], //流程进度列表
      currTabPane: 'pending', //当前所在的tab
      operationWidth: '350px',
    }
  },
  components: {
    FilterTable,
    TableList,
  },
  mounted() {},
  created() {
    this.findWorkOrderList()
    this.getListPar()
    this.getClassifyList()
  },
  methods: {
    //查询方法
    findWorkOrderList(type = 'passive') {
      var _this = this
      this.$nextTick(() => {
        const filter = _this.$refs.filter
        const table = _this.$refs.table
        let params = {
          condition: { ...filter.searchParams, recordFlow: _this.recordFlow },
          page: { ...table.pageInfo },
          rule: {},
        }
        if (filter.timeValue) {
          params.condition.recordExpectDtStart = filter.timeValue[0]
          params.condition.recordExpectDtEnd = filter.timeValue[1]
          params.rule.recordExpectDt = 'T'
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
          .getHandlePage(params)
          .then((res) => {
            const list = res.content.list
            table.total = res.content.total
            type == 'passive'
              ? (table.workOrderLoading = false)
              : (filter.searchLoading = false)
            return list
          })
          .then((list) => {
            list.forEach((item) => {
              item.handleTime = 0
              item.orderTime = 0
            })
            _this.workOrderList = list
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
      this.$api.parameter
        .getTree()
        .then((res) => {
          this.classifyList = res.content
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
          this.recordClassifyOption = recordClassifyOption
        })
        .catch((error) => {})
    },
    //查询字典值  优先级,是否子单,工单来源,流程进度
    getListPar() {
      const params = {
        keys: 'URGENT_GRADE,BRANCH_RECORD,RECEIPT_SOURCE,RECORD_FLOW',
      }
      this.$api.parameter
        .getListPar(params)
        .then((res) => {
          this.urgentGradeOption = res.content.URGENT_GRADE
          this.branchRecordOption = res.content.BRANCH_RECORD
          this.receiptSourceOption = res.content.RECEIPT_SOURCE
          this.recordFlowOption = res.content.RECORD_FLOW
        })
        .catch((error) => {})
    },
    handleClick() {
      const _this = this
      const currTabPane = _this.currTabPane
      if (currTabPane == 'pending') {
        _this.recordFlow = 'J,D' //待处理
        _this.operationWidth = '350px'
        _this.findWorkOrderList()
      } else if (currTabPane == 'being') {
        _this.recordFlow = 'C,Z,H' //处理中 暂缓中 撤单中
        _this.operationWidth = '350px'
        _this.findWorkOrderList()
      } else if (currTabPane == 'processed') {
        _this.recordFlow = 'Y,Q,W' //已处理
        _this.operationWidth = '200px'
        _this.findWorkOrderList()
      } else {
        console.warn('标签页不存在')
      }
    },
  },
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
