<template>
  <div>
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
      >
      </el-table-column>

      <el-table-column
        prop="recordClassifySmallName"
        label="小类"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="recordName"
        label="工单标题"
        show-overflow-tooltip
        header-align="center"
        align="center"
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
        prop="receiptSource"
        label="工单来源"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.receiptSource | dataFormat(receiptSourceOption) }}
        </template>
      </el-table-column>

      <el-table-column
        width="155px"
        prop="createDt"
        label="创建时间"
        sortable
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column>

      <el-table-column
        width="155px"
        prop="recordExpectDt"
        label="期望时间"
        sortable
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column>

      <el-table-column
        v-if="recordFlow == 'J,D'"
        prop="orderTime"
        width="155px"
        sortable
        label="剩余接单时间"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.orderTime >= 0">
            {{ time(scope.row.orderTime) }}
            <!-- {{ parseTime(scope.row.orderTime, '{i}:{s}') }} -->
          </p>
          <p v-else>已超时</p>
        </template>
      </el-table-column>

      <el-table-column
        v-if="recordFlow == 'C,Z,H'"
        prop="handleTime"
        width="155px"
        sortable
        label="剩余处理时间"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.handleTime >= 0">
            {{ time(scope.row.handleTime) }}
            <!-- {{parseTime(scope.row.handleTime,'{y}-{m}-{d} {h}:{i}:{s}')}} -->
          </p>
          <p v-else>已超时</p>
        </template>
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
        label="操作"
        header-align="center"
        align="center"
        :width="operationWidth"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-success"
            @click="acceptedRecord(scope.row.recordCode)"
            v-if="recordFlow == 'J,D'"
            >接单</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-error"
            @click="openDialog(scope.row, '拒绝订单', 'J')"
            v-if="recordFlow == 'J,D'"
            >拒绝接单</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-finished"
            @click="openDialog(scope.row, '处理完成', 'W', '30%')"
            v-if="recordFlow == 'C,Z,H' && scope.row.recordFlow == 'C'"
            >处理完成</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-s-flag"
            @click="openDialog(scope.row, '暂缓订单', 'H')"
            v-if="recordFlow == 'C,Z,H' && scope.row.recordFlow == 'C'"
            >暂缓订单</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-refresh-left"
            @click="recoverRecord(scope.row.recordCode)"
            v-if="recordFlow == 'C,Z,H' && scope.row.recordFlow == 'Z'"
            >恢复订单</el-button
          >
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-s-flag"
            @click="openDialog(scope.row, '确认撤单', 'P', '30%')"
            v-if="recordFlow == 'C,Z,H' && scope.row.recordFlow == 'H'"
            >确认撤单</el-button
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
        <el-button
          type="primary"
          @click="detailsDialog = false"
          v-if="recordFlow != 'C,Z,H' || detailsParams.recordFlow != 'C'"
          >确 定</el-button
        >
        <el-button
          type="primary"
          @click="openDialog(detailsParams, '退单', 'T')"
          v-if="recordFlow == 'C,Z,H' && detailsParams.recordFlow == 'C'"
          >退 单</el-button
        >
        <el-button
          type="primary"
          @click="openDialog(detailsParams, '转单', 'Z')"
          v-if="recordFlow == 'C,Z,H' && detailsParams.recordFlow == 'C'"
          >转 单</el-button
        >
        <el-button
          type="primary"
          @click="openDialog(detailsParams, '子单', 'B')"
          v-if="recordFlow == 'C,Z,H' && detailsParams.recordFlow == 'C'"
          >子 单</el-button
        >
        <el-button
          type="primary"
          @click="openDialog(detailsParams, '转省处理', 'S', '30%')"
          v-if="recordFlow == 'C,Z,H' && detailsParams.recordFlow == 'C'"
          >转省处理</el-button
        >
        <el-button type="primary" @click="detailsDialog = false"
          >返 回</el-button
        >
      </span>
    </el-dialog>

    <!-- 基础原因对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="remarkDialog"
      :width="width"
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
        <el-button type="primary" @click="closeDialog('baseParams')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 处理完成对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="finishedDialog"
      :width="width"
      center
      destroy-on-close
    >
      <el-form
        ref="finishedParams"
        :model="finishedParams"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="处理时长" prop="wordDt">
          <el-input
            placeholder="请输入处理时长,例如:1.5"
            v-model.trim="finishedParams.wordDt"
            clearable
          >
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
        <el-form-item label="原因" prop="remark">
          <el-input
            type="textarea"
            maxlength="255"
            show-word-limit
            rows="5"
            v-model.trim="finishedParams.remark"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件上传">
          <el-upload
            ref="upload"
            class="upload"
            action="#"
            :auto-upload="true"
            :http-request="uploadFile"
            :before-upload="checkFile"
            :show-file-list="false"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div
              slot="tip"
              style="display: inline;margin-left: 20px"
              class="el-upload__tip"
            >
              （上传的附件不超过8M）
            </div>
          </el-upload>

          <div class="table-content-s" v-if="fileList.length != 0">
            <el-table
              :data="fileList"
              row-class-name="table-custom"
              header-row-class-name="table-custom"
              border
              style="width: 100%;margin: 10px 0"
            >
              <el-table-column
                prop="fileName"
                label="附件名称"
                show-overflow-tooltip
                header-align="center"
              >
              </el-table-column>

              <el-table-column
                label="操作"
                width="100px"
                show-overflow-tooltip
                header-align="center"
                align="center"
              >
                <template slot-scope="item">
                  <el-button
                    type="danger"
                    @click="delFileCode(item.row)"
                    size="mini"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="finishedDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog('finishedParams')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 确认撤单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="confirmDialog"
      :width="width"
      center
      destroy-on-close
    >
      <el-form
        ref="confirmParams"
        :model="confirmParams"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="处理时长" prop="wordDt">
          <el-input
            placeholder="请输入处理时长,例如:1.5"
            v-model.trim="confirmParams.wordDt"
            clearable
          >
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog('confirmParams', 'P')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 转省处理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="transferProvinceDialog"
      :width="width"
      center
    >
      <el-form
        ref="transferProvinceParams"
        :model="transferProvinceParams"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="回填单号" prop="backfillNum">
          <el-input
            placeholder="请输入回填单号"
            v-model.trim="transferProvinceParams.backfillNum"
            clearable
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="transferProvinceDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog('transferProvinceParams')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 转单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="transferRecordDialog"
      :width="width"
      center
      destroy-on-close
    >
      <el-form
        ref="transferRecordParams"
        :model="transferRecordParams"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="选择人员">
          <orgTree @selectedUser="selectedUser"></orgTree>
        </el-form-item>
        <el-form-item label="转单原因" prop="remark">
          <el-input
            type="textarea"
            maxlength="255"
            show-word-limit
            rows="5"
            v-model.trim="transferRecordParams.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="transferRecordDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog('transferRecordParams')"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 子单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="branchRecordDialog"
      :width="width"
      center
      destroy-on-close
    >
      <el-form
        ref="branchRecordParams"
        :model="branchRecordParams"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="选择人员">
          <orgTree @selectedUser="selectedUser"></orgTree>
        </el-form-item>
        <el-form-item label="期望时间" prop="expectDt">
          <el-date-picker
            v-model="branchRecordParams.expectDt"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="子单说明" prop="explain">
          <el-input
            type="textarea"
            maxlength="255"
            show-word-limit
            rows="5"
            v-model.trim="branchRecordParams.explain"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件上传">
          <el-upload
            ref="upload"
            class="upload"
            action="#"
            :auto-upload="true"
            :http-request="uploadFile"
            :before-upload="checkFile"
            :show-file-list="false"
            multiple
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div
              slot="tip"
              style="display: inline;margin-left: 20px"
              class="el-upload__tip"
            >
              （上传的附件不超过8M）
            </div>
          </el-upload>
          <div class="table-content-s" v-if="fileList.length != 0">
            <el-table
              :data="fileList"
              row-class-name="table-custom"
              header-row-class-name="table-custom"
              border
              style="width: 100%;margin: 10px 0"
            >
              <el-table-column
                prop="fileName"
                label="附件名称"
                show-overflow-tooltip
                header-align="center"
              >
              </el-table-column>

              <el-table-column
                label="操作"
                width="100px"
                show-overflow-tooltip
                header-align="center"
                align="center"
              >
                <template slot-scope="item">
                  <el-button
                    type="danger"
                    @click="delFileCode(item.row)"
                    size="mini"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="branchRecordDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog('branchRecordParams')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/work-order/queryGeneral'
