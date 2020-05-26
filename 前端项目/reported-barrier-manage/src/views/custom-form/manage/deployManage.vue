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
          <el-input v-model="outFieldDescTxt"
            size="small"
            name="outFieldDesc"
            placeholder="模板描述"
            clearable />
        </el-form-item>
        <div style="display: inline-block;margin-bottom: 10px">
          <el-button type="success"
                     @click="search" size="small">搜索</el-button>
          <el-button type="primary"
                     v-if="isAuto"
                     size="small"
                     @click="openDialog('add')">新增</el-button>
          <el-button type="warning"
                     @click="getRouter" size="small">分类管理</el-button>
                     
          <!-- <el-button type="warning"
                     @click="recover" size="small">收权</el-button> -->
        </div>
            <el-tag type="primary"
              v-if="this.$store.state.user.isTest"
              style="float: right">
        {{ this.$store.state.user.isTest ? 
              this.$store.state.user.userName : 
              this.$storage.getSession('account').userName }}</el-tag>
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
                         header-align="center"
                         align="center"
                         :index="(page.pageIndex-1) * page.pageSize + page.index + 1" />

        <el-table-column v-if="false"
                         prop="code"
                         label="模板ID"
                         header-align="center"
                         align="center"
                         width="100" />

        <el-table-column prop="modelName"
                         header-align="center"
                         align="center"
                         label="模板名" />

        <el-table-column prop="outFieldDesc"
                         label="模板描述"
                         header-align="center"
                         align="center"
                         width="300" />

        <el-table-column prop="createDate"
                         label="创建时间"
                         header-align="center"
                         align="center"
                         width="200" />

      <el-table-column fixed="right"
                      label="操作"
                      header-align="center"
                      align="center"
                      width="200">
        <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       v-if="isAuto"
                       @click="openDialog('edit', scope.row.code, scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status==1 && isAuto"
                       size="mini"
                       type="danger"
                       @click="statusChange(scope.row,0)">失效</el-button>
            <el-button v-if="scope.row.status==0 && isAuto"
                       size="mini"
                       type="success"
                       @click="statusChange(scope.row,1)">恢复</el-button>
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

    <!--编辑-->
    <el-dialog :title="(operType == 'add' ? '新增' : '编辑') + '需求模板'"
               :visible.sync="isDialog"
               top="5vh"
               width="60%"
               class="deploy-manage-dialog"
               :close-on-click-modal="false">
      <div style="margin-right: 100px">
        <el-form :model="form"
                 :rules="rules"
                 ref="formRef"
                 label-width="150px">
          <el-form-item label="模板名:"
                        prop="modelName">
            <el-input v-model="form.modelName"
                      type="text"></el-input>
          </el-form-item>
          <el-form-item label="模板类别:" prop="classifyCode">
            <el-cascader
              placeholder=""
              v-model="form.classifyCode"
              :props="{ value: 'classifyCode', label: 'classifyName' }"
              :options="option.classify" ></el-cascader>
          </el-form-item>

          <el-form-item label="需要审核:" prop="verifyType" class="vvbbc">
            <el-select v-model="form.verifyType" @change="changeVerifyType">
              <el-option v-for="item in option.verify"
                         :key="item.value"
                         :value="item.value"
                         :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="流程类型:"  class="vvbbc">
            <el-select v-model="form.planType">
              <el-option v-for="item in planTypes"
                         :key="item.value"
                         :value="item.value"
                         :label="item.label" />
            </el-select>
          </el-form-item>

          <el-form-item label="模板描述:">
            <el-input v-model="form.outFieldDesc"
                      type="text"></el-input>
          </el-form-item>
          
          <el-form-item label="复制模板:"
                        v-if="operType == 'add'">
            <el-select v-model="form.modelId">
              <el-option v-for="item in models"
                         :key="item.code"
                         :value="item.code"
                         :label="item.modelName">
              </el-option>
            </el-select>
          </el-form-item>

          <div style="text-align: right;margin-right: -43px;">
            <el-button type="simple"
                       @click="isDialog=false">取消</el-button>
            <el-button type="primary"
                       :disabled="disabled"
                       @click="saveEdit">保存</el-button>
          </div>

          <div v-if="operType == 'edit'">
            <el-divider style="margin-left: 44px;"></el-divider>
            <p style="font-size: 18px;">配置</p>
            <el-form-item label="配置模板字段:">
              <el-button size="mini"
                         type="warning"
                         @click="setOption(modelData)">配置模板字段</el-button>
            </el-form-item>

            <el-form-item label="配置人员信息:" v-if="form.verifyType != 'unverify'">
              <el-button size="mini"
                         type="primary"
                         @click="dialogPlan(modelData.code)">配置人员信息</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Model1',
  data() {
    return {
      roleCode: '',
      isAuto: true,
      operType: '', // 操作类型
      tableData: [], // table对象
      isDialog: false, // 是否显示编辑模板
      modelNameTxt: null, // 模板名-搜索
      outFieldDescTxt: null, // 模板描述-搜索
      models: [], // 模板下拉列表
      option: {
        classify: [],
        verify: [{
          value: 'verify',
          label: '需要审核'
        },{
          value: 'unverify',
          label: '不需要审核'
        },{
          value: 'together',
          label: '并行审核'
        }]
      },
      modelData: {},
      loading: false,
      disabled: false, // 保存按钮状态
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
        outFieldDesc: '', // 模板描述-编辑
        classifyCode: [], // 分类类型
        planType: 1,
        verifyType: 'unverify' // 是否需要审核
      },
      planTypes: [{ label: '严谨型', value: 1 }, { label: '松散型', value: 0 }],
      rules: {
        modelName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        classifyCode: [
          { required: true, message: '请选择模板类别', trigger: 'blur' }
        ],
        verifyType: [
          { required: true, message: '请选择是否需要审核', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.search() // 模糊查询
  },
  methods: {
    getRouter() {
      this.$router.push({
        path: '/workDesk/classify',
        query: {
          type: 'workDesk'
        }
      })
    },
    changeVerifyType(data) {
      this.operType == 'edit' && data != 'unverify' && this.$message.warning('请点击保存，再配置人员信息')
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
    setOption(row) {
      this.$router.push({
        path: '/cf-deploy',
        query: {
          modelCode: row.code
        }
      })
    },
    //编辑状态
    statusChange(row, status) {
      let txt = '停用'
      if (status === 1) {
        txt = '恢复'
      }
      const r = confirm('是否确认' + txt + '当前模板?')
      if (r === false) { return }
      const params = {
        code: row.code, // 主键
        status: status // 状态
      }
      this.$api.manage.updateStatus(params).then((res) => {
        this.$message.success(res.content)
        this.search()
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
        roleCode: this.$store.state.user.roleCode,
      }
      this.$api.manage.listModel(params).then((res) => {
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
    // 新增-弹窗
    openDialog(type, val, data) {
      this.operType = type
      if (this.operType == 'add') {
        this.isDialog = true
        this.disabled = false
        this.form.modelName = ''
        this.form.outFieldDesc = ''
        this.form.classifyCode = []
        this.form.verifyType = 'unverify'
        this.modelListBlind()

      } else {
        this.form.classifyCode = []
        let list = data.classifyCodeFull.split(",")
        list.forEach(element => {
          this.form.classifyCode.push(parseInt(element))
        });

        this.form.modelCode = val
        this.form.modelName = data.modelName
        this.form.verifyType = data.verifyType
        this.form.outFieldDesc = data.outFieldDesc
        this.isDialog = true
        this.disabled = false
        this.modelData = data
      }
    },
    // 编辑保存
    saveEdit() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {

          // 编辑类型
          if (this.operType == 'edit') {

          this.disabled = true
          const params = {
            planType: this.form.planType,
            code: this.form.modelCode, // 主键
            modelName: this.form.modelName, // 模板名
            verifyType: this.form.verifyType,
            classifyCode: this.form.classifyCode.length > 0 ? this.form.classifyCode[this.form.classifyCode.length - 1] : 0,
            classifyCodeFull: this.form.classifyCode.join(","), 
            outFieldDesc: this.form.outFieldDesc // 模板描述
          }


          this.$api.manage.updateModel(params).then((res) => {
            this.disabled = false
            this.$message.success("编辑成功！")
            // this.isDialog = false
            this.search()
          })

          // 新增类型
          } else {
            this.disabled = true

            const params = {
              planType: this.form.planType,
              verifyType: this.form.verifyType,
              modelName: this.form.modelName, // 模板名
              outFieldDesc: this.form.outFieldDesc, // 模板描述
              copyModelCode: this.form.modelId, // 复制模板ID
              createOperCode: this.$store.state.user.operCode,
              classifyCodeFull: this.form.classifyCode.join(","),
              classifyCode: parseInt(Array.isArray(this.form.classifyCode) ? this.form.classifyCode[this.form.classifyCode.length - 1] : this.form.classifyCode)       
            }
            this.$api.manage.insertModel(params).then((res) => {
              this.$message.success("新增成功，请点击编辑配置字段！")
              this.isDialog = false
              this.search()
            })
          }
        }else {
          return false
        }
      })
    },
    // 流程跳转
    dialogPlan(val) {
      this.$router.push({path:'/cf-plan',query:{code:val}})
    },
    // 模板下拉列表绑定
    modelListBlind() {
      const params = {
        page: 1, // 当前页
        modelName: '', // 模板名
        outFieldDescTxt: '', // 模板描述
        size: 10000, // 每页显示多少条数据
        operCode: this.$store.state.user.operCode,
        roleCode: this.$store.state.user.roleCode
      }
      this.$api.manage.listModel(params).then((res) => {
        this.models = res.content.list
        this.models.unshift({ code: '0', modelName: '空白模板' })
        this.form.modelId = '0'
      })
    },
    // table行样式
    rowClass() {
      return 'text-align : center;'
    },
    // table单元格样式
    cellStyle() {
      return 'text-align : center;'
    },
    getClassifyData() {
      this.$api.manage.getTree().then(res => {
        if (Array.isArray(res.content)) { this.option.classify = res.content.filter(item => { return item.children != null }) }
      })
    }
  },
  created() {
    this.getClassifyData()
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

<style lang="less">
@import url("./css/table.css");

.deploy-manage-dialog {
  .el-cascader {
    width: 100%;
  }
  .vvbbc {
    .el-select {
      width: 100%;
    }
  }
}

</style>
