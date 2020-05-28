<template>
  <div class="major-contain">

    <el-dialog title="选择点单信息"
               :visible.sync="selectOrderUserDialog"
               top="5vh"
               width="50%"
               left>
      <div slot="title"
           class="header-title">
        <span>选择点单信息</span>
      </div>

      <div class="wrap">
        <el-form :model="patherForm"
                 ref="patherForm"
                 :rules="patherRule"
                 label-width="120px">
          <el-form-item label="是否点单">
            <el-switch
              v-model="patherForm.patherType"
              active-text="需要点单"
              inactive-text="不需要点单">
            </el-switch>
          </el-form-item>
          <el-form-item label="点单人员"
                        prop="patherCode"
                        v-if="patherForm.patherType"
                        required
                        :rules="{required: true, message: `点单人员不能为空`, trigger: 'blur'}">
            <el-select v-model="patherForm.patherCode"
                       placeholder="请选择点单人员">
              <el-option v-for="items in disposeUsers"
                         :key="items.userCode"
                         :label="items.userName + '（ ' + items.userPhone + ' ）'"
                         :value="items.userCode">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary"
                       @click="selectPather">发起申请</el-button>
            <el-button @click="selectOrderUserDialog = false">取消</el-button>
          </el-form-item>

        </el-form>
      </div>

    </el-dialog>
    <el-card class="box-card"
             v-loading="loading">
      <div class="icon-close">
        <i class="el-icon-circle-close" @click="onCancel"></i>
      </div>

      <el-form :model="form"
               :rules="rules"
               ref="ruleForm"
               label-width="110px"
               class="demo-ruleForm"
               :validate-on-rule-change="false">

        <el-row :gutter="20">
          <el-col :span="12"
                  :offset="6"
                  style="text-align: center">

            <el-form-item prop="title"
                          v-if="!(titleData.controlType == 2 && !titleData.canEdit)">

              <el-input v-model="form['title']"
                        placeholder="请输入标题"></el-input>
            </el-form-item>

            <h2 v-else>{{ getExample(titleData.defaultTitle) }}</h2>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="(item.valueType == 'textarea' || item.valueType == 'remark' || item.valueType == 'remoteQuery' || item.valueType == 'remoteCheck')  ? 22 : 11"
                  v-for="(item,index) in fieldList"
                  :key="index">
            <el-form-item :label="item.fieldName"
                          :style="'height: ' + (item.valueType == 'textarea' || item.valueType == 'remark' || item.valueType == 'remoteQuery' || item.valueType == 'remoteCheck') ?'80px' :'40px'"
                          :prop="'key-' + index">

              <!-- 数据库查询 -->
              <div v-if="item.valueType == 'remoteQuery'" class="remote-form">
                <el-form :model="item.itemForm" :ref="item.code" :rules="ruleForm[item.code]" label-width="150px">
                  <el-form-item v-for="remoteItem in Object.keys(remoteQueryForm[item.code].itemForm)" :prop="remoteItem" :key="remoteItem" :label="remoteItem">
                    <el-input v-model="remoteQueryForm[item.code].itemForm[remoteItem]" placeholder=""></el-input>
                  </el-form-item>
                  <el-button :loading="remoteQueryLoading[item.code]" :disabled="remoteQueryLoading[item.code]" type="primary" size="small" style="margin-left: 10px" @click="remoteQuery(item)">搜索</el-button>
                </el-form>
                <el-form :model="item.queryForm" label-width="150px" v-if="Object.keys(remoteQueryForm[item.code].queryForm).length != 0">
                  <el-form-item v-for="queryItem in Object.keys(remoteQueryForm[item.code].queryForm)" :key="queryItem" :label="queryItem">
                    <el-input v-model="remoteQueryForm[item.code].queryForm[queryItem]" placeholder="" disabled></el-input>
                  </el-form-item>
                </el-form>
              </div>

              <!-- 数据库验证 -->
              <div v-if="item.valueType == 'remoteCheck'" class="remote-form">
                <el-form :model="item.itemForm" label-width="150px">
                  <el-form-item v-for="remoteItem in Object.keys(item.itemForm)" :key="remoteItem" :label="remoteItem">
                    <el-input v-model="item.itemForm[remoteItem]" placeholder=""></el-input>
                  </el-form-item>
                  <el-button :loading="remoteCheckLoading[item.code]" :disabled="remoteCheckLoading[item.code]" type="success" size="small" style="margin-left: 10px" @click="remoteCheck(item)">验证</el-button>
                </el-form>
                <div style="width: 150px" class="tip-text">
                  <transition-group  name="my"  mode="out-in">
                    <span class="red"  v-if="remoteCheckObj[item.code] == null" key="1">
                      <i class="el-icon-warning-outline"></i>
                        需要验证
                    </span>

                    <span class="red" v-else-if="remoteCheckObj[item.code] == false" key="2">
                      <i class="el-icon-warning-outline"></i>
                        验证不通过
                    </span>

                    <span class="green" v-else key="3">
                      <i class="el-icon-circle-check"></i>
                        验证通过
                    </span>
                  </transition-group>
                </div>
              </div>

              <div v-if="item.valueType == 'remark'"
                   style="word-wrap: break-word">{{ item.remarkText }}</div>

              <el-input v-if="item.valueType == 'text'"
                        v-model="form['key-' + index]"
                        :placeholder="item.placeholder"></el-input>

              <el-input v-if="item.valueType == 'phone'"
                        v-model="form['key-' + index]"
                        :placeholder="item.placeholder"></el-input>

              <el-input v-if="item.valueType == 'textarea'"
                        type="textarea"
                        class="model-write-textare-font"
                        :rows="4"
                        v-model="form['key-' + index]"
                        :placeholder="item.placeholder"></el-input>

              <el-select v-if="item.valueType == 'select'"
                         style="width: 300px"
                         v-model="form['key-' + index]"
                        :placeholder="item.placeholder">
                <el-option v-for="(items,index) in item.selectList"
                           :key="index"
                           :label="items"
                           :value="items">
                </el-option>
              </el-select>

              <el-date-picker v-if="item.valueType == 'date'"
                              :value-format="item.dateType == 'ymdhm' ?  'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
                              v-model="form['key-' + index]"
                              :type="item.dateType == 'ymdhm' ? 'datetime' : 'date'"
                              :placeholder="item.placeholder">
              </el-date-picker>

              <el-checkbox-group v-if="item.valueType == 'check'"
                                 v-model="form['key-' + index]">
                <el-checkbox v-for="(item,index) in item.selectList"
                             :key="index"
                             :label="item">{{item}}</el-checkbox>
              </el-checkbox-group>

              <el-radio-group v-if="item.valueType == 'radio'"
                              v-model="form['key-' + index]">
                <el-radio v-for="(item,index) in item.selectList"
                          :key="index"
                          :label="item">{{item}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="22"
                  v-if="fileModelList.length>0">
            <el-form-item label="附件模板">
              <div class="table-content-s">
                <el-table :data="fileModelList"
                          row-class-name="table-custom"
                          header-row-class-name="table-custom"
                          border
                          style="width: 100%;margin: 10px 0">
                  <el-table-column prop="fieldName"
                                   label="模板下载">
                    <template slot-scope="main">
                      {{ main.row.fieldName }}
                    </template>
                  </el-table-column>

                  <el-table-column label="操作"
                                   width="200px">
                    <template slot-scope="main">
                      <el-button type="primary"
                                 @click="download(main.row)"
                                 size="mini">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="22">
            <el-form-item label="附件">
              <el-upload class="upload-demo"
                         action="#"
                         :http-request="uploadFile" 
                         :before-upload="checkFile"
                         :show-file-list="false"
                         multiple>
                <el-button size="small"
                           type="primary">点击上传</el-button>
                <div slot="tip"
                     style="display: inline;margin-left: 20px"
                     class="el-upload__tip">（上传的附件不超过8M）</div>
              </el-upload>

              <div class="table-content-s" v-if="fileValueList.length != 0">
                <el-table :data="fileValueList"
                          row-class-name="table-custom"
                          header-row-class-name="table-custom"
                          border
                          style="width: 100%;margin: 10px 0">
                  <el-table-column prop="fileName"
                                   label="附件名称">
                  </el-table-column>

                  <el-table-column label="操作"
                                   width="200px">
                    <template slot-scope="item">
                      <el-button type="success"
                                 @click="delFileCode(item.row)"
                                 size="mini">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </div>

            </el-form-item>
          </el-col>

        </el-row>

        <div style="display: flex;justify-content: center;">
          <el-button type="primary"
                     @click="onSubmitForm">发起申请</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import {downloadFile} from '@/utils/index'
import nodeUserSelect from './nodeUserSelect'
import { checkPhone } from '@/utils/validation'


export default {
  components: {
    nodeUserSelect
  },
  data () {
    var checkTile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入标题内容'));
      } else {
        callback();
      }
    };
    return {
      flag: false,
      list: [],
      titleData: {},
      fieldList: [],
      fileModelList: [],
      planData: {},
      form: {},
      rules: {},
      patherRule: {
        patherCode: { required: true, message: '请选择点单人员', trigger: 'blur' },
      },
      disposeUsers: [],
      modelCode: '',
      verifyType: '',
      bigClassifyCode: '',
      smallClassifyCode: '',
      loading: false,
      disabled: false,
      defaultAdd: {
        phone: '',
        recordExpectDt: ''
      },
      remoteCheckObj: {},
      remoteCheckLoading: {},
      remoteQueryLoading: {},
      remoteQueryForm: {},
      ruleForm: {},
      isHightNode: false,
      selectNodeUserDialog: false,
      selectOrderUserDialog: false,
      operData: {
        operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode,
        userName: this.$store.state.user.isTest ? this.$store.state.user.userName : this.$storage.getSession('account').userName
      },
      patherForm: {
        patherType: false,
        patherCode: ''
      },
      fileValueList: []
    }
  },
  watch: {
    'patherForm.patherType'(newV) {
      if (!newV) {
        this.patherForm.patherCode = ''
      }
    }
  },
  methods: {
    uploadFile(param) {
      const form = new FormData()
      form.append("file", param.file, param.file.name)

      let params = {
        fileType: 'F',
      }

      this.$api.cfcommon.uploadFile(form, params).then(res => {
        
        this.uploadLoading = false
        let data = {
          fileId: res.content.fileId,
          filePath: res.content.filePath,
          fileName: res.content.fileName,
          fileType: res.content.fileType,
        }
        this.fileValueList.push(data)
      })
    },
    onSubmitResult() {
      let fieldList = JSON.parse(JSON.stringify(this.fieldList))
      fieldList.unshift(this.titleData)
      fieldList = fieldList.filter(item => {
        return item.valueType != 'remoteCheck'
      })

      let fileCodeList = this.fileValueList.map(item => {
        return item.fileId
      })

      let params = {
        fieldList: fieldList,
        recordClassify: this.bigClassifyCode,
        recordClassifySmall: this.smallClassifyCode,
        verifyType: this.verifyType,
        modelCode: this.modelCode,
        title: this.form.title,
        submitFile: fileCodeList.join(','),
        createPhone: this.defaultAdd.phone,
        recordExpectDt: this.defaultAdd.recordExpectDt,
        operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode
      }

      this.verifyType != 'verify' && (params['disposeCode'] = (this.patherForm.patherType ? this.patherForm.patherCode : ''))

      this.$api.write.insertPlanAcc(params).then(res => {
        this.disabled = false

        if (res.code == '0') {
          this.$message.success('保存成功')
          this.selectNodeUserDialog = false
          this.$router.push('/cf-classify')
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    selectPather() {
      this.$refs['patherForm'].validate((valid) => {
        if (valid) {
          this.onSubmitResult()
        }
      })
    },
    remoteCheck(data) {
      // 按钮加载
      this.remoteCheckLoading[data.code] = true
      this.flag = !this.flag
      let list = Object.values(data.itemForm)
      let params = {
        sqlTxt: data.sqlTxt,
        param: list,
        datasourceCode: data.datasourceCode
      }

      this.$api.dataSource.dataList(params).then(res => {
        this.remoteCheckLoading[data.code] = false
        if (res.code == 0) {

          if (res.content && res.content.length > 0) {
            this.remoteCheckObj[data.code] = true
            this.$message.success('验证成功！')
          } else if (res.err_msg) {
            this.remoteCheckObj[data.code] = false
            this.$message.error(res.err_msg)
          } else {
            this.remoteCheckObj[data.code] = false
          }

        } else {
          this.remoteCheckObj[data.code] = false
          this.$message.error('验证不通过！')
        }
      })
    },
    remoteQuery(data) {
      this.remoteQueryLoading[data.code] = true
      let list = Object.values(data.itemForm)
      let params = {
        sqlTxt: data.sqlTxt,
        param: list,
        datasourceCode: data.datasourceCode
      }

      this.$api.dataSource.dataList(params).then(res => {
        this.remoteQueryLoading[data.code] = false
        let obj = (res.content && res.content.length > 0) ? res.content[0] : {}
        Vue.set(this.remoteQueryForm[data.code], 'queryForm', obj)
      })
    },
    getExample(data) {
      let text = ''
      let userName = this.$store.state.user.userName
      let date = '2020/02/03'
      let orgName = '机构名称'

      if (!this.$store.state.user.isTest) {
        userName = this.$storage.getSession('account').userName
        this.$storage.getSession('account').orgs['ACC_001'] 
        && this.$storage.getSession('account').orgs['ACC_001'][0] 
        && this.$storage.getSession('account').orgs['ACC_001'][0]['orgName'] 
        && (orgName = this.$storage.getSession('account').orgs['ACC_001'][0]['orgName'])
      }
      let list = data.split(',')

      for (let n =  list.length; n > 0; n--) {
        let item = list[n - 1]
        if (item == 'apply') {
          text = userName + (n == list.length ? '' : '/') + text
        } else if (item == 'applyTime') {
          text = date + (n == list.length ? '' : '/') + text
        } else if (item == 'org') {
          text = orgName + (n == list.length ? '' : '/') + text
        } else {
          text = item + (n == list.length ? '' : '/') + text
        }
      }
      return text
    },

    getHightNode() {
      this.isHightNode = true
    },
    onCancel() {
      this.$router.push('/cf-classify')
    },
    checkFile(file) {
      let name = file.name
      let type = file.type
      let size = file.size // 949587 = 927KB

      if (size > 8388608) { // 最大为8M
        this.$message.error('文件最大为8M')
        return false
      }

    },
    setFileCode(res,file,fileList) {
      console.log('data', res,file,fileList)
    },
    delFileCode(res) {
      this.fileValueList = this.fileValueList.filter(item => {
        return item.fileId != res.fileId
      })
    },
    download(data) {
      this.$api.cfcommon.downloadFile({ fileId: data.fileId }).then(res => {
        downloadFile(res.data, data.fileName)
      })
    },
    onSubmitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        let isCheck = true
        let itemCheck = true
        Object.values(this.remoteCheckObj).map(item => {
          if (!item) {
            isCheck = false
          }
        })

        Object.keys(this.ruleForm).map(code => {
          this.$refs[code][0].validate((valid) => { if (!valid) {itemCheck = valid} })
        })

        if (!isCheck || !itemCheck) {
          !isCheck && this.$message.error('必须校验需要验证的字段')
          return false
        }


        if (valid) {
          this.titleData['fieldValue'] = this.form['title']
          this.fieldList.map((item, index) => {
            if (this.form['key-' + index]) {

              // 将form的值写到 fieldList 里面
              if (typeof this.form['key-' + index] != 'string') {
                item['fieldValue'] = Array.from(this.form['key-' + index]).join(',')
              } else {
                item['fieldValue'] = this.form['key-' + index]
              }
            }
            // 将数据库查询到的值写到 fieldList 里面
            if (item.valueType == 'remoteQuery') {
              let obj = {...this.remoteQueryForm[item.code].itemForm, 
              ...this.remoteQueryForm[item.code].queryForm}
              item['fieldValue'] = JSON.stringify(obj)
            }
            //  保存电话号码和期望日期
            if (item.defaultAdd) {
              if (item.valueType == 'phone') {
                this.defaultAdd.phone = item.fieldValue
              } else {
                this.defaultAdd.recordExpectDt = item.fieldValue
              }
            }
          })
          // 调出弹窗
          if (this.verifyType != 'verify') {
            this.selectOrderUserDialog = true
          } else {
            this.$confirm('确定提交数据吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.onSubmitResult()
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    getType (type) {

      if (type == '日') {
        return 'date'
      } else if (type == '月') {
        return 'month'
      } else if (type == '年') {
        return 'year'
      } else if (type == '小时分钟') {
        return 'year'
      }
    },
    getFormat (type) {
      if (type == '日') {
        return 'yyyy-MM-dd'
      } else if (type == '月') {
        return 'yyyy-MM'
      } else if (type == '年') {
        return 'yyyy'
      }
    },
    getTip (type) {
      if (type == '日') {
        return '选择日期'
      } else if (type == '月') {
        return '选择月份'
      } else if (type == '年') {
        return '选择年份'
      } else if (type == '小时分钟') {
        return '选择小时分钟'
      }
    },
    getDisposeUser() {
      this.$api.people.disposeUsers({ classifyCode: this.smallClassifyCode }).then(res => {
        this.disposeUsers = res.content
      })
    }
  },
  async created () {
    let writeStore = require('./store/index')
    this.modelCode = writeStore.store.model.modelCode
    this.verifyType = writeStore.store.model.verifyType    
    this.bigClassifyCode = writeStore.store.model.bigClassifyCode
    this.smallClassifyCode = writeStore.store.model.smallClassifyCode

    // 得到点单人员
    this.getDisposeUser()

    if (this.modelCode) {
      // 访问时候
      let params = {
        modelCode: this.modelCode
      }
      this.loading = true

      await this.$api.deploy.getFiledByModelId(params).then(res => {
        this.loading = false

        let list = [] // 记录下fieldList的title的下标
        this.fieldList = res.content.list
        this.planData = res.content.plan
        let formIndex = 0

        this.fieldList.map((item, index) => {
          if (item.valueType == 'title') {
            list.unshift(index)
            this.titleData = JSON.parse(JSON.stringify(item))
          }

          if (item.valueType == 'file') {
            list.unshift(index)
            this.fileModelList.push(item)
          }

          if (item.valueType != 'title' && item.valueType != 'file') {
            if (item.required && item.valueType != 'remoteQuery' && item.valueType != 'remoteCheck') {

                let text = ''
                if (item.valueType == 'text' || item.valueType == 'textarea' || item.valueType == 'date' || item.valueType == 'phone') {
                  text = '请输入' + item.fieldName
                } else if (item.valueType == 'select' || item.valueType == 'check' || item.valueType == 'radio') {
                  text = '请选择' + item.fieldName
                }

                //  验证规则
                let ruleList = [ { required: true, message: text, trigger: 'blur' } ]

                //  设置期望时间不超过两个小时
                if (item.valueType == 'date' && item.defaultAdd && item.dateType == 'ymdhm') {
                  const validateTime = (rule, value, callback) => {
                    const date = new Date()
                    const result = new Date(value)
                    const minuter = parseInt((result - date) / 1000 / 60)
                    // 得到分钟数
                    if (minuter > 119) {
                      callback()
                    } else {
                      callback(new Error('期望时间不能少于当前2小时'))
                    }
                  }
                  ruleList.push({ validator: validateTime, trigger: 'blur' })
                }
                Vue.set(this.rules, 'key-' + (formIndex), ruleList)
            }

            // 设置form
            if (item.valueType == 'check') {
              Vue.set(this.form, 'key-' + (formIndex), [])
            } else if (item.valueType == 'remark') {
              Vue.set(this.form, 'key-' + (formIndex), item.remarkText)
            } else if (item.valueType == 'remoteQuery' || item.valueType == 'remoteCheck') {

              let isRequired = item.required

              let labelList = item.variateLabel.split(',')
              let itemForm = {}
              let ruleForm = {}
              let ruleFormEmpty = {}

              // 远程查询的标签验证
              labelList.forEach(items => {
                itemForm[items] = ''
                ruleForm[items] = {required: true, message: '请输入' + items + '值', trigger: 'blur'}
                ruleFormEmpty[items] = {}
              })

              if (item.valueType == 'remoteCheck') {
                Vue.set(item, 'itemForm', itemForm)
                Vue.set(item, 'queryForm', {})
                Vue.set(this.remoteCheckObj, item.code, null)
                Vue.set(this.remoteCheckLoading, item.code, false)
              }

              if (item.valueType == 'remoteQuery') {
                Vue.set(item, 'itemForm', itemForm)
                Vue.set(item, 'queryForm', {})

                Vue.set(this.remoteQueryLoading, item.code, false)
                let obj = {itemForm: itemForm,queryForm: {}}
                Vue.set(this.remoteQueryForm, item.code, obj)
                if (item.required) {
                  Vue.set(this.ruleForm, item.code, ruleForm)
                } else {
                  Vue.set(this.ruleForm, item.code, ruleFormEmpty)
                }
                // 设置表单验证
              }

            } else {
              Vue.set(this.form, 'key-' + (formIndex), '')
              if (item.valueType == 'phone' && item.defaultAdd && !this.$store.state.user.isTest) {
                Vue.set(this.form, 'key-' + (formIndex), this.$store.state.user.empSms)
              }
            }
            formIndex++
          }
        })
        if (list.length > 0) {
          this.titleData.prefixList = this.titleData.prefixList.split(',')
          this.titleData.suffixList = this.titleData.suffixList.split(',')


          Vue.set(this.form, 'title', '')
          Vue.set(this.rules, 'title', [
            { required: true, message: '请输入标题内容', trigger: 'blur' }
          ])

          list.map(item => {
            this.fieldList.splice(item, 1)
          })
        }

      }).catch(error => {
        this.loading = false
        console.error(error)
      })
    }
  }
}
</script>

<style lang="scss">
.wrap {
  .el-select {
    width: 100%;
  }
}

.table-custom {
  line-height: 10px;

  .is-leaf,
  td {
    padding: 4px 0;
  }
}

.table-content-s {
  .el-table__header-wrapper {
    border-bottom: 1px solid #ebeef5;
  }
}

.model-write-textare-font {
  .el-textarea__inner {
    font: 400 13.3333px Arial;
  }
}

</style>

<style lang="scss" scoped>
.cf-write-pointer {
  margin-left: 10px;
  vertical-align: middle;
  width: 25px;
  animation: move 0.7s 0s linear infinite;
}
.cf-write-button {
  margin-left: 30px;
}
@keyframes move {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(0);
  }
}

.my-enter{
    opacity:  0;/*透明度*/
}
.my-leave {
  opacity: 0;
}
.my-enter-active {
    transition: all 1s ease;
}

.my-leave-active {
    transition: all 0s ease-out;
}

.major-contain {
  margin: 5px auto;
  width: 90%;
}
.wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
}
.wrap-form {

}

.header-title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
}
.type-title {
  font-size: 20px;
  color: red;
}
.upload-content {
  margin: 0 auto;
  margin-bottom: 10px;
}

.icon-close {
  position: absolute;
  right: 3%;
  top: 3%;
  font-size: 40px;
  color: #4f5e82;
  cursor: pointer;
  z-index: 2;
}
.icon-close:hover {
  color: #537fe4;
}

.box-card {
  position: relative;
}

.remote-form {
  .el-form {
    &:nth-child(1){
      .el-form-item {
        width: 300px;
        display: inline-block;
      }
    }
    &:nth-child(2){
      margin-top: 10px;

      .el-form-item {
        margin: 5px 0;
        width: 300px;
        display: inline-block;
      }      
    }
  }
  .tip-text {
      width: 150px;
      text-align: right;
      font-size: 10px;
      line-height: 20px;    
    .red {
      color: red;   
    }
    .green {
      color: green;   
    }
  }
}

</style>
