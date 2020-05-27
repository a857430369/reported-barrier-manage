<template>
  <div class="custom_style">
    <el-container>
      <!-- 头部容器 -->
      <el-header style="margin-top:20px;height:145px">
        <el-card class="filter">
          <el-form ref="searchParams" :model="searchParams" label-width="100px">
            <el-row type="flex" style="margin:0 5%">
              <el-col
                :span="24"
                style="display:flex;margin: 0 auto;width:100%;height:50px"
              >
                <el-form-item label="大类">
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
                </el-form-item>

                <el-form-item label="小类">
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
                </el-form-item>

                <el-form-item label="工单标题">
                  <el-input
                    style="width:215px"
                    placeholder="请输入工单标题"
                    class="filter-item"
                    v-model.trim="searchParams.recordName"
                    @keyup.enter.native="findWorkOrderList('search')"
                  />
                </el-form-item>

                <el-form-item label="优先级">
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
                </el-form-item>

                <el-form-item label="是否子单">
                  <el-select
                    v-model="searchParams.branchRecord"
                    placeholder="请选择是否子单"
                    clearable
                  >
                    <el-option
                      v-for="item in branchRecordOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" style="margin:0 5%">
              <el-col
                :span="24"
                style="display:flex;margin: 0 auto;width:100%;height:50px"
              >
                <el-form-item label="工单来源">
                  <el-select
                    v-model="searchParams.receiptSource"
                    placeholder="请选择工单来源"
                    clearable
                  >
                    <el-option
                      v-for="item in receiptSourceOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="流程进度">
                  <el-select
                    v-model="searchParams.recordFlow"
                    placeholder="请选择工单流程进度"
                    clearable
                  >
                    <el-option
                      v-for="item in recordFlowOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="创建人">
                  <el-input
                    style="width:215px"
                    placeholder="请输入工单创建人"
                    class="filter-item"
                    v-model.trim="searchParams.createName"
                    clearable
                    @keyup.enter.native="findWorkOrderList('search')"
                  />
                </el-form-item>

                <el-form-item label="期望时间">
                  <el-date-picker
                    :style="{ width: timeWidth }"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="timeValue"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center" style="width:100%;height:35px">
              <el-button
                type="primary"
                :loading="searchLoading"
                icon="el-icon-search"
                @click="findWorkOrderList('search')"
                size="medium"
                >搜索</el-button
              >
              <!-- <el-button type="primary" size="medium" icon="el-icon-s-home"
                >工作台</el-button
              > -->
            </el-row>
          </el-form>
        </el-card>
      </el-header>

      <!-- 主内容容器 -->
      <el-main style="margin-top:5px">
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
              prop="backfillNum"
              label="是否转省"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tag :type="row.backfillNum | backfillNumFilter">
                  {{ row.backfillNum ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>

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
              prop="lastDt"
              label="处理时间"
              sortable
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="155px"
            >
            </el-table-column>

            <el-table-column
              prop="wordDt"
              label="处理时长(H)"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="120px"
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
              prop="recordScore"
              label="评分(5.0)"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="150px"
            >
              <template slot-scope="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="row.recordAssess | recordAssessFormat"
                  placement="top-end"
                >
                  <el-rate
                    :value="row.recordScore | parseStr2Int"
                    :colors="colors"
                    disabled
                  ></el-rate>
                </el-tooltip>
              </template>
            </el-table-column>

            <!-- <el-table-column
              prop="recordAssess"
              label="评价"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column> -->

            <el-table-column
              label="操作"
              header-align="center"
              align="center"
              fixed="right"
              min-width="100px"
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

    <!-- 详情对话框 -->
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
        <el-button type="primary" @click="detailsDialog = false"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/work-order/queryGeneral'
import router from '@/router'
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
    backfillNumFilter(val) {
      if (val) {
        return 'success'
      }
      return ''
    },
    parseStr2Int(val) {
      if (val) {
        return parseInt(val)
      }
      return 0
    },
    recordAssessFormat(val) {
      if (val) {
        return val
      }
      return '暂无评价'
    },
  },
  components: {
    query,
  },
  data() {
    return {
      timeValue: '',
      timeWidth: '',
      searchLoading: false,
      searchParams: {
        recordName: '', // 工单标题
        recordFlow: '', // 工单流程进度
        recordClassifyName: '', // 大类名称
        recordClassifySmallName: '', // 小类名称
        branchRecord: '', //是否子单
        urgentGrade: '', // 分类优先级
        receiptSource: '', //工单来源
        createName: '', // 工单创建人
      },
      workOrderLoading: false,
      workOrderList: [],
      classifyList: [], //分类树
      recordClassifyOption: [], //大类列表
      recordClassifySmallOption: [], //小类列表
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
      fm: undefined,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
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
    this.screenCheck()
  },
  methods: {
    screenCheck() {
      const _this = this
      if (screen.width > 1600) {
        _this.timeWidth = '535px'
      } else {
        _this.timeWidth = '400px'
      }
    },
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
        .getAllPage(params)
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
      this.pageInfo.pageSize = val
      this.findWorkOrderList()
    },
    //处理pageNumber改变时的方法
    handlePage(val) {
      this.pageInfo.pageNumber = val
      this.findWorkOrderList()
    },
  },
}
</script>

<style>
/* .table-style .el-table td,
.table-style .el-table th {
  padding: 5px 0;
} */
</style>
