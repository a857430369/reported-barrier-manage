<template>

  <el-table :data="historyList"
            style="width: 100%;border: thin solid #00000030"
            :header-cell-style="{borderBottom : 'thin solid #00000030',padding: '2px 2px',borderBottom: 'solid',borderBottomWidth: 'thin'}"
            header-cell-class-name="history-header-content"
            :row-style="{}"
            :cell-style="{'padding': '3px 0px',borderBottom: 'thin solid #00000030'}"
            border>
    <el-table-column prop="date"
                     label="处理人 \ 主送"
                     header-align="center"                     
                     >
      <template slot-scope="main">
        <p class="main-contain"><span style="font-weight: 600">处理人：</span>{{ main.row.executorOperName }}
          <span>( {{ main.row.executorOperOrgName }} ) </span>

          <span v-if="main.row.historyType == 1">( 发起申请 )</span>
          <span v-else-if="main.row.historyType == 2">( {{ `${ main.row.executorOperNodeName != null ?  main.row.executorOperNodeName : '代理'}-审核` }}<span v-if="main.row.executorOperReply"
                  style="color: blue">-{{ `${main.row.executorOperReply}` }}</span> )
          </span>
          <span v-else-if="main.row.historyType == 3">( {{ `${main.row.executorOperNodeName != null ?  main.row.executorOperNodeName : '代理'}-退回` }} )</span>
          <span v-else-if="main.row.historyType == 4">( {{ `${main.row.executorOperNodeName != null ?  main.row.executorOperNodeName : '代理'}-授权` }} )</span>
          <span v-else-if="main.row.historyType == 5">( {{ `${main.row.executorOperNodeName != null ?  main.row.executorOperNodeName : ''}` }} )</span>
          <span v-else-if="main.row.historyType == 6">( {{ `通知申请人` }} )</span>

        </p>
        <p v-if="main.row.targetOperName"
           class="main-contain p-top"><span style="font-weight: 600">主&nbsp;&nbsp;&nbsp;&nbsp;送：</span>{{ main.row.targetOperName }}
          <span>( {{ main.row.targetOperOrgName }} )</span>
          <span>( {{ ( main.row.targetOperNodeName != null ?  main.row.targetOperNodeName : '代理')  + '-审核' }} )</span>
        </p>
      </template>

    </el-table-column>
    <el-table-column prop="executorState"
                     label="操作类型"
                     width="180"
                     align="center"
                     header-align="center"                     
                     >
      <template slot-scope="main">
        <p>{{ main.row.historyType == 1 ? '申请' : 
              (main.row.historyType == 2 ? '审核' : 
              (main.row.historyType == 3 ? '退回' : 
              (main.row.historyType == 4 ? '授权' : 
              (main.row.historyType == 5 ? '收回权限' : '通知申请人'))))}}</p>
        <p class="p-top"
           v-if="main.row.targetOperName">&nbsp;</p>
      </template>
    </el-table-column>

    <el-table-column prop="executorState"
                     label="状态"
                     width="180"
                     align="center"
                     header-align="center"                     
                     >
      <template slot-scope="main">
        <p>{{ main.row.executorState == 1 ? '已完成' : '未完成' }}</p>
        <p class="p-top"
           v-if="main.row.targetOperName">已完成</p>
      </template>
    </el-table-column>
    <el-table-column prop="time"
                     label="开始时间"
                     width="200"
                     align="center"
                     header-align="center"                     
                     >
      <template slot-scope="main">
        <p>{{ main.row.executorCreateDate }}</p>
        <p class="p-top"
           v-if="main.row.targetOperName">{{ main.row.targetCreateDate }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="address"
                     label="结束时间"
                     width="200"
                     align="center"
                     header-align="center"                     
                     >
      <template slot-scope="main">
        <p>{{ main.row.executorStopDate }}</p>
        <p class="p-top"
           v-if="main.row.targetOperName">{{ main.row.targetStopDate }}</p>
      </template>
    </el-table-column>
  </el-table>

</template>

<script>
export default {
  props: {
    formCode: Number
  },
  watch: {
    formCode: {
      handler(newVal) {
        if (newVal != '') {
          this.search()
        }
      },
      immediate: true
    },

  },
  data() {
    return {
      historyList: []
    }
  },
  methods: {
    search() {
      this.$api.deploy.listNeedHistory({ formCode: this.formCode }).then(res => {
        this.historyList = res.content
      })
    }
  }

}
</script>


<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.main-contain > span:nth-child(2) {
  color: blue;
}
.p-top {
  margin-top: 6px;
}
</style>

<style lang="scss">
.history-header-content {
  .cell {
    background-color: #edf8f4;
    color: #2b6c94;
  }
}
</style>

