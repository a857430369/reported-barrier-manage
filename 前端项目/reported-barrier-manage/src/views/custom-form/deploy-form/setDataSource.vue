<template>
  <div>
    <!-- 填写数据源表单 -->
    <el-dialog title="数据源信息"
               :visible.sync="writeFormDialog"
               append-to-body
               top="10vh"
               width="50%"
               left>
      <div class="deploy-wrap">
        
        <el-form :model="form"
                 ref="ruleForm"
                 :rules="rules"
                 label-width="150px">

          <el-form-item label="数据源名称："
                        required
                        prop="name">
            <el-input v-model="form.name" placeholder="请输入数据源名称"></el-input>
          </el-form-item>

          <el-form-item label="数据源名称URL："
                        required
                        prop="url">
            <el-input v-model="form.url" placeholder="请输入数据源名称URL"></el-input>

          </el-form-item>

          <el-form-item label="数据源用户名："
                        required
                        prop="userName">
            <el-input v-model="form.userName" placeholder="请输入数据源用户名"></el-input>
          </el-form-item>

          <el-form-item label="数据源密码："
                        prop="password">
            <el-input v-model="form.password" placeholder="请输入数据源密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="addLoading" :disabled="addLoading" @click="addDataSource">立即创建</el-button>
            <el-button type="success" :loading="testLoading" :disabled="testLoading" @click="testConnect">测试连接</el-button>
            <el-button @click="writeFormDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 填写数据源表单 -->

    <el-table :data="data"
              row-class-name="table-custom"
              header-row-class-name="table-custom"
              border
              style="width: 100%;margin: 10px 0">
      <el-table-column prop="name"
                       label="数据源名称">
      </el-table-column>

      <el-table-column label="操作"
                       width="200px">
        <template slot-scope="item">
          <el-button type="primary"
                     @click="editDataSource(item.row)"
                     size="mini">编辑</el-button>
          <el-button type="success"
                     @click="delDataSource(item.row)"
                     :disabled="loading"
                     :loading="loading"
                     size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <i class="el-icon-circle-plus-outline" @click="writeForm('add')"></i>

  </div>
</template>

<script>
import store from './store/index'

export default {
  props: {
    modelCode: String
  },
  data() {
    return {
      addLoading: false,
      testLoading: false,
      data: [
        {name: 123},
      ],
      type: '',
      writeFormDialog: false,
      dataSources: store.dataSources,
      form: {
        code: '',
        name: '',
        url: '',
        userName: '',
        password: ''
      },
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入数据库URL', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入数据库帐号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入数据库密码', trigger: 'blur' }]
      }   
    }
  },
  methods: {
    // 新建数据源
    addDataSource() {
      this.addLoading = true
      if (this.type == 'add') {
        this.$api.dataSource.insertDatasource({...this.form, modelCode: this.modelCode}).then(res => {
          this.addLoading = false
          if (res.code == 0) {
            this.$message.success('保存成功！')
            this.writeFormDialog = false
            this.queryDataSource()
          }
        })
      } else {
        this.$api.dataSource.updateDatasource({...this.form, modelCode: this.modelCode}).then(res => {
          this.addLoading = false
          if (res.code == 0) {
            this.$message.success('修改成功！')
            this.writeFormDialog = false
            this.queryDataSource()
          }
        })
      }
    },
    // 测试连接
    testConnect() {
      this.testLoading = true
      this.$api.dataSource.checkConnection(this.form).then(res => {
        this.testLoading = false
        if (res.code == 0 && res.content == true) {
          this.$message.success('连接成功！')
        } else {
          this.$message.error('连接失败！')
        }
      })
    },
    // 重置表单
    resetForm () {
      Object.keys(this.form).map(key => {
        this.form[key] = ''
      })
    },
    editDataSource(data) {
      this.type = 'edit'
      Object.keys(this.form).map(key => {
        this.form[key] = data[key]
      })

      this.writeFormDialog = true
    },
    delDataSource(data) {
      this.loading = true

      let params = {
        modelCode: this.modelCode,
        datasourceCode: data.code
      }
      this.$api.dataSource.checkDatasourceReference(params).then(res => {
        this.loading = false
        let text = '将删除这个数据源的信息'
        if (res.content) {
          text = '有字段引用这个数据源 是否还要删除这个数据源！！！'
        }

        this.$confirm(text, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.dataSource.deleteDatasource({code: data.code}).then(res => {
            if (res.code == 0) {
              this.$message.success('删除成功！')
              this.queryDataSource()
            }
          })
        }).catch(() => {})
      })

    },
    writeForm(type) {
      this.type = 'add'
      this.resetForm()
      this.writeFormDialog = true
    },
    queryDataSource() {
      this.$api.dataSource.datasourceList({modelCode: this.modelCode}).then(res => {
        this.data = res.content
        store.setDataSources(this.data)
      })
    }
  },
  created() {
    this.queryDataSource()
  }
}
</script>

<style lang="scss" scoped>
.table-custom {
  line-height: 10px;

  .is-leaf,
  td {
    padding: 4px 0;
  }
}

i {
  margin: 10px;
  color: #bfbfbf;
  font-size: 40px;
  text-shadow: 0.2px 0.4px 1px rgba(0,0,0,0.7);  
}
i:hover {
  cursor: pointer;
  color: #8a8a8a;
}


.deploy-wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
  .el-select {
    width: 100%;
  }
}

</style>
