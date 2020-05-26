<template>
  <div class="topShow" >
    <el-table  border :data="tableData" style=" margin: -10px auto;" v-loading='loading'>
      <el-table-column label="序号" type="index" align="center" width='50px'>
      </el-table-column>
      <el-table-column label="公告标题" show-overflow-tooltip prop="noticeName" align="center" width='450px'>
        <template slot-scope="scope">
          <el-popover
          placement="bottom"
           title="标题"
           width="300"
           trigger="hover"
           v-if="scope.row.noticeName"
           :content="scope.row.noticeName">
            <span slot="reference"><el-button type="text" size="small" @click="changeDio(scope.$index, scope.row)" >{{scope.row.noticeName}}</el-button></span>
          </el-popover>
          <span v-else><el-button type="text" size="small" @click="changeDio(scope.$index, scope.row)" >{{scope.row.noticeName}}</el-button></span>
        </template>
        <!-- <template slot-scope="scope">
        <el-button type="text" size="small" @click="changeDio(scope.$index, scope.row)" >{{scope.row.noticeName}}</el-button>
        </template> -->
      </el-table-column>
      <!-- <el-table-column label="公告摘要" show-overflow-tooltip prop="noticeSummary" align="center" width='350px'>
      </el-table-column> -->
      <el-table-column label="发布人" prop="sendName" align="center">
      </el-table-column>
      <el-table-column label="状态" prop="isRead" align="center" >
        <template slot-scope="pstatus">
        <span v-if="pstatus.row.isRead=='E'"><el-tag type="success" effect="plain">已阅</el-tag></span>
        <span v-else-if="pstatus.row.isRead=='F'"><el-tag type="danger" effect="plain">未阅</el-tag></span>
        <span v-else-if="pstatus.row.isRead=='*'"><el-tag type="info" effect="plain">全体通知</el-tag></span>
      </template>
      </el-table-column>
      <el-table-column label="通知类型" prop="noticeType" align="center" >
        <template slot-scope="pstatus">
        <span v-if="pstatus.row.noticeType=='S'"><el-tag type="primary" effect="plain">系统通知</el-tag></span>
        <span v-else-if="pstatus.row.noticeType=='M'"><el-tag type="success" effect="plain">短信通知</el-tag></span>
        <span v-else-if="pstatus.row.noticeType=='Z'"><el-tag type="info" effect="plain">报障通知</el-tag></span>
        <span v-else-if="pstatus.row.noticeType=='K'"><el-tag type="info" effect="plain">知识库</el-tag></span>
      </template>
      </el-table-column>
      <el-table-column label="紧急度" prop="noticeUrgent" align="center">
        <template slot-scope="pstatus">
        <el-tag :type="pstatus.row.noticeUrgent=='P'? 'primary':'danger'" effect="plain">
        {{pstatus.row.noticeUrgent=='P'? '普通':'紧急'}}</el-tag></template>
      </el-table-column>
      <el-table-column label="发布时间" prop="createDt" align="center" >
      </el-table-column>
      <el-table-column label="操作" fixed='right' align="center" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success" icon="el-icon-share"
            @click="changeDio(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看通知对话框模块 -->
    <noticedet v-bind:message="dataForm" ref="dataForm" v-if="dialogDet" :visible.sync="dialogDet" @getAll='findAll'></noticedet>
    <!-- 显示紧急对话框模块 -->
    <noticeUrgency v-bind:urgenucy="dataForm" ref="dataForm" v-if="dialogNum" :visible.sync="dialogNum" @getAll='findAll'></noticeUrgency>
    <!--分页功能 -->
    <el-row  style="text-align: right">
      <div style="height:10px"></div>
    <div >
        <el-pagination style="padding: 2px 0px;"
        layout="total, sizes, prev, pager, next"
        @current-change="refreshPageRequest"
         @size-change="handleSizeChange"
        :hide-on-single-page="value"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageRequest.pageSize"
        :current-page="pageRequest.pageNum"
        :total="pageRequest.totalSize"
      >
        </el-pagination>
    </div>
    </el-row>
  </div>
  
  
</template>
  
