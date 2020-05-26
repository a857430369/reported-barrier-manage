<template>
  <div class="plan_main">
    <div class="plan_head">
      <div  style="margin-left:5px;line-height:21px;float: left;margin-top: 6px;">
      <span style="margin-right: 10px">流程树</span>
      <el-button size="mini"
                 type="primary"
                 style="margin-top: -2px"
                 plain
                 @click="revert">返回上一层</el-button>
      </div>

      <div style="float:right;line-height:21px;float: right;margin-top: 4px;">
        <el-button :loading="loading.exportData"
                   :disabled="disableds.exportData"
                   style="margin-right: 10px"      
                   size="mini"
                   type="warning"
                   plain
                   @click="exportData">导出数据</el-button> 
        <el-upload class="upload-demo"
                   style="display: inline-block;margin-right: 10px"
                   action=""
                   :http-request="uploadData"
                   :show-file-list="false"
                   :before-upload="checkFile"
                   multiple>
          <el-button size="mini"
                     type="primary"
                     :disabled="disableds.importData" 
                     :loading="loading.importData"
                     plain>导入数据</el-button>
        </el-upload>

        <el-button :loading="loading.exportModel"
                   :disabled="disableds.exportModel"
                   size="mini"
                   type="success"
                   plain
                   @click="exportModel">导出模板</el-button>       

        <el-button :disabled="planDisabled"
                   size="mini"
                   type="primary"
                   plain
                   @click="operateFormDialog('fristAdd')">新增流程</el-button>
      </div>  
    </div>
    <div class="plan_body">
      <el-tree :data="treeData"
               :props="defaultProps"
               :default-expand-all="true"
               :expand-on-click-node="false"
               :render-content="renderContent"
               style="margin-left: 1px;" />
    </div>

    <el-dialog title="配置选择人员"
               :visible.sync="selectUserDialog"
               top="10vh"
               width="70%"
               left>
      <div class="wrap">
        <userSelect @onCancel="selectUserDialog = false"
                    orgClass="plant_001"
                    :treeCode="treeCode"
                    :modelCode="modelCode"
                    :nodeCode="nodeCode"></userSelect>
      </div>
    </el-dialog>

    <!--新增流程-->
    <el-dialog :title="operateType == 'edit' ? '修改节点' : '新增节点'"
               :visible.sync="showOperateDialog"
               width="30%"
               :close-on-click-modal="false">
      <div>
        <el-form class="dialog-left"
                 label-width="120px"
                 :model="nodeForm"
                 :rules="nodeFormRule"
                 ref="nodeFormRule">
          <el-form-item label="节点名:"
                        prop="nodeName">
            <el-input v-model="nodeForm.nodeName"
                      type="text" />
          </el-form-item>
          <el-form-item label="时间限制(小时):"
                        prop="limitTime">
            <el-input v-model="nodeForm.limitTime"
                      type="text" />
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: right">
        <el-button type="simple"
                   @click="showOperateDialog=false">取消</el-button>
        <el-button type="primary"
                   :disabled="disabled"
                   @click="operateFormDate">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import userSelect from '../components/userSelect'
import { downloadFile } from '@/utils/common'

