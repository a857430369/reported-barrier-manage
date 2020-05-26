<template>
  <el-dialog width="40%" 
    v-loading="loading"
    :visible.sync="visible"
    :before-close="modalClose"
    :close-on-click-modal="false"
    title="接收情况清单">
    <el-row>
      <el-table  border :data="tableData" style="width: 80%; margin: 0px auto;" >
        <el-table-column label="接收人" prop="userName" align="center">
        </el-table-column>
        <el-table-column label="是否已阅" prop="isRead" align="center">
          <template slot-scope="pstatus"><el-tag :type="pstatus.row.isRead=='E'? 'success':'danger'" effect="plain">
       {{pstatus.row.isRead=='E'? '已阅':'未阅'}}</el-tag></template>
        </el-table-column>
      </el-table>
    </el-row>
     <!--分页功能 -->
    <div style="text-align: center">
        <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest" :hide-on-single-page="value"
          :current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageRequest.totalSize" >
        </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
export default {
    props: {
      message:{
        type: Object,
        default: () => ({})
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
        return {
        tableData: [],
        dialogAdd:false,//新增对话框状态
        dataFrom:{},
        pageRequest: { pageNum: 1, pageSize: 10}, 
        value: false,
        loading: false, //页面加载
        }
    },
    created() {
    this.findAll()
    },
    methods: {
        //分页查询
        findAll() {
          this.loading=true
          let dev ={condition:{noticeCode:this.message.noticeCode},rule:{},page:{}}
          dev.page={pageNumber:this.pageRequest.pageNum,pageSize:this.pageRequest.pageSize,direction:"Desc"}
          let demo={noticeRecord:dev,flag:0}
            this.$api.noticeRecord.getPage(demo).then((res) => { 
              this.loading=false
              this.tableData = res.content.list
              this.pageRequest.totalSize = res.content.total
            })
        },
        //分页换页刷新
        refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum
        this.findAll()
        },
        //对话框页面关闭
        modalClose() {
          this.$emit('update:visible', false); // 直接修改父组件的属性
        },
    },
}
</script>
<style scoped lang="less">
  /deep/ .el-dialog__body {
    padding: 10px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>
<style scoped lang="less">
/deep/.el-table td, .el-table th {
    padding: 5px 0;
 }
</style>
