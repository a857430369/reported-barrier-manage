<template>
  <div class="major-contain"
       v-loading="loading">

    <!-- 配置数据源 -->
    <el-dialog title="配置数据源"
               :visible.sync="dataSourceDialog"
               top="10vh"
               width="50%"
               left>
      <div class="wrap">
        <setDataSoure :modelCode="modelCode"></setDataSoure>
      </div>
    </el-dialog>
    <!-- 配置数据源 -->

    <el-dialog title="配置输入框"
               :visible.sync="titleDialog"
               top="10vh"
               width="50%"
               left>
      <div class="deploy-wrap">

        <el-form :model="titleForm"
                 ref="ruleForm"
                 :rules="rules"
                 label-width="80px">

          <el-form-item label="标题控制"
                        required
                        prop="type">
            <el-switch v-model="titleForm.type"
                       active-text="系统控制"
                       inactive-text="用户自定义">
            </el-switch>
          </el-form-item>

          <el-form-item label="可以编辑"
                        v-if="titleForm.type"
                        required
                        prop="canEdit">
            <el-switch v-model="titleForm.canEdit"
                       active-text="用户可进行编辑"
                       inactive-text="用户不可以编辑">
            </el-switch>
          </el-form-item>

          <el-form-item v-if="titleForm.type && !titleForm.canEdit"
                        label="默认标题"
                        required
                        prop="defaultTitle">

            <el-tooltip content="可输入设置标题"
                        popper-class="deploy-tooltip"
                        placement="top-start"
                        effect="light">

              <el-select v-model="titleForm.defaultTitle"
                         :visible-change="visiblePrefix = true"
                         width="100px"
                         multiple
                         filterable
                         allow-create
                         default-first-option
                         placeholder="请选择标题">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>

          <el-form-item v-if="titleForm.type && titleForm.canEdit"
                        label="标题前缀"
                        prop="type">

            <el-tooltip content="可输入设置前缀"
                        popper-class="deploy-tooltip"
                        placement="top-start"
                        effect="light">

              <el-select v-model="titleForm.prefix"
                         :visible-change="visiblePrefix = true"
                         width="100px"
                         multiple
                         filterable
                         allow-create
                         default-first-option
                         placeholder="请选择标题前缀">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>

          <el-form-item v-if="titleForm.type && titleForm.canEdit"
                        label="标题后缀"
                        prop="type">
            <el-tooltip content="可输入设置后缀"
                        popper-class="deploy-tooltip"
                        placement="top-start"
                        effect="light">
              <el-select v-model="titleForm.suffix"
                         multiple
                         filterable
                         allow-create
                         default-first-option
                         placeholder="请选择标题后缀">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-tooltip>

          </el-form-item>

          <el-form-item>
            <el-button type="primary"
                       @click="onSumbitTitle">立即创建</el-button>
            <el-button @click="titleDialog = false">取消</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog>
    <div class="option-contain">
      <el-button type="info"
                 @click="revert"
                 icon="el-icon-arrow-left">返回</el-button>
      <el-button type="success"
                 @click="addInput"
                 icon="el-icon-edit">新增标签</el-button>
      <el-button type="danger"
                 @click="dataSourceDialog = true"
                 icon="el-icon-edit">配置数据源</el-button>
      <el-button type="primary"
                 @click="saveModel"
                 :disabled="disabled"
                 :loading="disabled"
                 icon="el-icon-star-off">保存</el-button>
    </div>
    <div class="main-contain">
      <el-row :gutter="20">
        <el-col :span="12"
                :offset="6">
          <div class="major-item-contain">

            <el-row type="flex">
              <el-col :span="4"
                      style="text-align:center;border: 1px solid #00000020;border-radius: 7%;">
                <span style="line-height: 40px;text-align:center">标题</span>

              </el-col>

              <el-col v-if="is"
                      :span="11"
                      :offset="1"
                      style="position: relative;">
                <el-form ref="form"
                         :label-width="titleForm.type ?  '300px' : '200px'">
                  <el-form-item :label="getExample()"
                                required
                                style="margin-bottom: 0px">
                  </el-form-item>
                </el-form>

              </el-col>
              <el-col v-else
                      :span="11"
                      style="position: relative;">
                <div style="position: absolute;bottom: 5%">
                  <span class="tip"> （信息不完整）</span>
                </div>

              </el-col>

              <el-col :span="8"
                      style="display: flex;
              align-items: center;
              justify-content: flex-end;">
                <el-row type="flex"
                        justify="end"
                        align="bottom">
                  <el-button type="primary"
                             @click="setOption"
                             size="small">配置</el-button>

                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="(item.valueType == 'textarea' || item.valueType == 'remark' || item.valueType == 'remoteQuery' || item.valueType == 'remoteCheck') ? 21 : 10"
                :offset="1"
                v-for="(item,index) in list"
                :key="index">
          <inputType :index="index"
                     :datas="item"
                     :type="item.type"
                     :ref="'form-' + index"
                     :dictList="dictList"
                     @getOption="getOption"
                     @getTipVal="getTipVal"
                     @getOtherVal="getOtherVal"
                     @change="changeItem(...arguments, list)"
                     @delList="delListItem"></inputType>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10"
                :offset="1"
                v-for="(item,index) in requiredList"
                :key="index">
          <inputType :index="index"
                     :isRequired="true"
                     :datas="item"
                     :type="item.type"
                     :ref="'requiredForm-' + index"
                     :dictList="dictList"
                     @getOption="getOptionRequire"
                     @getTipVal="getTipVal"
                     @getOtherVal="getOtherVal"
                     @change="changeItem(...arguments, requiredList)"
                     @delList="delListItem"></inputType>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="21"
                :offset="1">
          <hr style="border:1px dotted #666666" />

        </el-col>
        <el-col :span="21"
                :offset="1">
          <el-form label-width="100px">
            <el-form-item label="上传附件模板">

              <el-upload class="upload-demo"
                         action="#"
                         :http-request="uploadFile" 
                         :on-success="setFileCode"
                         :on-remove="delFileCode"
                         :show-file-list="false"
                         :before-upload="checkFile"
                         :disabled="uploadLoading"
                         multiple>
                <el-button size="small"
                           :disabled="uploadLoading"
                           :loading="uploadLoading"
                           type="primary">点击上传</el-button>
                <div slot="tip"
                     style="display: inline;margin-left: 20px"
                     class="el-upload__tip">（上传的附件不超过8M）</div>
              </el-upload>

              <div class="table-content-s">
                <el-table :data="fileModelList"
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
                      <el-button type="primary"
                                 @click="download(item.row)"
                                 size="mini">下载</el-button>
                      <el-button type="success"
                                 @click="delFileCode(item.row)"
                                 size="mini">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </div>

            </el-form-item>

          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
  .el-select {
    width: 100%;
  }
}
.major-contain {
  margin: 5px auto;
  width: 95%;
  .option-contain {
    width: 100%;
    height: 50px;
    background: skyblue;
    margin-bottom: 10px;
    border-radius: 1%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .main-contain {
    padding-top: 5px;
    width: 100%;
    height: 500px;
    background: #f7f7f7;
    border: 1px solid #00000020;
    border-radius: 1%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.major-item-contain {
  // background: skyblue;
  margin: 5px 0;
  background: #fff;
  padding: 3px;
  border: 1px dashed #00000060;
  width: 100%;
  height: 100%;
}

.tip {
  font-size: 10px;
  color: red;
}
.deploy-wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
}
.deploy-tooltip {
}
</style>

<style lang="scss">
.deploy-wrap {
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
</style>

<script>
import store from './store/index'
import inputType from "./inputType";
import setDataSoure from "./setDataSource"
import { downloadFile } from '@/utils/common'

export default {
  components: {
    inputType,
    setDataSoure
  },
  data() {
    return {
      uploadLoading: false,
      visiblePrefix: false,
      visibleSuffix: false,      
      modelCode: "",
      text: "",
      list: [],
      requiredList: [],
      dictList: [],
      disabled: false,
      value: '',
      titleDialog: false,
      dataSourceDialog: false,
      is: true,
      titleForm: {
        type: false,
        canEdit: false,
        defaultTitle: [],
        name: '',
        prefix: [], // 前缀
        suffix: [] // 后缀
      },
      loading: false,
      options: [{
        value: 'org',
        label: '机构'
      },{
        value: 'apply',
        label: '申请人'
      }, {
        value: 'applyTime',
        label: '申请时间'
      }],
      rules: {
        defaultTitle: [{ required: true, message: '请输入默认标题', trigger: 'change' }]
      },
      action: '',
      fileCodeList: [],
      fileModelList: []
    };
  },
  watch: {
    'titleForm.type': {
      handler(newV) {
        if (!newV) { // 用户自定义
          this.titleForm.prefix = []
          this.titleForm.suffix = []
          this.titleForm.defaultTitle = []
        }
      }
    },
    'titleForm.canEdit': {
      handler(newV) {
        if (newV) { // 用户自定义
          this.titleForm.defaultTitle = []
        } else {
          this.titleForm.prefix = []
          this.titleForm.suffix = []          
        }
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
        this.fileModelList.push(data)
      })
    },
    // 查询所有的数据源
    queryDataSource() {
      this.$api.dataSource.datasourceList({modelCode: this.$route.query.modelCode}).then(res => {
        store.setDataSources(res.content)
      })
    },
    download(data) {
      this.$api.cfcommon.downloadFile({ fileId: data.fileId }).then(res => {
        downloadFile(res.data, data.fileName)
      })
    },
    checkFile(file) {
      this.uploadLoading = true
      let name = file.name
      let type = file.type
      let size = file.size // 949587 = 927KB

      if (size > 8388608) { // 最大为8M
        this.$message.error('文件最大为8M')
        this.uploadLoading = false
        return false
      }
    },
    delFileCode(data) {
      this.fileModelList = this.fileModelList.filter(item => {
        return item.fileId != data.fileId
      })
    },
    // 得到附件的code
    setFileCode(res,file,fileList) {

      this.uploadLoading = false
      let data = {
        fileId: res.content[0].fileId,
        filePath: res.content[0].filePath,
        fileName: res.content[0].fileName,
        fileType: res.content[0].fileType,
      }
      this.fileModelList.push(data)
    },
    async checkTitleForm() {
      await this.$refs['ruleForm'].validate((valid) => {
        this.is = valid
      })
      return this.is
    },
    async onSumbitTitle() {

      let is = await this.checkTitleForm()

      if (!is) {
        return
      }
      this.getExample()
      this.titleDialog = false
    },
    getExample() {
      let text = '标题'

      if (this.titleForm.type) {
        if (this.titleForm.canEdit) {

          // prefix 前缀
          for (let n =  this.titleForm.prefix.length; n > 0; n--) {
            let item = this.titleForm.prefix[n - 1]
            if (item == 'apply') {
              text = 'AAA/' + text
            } else if (item == 'applyTime') {
              text = '2020-01-01/' + text
            } else if (item == 'org') {
              text = '机构/' + text
            } else {
              text = item + '/' + text
            }
          }
          // suffix 后缀
          for (let n = 0; n < this.titleForm.suffix.length ; n++) {
            let item = this.titleForm.suffix[n]
            if (item == 'apply') {
              text = text + '/AAA'
            } else if (item == 'applyTime') {
              text = text + '/2020-01-01'
            } else if (item == 'org') {
              text = text + '/机构'
            } else {
              text = text + '/' +  item 
            }
          }
        } else {

          text = ''
          for (let n =  this.titleForm.defaultTitle.length; n > 0; n--) {
            let item = this.titleForm.defaultTitle[n - 1]
            if (item == 'apply') {
              text = 'AAA' + (n == this.titleForm.defaultTitle.length ? '' : '/') + text
            } else if (item == 'applyTime') {
              text = '2020-01-01' + (n == this.titleForm.defaultTitle.length ? '' : '/') + text
            } else if (item == 'org') {
              text = '机构' + (n == this.titleForm.defaultTitle.length ? '' : '/') + text
            } else {
              text = item + (n == this.titleForm.defaultTitle.length ? '' : '/') + text
            }
          }
        }
      }      
      return text

    },
    setOption() {
      this.titleDialog = true
    },
    revert() {
      this.$router.go(-1);
    },
    saveModel() {
      this.disabled = true;
      let isTrue = true;
      this.list.map((item, index) => {
        if (!this.$refs[`form-${index}`][0].checkForm()) {
          isTrue = false;
        }
      });
      // this.requiredList.map((item, index) => {
      //   if (!this.$refs[`requiredForm--${index}`][0].checkForm()) {
      //     isTrue = false;
      //   }
      // });
      // 标题是系统控制的，用户不可以输入，默认列表为空
      if (this.titleForm.type && !this.titleForm.canEdit && this.titleForm.defaultTitle.length == 0) {
        this.is = false
        isTrue = false
      }

      // 验证
      if (isTrue) {
        let list = JSON.parse(JSON.stringify(this.list))

        let max = 0
        let min = 0

        list.map(item => {
          max = Math.max(max, item.orderBy)
          min = Math.min(min, item.orderBy)

          if (item.valueType == 'select' || item.valueType == 'radio' || item.valueType == 'check') {
            item.selectList = item.selectList.map(items => {
              return items.value
            })
          }
        })
        list.unshift({
          orderBy: min--,
          valueType: 'title',
          controlType: this.titleForm.type ? 2 : 1,
          suffixList: this.titleForm.suffix,
          prefixList: this.titleForm.prefix,
          canEdit: this.titleForm.canEdit,
          defaultTitle: this.titleForm.defaultTitle,
          remarkText: this.titleForm.remarkText
        })

        this.fileModelList.map(item => {
          list.push({
            fieldName: item.fileName,
            valueType: 'file',
            fileCode: item.fileId,
            orderBy: ++max
          })
        })

        this.requiredList.map(item => {
          list.push({
            ...item,
            orderBy: ++max,
            defaultAdd: 1
          })
        })        

        let param = {
          modelCode: this.modelCode,
          fieldData: list
        };

        if (this.list.length == 0) {
          this.$message.error("必须添加字段");
          this.disabled = false;
          return;
        }

        this.$api.deploy
          .updateModelFiled(param)
          .then(res => {
            this.$message.success("保存成功");
            this.disabled = false;
          })
          .catch(error => {
            this.disabled = false;
            this.$message.error("保存失败");
            console.log(error);
          });
      } else {
        this.disabled = false;
        this.$message.error("未填写完整信息");
      }
    },
    getTipVal(index, type, newVal) {
      this.list[index].fieldName = newVal;
    },
    getOtherVal(index, type, newVal) {
      if (type == "date") {
        this.list[index].dateType = newVal;
      } else if (type == "select") {
        this.list[index].dictCode = newVal;
      }
    },
    addInput() {
      this.list.push({
        valueType: "text",
        fieldName: "",
        dictCode: "",
        dateType: "",
        required: true,
        remarkText: '',
        selectList: [{value: ''}]
      });

      this.list.map((item, index) => {
        item.orderBy = index + 1;
      });
    },
    delListItem(index) {
      this.list.splice(index, 1);

      this.list.map((item, index) => {
        item.orderBy = index;
      });
    },
    del(index) {
      this.list.splice(index, 1);
    },
    changeItem() {
      
      let index = arguments[0]
      let type = arguments[1]
      let tipValue = arguments[3]
      let list = arguments[4]

      list[index].valueType = type;
      list[index].fieldName = tipValue;
      list[index].dictCode =
        type == "select" ? list[index].dictCode : "";
      list[index].dateType =
        type == "date" ? list[index].dateType : "";
    },
    getOptionRequire(index, type, form) {
      this.requiredList[index].valueType = type;
      this.requiredList[index].fieldName = form.name;
      this.requiredList[index].required = form.required;
      this.requiredList[index].orderBy = form.orderBy;
      this.requiredList[index].remarkText = form.remarkText;
      this.requiredList[index].variateLabel = form.variateLabel
      this.requiredList[index].datasourceCode = form.dataSource
      this.requiredList[index].sqlTxt = form.sqlTxt
      this.requiredList[index].placeholder = form.placeholder
        type == "select" || type == "check" || type == "radio"
          ? form.select
          : "";
      this.requiredList[index].selectList =
        type == "select" || type == "check" || type == "radio"
          ? form.selectList
          : [];
      this.requiredList[index].dateType = type == "date" ? form.date : "";      
    },
    getOption(index, type, form) {

      this.list[index].valueType = type;
      this.list[index].fieldName = form.name;
      this.list[index].required = form.required;
      this.list[index].orderBy = form.orderBy;
      this.list[index].remarkText = form.remarkText;
      this.list[index].variateLabel = form.variateLabel
      this.list[index].datasourceCode = form.dataSource
      this.list[index].sqlTxt = form.sqlTxt
      this.list[index].placeholder = form.placeholder
        type == "select" || type == "check" || type == "radio"
          ? form.select
          : "";
      this.list[index].selectList =
        type == "select" || type == "check" || type == "radio"
          ? form.selectList
          : [];
      this.list[index].dateType = type == "date" ? form.date : "";
    }
  },
  async created() {
    await this.queryDataSource()

    this.action = this.$store.state.user.isTest ? 'http://localhost:10001/file/upload/' : 'http://132.110.64.161:30001/currency_need/file/upload/'

    if (this.$route.query.modelCode) {
      this.loading = true;
      this.modelCode = this.$route.query.modelCode;
      let params = {
        modelCode: this.modelCode
      };
      this.$api.deploy
        .getFiledByModelId(params)
        .then(res => {
          this.loading = false;

          res.content.list.forEach(item => {
            if (item.valueType == 'title') {
              this.titleForm = {
                type: item.controlType == 2 ? true : false,
                canEdit: item.canEdit == false ? false : true,
                prefix: item.controlType == 2 && item.canEdit ? item.prefixList.split(',') : [],
                suffix: item.controlType == 2 && item.canEdit ? item.suffixList.split(',') : [],
                defaultTitle: item.controlType == 2 && !item.canEdit && item.defaultTitle ? item.defaultTitle.split(',') : [],
              }
            } else if (item.valueType != 'file') {
              if (item.valueType == 'select' || item.valueType == 'radio' || item.valueType == 'check') {
                item.selectList = item.selectList.map(mini => {
                  return { 'value': mini }
                })
              }

              if (item.defaultAdd != 1) {
                this.list.push(item)
              } else {
                this.requiredList.push(item)
              }
              // 文件类型
            } else {
              this.fileModelList.push({ ...item, fileName: item.fieldName})
            }
          })

          this.loading = false;

          // 默认添加
          if (this.requiredList.length == 0) {
            this.requiredList = [
              {
                "fieldName": "期望完成时间",
                "valueType": "date",
                "dateType": "ymdhm",
                "orderBy": 1,
                "required": true,
              },{
                "fieldName": "联系人电话",
                "valueType": "phone",
                "orderBy": 1,
                "required": true,
              }
            ]
          }
        })
        .catch(error => {
          this.loading = false;

          console.error(error);
        });

    } else {
      this.$message.error("没有模板ID");
      this.$router.push({
        path: "/cf-deployManage"
      });
    }
  }
};
</script>
