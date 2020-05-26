<template>
  <div class="major-contain">
    <div class="main-contain">
      <div style="margin: 0 auto;width: 98%">

        <!-- 提交表单-开始 -->
        <span><i class="el-icon-menu menu-icon"></i>模板名称：{{ modelName }}</span>
        <queryForm :orderCode="formCode"></queryForm>
        <!-- 提交表单-结束 -->


        <!-- 附件-开始 -->
        <span><i class="el-icon-menu menu-icon"></i>需求附件</span>
        <queryFile :orderCode="formCode"></queryFile>
        <!-- 附件-结束 -->


        <!-- 审批小流程-开始 -->
        <span><i class="el-icon-menu menu-icon"></i>审批意见</span>
        <queryVerify :orderCode="formCode"></queryVerify>
        <!-- 审批小流程-结束 -->

      </div>
    </div>
  </div>
</template>

<script>
import queryForm from './queryForm'
import queryFile from './queryFile'
import queryVerify from './queryVerify'

export default {
  components: {
    queryForm,
    queryFile,
    queryVerify
  },
  props: {
    modelName:{
      type: String,
      default: ''
    },
    formCode: {
      type: Number,
      default: ''
    }
  },
  data() {
    return {
      
      loading: {
        form: false,
        verify: false,
        file: false
      },
      form: {
        verifyResult: '',
        verifyReply: ''
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
      returnVerifyReply: ''
    }
  },
  methods: {
    download(data) {
      let base = ''
      let fileNameItem = `${data.sourceFileName}.${data.contentType}`

      if (this.$store.state.user.isTest) {
        base = 'http://localhost:10001/file/download'
      } else {
        base = 'http://132.110.64.161:30001/currency_need/file/download'
      }
      const url = `url=${data.sourcePathName}`
      const fileName = `fileName=${fileNameItem}`
      const a = document.createElement('a')
      a.href = base + '?' + fileName + '&' + url
      a.click()
    },
    onCancel() {
      this.$emit('onCancel')
    }
  },
  mounted() {
  },
  created() {
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.major-contain {
  margin: 0 auto;
  width: 95%;
  margin-bottom: 30px;
  .option-contain {
    width: 100%;
    height: 50px;
    background: skyblue;
    margin-bottom: 10px;
    border-radius: 1%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main-contain {
    padding-top: 5px;
    width: 100%;
    background: #f7f7f7;
    border: 1px solid #00000020;
    border-radius: 1%;
    overflow-y: auto;
    overflow-x: hidden;

    .menu-icon {
      margin-right: 8px;
      color: #58a6e8;
    }
  }
}
.wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
}

.button-center {
  display: flex;
  justify-content: center;
}

</style>