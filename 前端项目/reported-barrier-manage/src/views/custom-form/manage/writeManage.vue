<template>
  <div class="main-manage">
    <div class="d-d-form">
      <el-form label-width="80px"
               label-position="right">
        <el-form-item label="模板名">
          <el-input v-model="modelNameTxt"
                    size="small"
                    name="modelName"
                    placeholder="模板名"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="模板描述">
          <el-input v-model="modelNameTxt"
                    size="small"
                    name="outFieldDesc"
                    placeholder="模板描述"
                    clearable></el-input>
        </el-form-item>
        <div style="display: inline-block;margin-bottom: 10px">
          <el-button type="success"
                     @click="search" size="small">搜索</el-button>
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
                         :index="(page.pageIndex-1) * page.pageSize + page.index + 1" />

        <el-table-column v-if="false"
                         prop="code"
                         label="模板ID"
                         width="100" />

        <el-table-column prop="modelName"
                         label="模板名" />

        <el-table-column prop="outFieldDesc"
                         label="模板描述"
                         show-overflow-tooltip
                         width="300" />

        <el-table-column prop="createDate"
                         label="创建时间"
                         width="200" />

        <el-table-column prop="userName"
                         label="创建人"
                         width="200" />

      <el-table-column fixed="right"
                      label="操作"
                      width="150">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="success"
                       @click="getFormByModel(scope.row)">发起申请</el-button>
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
export default {
  name: 'Model1',
  data() {
    return {
      tableData: [], // table对象
      modelNameTxt: null, // 模板名-搜索
      outFieldDescTxt: null, // 模板描述-搜索
      loading: false,
      page: {
        index: 0,
        pageSize: 10,
        total: 0,
        pageIndex: 1
      },
      form: {
        modelId: '',
        modelCode: '', // 模板code
        modelName: '', // 模板名-编辑
        outFieldDesc: '' // 模板描述-编辑
      },
      rules: {
        modelName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.search() // 模糊查询
  },
  methods: {
    headRowClassName ({row, rowIndex}) {
      return 'high-line-head-row';
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex%2 == 1) {
        return 'high-line-row';
      }
      return '';
    },
    getFormByModel(row) {
      this.$router.push({
        path: '/write',
        query: {
          modelCode: row.code
        }
      })
    },
    // 搜索
    search() {
      this.loading = true
      const params = {
        page: this.page.pageIndex, // 当前页
        modelName: this.modelNameTxt, // 模板名
        outFieldDesc: this.outFieldDescTxt, // 模板描述
        size: this.page.pageSize, // 每页显示多少条数据
        operCode: this.$store.state.user.operCode,
        roleCode: ''        
      }
      this.$api.manage.pageOperModel(params).then((res) => {
        this.loading = false
        this.tableData = res.content.list
        this.page.total = res.content.total
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
  created() {
    if (!this.$store.state.user.isTest) {
      let roleCode = ''
      let operCode = this.$storage.getSession('account').operCode
      let userName = this.$storage.getSession('account').userName
      if (this.$storage.getSession('account').currRoleInfo && 
      this.$storage.getSession('account').currRoleInfo['NEED_SYS_CODE'] && 
      this.$storage.getSession('account').currRoleInfo['NEED_SYS_CODE'].roleCode) {
        roleCode = this.$storage.getSession('account').currRoleInfo['NEED_SYS_CODE'].roleCode
      }

      this.$store.commit('setUser', {roleCode: roleCode, userName: userName, operCode: operCode})
    }
  }
}
</script>
<style scope>
.table {
  margin-top: 10px;
}
.main-manage {
  padding: 10px;
  width: 98%;
  margin: 0 auto;
}
</style>

<style>
@import url("./css/table.css");
</style>