<script>
import noticedet from "../../components/notice/notice_details"
import noticeUrgency from '../../components/notice/notice_Urgency'
export default {
    props:{
      Form:null,
    },
  components:{
      noticedet,noticeUrgency,
  },
  data() {
    return {
      tableData: [],
      dataForm:{value:''},
      value: false,
      pageRequest: { pageNum: 1, pageSize: 10}, 
      switchSee: true,//开关选择已阅/未阅
      dialogDet:false,//单个紧急通告显示
      dialogNum:false,//多个紧急通告显示
      loading:'',
      Select:{noticeName:'',noticeType:'',noticeUrgent:'',seleceDate:''},
      typeNotice:[{ 
          id:'S',
          label :'系统通知'
        },{
          id:'Z',
          label :'报障通知'
        },{
          id:'M',
          label :'短信通知'
        },{
          id:'K',
          label :'知识库'
        }],
      typeUrgent:[{
        id:'P',
        label :'普通'
        },{ 
        id:'J',
        label :'紧急'
        },],
    }
  },
  mounted() {},
  created() {
   this.findAll()
  },
  methods: {
    //模糊查询
    findPage(val){
      this.loading=true
      if(val.seleceDate==null){
        val.seleceDate=''
      }
      let dev ={condition:{noticeName:val.noticeName,noticeType:val.noticeType,noticeUrgent:val.noticeUrgent,
      createDtStart:val.seleceDate[0],createDtEnd:val.seleceDate[1],isRead:this.Form[0],noticeAppoint:this.Form[1]},
      rule:{createDt:"T",noticeName:"like",noticeType:'in'},page:{}}
      dev.page={pageNumber:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,direction:"DESC",property: 'createDt'}
      let demo ={noticeRecord:dev,flag:1}
      this.$api.noticeRecord.getPage(demo).then((res) => {  
          this.loading=false
          this.tableData = res.content.list
          this.pageRequest.totalSize = res.content.total
      })
    },
    //
    handleSizeChange(val){
      this.pageRequest.pageSize = val
      this.findAll()
    },
    //查询所有通知
    findAll(){
      this.loading=true
      let dev ={condition:{isRead:this.Form[0],noticeAppoint:this.Form[1],noticeType:"S,M,Z"},rule:{noticeType:'in'},page:{}}
      dev.page={pageNumber:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,direction:"DESC",property: 'createDt'}
      let demo ={noticeRecord:dev,flag:1}
      this.$api.noticeRecord.getPage(demo).then((res) => {  
          this.loading=false
          this.tableData = res.content.list
          this.findUrgent()
          this.pageRequest.totalSize = res.content.total
      })
    },
    //分页换页刷新
    refreshPageRequest: function (pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findAll()
    },
    //查询出紧急且未阅的公告
    findUrgent(){
      let dev ={condition:{noticeType:"S,M,Z"},rule:{noticeType:'in'},page:{}}
      dev.page={pageNumber:1,pageSize:10000,direction:"DESC",property: 'createDt'}
      let demo ={noticeRecord:dev,flag:2}
      this.$api.noticeRecord.getPage(demo).then((res) => { 
          if(res.content.list.length==1){
              let num = JSON.parse(sessionStorage.getItem("noticeCode"))
              let a =0
              if(num!=null){
                for(let i=0;i<num.length;i++){
                  if(res.content.list[0].noticeCode==num[i]){
                    a++
                  }
                }
              }
              if(a==0){
                this.dialogDet=true
                this.dataForm=res.content.list[0]
                this.dataForm.value='0'
              }
          }else if(res.content.list.length>1){
            let b = JSON.parse(JSON.stringify(res.content.list))
            let num = JSON.parse(sessionStorage.getItem("noticeCode"))
            if(num != null){
              var c = num.map(item => {
                let get
                var a = b.find((code,index) => {
                  get = index
                  return code.noticeCode === item
                })
                b.splice(get,1)
                return b
              });
              if(c[c.length-1].length>0){
                  this.dialogNum=true
                  this.dataForm=c[c.length-1]
                  this.dataForm.value='0'
              }
            }else{
              this.dialogNum=true
              this.dataForm=res.content.list
              this.dataForm.value='0'
            }
          }else {
            this.dialogDet=false,
            this.dialogNum =false
          }
      })
    },
    //显示通知
    changeDio(id,val){
      this.dialogDet=true
      this.dataForm=Object.assign({}, val)
      this.dataForm.value='0'
    },
},
}
</script>
<style scoped>
  .row-style {
  margin: 10px;
  width: 100%;
  height: 100%;
  }
  .bottom {
    margin-top: 0px;
    line-height: 12px;
  }
  .switchChange{
    display: block;
    position:absolute;
    left:400px;
  }
  .button {
    padding: 0;
    float: right;
  }
  .time{
    padding: 0;
    float: left;
  }
  .status {
    padding: 0;
    float: left;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  .el-table__body td{max-height: 23px !important;overflow: hidden !important;} 
</style>

<style scoped lang="less">
/deep/.el-table td, .el-table th {
    padding: 5px 0;
 }
</style>