import orgTree from '@/components/work-order/orgTree'
// import { parseTime } from '@/utils'

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
  },
  props: {
    workOrderList: {
      type: Array,
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
    findWorkOrderList: {
      type: Function,
      required: true,
    },
    recordFlow: {
      type: String,
      required: true,
    },
    operationWidth: {
      type: String,
      default: function() {
        return '300px'
      },
    },
  },
  components: {
    query,
    orgTree,
  },
  data() {
    const onePoint = (rule, value, callback) => {
      if (!/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) {
        callback(new Error('只保留一位小数'))
      } else {
        callback()
      }
    }
    return {
      //倒计时
      ticker: null,
      d: '',
      h: '',
      m: '',
      s: '',

      //加载
      workOrderLoading: false,
      loading: false,

      //详情必要参数
      detailsParams: {
        recordCode: '', //工单编码
        isVerify: '', //是否审核
        recordClassifySmallName: '', //小类
      },

      //对话框
      detailsDialog: false, //详情
      remarkDialog: false, //原因
      finishedDialog: false, //处理完成
      confirmDialog: false, //确定撤单
      transferProvinceDialog: false, //转省处理
      transferRecordDialog: false, //转单
      branchRecordDialog: false, //子单

      //对话框基础信息
      title: '',
      width: '',
      functionType: '',

      //请求参数
      baseParams: {
        recordCode: '',
        remark: '',
      },
      finishedParams: {
        recordCode: '', // 工单编码
        wordDt: '', // 处理时长
        fileIds: '', // 附件id，逗号隔开，可以为空
      },
      confirmParams: {
        recordCode: '',
        wordDt: '',
      },
      transferProvinceParams: {
        recordCode: '',
        backfillNum: '',
      },
      transferRecordParams: {
        recordCode: '',
        userCode: '',
        remark: '',
      },
      userParams: {
        recordClassifySmall: '',
        userName: '',
      },
      branchRecordParams: {
        recordCode: '',
        phone: '',
        disposeCode: '',
        expectDt: '',
        explain: '',
      },

      //返回数据
      userInfo: undefined,
      fileList: [],
      fileIdList: [],
      userOptions: [],
      userList: [],

      //分页
      total: 0,
      pageSizes: [10, 20, 50, 100],
      pageInfo: {
        pageNumber: 1,
        pageSize: 10,
        direction: 'DESC',
        property: 'createDt',
      },

      //校验
      rules: {
        remark: [{ required: true, message: '请填写原因', trigger: 'blur' }],
        wordDt: [
          { required: true, message: '请输入处理时长', trigger: 'blur' },
          {
            validator: onePoint,
            message: '请输入正确格式',
            trigger: 'blur',
          },
        ],
        backfillNum: [
          { required: true, message: '请填写回填单号', trigger: 'blur' },
        ],
        userCode: [
          { required: true, message: '请选中被转人员', trigger: 'blur' },
        ],
        expectDt: [
          { required: true, message: '请选择期望时间', trigger: 'blur' },
        ],
        explain: [{ required: true, message: '请填写说明', trigger: 'blur' }],
      },
    }
  },
  watch: {
    workOrderList(val) {
      this.workOrderList = val
      const recordFlow = this.recordFlow
      for (let i = 0, len = this.workOrderList.length; i < len; i++) {
        const item = this.workOrderList[i]
        if (recordFlow == 'J,D') {
          item.orderTime =
            new Date(item.lastDt).getTime() + 600000 - new Date().getTime()
        } else if (recordFlow == 'C,Z,H') {
          item.handleTime =
            new Date(item.recordExpectDt).getTime() - new Date().getTime()
        }
      }
      if (this.ticker) {
        clearInterval(this.ticker)
      }
      this.beginTimer()
    },
  },
  methods: {
    //开启定时器
    beginTimer() {
      this.ticker = setInterval(() => {
        for (let i = 0, len = this.workOrderList.length; i < len; i++) {
          const item = this.workOrderList[i]
          if (item.handleTime > 0) {
            item.handleTime = item.handleTime - 1000
          }
          if (item.orderTime > 0) {
            item.orderTime = item.orderTime - 1000
          }
        }
      }, 1000)
    },
    //时间格式化
    time(time) {
      if (time >= 0) {
        let d = Math.floor(time / 1000 / 60 / 60 / 24)
        let h = Math.floor((time / 1000 / 60 / 60) % 24)
        let m = Math.floor((time / 1000 / 60) % 60)
        let s = Math.floor((time / 1000) % 60)
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        return d + '天' + h + '时' + m + '分' + s + '秒'
      }
    },

    //对话框的打开和关闭
    openDetailsDialog(index, data) {
      this.detailsParams = data
      this.detailsDialog = true
    },
    openDialog(data, title, functionType, width = '50%') {
      if (!functionType) return false
      this.title = title
      this.width = width
      this.functionType = functionType
      if (functionType == 'J' || functionType == 'H' || functionType == 'T') {
        this.baseParams.recordCode = data.recordCode
        this.remarkDialog = true
      } else if (functionType == 'W') {
        this.clearFileParams()
        this.finishedParams.recordCode = data.recordCode
        this.finishedDialog = true
      } else if (functionType == 'P') {
        this.confirmParams.recordCode = data.recordCode
        this.confirmDialog = true
      } else if (functionType == 'S') {
        this.transferProvinceParams.recordCode = data.recordCode
        this.transferProvinceDialog = true
      } else if (functionType == 'Z') {
        this.transferRecordParams.recordCode = data.recordCode
        this.userParams.recordClassifySmall = data.recordClassifySmall
        this.transferRecordDialog = true
      } else if (functionType == 'B') {
        this.clearFileParams()
        this.branchRecordParams.recordCode = data.recordCode
        this.branchRecordParams.phone = data.createPhone
        this.branchRecordDialog = true
      } else {
        console.warn(functionType, '类型不存在')
      }
    },
    closeDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const functionType = this.functionType
          if (functionType == 'J') {
            this.refuseRecord()
            this.remarkDialog = false
          } else if (functionType == 'H') {
            this.deferRecord()
            this.remarkDialog = false
          } else if (functionType == 'T') {
            this.retreatRecord()
            this.remarkDialog = false
            this.detailsDialog = false
          } else if (functionType == 'W') {
            this.finishedProcessing()
            this.finishedDialog = false
          } else if (functionType == 'P') {
            this.confirmRecallRecord()
            this.confirmDialog = false
          } else if (functionType == 'S') {
            this.transferProvince()
            this.transferProvinceDialog = false
            this.detailsDialog = false
          } else if (functionType == 'Z') {
            const flag = this.checkUserInfo()
            if (true) {
              this.transferRecord()
              this.transferRecordDialog = false
              this.detailsDialog = false
            }
          } else if (functionType == 'B') {
            const flag = this.checkUserInfo()
            if (true) {
              this.branchRecord()
              this.branchRecordDialog = false
            }
          } else {
            console.warn(functionType, '类型不存在')
          }
        }
      })
    },

    //文件处理
    delFileCode(data) {
      const fileId = data.fileId
      const fileList = this.fileList
      for (let [index, item] of fileList.entries()) {
        if (item.fileId == fileId) {
          fileList.splice(index, 1)
          break
        }
      }
    },
    checkFile(file) {
      let size = file.size
      if (size > 8 * 1024 * 1024) {
        this.$message.error('上传的附件不超过8M')
        return false
      }
    },
    uploadFile(param) {
      const _this = this
      const form = new FormData()
      form.append('file', param.file, param.file.name)
      let params = {
        fileType: 'F',
      }
      this.$api.common.uploadFile(form, params).then((res) => {
        this.fileList.push(res.content)
      })
    },

    //子组件传值
    selectedUser(val) {
      this.userInfo = val
    },
    checkUserInfo() {
      const userInfo = this.userInfo
      if (!userInfo) {
        this.$message({
          message: '请选择人员',
          type: 'warning',
        })
        return false
      }
      return true
    },

    //API
    //接单
    acceptedRecord(val) {
      this.loading = true
      const params = {
        recordCode: val,
      }
      this.$api.record
        .acceptedRecord(params)
        .then((res) => {
          this.$message({
            message: '接单成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //拒绝接单
    refuseRecord() {
      this.loading = true
      const params = this.baseParams
      this.$api.record
        .refuseRecord(params)
        .then((res) => {
          this.$message({
            message: '拒绝接单成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearBaseParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //处理完成
    finishedProcessing() {
      this.loading = true
      const params = this.finishedParams
      const fileList = this.fileList
      if (fileList) {
        let fileIds = []
        fileList.forEach((item) => {
          fileIds.push(item.fileId)
        })
        params.fileIds = fileIds.join(',')
      }
      this.$api.record
        .finishedProcessing(params)
        .then((res) => {
          this.$message({
            message: '处理完成',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearFinishedParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //暂缓订单
    deferRecord() {
      this.loading = true
      const params = this.baseParams
      this.$api.record
        .deferRecord(params)
        .then((res) => {
          this.$message({
            message: '暂缓成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearBaseParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //恢复订单
    recoverRecord(val) {
      this.loading = true
      const params = {
        recordCode: val,
      }
      this.$api.record
        .recoverRecord(params)
        .then((res) => {
          this.$message({
            message: '恢复成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //确认撤单
    confirmRecallRecord() {
      this.loading = true
      const params = this.confirmParams
      this.$api.record
        .confirmRecallRecord(params)
        .then((res) => {
          this.$message({
            message: '确认撤单成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearConfirmParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //退单
    retreatRecord() {
      this.loading = true
      const params = this.baseParams
      this.$api.record
        .retreatRecord(params)
        .then((res) => {
          this.$message({
            message: '退单成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearBaseParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //转省处理
    transferProvince() {
      this.loading = true
      const params = this.transferProvinceParams
      this.$api.record
        .transferProvince(params)
        .then((res) => {
          this.$message({
            message: '转省处理成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearTransferProvinceParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //转单
    transferRecord() {
      this.loading = true
      const params = {
        ...this.transferRecordParams,
        userCode: this.userInfo.userCode,
      }
      this.$api.record
        .transferRecord(params)
        .then((res) => {
          this.$message({
            message: '转单成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearTransferRecordParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    //子单
    branchRecord() {
      this.loading = true
      const params = {
        ...this.branchRecordParams,
        disposeCode: this.userInfo.userCode,
      }
      const fileList = this.fileList
      if (fileList) {
        let fileIds = []
        fileList.forEach((item) => {
          fileIds.push(item.fileId)
        })
        params.fileId = fileIds.join(',')
      }
      this.$api.record
        .branchRecord(params)
        .then((res) => {
          this.$message({
            message: '子单点单成功',
            type: 'success',
          })
          this.loading = false
        })
        .then(() => {
          this.clearBranchRecordParams()
          this.findWorkOrderList()
        })
        .catch((error) => {
          this.loading = false
        })
    },

    //参数清理
    clearBaseParams() {
      this.baseParams = {
        recordCode: '',
        remark: '',
      }
    },
    clearFinishedParams() {
      this.finishedParams = {
        recordCode: '',
        wordDt: '',
        fileIds: '',
      }
    },
    clearTransferProvinceParams() {
      this.transferProvinceParams = {
        recordCode: '',
        backfillNum: '',
      }
    },
    clearConfirmParams() {
      this.confirmParams = {
        recordCode: '',
        wordDt: '',
      }
    },
    clearTransferRecordParams() {
      this.transferRecordParams = {
        recordCode: '',
        userCode: '',
        remark: '',
      }
      this.userInfo = undefined
    },
    clearBranchRecordParams() {
      this.branchRecordParams = {
        recordCode: '',
        phone: '',
        disposeCode: '',
        expectDt: '',
        explain: '',
      }
    },
    clearFileParams() {
      this.fileList = []
      this.fileIdList = []
    },
    //分页监控
    handleSizePage(val) {
      this.pageInfo.pageSize = val
      this.findWorkOrderList()
    },
    handlePage(val) {
      this.pageInfo.pageNumber = val
      this.findWorkOrderList()
    },
  },
}
</script>

<style scope>
.table-content-s .el-table__header-wrapper {
  border-bottom: 1px solid #ebeef5;
}
</style>
