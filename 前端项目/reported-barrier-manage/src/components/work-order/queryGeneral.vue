<template>
  <div class="container">
    <el-card
      v-if="branchRecord == 'N'"
      class="box-card"
      shadow="never"
      :body-style="{ backgroundColor: '#f7f7f7' }"
    >
      <div slot="header" class="header-text">
        <span><i class="el-icon-menu menu-icon"></i>详细信息</span>
      </div>
      <queryForm :orderCode="formCode"></queryForm>
    </el-card>

    <el-card
      v-else
      class="box-card"
      shadow="never"
      :body-style="{ backgroundColor: '#f7f7f7' }"
    >
      <div slot="header" class="header-text">
        <span><i class="el-icon-menu menu-icon"></i>子单说明</span>
      </div>
      <div style="height:100px;margin-left:20px">
        <span> {{ recordExplain }} </span>
      </div>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-text">
        <span><i class="el-icon-menu menu-icon"></i>需求附件</span>
      </div>
      <queryFile :orderCode="formCode"></queryFile>
    </el-card>

    <el-card class="box-card" shadow="never" v-if="isVerify == 'Y'">
      <div slot="header" class="header-text">
        <span><i class="el-icon-menu menu-icon"></i>审批意见</span>
      </div>
      <queryVerify :orderCode="formCode"></queryVerify>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-text">
        <span><i class="el-icon-menu menu-icon"></i>处理流程</span>
      </div>
      <queryRecordStep :recordCode="formCode"></queryRecordStep>
    </el-card>

    <el-card class="box-card" shadow="never">
      <div slot="header" class="header-text">
        <span><i class="el-icon-menu menu-icon"></i>处理附件</span>
      </div>
      <queryRecordFile :recordCode="formCode"></queryRecordFile>
    </el-card>
  </div>
</template>

<script>
import queryForm from './queryForm'
import queryFile from './queryFile'
import queryVerify from './queryVerify'
import queryRecordStep from './queryRecordStep'
import queryRecordFile from './queryRecordFile'

export default {
  components: {
    queryForm,
    queryFile,
    queryVerify,
    queryRecordStep,
    queryRecordFile,
  },
  props: {
    formCode: Number,
    isVerify: {
      type: String,
      default: '',
    },
    branchRecord: {
      type: String,
      default: 'N',
    },
    recordExplain: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loading: {
        form: false,
        verify: false,
        file: false,
      },
      form: {
        verifyResult: '',
        verifyReply: '',
      },
      verifyReply: '',
      verifyDialog: false,
      historyDialog: false,
      returnDialog: false,
      disabled: false,
      modelId: '',
      treeData: [],
      verifyResult: '',
      planAccData: [],
      returnVerifyReply: '',
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  background: #f7f7f7;
}
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
.container .el-card__header {
  background: rgb(236, 245, 255);
}
</style>
