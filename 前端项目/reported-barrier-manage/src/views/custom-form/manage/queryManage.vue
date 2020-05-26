<template>
  <div class="main-manage">
    <el-dialog title="选择审核人员"
               :visible.sync="entrustDiaload"
               top="5vh"
               width="70%"
               left>
      <div slot="title"
           class="header-title">
        <span>选择委托人员</span>
      </div>

      <div class="wrap">
        <entrustSelect @onCancel="entrustDiaload = false"
                       :isAuthorize="isAuthorize"
                       @onSumitSuccess="onSumitEntrust"
                       orgClass="plant_001"
                       :modelCode="modelCode"
                       onlyResult>
        </entrustSelect>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="verifyModelDialog"
               :top="isShowModel ? '2vh' : '10vh'"
               :width="isShowModel ? '90%' : '40%'"
               :fullscreen="true"
               class="wrap-verify"
               left>
      <div>
        <query :formCode="formCode"
               :modelName="modelName"
               :planName="planName"
               :title="title"
               ref="seeForm"
               :modelCode="modelCode"
               :isAutoVerifyProp="isAutoVerify"
               :isNotionProp="isNotion"
               :isAuthorize="isAuthorize"
               :isShowForm="isHaveVerify"
               @onSumbit="onFormSumbit"
               :planAccCode="planAccCode"
               @search="search"
               @onCancel="verifyModelDialog = false"></query>
      </div>
    </el-dialog>

    <div class="d-d-form">
      <el-form label-width="80px"
               label-position="right">
        <el-form-item label="模板标题">

          <el-input v-model="searchObj.title"
                    name="planName"
                    size="small"
                    placeholder="请输入标题"
                    clearable></el-input>

        </el-form-item>


        <el-form-item label="审核状态">
          <el-select v-model="searchObj.type"
                     size="small"
                     clearable
                     placeholder="请选择审核状态">
            <el-option v-for="item in [{value: 3, label: '查看全部'}, {value: 1, label: '待办'}, {value: 0, label: '已办'}]"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select v-model="searchObj.state"
                     size="small"
                     clearable
                     placeholder="请选择订单状态">
            <el-option v-for="item in [{value: '', label: '全部'}, {value: 1, label: '未通过'}, {value: 2, label: '通过'}]"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <div style="display: inline-block;margin-bottom: 10px">
          <el-button type="success"
                     @click="search" size="small">搜索</el-button>
          <el-button type="primary"
                     v-if="!isEtruntState"
                     @click="setEntrust" size="small">授权</el-button>
          <el-button type="warning"
                     v-else
                     @click="recover" size="small">收权</el-button>
        </div>
          <el-tag type="primary"
                  v-if="this.$store.state.user.isTest"
                  style="float: right;margin-top: 5px;">{{ this.$store.state.user.isTest ? this.$store.state.user.userName : this.$storage.getSession('account').userName }}</el-tag>

      </el-form>
    </div>

      <el-table :data="tableData"
                v-loading="loading"
                border
                size="medium"
                :header-cell-class-name="headRowClassName"
                :row-class-name="tableRowClassName"
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="70"
                         :index="(pageIndex-1) * pageSize + index + 1"
                         header-align="center"
                         align="center" />

        <el-table-column prop="title"
                         label="申请需求"
                         header-align="center"
                         align="center">
          <template slot-scope="main">
            <!-- <el-button @click="getModel(main.row)"
                       type="text">{{ main.row.title }}</el-button> -->
            <span style="color: #409EFF;cursor: pointer"
                  @click="getModel(main.row)">{{ main.row.recordName }}</span>

          </template>
        </el-table-column>
        <el-table-column prop="upUser"
                         label="上一级审核人"
                         width="150"
                         header-align="center"
                         align="center" />

        <el-table-column prop="applyUser"
                         label="申请人"
                         width="100"
                         header-align="center"
                         align="center" />

        <el-table-column prop="createDt"
                         label="申请时间"
                         width="160"
                         header-align="center"
                         align="center" />

        <el-table-column prop="state"
                         label="是否通过"
                         width="100"
                         header-align="center"
                         align="center">
          <template slot-scope="main">
            {{ main.row.recordFlow == 'D' ? '通过':'未通过' }}
          </template>
        </el-table-column>

      </el-table>

      <div style="float: right">

        <el-pagination @current-change="handleCurrentChange"
                       :page-size="10"
                       layout="total, prev, pager, next"
                       :total="page.total">
        </el-pagination>

      </div>
    </div>