export default {
  name: 'Plan',
  components: {
    userSelect
  },
  data() {
    return {
      operateType: '',
      treeCode: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      selectUserDialog: false,
      showOperateDialog: false,
      nodeForm: {
        nodeCode: null,
        nodeName: null,
        limitTime: null,
        codeLevel: null,
        parentCode: null
      },
      nodeFormRule: {
        planName: [
          { required: true, message: '请输入流程名称', trigger: 'blur' }
        ],
        planDesc: [
          { required: true, message: '请输入流程描述', trigger: 'blur' }
        ],
        nodeName: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ]
      },
      loading: {
        exportModel: false,
        exportData: false,
        importData: false
      },
      disableds: {
        exportModel: false,
        exportData: false,
        importData: false
      },
      modelCode: null,
      disabled: false,
      planDisabled: false,
      isCheckNode: false,
      nodeCode: null
    }
  },
  mounted() {
    this.modelCode = this.$route.query.code
    this.blindTree()
  },
  methods: {
    uploadData(param) {
      const form = new FormData()
      form.append("file", param.file, param.file.name)
      this.$api.deploy.importTrees(form, this.modelCode).then(res => {
        downloadFile(res.data, '提示信息.xls')        
      })
    },
    returnResult(res) {
      downloadFile(res.data, '错误人员信息.xls')        
    },
    checkFile(file) {
      let name = file.name
      if (name.indexOf('.xls') == -1) {
        this.$message.error("请导入Excel")
        return false
      }
    },
    exportModel() {
      let params = { modelCode: this.modelCode }
      this.loading.exportModel = true
      this.disableds.exportModel = true
      this.$api.deploy.exportTrees(params).then(res => {
      this.loading.exportModel = false
      this.disableds.exportModel = false
      downloadFile(res.data, '导出模板.xls')        
    }).catch(error => {
      console.error(error)
      this.loading.exportModel = false
      this.disableds.exportModel = false
      this.$message.error("导出失败")
    })
    },
    exportData() {
      let params = { modelCode: this.modelCode }
      this.loading.exportData = true
      this.disableds.exportData = true
      this.$api.deploy.exportTreesData(params).then(res => {
      this.loading.exportData = false
      this.disableds.exportData = false
        downloadFile(res.data, '人员数据.xls')        
      }).catch(error => {
        console.error(error)
        this.loading.exportData = false
        this.disableds.exportData = false
        this.$message.error("导出失败")
      })
    },
    // 选择节点人员
    selectUser(node) {
      this.treeCode = node.data.code
      this.nodeCode = node.data.code
      this.selectUserDialog = true
    },
    // 刷新树形视图
    blindTree() {
      const params = {
        modelCode: this.modelCode
      }
      this.$api.deploy.listNeedTree(params).then((res) => {
        if (res.content === null || res.content.length === 0) {
          this.planDisabled = false
        } else {
          this.planDisabled = true
        }
        this.treeData = res.content
      })
    },
    operateFormDialog(type, data) {
      this.operateType = type

      if (type == 'fristAdd') {
        this.disabled = false
        this.showOperateDialog = true        
        this.nodeForm.codeLevel = 1
        this.nodeForm.nodeCode = ''
        this.nodeForm.nodeName = ''
        this.nodeForm.limitTime = ''        
        this.nodeForm.parentCode = null
      } else if (type == 'add') {

        this.disabled = false
        this.showOperateDialog = true
        this.nodeForm.nodeCode = ''
        this.nodeForm.nodeName = ''
        this.nodeForm.limitTime = ''
        this.nodeForm.codeLevel = (data.codeLevel + 1)
        this.nodeForm.parentCode = data.code
      } else {
        this.disabled = false
        this.showOperateDialog = true
        this.nodeForm.nodeCode = data.code
        this.nodeForm.nodeName = data.nodeName
        this.nodeForm.limitTime = data.limitTime
        this.nodeForm.codeLevel = data.codeLevel
        this.nodeForm.parentCode = data.parentCode
      }
    },
    // 检查节点名称是否重复
    async checkNode () {

      const params = {
        modelCode: this.modelCode,
        nodeName: this.nodeForm.nodeName
      }
      this.isCheckNode = false

      await this.$api.deploy.checkNodeName(params).then(res => {
        if (res.code == 0) {
          this.isCheckNode = res.content
        }
      })
    },

    // 修改Node表单
    async operateFormDate() {
      let validResult = false

      this.$refs['nodeFormRule'].validate((valid) => {
        validResult = valid
      })
      if (!validResult) {
        return
      }
      await this.checkNode()

      if (!this.isCheckNode) {
        this.$message.error("该节点名称重复了")
        return
      }
      if (this.operateType == 'add' || this.operateType == 'fristAdd') {
        // 增加
        const params = {
          modelCode: this.modelCode,
          ...this.nodeForm
        }
        this.$api.deploy.insertNeedTree(params).then((res2) => {
          this.$message.success(res2.content)
          this.showOperateDialog = false
          this.blindTree()
        })
      } else {
        // 编辑
        let params = {
          code: this.nodeForm.nodeCode,
          ...this.nodeForm
        }
        this.$api.deploy.updateNeedTree(params).then((res) => {
          this.$message.success(res.content)
          this.showOperateDialog = false
          this.blindTree()
        })
      }
    },
    // 删除
    remove(node, data) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            code: data.code, // 主键
            codeLevel: data.codeLevel,
            modelCode: this.modelCode
          }
          this.$api.deploy.deleteNeedTree(params).then((res) => {
            this.$message.success(res.content)
            this.blindTree()
          })
        })

    },
    // 树形函数
    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button class="treeButton" type="primary" on-click={() => this.operateFormDialog('add', data)} plain>增加</el-button>
            <el-button class="treeButton" type="success" on-click={() => this.operateFormDialog('edit', data)} plain>编辑</el-button>
            <el-button style="width: 120px" class="treeButton" type="primary" on-click={() => this.selectUser(node, data)} plain>选择节点人员</el-button>
            <el-button class="treeButton" type="danger" on-click={() => this.remove(node, data)} plain>删除</el-button>
          </span>
        </span>
      )
    },
    // 返回上一级
    revert() {
      this.$router.go(-1)
    }
  }
}
</script>
<style>
.plan_main {
  margin: 0 auto;
  width: 1000px;
}
.plan_head {
  width: 100%;
  height: 40px;
  border: 1px solid #939393;
  border-bottom: none;
  font-size: 20px;
  padding: 0 1px 0 10px;
  box-sizing: border-box;

}

.plan_head>span {
  margin-top: 5px;
  margin-right: 5px;
  display: inline-block;

}

.plan_body {
  width: 100%;
  height: 500px;
  border: 1px solid #939393;
  box-sizing: border-box;  
}
.treeButton {
  padding: 0;
  height: 20px;
  width: 60px;
  font-size: 12px;
}
</style>

<style lang="scss" scoped>
.wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
}
.user-contain {
  border: 1px dotted;
}
.plan_body {
  .el-tree {
    background: transparent;
  }
}

</style>
