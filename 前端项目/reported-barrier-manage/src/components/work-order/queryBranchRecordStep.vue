<template>
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
          @click="openDialog('子单流程', '50%')"
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
</template>

<script>
export default {
  props: {
    recordCode: Number,
  },
  data() {
    return {
      stepList: [],
      stepLoading: false,
      tagList: ['→', '←', '[系统]', '[超时!订单回收]'],
    }
  },
  created() {
    this.getRecordStep()
  },
  methods: {
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

<style lang="scss" scoped></style>