</template>

<script>
import query from '../query-form/query'
// import query from '../query-form/queryGeneral'
import entrustSelect from '../components/entrustSelect'

export default {
  name: 'queryManage',
  components: {
    query,
    // queryGeneral,
    entrustSelect
  },
  data() {
    return {
      title: '',
      planName: '',
      modelName: '',
      planNameSearch: '',
      headerStyle: {},
      isAuthorize: 0, // 是否授权给其他人
      isHaveVerify: false, // 是否已经审核
      isShowModel: false, // 
      isAutoVerify: false, // 是否有权限审核
      isNotion: false, //申请人是否可以确认这个流程
      planAccCode: '',
      index: 0, // table当前序号
      pageSize: 10, // 每页显示条数
      total: 0, // 总页数
      pageIndex: 1, // 当前页
      tableData: [], // table对象
      addVisible: false, // 是否显示新增模板
      editVisible: false, // 是否显示编辑模板
      modelNameTxt: '',
      outFieldDescTxt: '',
      disabled: false, // 保存按钮状态
      modelCode: '', // 模板code,
      nodeTreeObj: {},//每次请求的节点数据都会存到里面
      formCode: null,
      defaultProps: {
        children: 'children',
        label: 'operName',
        nodeName: 'nodeName'
      },
      page: {
        index: 0,
        pageSize: 10,
        total: 0,
        pageIndex: 1
      },
      searchObj: {
        title: '',
        type: 1,
        state: ''
      },
      showExpand: false,
      entrustDiaload: false,
      verifyModelDialog: false,
      loading: false,
      userData: {},
      verifyOptions: [{
        value: -1,
        label: '查看全部'
      },{
        value: 0,
        label: '已办'
      }, {
        value: 1,
        label: '待办'
      }],
      isEtruntState: false
    }
  },
  mounted() {
    this.search(), // 模糊查询
    this.selectEntrust()
  },
  methods: {
    // 收回权限
    recover() {
      let params = { operCode: this.$store.state.user.isTest ? 
                    this.$store.state.user.operCode : 
                    this.$storage.getSession('account').operCode}

      this.$api.query.updateAuthorize(params).then(res => {
        if (res.code != 0) {
          this.$message.error('保存失败')
        } else {
          this.$message.success('保存成功')
          this.isEtruntState = !this.isEtruntState
          this.search()
        }
      })
    },
    // 委托
    setEntrust() {
      this.entrustDiaload = true
    },
    showButByOperCode(item, main) {
      let nowVeirfy = main.needPlanAcc.verify // 当前用户的审核状态
      let nowLevel = main.needPlanAcc.codeLevel // 当前用户的等级
      let operLevel = item.codeLevel // 这条信息的等级
      let operType = item.operType // 这条信息的操作类型
      let verify = item.verify // 这条信息的审核状态
      // 表示当前节点比循环后的节点大 && 是审核类型 && 审核状态不是未审核
      if (nowLevel > operLevel && operType == '2' && verify != '1' && nowVeirfy == '1') {
        return true
      } else {
        return false
      }
    },
    // 得到tag的标签
    getTagType(row) {
      if (row.operType != '2') {
        return 'danger'
      } else {
        if (row.verify == '1') {
          return 'primary'
        } else {
          return 'success'
        }
      }
    },
    headRowClassName ({row, rowIndex}) {
      return 'high-line-head-row';
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex%2 == 1) {
        return 'high-line-row';
      }
      return '';
    },

    // 得到字典的名称
    getStateName(row) {
      if (row.operType == '3') {
        return '通知申请人'
      } else if (row.operType == '1') {
        return '提出申请'
      } else {
        if (row.verify == '2') {
          return '同意'
        } else if (row.verify == '3') {
          return '不同意'
        } else {
          return '未审核'
        }
      }
    },
    compareTime(limitTime) {
      if (limitTime != null && limitTime != '') {
        let time1=new Date(limitTime);    
        let myDate = new Date();
        return time1 > myDate
      } else {
        return true
      }
    },
    getModel(node) {
      this.isShowModel = true
      this.isHaveVerify = node.needPlanAcc.verify == '1'
      this.isAuthorize = node.needPlanAcc.isAuthorize
      // 有无审核状态判断的条件是 操作类型是审核还有审核是未通过

      this.isAutoVerify = node.needPlanAcc.operType == '2' && node.needPlanAcc.verify == '1'

      this.isNotion = node.needPlanAcc.operType != '2' && node.needPlanAcc.isNotion && node.state != 2
      this.formCode = node.recordCode
      this.modelCode = node.modelCode
      this.title=node.title
      this.planName= node.planName
      this.modelName = node.modelName
      this.planAccCode = node.needPlanAcc.code
      this.verifyModelDialog = true
    },
    getVerify(node) {
      this.planAccCode = node.needPlanAcc.code
      this.isShowModel = false
      this.verifyModelDialog = true
      this.formCode = node.code
      if (this.$refs.seeForm) {
        this.$refs.seeForm.reset()
      }
    },
    onSumitEntrust() {
      this.entrustDiaload = false
      this.search()
      this.selectEntrust()
    },
    expandSelect(row, expandedRows) {
      let formCode = row.code
      this.expandDialog = true
      this.showExpand = false
      if (this.nodeTreeObj[formCode]) {
        this.showExpand = true
        this.expandDialog = false
      } else {
        this.$api.people.listNeedPlanAcc({formCode}).then(res => {
          this.nodeTreeObj[formCode] = res.content
          this.showExpand = true
          this.expandDialog = false
        })
      }
    },
    seeVerify(row) {
      let $table = this.$refs.table;
      this.tableData.map((item) => {
        if (row.code != item.code) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row, true)
    },
    onFormSumbit(formCode) {
      delete this.nodeTreeObj[formCode]
      this.search()
    },
    // 搜索
    search() {
      
      const params = {
        state: this.searchObj.state,
        type: this.searchObj.type,
        title: this.searchObj.title,
        operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode,
        page: this.page.pageIndex, // 当前页
        size: this.page.pageSize, // 每页显示多少条数据
      }

      if (this.planName != '') {
        params['planName'] = this.planNameSearch
      }
      this.loading = true
      this.$api.manage.pageNeedForm(params).then((res) => {
        this.loading = false
        this.page.total = res.content.total

        if (res.code == 0 && res.content) {
          this.tableData = res.content.list
        } else {
          this.tableData = []
        }
      }).catch(error => {
        this.loading = false
        console.error(error)
      })
    },
    // 查询委托人
    selectEntrust() {
      let operCode = this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode
      let params = { operCode : operCode}
      this.$api.deploy.checkAuthorize(params).then(res => {
        this.isEtruntState = res.content
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.page.pageIndex = val
      this.search()

    },
    // table行样式
    rowClass() {
      return 'text-align : center;'
    },
    // table单元格样式
    cellStyle() {
      return 'text-align : center;'
    }
  },
  created() {}
}
</script>

<style scoped>
.table {
  margin-top: 10px;
}
.main-manage {
  padding: 10px;
  width: 98%;
  margin: 0 auto;
}
.treeButton {
  padding: 0;
  height: 20px;
  width: 60px;
  font-size: 12px;
}
.custom-tree-nodes {
  width: 100%;
}
.history-verify {
  margin-left: 7px;
}
</style>


<style lang="scss">
@import url("./css/table.css");
</style>
