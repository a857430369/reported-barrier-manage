<template>
  <div>
    <div>
          <el-form
            :model="Select"
            style="margin:-3px auto 10px 0;height:36px"
          >
          <el-row >
            <!--搜索功能模块 -->
            <el-col :span='4' style='height:40px'>
            <el-form-item >
              <el-input
                v-model="Select.noticeName"
                style="width:90%"
                placeholder="请输入通告标题"
                clearable
              ></el-input>
            </el-form-item>
            </el-col>
            <!-- <el-col :span='4'  style='height:40px'>
            <el-form-item >
              <el-select
                v-model="Select.noticeType"
                style="width:90%"
                clearable
                placeholder="请选择通告类型"
              >
                <el-option
                  v-for="item in typeNotice"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            </el-col> -->
            <el-col :span='4'  style='height:40px'>
            <el-form-item >
              <el-select
                v-model="Select.noticeUrgent"
                style="width:90%"
                clearable
                placeholder="请选择紧急度"
              >
                <el-option
                  v-for="item in typeUrgent"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            </el-col>
            <el-col :span='11'  style='height:40px'>
            <el-form-item>
              <el-date-picker
                v-model="Select.seleceDate"
                style='width:95%'
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd hh:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span='5 '  style='height:40px'>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="findPage()"
                size="medium"
                >搜索</el-button
              >
            </el-form-item>
            </el-col>
            </el-row>
          </el-form>
    </div>
    <!-- 查看通知对话框模块 -->
    <noticedetails v-bind:message="dataForm" ref="dataForm" v-if="dialogDetiet" :visible.sync="dialogDetiet" @getAll='findRecordAll'></noticedetails>
    <el-row>
      <el-table
        border
        :data="tableData"
        style="width: 100%; margin: 0px auto;"
        v-loading="loading"
      >
        <el-table-column label="序号" type="index" align="center" width="65px">
        </el-table-column>
        <el-table-column
          label="公告标题"
          show-overflow-tooltip
          prop="noticeName"
          width="450"
        >
        <template slot-scope="scope">
          <!-- <el-popover
          placement="bottom"
           title="标题"
           width="300"
           trigger="hover"
           v-if="scope.row.noticeName"
           :content="scope.row.noticeName">
            <span slot="reference"> -->
              <el-button type="text" size="small" @click="changeDio(scope.$index, scope.row)" >{{scope.row.noticeName}}</el-button>
            <!-- </span>
          </el-popover>
          <span v-else><el-button type="text" size="small" @click="changeDio(scope.$index, scope.row)" >{{scope.row.noticeName}}</el-button></span> -->
        </template>
        </el-table-column>
        <!-- <el-table-column label="公告摘要" show-overflow-tooltip prop="noticeSummary" align="center" width='350px'>
        </el-table-column> -->
        <el-table-column label="通知类型" prop="noticeType" align="center" width='100'>
          <template slot-scope="pstatus"
            ><el-tag
              :type="pstatus.row.noticeType == 'S' ? 'primary' : 'success'"
              effect="plain"
            >
              {{
                pstatus.row.noticeType == 'S' ? '系统通知' : '短信通知'
              }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column label="紧急度" prop="noticeUrgent" align="center">
          <template slot-scope="pstatus"
            ><el-tag
              :type="pstatus.row.noticeUrgent == 'P' ? 'primary' : 'danger'"
              effect="plain"
            >
              {{ pstatus.row.noticeUrgent == 'P' ? '普通' : '紧急' }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column label="发布时间" prop="lastDt" align="center" width="170">
        </el-table-column>
        <el-table-column label="发布人数" prop="sum" align="center">
        </el-table-column>
        <el-table-column label="已阅人数" prop="count" align="center">
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="300">
          <template slot-scope="scope">
              <!-- <el-button 
              size="mini"
              type="primary"
              icon="el-icon-edit"
              >修改</el-button> -->
              <el-button v-if="scope.row.noticeAppoint=='F' && scope.row.noticeType!='M'"
              size="mini"
              type="success"
              icon="el-icon-share"
              @click="handleDet(scope.$index, scope.row)"
              >阅读详情</el-button>
              <el-button v-if="scope.row.noticeType!='M'"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelet(scope.$index, scope.row)"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页功能 -->
    <div style="text-align: right;width: 98%;">
      <el-pagination
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
    <!--选择人员 对话框模块 -->
    <noticeSee
      v-bind:message="dataForm"
      ref="dataForm"
      v-if="dialogDet"
      :visible.sync="dialogDet"
    ></noticeSee>
  </div>
</template>
<script>
import noticeSee from '../../components/notice/notice_read'
import noticedetails from "../../components/notice/notice_details"
export default {
  components: {
    noticeSee,
    noticedetails,
  },
  data() {
    return {
      tableData: [],
      dialogAdd: false, //新增对话框状态
      dataFrom: {},
      pageRequest: { pageNum: 1, pageSize: 10 },
      value: false,
      dialogDet: false,
      dataForm: [],
      loading: false,
      Select: {
        noticeName: '',
        noticeUrgent: '',
        seleceDate: ['',''],
      },
      typeNotice: [
        {
          id: 'S',
          label: '系统通知',
        },
        {
          id: 'Z',
          label: '报障通知',
        },
        {
          id: 'M',
          label: '短信通知',
        },
      ],
      typeUrgent: [
        {
          id: 'P',
          label: '普通',
        },
        {
          id: 'J',
          label: '紧急',
        },
      ],
      dialogDetiet:false,
    }
  },
  created() {
    this.findRecordAll()
  },
  methods: {
    //显示通知
    changeDio(id,val){
      this.dialogDetiet=true
      this.dataForm=Object.assign({}, val)
      this.dataForm.value='1'
    },
    //删除通告
    handleDelet(id,val){
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.editLoading = true
        let dev =val.noticeCode
        this.$api.notice.delInfo(dev).then((res) => {
            this.editLoading = false
            if (res.code == 0) {
                this.$message({ message: '删除成功', type: 'success' })
                this.findRecordAll()
            } else {
                this.$message({ message: '删除失败, ', type: 'error' })
            }
        })
      })
    },
    //模糊查询
    findPage() {
      if(this.Select.seleceDate==null){
        this.Select.seleceDate=''
      }
      this.loading=true
      let dev = {
        condition: {
          noticeName: this.Select.noticeName,
          noticeUrgent: this.Select.noticeUrgent,
          createDtStart: this.Select.seleceDate[0],
          createDtEnd: this.Select.seleceDate[1],
        },
        rule: { createDt: 'T', noticeName: 'like' },
        page: {},
      }
      dev.page = {
        pageNumber: this.pageRequest.pageNum,
        pageSize: this.pageRequest.pageSize,
        direction: 'DESC',
        property: 'lastDt',
      }
      this.$api.noticeRecord.findGroupByIsRead(dev).then((res) => {
        this.loading=false
        this.tableData = res.content.list
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].noticeAppoint=='A'){
            this.tableData[i].sum='全体'
            this.tableData[i].count='全体'
          }
          if(this.tableData[i].noticeType=='M'){
            this.tableData[i].count=''
          }
        }
        this.pageRequest.totalSize = res.content.total
      })
    },
    //
    handleSizeChange(val){
      this.pageRequest.pageSize = val
      this.findRecordAll()
    },
    //分页查询
    findRecordAll() {
      let dev = { condition: {}, rule: {}, page: {} }
      dev.page = {
        pageNumber: this.pageRequest.pageNum,
        pageSize: this.pageRequest.pageSize,
        direction: 'DESC',
        property: 'lastDt',
      }
      this.$api.noticeRecord.findGroupByIsRead(dev).then((res) => {
        this.tableData = res.content.list
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].noticeAppoint=='A'){
            this.tableData[i].sum='全体'
            this.tableData[i].count='全体'
          }
          if(this.tableData[i].noticeType=='M'){
            this.tableData[i].count=''
          }
        }
        this.pageRequest.totalSize = res.content.total
      })
    },
    //分页换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findRecordAll()
    },
    //通知阅读详情
    handleDet(index, row) {
      this.dialogDet = true
      this.dataForm = Object.assign({}, row)
    },
  },
}
</script>
<style scoped lang="less">
/deep/.el-table td,
.el-table th {
  padding: 5px 0;
}
/deep/.el-form-item__content {
    line-height: 35px;
    position: relative;
    font-size: 14px;
}
</style>
