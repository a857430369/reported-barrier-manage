<template>
  <el-dialog width="60%" 
    v-loading="loading"
    :visible.sync="visible"
    :before-close="modalClose"
    :close-on-click-modal="false">
    <template slot="title"> 
      <el-row style="margin:0px auto;text-align: center;"><h2>您有{{this.urgenucy.length}}条通告待查收
      <span style='color:red;text-align: center;margin:0px auto;'>(紧急!!)</span></h2></el-row>
    </template>
    <div id="app" style="text-align: center;margin:-20px auto">
      <el-row style="margin:20px auto"> 
          <el-table :data="tableData" style="width: 100%; margin: 0 auto;" border>
            <el-table-column label="公告标题" show-overflow-tooltip prop="noticeName" align="center" width="450"> 
            </el-table-column>
            <!-- <el-table-column label="公告概要" show-overflow-tooltip prop="noticeSummary" align="center">
            </el-table-column> -->
            <el-table-column label="通知类型" prop="noticeType" align="center" >
              <template slot-scope="pstatus">
              <span v-if="pstatus.row.noticeType=='S'"><el-tag type="primary" effect="plain">系统通知</el-tag></span>
              <span v-if="pstatus.row.noticeType=='M'"><el-tag type="success" effect="plain">短信通知</el-tag></span>
              <span v-if="pstatus.row.noticeType=='Z'"><el-tag type="info" effect="plain">保障通知</el-tag></span>
            </template>
              <!-- <template slot-scope="pstatus"><el-tag :type="pstatus.row.noticeType=='S'? 'primary':'success'" effect="plain">
            {{pstatus.row.noticeType=='S'? '系统通知':'短信通知'}}</el-tag></template> -->
            </el-table-column>
            <el-table-column label="发布时间" prop="createDt" align="center"  width='170'>
            </el-table-column>
            <el-table-column label="操作" fixed='right' align="center" >
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary" icon="el-icon-share"
                    @click="handleRead(scope.$index, scope.row)">查看</el-button>
                </template>
            </el-table-column>
          </el-table>
      </el-row>
      <!-- 查看通知对话框模块 -->
    <noticedet v-bind:message="dataForm" ref="dataForm" v-if="daiogDet" :visible.sync="daiogDet" @getAll='modalClose'></noticedet>
    <!--分页功能 -->
    <div style="text-align: center">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" hide-on-single-page
          :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageRequest.totalSize" >
        </el-pagination>
    </div>
    </div>
  </el-dialog>
</template>
<script>
import noticedet from "../../components/notice/notice_details"
export default {
    props: {
      urgenucy:null,
      visible: {
        type: Boolean,
        default: false
      }
    },
    components:{
      noticedet,
    },
    data(){
        return {
          loading:false,
          daiogDet:false,
          pageRequest: { pageNum: 1, pageSize: 10,totalSize:this.urgenucy.length}, 
          value:false,
          tableData:[],
        }
    },
    created() {
      this.findAll()
    },
    methods:{
      //对话框页面关闭
      modalClose() {
        this.$emit('update:visible', false); // 直接修改父组件的属性
        this.$emit('getAll')
      },
      //查看详情
      handleRead(index, row){
        this.daiogDet=true,
        this.dataForm = Object.assign({}, row)
        this.dataForm.value='0'
      },
      //
      findAll(){
        let a = this.urgenucy
        delete a.value;
        let dev ={ pageNum:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,noticeRecord:{}}
        dev.noticeRecord=a
        this.$api.noticeRecord.findPageByList(dev).then((res) => { 
          this.tableData=res.content
        })
      },
      //分页换页刷新
        refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum
        this.findAll()
        },
    },
}
</script>

<style scoped lang="less">
/deep/.el-table td, .el-table th {
    padding: 5px 0;
 }
 /deep/.el-dialog__body {
    padding: 10px 20px;
 }
</style>