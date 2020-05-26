<template>
  <div class="major-contain">

    <!-- 流程-开始 -->
    <el-dialog title="流程跟踪"
               :visible.sync="historyDialog"
               fullscreen
               :append-to-body="true">
      <all-history :formCode="formCode"
                   ref="history"></all-history>
    </el-dialog>
    <!-- 流程-结束 -->

    <!-- 审核部分-开始 -->
    <el-dialog title="提交审核"
               :visible.sync="verifyDialog"
               :append-to-body="true"
               top="2vh"
               width="70%">

      <el-alert title="当前用户已经是流程中的最顶级人员了，不需要提交上级审核"
                v-if="isHightNode"
                center
                :closable="false"
                type="success"
                style="margin: 10px 0"
                show-icon>
      </el-alert>

      <node-user-select v-else
                        @getResultList="getResultList"
                        @isHightNode="getHightNode"
                        :isAuthorize="isAuthorize"
                        :formCode="formCode"
                        :planType=1
                        orgClass="plant_001"
                        :modelCode="modelCode"
                        nodeCode=""></node-user-select>
      <verify-view @getVerifyReply="getVerifyReply"></verify-view>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="verifyDialog = false">取 消</el-button>
        <el-button type="primary"
                   :disabled="disabled"
                   :loading="disabled"
                   @click="onSubmitVerify">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核部分-结束 -->


    <div class="option-contain">
      <el-button type="success"
                 v-if="isAutoVerify"
                 icon="el-icon-edit"
                 @click="getVerifyDialog">审核</el-button>

      <el-button type="success"
                 v-if="isNotionProp"
                 icon="el-icon-edit"
                 @click="confirmNotion">确认审核</el-button>
      <el-button type="primary"
                 icon="el-icon-star-off"
                 @click="getAllHistory">流程跟踪</el-button>
      <el-button type="danger"
                 @click="getClose"
                 icon="el-icon-magic-stick">关闭</el-button>
    </div>

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
import allHistory from './allHistory'
import verifyView from './verifyView/verifyView'
import nodeUserSelect from '../components/nodeUserSelect/PersonSelect'

export default {
  components: {
    queryForm,
    queryFile,
    queryVerify,
    allHistory,
    verifyView,
    nodeUserSelect
  },
  props: {
    isAutoVerifyProp: {
      type: Boolean,
      default: false    
    },
    isNotionProp: {
      type: Boolean,
      default: false        
    },
    isAuthorize: {
      type: Number,
      default: 0
    },
    modelCode: {
      type:String,
      default: ''
    },
    title: String,
    planName:{
      type: String,
      default: ''
    },
    modelName:{
      type: String,
      default: ''
    },
    formCode: {
      type: Number,
      default: ''
    },
    isShowForm: {
      type: Boolean,
      default: true
    },
    showModel: {
      type: Boolean,
      required: true
    },
    planAccCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isAutoVerify: false,
      
      loading: {
        form: false,
        verify: false,
        file: false
      },
      list: [],
      fieldList: [],
      showform: {
      },
      tableData: [],
      form: {
        verifyResult: '',
        verifyReply: ''
      },
      isHightNode: false,
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
    // 确认通知
    confirmNotion() {
        this.$confirm('是否确认此流程', '确认此流程', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }).then(() => {

          let params = {
            operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode,
            formCode: this.formCode,
            modelCode: this.modelCode,
            operType: '3'
          }

          this.$api.query.confirmNeedPlanAcc(params).then(res => {
            if (res.code == 0) {
              this.$emit('search')
              this.$emit('onCancel')
                this.$message({
                  type: 'success',
                  message: '保存成功!'
                });
            } else {
                this.$message({
                  type: 'error',
                  message: '保存失败!'
                });
            }
          })
        })
    },
    // 将时间转化为 yyyy-MM-dd HH:MM:SS
    formatTime(data){
      return myTime(data.uploadTime);
      
      function myTime(date){
        var arr=date.split("T");
        var d=arr[0];
        var darr = d.split('-');

        var t=arr[1];
        var tarr = t.split('.000');
        var marr = tarr[0].split(':');

        var dd = parseInt(darr[0])+"/"+parseInt(darr[1])+"/"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
         return dd;
        }

         // 数字补0操作
        function  addZero(num) {
            return num < 10 ? '0' + num : num;
        }

        function formatDateTime (date) {
          var time = new Date(Date.parse(date));
          time.setTime(time.setHours(time.getHours() + 8));
          var Y = time.getFullYear() + '-';
          var  M = addZero(time.getMonth() + 1) + '-';
          var D = addZero(time.getDate()) + ' ';
          var h = addZero(time.getHours()) + ':';
          var m = addZero(time.getMinutes()) + ':';
          var  s = addZero(time.getSeconds());
          return Y + M + D;
        }
      },
    getHightNode() {
      this.isHightNode = true
    },
    onSubmitVerify() {
      if (this.verifyReply == '' || (!this.isHightNode && this.planAccData.length == 0)) {
        this.verifyReply == '' && this.$message.error("请输入审核意见")
        (!this.isHightNode && this.planAccData.length == 0) && this.$message.error("请选择审核人员")
        return
      }

      this.disabled = true
      let params = {
        code: this.planAccCode,
        operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode,
        formCode: this.formCode,
        verifyData: {
          verifyResult: 2,
          verifyReply: this.verifyReply,
        },
        modelCode: this.modelCode,
        planAccData: this.planAccData
      }
      this.$api.query.updateNeedPlanAcc(params).then(res => {
        this.disabled = false
        if (res.code != 0) {

          this.$message.error('保存失败')
        } else {
          this.$message.success('保存成功')
          this.verifyDialog = false
          this.isAutoVerify = false
          this.$emit('search')

          if (this.$refs['history']) {
            this.$refs['history'].search()
          }

          this.loading.verify = true
          this.$api.people.listNeedPlanAcc({formCode: this.formCode}).then(res => {
            this.loading.verify = false
            this.treeData = res.content
          })

        }

      })
    },
    getVerifyReply(data) {
      this.verifyReply = data
    },
    getResultList(data) {
      this.planAccData = data
    },
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
    getAllHistory() {
      this.historyDialog = true
    },
    getVerifyDialog() {
      this.verifyDialog = true
    },
    getClose() {
      this.$emit('onCancel')
    },
    reset() {
      this.form = {
        verifyResult: '',
        verifyReply: ''        
      }
    },
    // 得到tag的标签
    getTagType(row) {
      if (row.operType != '2') {
        return 'success'
      } else {
        if (row.verify == '1') {
          return 'primary'
        } else {
          return 'success'
        }
      }
    },
    // 得到字典的名称
    getStateName(row) {
      if (row.operType == '3') {
        return '通知申请人'
      } else if (row.operType == '1') {
        return '提出申请'
      } else {
        if (row.verify == '2') {
          return '审核通过'
        } else if (row.verify == '3') {
          return '审核不通过'
        } else {
          return '未审核'
        }
      }
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