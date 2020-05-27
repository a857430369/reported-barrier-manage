<template>
  <div class="filter-style">
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
        <template slot-scope="scope">
          {{ scope.row.urgentGrade | dataFormat(urgentGradeOption) }}
        </template>
      </el-table-column>

      <!-- <el-table-column
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
      </el-table-column> -->

      <!-- <el-table-column
        prop="recordExplain"
        label="子单说明"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column> -->

      <el-table-column
        v-show="recordFlow != 'J'"
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
        v-if="recordFlow == 'Y' || recordFlow == 'Q'"
        prop="wordDt"
        label="处理时长(H)"
        show-overflow-tooltip
        header-align="center"
        align="center"
        width="120px"
      >
      </el-table-column>

      <el-table-column
        prop="disposeName"
        label="跟进人"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column>

      <el-table-column
        v-if="recordFlow == 'Q'"
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
        v-if="recordFlow == 'Q'"
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
        :width="operationWidth"
      >
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.recordFlow != 'Q' &&
                scope.row.recordFlow != 'Y' &&
                scope.row.recordFlow != 'W' &&
                scope.row.recordFlow != 'H'
            "
            size="mini"
            type="warning"
            icon="el-icon-refresh-right"
            @click="openDialog(scope.row.recordCode, '撤单原因', 'F', '30%')"
            >申请撤单</el-button
          >

          <el-button
            v-if="scope.row.recordFlow == 'Y'"
            size="mini"
            type="primary"
            icon="el-icon-success"
            @click="openDialog(scope.row.recordCode, '发表评价', 'R', '30%')"
            >确认完成</el-button
          >

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

    <!-- 基础原因对话框 -->
    <el-dialog
      :title="remarkTitle"
      :visible.sync="remarkDialog"
      :width="remarkWidth"
      center
      destroy-on-close
    >
      <el-form
        ref="baseParams"
        :model="baseParams"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="原因" prop="remark">
          <el-input
            type="textarea"
            maxlength="255"
            show-word-limit
            rows="5"
            v-model.trim="baseParams.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="remarkDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog('baseParams', 'F')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 确认完成对话框 -->
    <el-dialog
      :title="confirmTitle"
      :visible.sync="confirmDialog"
      :width="confirmWidth"
      center
      destroy-on-close
    >
      <el-form
        ref="applyParams"
        :model="applyParams"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="评分" prop="recordScore">
          <el-rate
            v-model="applyParams.recordScore"
            :colors="colors"
            show-text
            :texts="texts"
            style="margin-top:10px"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="评价" prop="recordAssess">
          <el-input
            type="textarea"
            maxlength="255"
            show-word-limit
            rows="5"
            v-model.trim="applyParams.recordAssess"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="confirmDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="closeDialog('applyParams', 'R')"
          >提交评价</el-button
        >
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
  props: {
    workOrderList: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    urgentGradeOption: {
      type: Array,
      required: true,
    },
    branchRecordOption: {
      type: Array,
      required: true,
    },
    receiptSourceOption: {
      type: Array,
      required: true,
    },
    recordFlowOption: {
      type: Array,
      required: true,
    },
    getPersonalPage: {
      type: Function,
      required: true,
    },
    recordFlow: {
      type: String,
      required: true,
    },
    operationWidth: {
      type: String,
      default: '250px',
    },
  },
  components: {
    query,
  },
  data() {
    const aStar = (rule, value, callback) => {
      if (value == 0) {
        callback(new Error('最少一颗星'))
      } else {
        callback()
      }
    }
    return {
      workOrderLoading: false,
      //详情必要参数
      detailsParams: {
        recordCode: '', //工单编码
        isVerify: '', //是否需要审核
        branchRecord: '', //是否是子单
        recordExplain: '', //子单说明
      },
      detailsDialog: false,
      remarkTitle: '', //原因对话框标题
      remarkDialog: false, //原因对话框
      remarkWidth: '50%',
      baseParams: {
        recordCode: '',
        remark: '',
      },
      confirmTitle: '', //确认完成对话框标题
      confirmDialog: false, //确认完成对话框
      confirmWidth: '',
      applyParams: {
        recordCode: '',
        recordScore: 0,
        recordAssess: '',
      },
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      texts: ['极差', '失望', '一般', '满意', '非常满意'],
      pageSizes: [5, 10, 20, 50, 100],
      pageInfo: {
        pageNumber: 1,
        pageSize: 10,
        direction: 'DESC',
        property: 'createDt',
      },
      rules: {
        remark: [{ required: true, message: '请填写原因', trigger: 'blur' }],
        recordScore: [
          { required: true, message: '请选择分数', trigger: 'blur' },
          {
            validator: aStar,
            message: '最少一颗星',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    //打开详情对话框
    openDetailsDialog(index, data) {
      this.detailsParams = data
      this.detailsDialog = true
    },
    //打开对话框
    openDialog(recordCode, title, functionType, width = '50%') {
      if (functionType == 'F') {
        this.clearBaseParams()
        this.remarkWidth = width
        this.baseParams.recordCode = recordCode
        this.remarkTitle = title
        this.remarkDialog = true
      } else if (functionType == 'R') {
        this.clearApplyParams()
        this.confirmWidth = width
        this.applyParams.recordCode = recordCode
        this.confirmTitle = title
        this.confirmDialog = true
      }
    },
    //关闭对话框
    closeDialog(formName, functionType) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (functionType == 'F') {
            //申请撤单
            this.applyRecallRecord()
            this.remarkDialog = false
          } else if (functionType == 'R') {
            //确认完成
            this.confirmCompletion()
            this.confirmDialog = false
          }
        }
      })
    },
    //申请撤单
    applyRecallRecord() {
      this.loading = true
      const params = this.baseParams
      this.$api.record
        .applyRecallRecord(params)
        .then((res) => {
          this.$message({
            message: '申请撤单成功!',
            type: 'success',
          })
          this.loading = false
          this.getPersonalPage()
        })
        .catch((error) => {
          this.loading = false
        })
      this.clearBaseParams()
    },
    //确认完成
    confirmCompletion() {
      this.loading = true
      const params = this.applyParams
      this.$api.record
        .confirmCompletion(params)
        .then((res) => {
          this.$message({
            message: '确认成功',
            type: 'success',
          })
          this.loading = false
          this.getPersonalPage()
        })
        .catch((error) => {
          this.loading = false
        })
      this.clearApplyParams()
    },
    //查看详情
    //清除基础对话框参数
    clearBaseParams() {
      this.baseParams = {
        recordCode: '',
        remark: '',
      }
    },
    //清除确认完成对话框参数
    clearApplyParams() {
      this.applyParams = {
        recordCode: '',
        recordScore: 0,
        recordAssess: '',
      }
    },
    //处理pageSize改变时的方法
    handleSizePage(val) {
      this.pageInfo.pageSize = val
      this.getPersonalPage()
    },
    //处理pageNumber改变时的方法
    handlePage(val) {
      this.pageInfo.pageNumber = val
      this.getPersonalPage()
    },
  },
}
</script>
