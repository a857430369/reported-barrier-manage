<template>
  <div class="">
    <el-container>
      <!-- 头部容器 -->
      <el-header style="margin-top:20px">
        <el-card>
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
      <el-main style="margin-top:15px">
        <el-card>
          <TableList
            ref="table"
            :workOrderList="workOrderList"
            :findWorkOrderList="findWorkOrderList"
            :urgentGradeOption="urgentGradeOption"
            :branchRecordOption="branchRecordOption"
            :receiptSourceOption="receiptSourceOption"
            :recordFlowOption="recordFlowOption"
            :recordFlow="recordFlow"
          ></TableList>
        </el-card>
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
      recordFlow: 'Y', //已处理
      isCollapse: true,
      workOrderLoading: false,
      workOrderList: [], //工单列表
      classifyList: [], //分类树
      recordClassifyOption: [], //大类列表
      urgentGradeOption: [], //优先级列表
      branchRecordOption: [], //是否子单列表
      receiptSourceOption: [], //工单来源列表
      recordFlowOption: [], //流程进度列表
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
    findWorkOrderList() {
      var _this = this
      this.$nextTick(() => {
        const filter = _this.$refs.filter
        const table = _this.$refs.table
        let params = {
          condition: { ...filter.searchParams },
          page: { ...table.pageInfo },
          rule: {},
        }
        if (filter.timeValue) {
          params.condition.recordExpectDtStart = filter.timeValuetimeValue[0]
          params.condition.recordExpectDtEnd = filter.timeValuetimeValue[1]
          params.rule.recordExpectDt = 'T'
        }
        if (filter.searchParams.recordName) {
          params.rule.recordName = 'like'
        }
        if (filter.searchParams.createName) {
          params.rule.createName = 'like'
        }
        if (filter.searchParams.recordFlow.indexOf(',') > -1) {
          params.rule.recordFlow = 'in'
        }
        this.workOrderLoading = true
        this.$api.record
          .getHandlePage(params)
          .then((res) => {
            this.workOrderList = res.content.list
            table.total = res.content.total
            this.workOrderLoading = false
          })
          .catch((error) => {
            this.workOrderLoading = false
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
  },
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
