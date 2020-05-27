<template>
  <div class="custom_style">
    <el-container>
      <!-- 头部容器 -->
      <el-header style="margin-top:20px">
        <el-card class="filter">
          <el-row type="flex" justify="space-between">
            <el-col :span="24" style="display:flex">
              <div style="margin: 0 10px 0px 0">
                <el-select
                  v-model="searchParams.recordClassifyName"
                  placeholder="请选择大类"
                  clearable
                  @change="changeHandel"
                >
                  <el-option
                    v-for="item in recordClassifyOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin: 0 10px 0px 0">
                <el-select
                  v-model="searchParams.recordClassifySmallName"
                  placeholder="请选择小类"
                  clearable
                >
                  <el-option
                    v-for="item in recordClassifySmallOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin: 0 10px 0px 0">
                <el-select
                  v-model="searchParams.urgentGrade"
                  placeholder="请选择优先级"
                  clearable
                >
                  <el-option
                    v-for="item in urgentGradeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div style="margin: 0 10px 0px 0">
                <el-input
                  placeholder="请输入工单创建人"
                  class="filter-item"
                  v-model.trim="searchParams.createName"
                  clearable
                  @keyup.enter.native="findWorkOrderList('search')"
                />
              </div>
              <div style="margin: 0 10px 0px 0">
                <el-date-picker
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="期望开始时间"
                  end-placeholder="期望结束时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="timeValue"
                />
              </div>
              <div style="margin: 0 10px 0px 0">
                <el-button
                  type="primary"
                  size="medium"
                  :loading="searchLoading"
                  icon="el-icon-search"
                  @click="findWorkOrderList('search')"
                  >搜索</el-button
                >
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-header>

      <!-- 主内容容器 -->
      <el-main style="padding:10px 20px">
        <el-card>
          <el-table
            :data="workOrderList"
            border
            fit
            style="width: 100%"
            v-loading="workOrderLoading"
          >
            <el-table-column
              type="index"
              width="70px"
              label="序号"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="recordClassifyName"
              label="大类"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="150px"
            >
            </el-table-column>

            <el-table-column
              prop="recordClassifySmallName"
              label="小类"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="150px"
            >
            </el-table-column>

            <el-table-column
              prop="recordName"
              label="工单标题"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="400px"
            >
            </el-table-column>

            <el-table-column
              prop="urgentGrade"
              label="优先级"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.urgentGrade | dataFormat(urgentGradeOption) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="branchRecord"
              label="是否子单"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tag :type="row.branchRecord | statusFilter">
                  {{ row.branchRecord | dataFormat(branchRecordOption) }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- <el-table-column
              prop="recordExplain"
              label="子单说明"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column> -->

            <el-table-column
              prop="recordFlow"
              label="流程进度"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.recordFlow | dataFormat(recordFlowOption) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="createDt"
              label="创建时间"
              sortable
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="155px"
            >
            </el-table-column>

            <el-table-column
              prop="recordExpectDt"
              label="期望时间"
              sortable
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="155px"
            >
            </el-table-column>

            <el-table-column
              prop="createName"
              label="创建人"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="createPhone"
              label="联系电话"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="120px"
            >
            </el-table-column>

            <el-table-column
              label="操作"
              header-align="center"
              align="center"
              fixed="right"
              width="200px"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-document"
                  @click="openDetailsDialog(scope.$index, scope.row)"
                  >详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页组件 -->
          <el-row type="flex" justify="end" style="margin-top:5px">
            <div class="pagination-container">
              <el-pagination
                @current-change="handlePage"
                @size-change="handleSizePage"
                :current-page="pageInfo.pageNumber"
                :page-sizes="pageSizes"
                :page-size="pageInfo.pageSize"
                :total="total"
                layout="total, sizes,  prev, pager, next"
              ></el-pagination>
            </div>
          </el-row>
        </el-card>
      </el-main>
    </el-container>

    <!-- 对话框  destroy-on-close -->
    <el-dialog
      title="工单详情"
      :visible.sync="detailsDialog"
      width="80%"
      center
      v-if="detailsDialog"
    >
      <query
        :formCode="detailsParams.recordCode"
        :isVerify="detailsParams.isVerify"
        :branchRecord="detailsParams.branchRecord"
        :recordExplain="detailsParams.recordExplain"
      ></query>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsDialog = false">取 消</el-button>
        <el-button type="primary" @click="grabRecord">抢单</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/work-order/queryGeneral'
export default {
  filters: {
    dataFormat: function(msg, list) {
      for (let [index, item] of list.entries()) {
        if (item.value == msg) {
          return item.label
        }
      }
    },
    statusFilter(status) {
      if (status) {
        const statusMap = {
          S: 'success',
        }
        return statusMap[status]
      }
      return ''
    },
  },
  components: {
    query,
  },
  data() {
    return {
      timeValue: '',
      searchLoading: false,
      searchParams: {
        recordName: '', // 工单标题
        recordFlow: '', // 工单流程进度
        recordClassifyName: '', // 大类名称
        recordClassifySmallName: '', // 小类名称
        urgentGrade: '', // 分类优先级
        createName: '', // 工单创建人
      },
      workOrderLoading: false,
      workOrderList: [],
      classifyList: [], //分类树
      recordClassifyOption: [],
      recordClassifySmallOption: [],
      urgentGradeOption: [], //优先级列表
      branchRecordOption: [], //是否子单列表
      receiptSourceOption: [], //工单来源列表
      recordFlowOption: [], //流程进度列表
      detailsDialog: false,
      //详情必要参数
      detailsParams: {
        recordCode: '', //工单编码
        isVerify: '', //是否需要审核
        branchRecord: '', //是否是子单
        recordExplain: '', //子单说明
      },
      grabRecordLoading: false,
      total: 0,
      pageSizes: [10, 20, 50, 100],
      pageInfo: {
        pageNumber: 1,
        pageSize: 10,
        direction: 'DESC',
        property: 'createDt',
      },
    }
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
      const _this = this
      let params = {
        condition: { ..._this.searchParams },
        page: { ..._this.pageInfo },
        rule: {},
      }
      if (_this.timeValue) {
        params.condition.recordExpectDtStart = _this.timeValue[0]
        params.condition.recordExpectDtEnd = _this.timeValue[1]
        params.rule.recordExpectDt = 'T'
      }
      if (_this.searchParams.recordName) {
        params.rule.recordName = 'like'
      }
      if (_this.searchParams.createName) {
        params.rule.createName = 'like'
      }
      type == 'passive'
        ? (_this.workOrderLoading = true)
        : (_this.searchLoading = true)
      this.$api.record
        .getPage(params)
        .then((res) => {
          _this.workOrderList = res.content.list
          _this.total = res.content.total
          type == 'passive'
            ? (_this.workOrderLoading = false)
            : (_this.searchLoading = false)
        })
        .catch((error) => {
          type == 'passive'
            ? (_this.workOrderLoading = false)
            : (_this.searchLoading = false)
        })
    },
    //打开详情对话框
    openDetailsDialog(index, data) {
      this.detailsParams = data
      this.detailsDialog = true
    },
    //查看详情

    //抢单
    grabRecord() {
      const _this = this
      _this.grabRecordLoading = true
      const params = {
        recordCode: this.detailsParams.recordCode,
      }
      this.$api.record
        .grabRecord(params)
        .then((res) => {
          _this.$message({
            message: '抢单成功',
            type: 'success',
          })
        })
        .then(() => {
          _this.grabRecordLoading = false
          _this.detailsDialog = false
          _this.findWorkOrderList()
        })
        .catch((error) => {
          _this.grabRecordLoading = false
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
    //大类被选中时
    changeHandel() {
      const _this = this
      const val = _this.searchParams.recordClassifyName
      if (val) {
        //提取小类列表
        const classifyList = JSON.parse(JSON.stringify(_this.classifyList))
        for (let [index, item] of classifyList.entries()) {
          if (item.classifyName === val) {
            let childrenList = item.children
            let recordClassifySmallOption = []
            for (let [index, item] of childrenList.entries()) {
              recordClassifySmallOption.push({
                value: item.classifyName,
                label: item.classifyName,
              })
            }
            _this.recordClassifySmallOption = recordClassifySmallOption
            break
          }
        }
      } else {
        //清除小类列表
        _this.recordClassifySmallOption = []
      }
      _this.searchParams.recordClassifySmallName = ''
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
    //处理pageSize改变时的方法
    handleSizePage(val) {
      const _this = this
      _this.pageInfo.pageSize = val
      _this.findWorkOrderList()
    },
    //处理pageNumber改变时的方法
    handlePage(val) {
      const _this = this
      _this.pageInfo.pageNumber = val
      _this.findWorkOrderList()
    },
  },
}
</script>

<style scoped></style>
