<template>
  <div>
    <!-- 分组表格数据 -->
    <el-table
      :data="stepList"
      border
      fit
      v-loading="stepLoading"
      style="width: 100%;margin: 10px 0;"
    >
      <el-table-column
        prop="recordStepName"
        label="流程步骤"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template slot-scope="{ row }">
          <span
            v-if="row.recordStep == 'I'"
            style="cursor:pointer;color:#66b1ff"
            @click="openDialog('子单流程', '80%', row)"
          >
            {{ row.recordStepName }}
          </span>
          <span v-else>
            {{ row.recordStepName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="stepRemark"
        label="说明"
        show-overflow-tooltip
        header-align="center"
        align="center"
        min-width="300px"
      >
      </el-table-column>

      <el-table-column
        label="操作人"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template slot-scope="{ row }">
          <span v-if="!row.userName">
            {{ row.createName }}
          </span>
          <span v-else-if="row.createName">
            {{ `${row.createName} ${tagList[0]} ${row.userName}` }}
          </span>
          <span v-else-if="!row.createName && row.recordStep != 'C'">
            {{ `${tagList[2]} ${tagList[0]} ${row.userName}` }}
          </span>
          <span style="color:red" v-else>
            {{ tagList[3] }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        prop="createDt"
        label="记录时间"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column>
    </el-table>
    <!-- 子单流程 -->
    <el-dialog
      :title="title"
      :visible.sync="branchRecordDialog"
      :width="width"
      center
      append-to-body
      v-if="branchRecordDialog"
    >
      <el-card class="box-card" shadow="never">
        <div slot="header" class="header-text">
          <span><i class="el-icon-menu menu-icon"></i>处理流程</span>
        </div>
        <queryBranchRecordStep
          :recordCode="branchRecordCode"
        ></queryBranchRecordStep>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="branchRecordDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import queryBranchRecordStep from './queryBranchRecordStep'
export default {
  components: { queryBranchRecordStep },
  props: {
    recordCode: Number,
  },
  data() {
    return {
      title: '',
      width: '',
      stepList: [],
      stepLoading: false,
      tagList: ['→', '←', '[系统]', '[超时!订单回收]'],
      branchRecordDialog: false,
      branchRecordCode: undefined,
    }
  },
  created() {
    this.getRecordStep()
  },
  methods: {
    openDialog(title, width, data) {
      this.title = title
      this.width = width
      this.branchRecordCode = parseInt(data.stepRemark.slice(5))
      this.branchRecordDialog = true
    },
    closeDialog() {
      this.branchRecordDialog = false
    },
    //查询
    getRecordStep() {
      const _this = this
      const params = { recordCode: _this.recordCode }
      _this.stepLoading = true
      _this.$api.record
        .getRecordStep(params)
        .then((res) => {
          _this.stepList = res.content
          _this.stepLoading = false
        })
        .catch((error) => {
          _this.stepLoading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-icon {
  margin-right: 8px;
  color: #58a6e8;
}
.box-card {
  margin-top: 2px;
}
.header-text {
  font-size: 18px;
}
</style>

<style>
.box-card .el-card__header {
  background: rgb(236, 245, 255);
}
.box-card .el-table td,
.box-card .el-table th {
  padding: 5px 0;
}
.box-card .el-table th {
  background-color: #f3f6fb;
}
</style>
