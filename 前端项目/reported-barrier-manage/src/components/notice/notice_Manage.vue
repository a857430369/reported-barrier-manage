<template>
  <div>
    <div>
          <el-form
            :model="Select"
            style="margin:-10px auto;height:36px;margin-left:40px;"
          >
          <el-row >
            <!--搜索功能模块 -->
            <el-col :span='4' style='height:40px'>
            <el-form-item>
              <el-input
                v-model="Select.noticeName"
                style="width:90%"
                placeholder="请输入通告标题"
                clearable
              ></el-input>
            </el-form-item>
            </el-col>
            <el-col :span='4'  style='height:40px'>
            <el-form-item >
              <el-select
                v-model="Select.noticeType"
                style="width:90%"
                clearable
                placeholder="请选择通知类型"
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
            </el-col>
            <el-col :span='4'  style='height:40px'>
            <el-form-item>
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
            <el-col :span='7'  style='height:40px'>
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
    <el-table border :data="tableData" style="width: 95%; margin: 0px auto;">
      <el-table-column label="序号" type="index" align="center" width="65px">
      </el-table-column>
      <el-table-column
        label="通告标题"
        show-overflow-tooltip
        prop="noticeName"
        align="center"
        width="450px"
      >
      <template slot-scope="scope">
          <el-popover
          placement="bottom"
           title="标题"
           width="300"
           trigger="hover"
           v-if="scope.row.noticeName"
           :content="scope.row.noticeName">
            <span slot="reference">{{scope.row.noticeName}}</span>
          </el-popover>
          <span v-else>{{scope.row.noticeName}}</span>
      </template>
      </el-table-column>
      <!-- <el-table-column label="公告摘要" show-overflow-tooltip prop="noticeSummary" align="center" width='350px'>
      </el-table-column> -->
      <el-table-column label="通知类型" prop="noticeType" align="center">
        <template slot-scope="pstatus">
          <span v-if="pstatus.row.noticeType == 'S'"
            ><el-tag type="primary" effect="plain">系统通知</el-tag></span
          >
          <span v-else-if="pstatus.row.noticeType == 'M'"
            ><el-tag type="success" effect="plain">短信通知</el-tag></span
          >
          <span v-else-if="pstatus.row.noticeType == 'Z'"
            ><el-tag type="info" effect="plain">报障通知</el-tag></span
          >
          <span v-else-if="pstatus.row.noticeType == 'K'"
            ><el-tag type="warning" effect="plain">知识库</el-tag></span
          >
        </template>
        <!-- <template slot-scope="pstatus"><el-tag :type="pstatus.row.noticeType=='S'? 'primary':'success'" effect="plain">
       {{pstatus.row.noticeType=='S'? '系统通知':'短信通知'}}</el-tag></template> -->
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
      <el-table-column label="保存时间" prop="lastDt" align="center" width='170'>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary" v-if="scope.row.noticeStatus=='D'"
            icon="el-icon-share"
            @click="handleOpen(scope.$index, scope.row)"
            >发布</el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-edit-outline"
            @click="handleDet(scope.$index, scope.row)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelet(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑对话框模块 -->
    <el-dialog width="75%" 
    :visible.sync="dialogVisible"
    :before-close="modalClose"
    :close-on-click-modal="false">
    <template slot="title"> 
    <el-row style="margin:0px auto;text-align: center"><h2>通告编辑</h2></el-row> 
    </template>
    <noticeEdit v-bind:dataForm='noticeMessage' ></noticeEdit></el-dialog>
    <!-- 对话框模块 -->
    <noticedet
      v-bind:message="dataForm"
      ref="dataForm"
      v-if="dialogDet"
      :visible.sync="dialogDet"
    ></noticedet>
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
  </div>
</template>
<script>
import noticedet from '../../components/notice/notice_details'
// import noticeEdit from '../../components/notice/notice_edit'
export default {
  components: {
    noticedet,
    // noticeEdit
  },
  data() {
    return {
      tableData: [],
      dataFrom: {},
      noticeMessage:[],
      pageRequest: { pageNum: 1, pageSize: 10 },
      value: false,
      activeIndex: '1',
      dialogDet: false,
      dataForm: '',
      Select: {
        noticeName: '',
        noticeType: '',
        noticeUrgent: '',
        seleceDate: '',
      },
      Status:[{
        id:'D',
        label:'未发布'
      },{
        id:'S',
        label:'已发布'
      }],
      dialogVisible:false,
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
    }
  },
  mounted() {},
  created() {
    this.findAll()
  },
  methods: {
    //
    modalClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    //模糊查询
    findPage() {
      if(this.Select.seleceDate==null){
        this.Select.seleceDate=''
      }
      let dev = {
        condition: {
          noticeName: this.Select.noticeName,
          noticeType: this.Select.noticeType,
          noticeUrgent: this.Select.noticeUrgent,
          createDtStart: this.Select.seleceDate[0],
          createDtEnd: this.Select.seleceDate[1],
          noticeStatus:'D'
        },
        rule: { createDt: 'T', noticeName: 'like',noticeType:'in' },
        page: {},
      }
      dev.page = {
        pageNumber: this.pageRequest.pageNum,
        pageSize: this.pageRequest.pageSize,
        direction: 'DESC',
        property: 'lastDt',
      }
      this.$api.notice.getPage(dev).then((res) => {
        this.tableData = res.content.list
        this.pageRequest.totalSize = res.content.total
      })
    },
    //
    handleSizeChange(val){
      this.pageRequest.pageSize = val
      this.findAll()
    },
    //分页查询
    findAll() {
      let dev = { condition: {noticeType:"S,M,Z",noticeStatus:'D',}, rule: {noticeType:'in'}, page: {} }
      dev.page = {
        pageNumber: this.pageRequest.pageNum,
        pageSize: this.pageRequest.pageSize,
        direction: 'DESC',
        property: 'lastDt',
      }
      this.$api.notice.getPage(dev).then((res) => {
        this.tableData = res.content.list
        this.pageRequest.totalSize = res.content.total
      })
    },
    //分页换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findAll()
    },
    //发布
    handleOpen(index, row) {
      this.$confirm('确认发布吗？', '提示', {}).then(() => {
        this.editLoading = true
        let dev = row.noticeCode
        this.$api.notice.editInfo(dev).then((res) => {
          this.editLoading = false
          if (res.code == 0) {
            this.$message({ message: '操作成功', type: 'success' })
            this.findAll()
          } else {
            this.$message({ message: '操作失败, ', type: 'error' })
          }
        })
      })
    },
    //详情
    handleDet(index, row) {
      // this.noticeMessage=Object.assign({}, row)
      // this.dialogVisible=true
      this.dialogDet = true, 
      this.dataForm = Object.assign({}, row)
      this.dataForm.value = '1'
    },
    //删除
    handleDelet(index, row) {
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.editLoading = true
        let dev = row.noticeCode
        this.$api.notice.delInfo(dev).then((res) => {
          this.editLoading = false
          if (res.code == 0) {
            this.$message({ message: '操作成功', type: 'success' })
            this.findAll()
          } else {
            this.$message({ message: '操作失败', type: 'error' })
          }
        })
      })
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
