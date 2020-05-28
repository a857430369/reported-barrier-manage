<template>
  <div class="major-item-contain">
    <!-- 配置中文名字 -->
    <!-- 填写数据源表单 -->
    <el-dialog title="测试SQL语句"
               :visible.sync="chineseNameDialog"
               append-to-body
               top="10vh"
               width="50%"
               left>
      <div class="deploy-wrap">
        <testDataSource :sql="form.sqlTxt" :type="value" ref="testDataSource" :label="inputForm" :dataSourceCode="form.dataSource" @onCancel="chineseNameDialog = false"></testDataSource>
      </div>
    </el-dialog>
    <!-- 配置中文名字 -->

    <el-dialog title="配置输入框"
               :visible.sync="centerDialogVisible"
               top="10vh"
               width="50%"
               left>
      <div class="wrap">
        <el-form :model="form"
                 ref="ruleForm"
                 :rules="rules"
                 label-width="120px">
          <el-form-item label="字段名称"
                        required
                        prop="name">
            <el-input v-model="form.name"
                      :disabled="isRequired"
                      placeholder="请输入字段名称"></el-input>
          </el-form-item>
          <el-form-item label="是否必填"
                        v-if="value != 'remoteCheck'"
                        required
                        prop="required">
            <el-switch v-model="form.required"></el-switch>
          </el-form-item>

          <el-form-item label="排序字段"
                        required
                        v-if="!isRequired"
                        prop="orderBy">
            <el-input v-model.number="form.orderBy"></el-input>
          </el-form-item>
          <el-form-item label="输入框水印"
                        v-if="value != 'remoteCheck' && value != 'remoteQuery'"
                        prop="placeholder">
             <el-popover
                placement="top-start"
                width="200"
                trigger="hover">
              <img :src="tipImage2" style="width: 170px">
              <el-input v-model="form.placeholder" slot="reference"></el-input>
             </el-popover>
          </el-form-item>

          <!-- 时间 -->
          <el-form-item v-if="value == 'date'"
                        label="时间维度"
                        required
                        prop="date">
            <el-select v-model="form.date"
                        :disabled="isRequired"
                       placeholder="请选择活动区域">
              <el-option label="年/月/日"
                         value="ymd"></el-option>
              <el-option label="年/月/日/时/分"
                         value="ymdhm"></el-option>
            </el-select>
          </el-form-item>

          <!-- 提醒内容 -->
          <el-form-item v-if="value == 'remark'"
                        label="提醒内容"
                        required
                        prop="remarkText">

            <el-input type="textarea"
                      :rows="4"
                      placeholder="请输入提醒内容"
                      v-model="form.remarkText">
            </el-input>

          </el-form-item>

          <!-- 数据库调用 -->
          <div class="remote" v-if="value == 'remoteCheck' || value == 'remoteQuery'">
            <el-form-item label="数据源选择" prop="dataSource" required>
              <el-select v-model="form.dataSource"
                         placeholder="请选择">
                <el-option v-for="item in option.dataSource"
                           :key="item.code"
                           :label="item.name"
                           :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="SQL语句" prop="sqlTxt" required class="vbhhhx">
              <!-- <div class="input-model"> -->
             <el-popover
                placement="top-start"
                width="280"
                trigger="hover">
              <img :src="tipImage3" style="width: 250px">
                <el-input
                 slot="reference"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="form.sqlTxt">
                </el-input>
             </el-popover>
             <span> * 问号 "?" 表示替换的变量</span>

            </el-form-item>

            <el-form-item label="变量的标签" class="input-label">

              <el-popover
                placement="top-start"
                width="200"
                trigger="hover">
                <img :src="tipImage" style="width: 170px">
                <div style="display: inline-block;position: relative;margin: 0 5px 5px 0" slot="reference" v-for="key in Object.keys(inputForm)" :key="key">
                  <el-input v-model="inputForm[key]" placeholder="变量标签"></el-input>
                  <i class="el-icon-circle-close del-label" @click="delInputForm(key)"></i>
                </div>
              </el-popover>

              <i class="el-icon-circle-plus-outline add-label" @click="addInputForm"></i>
            </el-form-item>

          </div>
          <!-- 下拉选项 -->
          <div v-if="this.value == 'select' || this.value == 'check' || this.value == 'radio'">
            <el-form-item v-for="(item, index) in form.selectList"
                          :key="index"
                          :label="'选项内容' + (index == 0 ? '' : index + 1)"
                          :prop="'selectList.' + index + '.value'"
                          required
                          :rules="{
                            required: true, message: `选项内容${index + 1}不能为空`, trigger: 'blur'
                          }">

              <el-input v-model="item.value"
                        placeholder="请输入选项内容"
                        style="width:80%;">
              </el-input>
              <el-button @click.prevent="delOption(item, index)"
                         type="danger">删除</el-button>
            </el-form-item>

          </div>
          <el-form-item>
            <el-button type="primary"
                       @click="onSumbit">完成配置</el-button>
                       
            <el-button type="success" @click="testSql" v-if="value == 'remoteCheck' || value == 'remoteQuery'">测试连接</el-button>
            <el-button type="warning"
                       v-if="this.value == 'select' || this.value == 'check' || this.value == 'radio'"
                       @click="addOption">新增选项</el-button>
            <el-button @click="centerDialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-row type="flex">
      <el-col :span="4">
        <el-select v-model="value"
                   placeholder="请选择"
                   v-if="!isRequired"
                   @change="change">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>

        <el-select v-else
                   v-model="value"
                   placeholder="请选择"
                   :disabled="isRequired"
                   @change="change">
          <el-option v-for="item in rOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>

      </el-col>

      <el-col :span="(value == 'textarea' || value == 'remark' || value == 'remoteQuery' || value=='remoteCheck') ? 11 : 7"
              :offset="1"
              style="position: relative;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">
        <div v-if="form.name == ''"
             style="position: absolute;bottom: 5%">
          <span class="tip">*点击右边配置编辑信息</span>
        </div>
        <el-form v-else
                 ref="form"
                 label-width="140px">
          <el-form-item :label="form.name"
                        :required="form.required"
                        style="margin-bottom: 0px">
            <el-input v-model="data"
                      v-if="value != 'remark' && form.remarkText != ''"
                      style="display: block"
                      size="mini"
                      :disabled="true"></el-input>
            <span v-else
                  class="remark-text">{{ form.remarkText }}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4"
              style="position: relative;">
        <div style="position: absolute;bottom: 5%"
             v-if="!isTrue">
          <span class="tip"> （信息不完整）</span>
        </div>
      </el-col>
      <el-col :span="(value == 'textarea' || value == 'remark' || value == 'remoteQuery' || value == 'remoteCheck') ? 4 : 8"
              style="display: flex;
              align-items: center;
              justify-content: flex-end;">
        <el-row type="flex"
                justify="end"
                align="bottom">
          <el-button type="primary"
                     @click="setOption"
                     size="small">配置</el-button>
          <el-button v-if="!isRequired"
                     type="success"
                     @click="del"
                     size="small">删除</el-button>

        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">

.vbhhhx {
  .el-form-item__content {
    text-align: right;
    line-height: 12px;
    font-size: 12px;
    color: red;
  }
}

.wrap {
  .el-select {
    width: 100%;
  }
}

.input-label {
  .el-form-item__content {
    line-height: unset;
  }
}

</style>

<style lang="scss" scoped>
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

.deploy-wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
  .el-select {
    width: 100%;
  }
}


ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.my-enter,.my-leave-to{
    opacity:  0;/*透明度*/
    transform: translateY(-70px);
}
.my-enter-active,.my-leave-active{
    transition: all 0.8s ease;
}

.remote {
  position: relative;
  .input-model {
    display: inline-block;
    box-sizing: border-box;
    width: calc(100% - 25px);
  }
  .input-label {
    .el-input {
      width: 130px;
    }
    .del-label {
      position: absolute;
      right: 1px;
      top: 1px;
      font-size: 13px;
      color: #cacac8;
      &:hover {
        cursor: pointer;
      }
    }
    .add-label {
      font-size: 25px;
      color: #bfbfbf;      
      vertical-align: sub;
      text-shadow: 0.2px 0.4px 1px rgba(0,0,0,0.7);
      &:hover {
        cursor: pointer;
        color: #8a8a8a;
      }
    }
  }

  .help {
    width: 20px;
    height: 20px;
    display: inline-block;
    margin-top: 5px;
    line-height: 20px;
    vertical-align: top;
    position: relative;
    font-size: 20px;
    color: #606266;
    &:hover {
      cursor: pointer;
      color: #ccc;
    }
    ul {
      color: #000;
      font-size: 12px;
      position: absolute;
      border-radius: 3px;
      overflow: hidden;
      top: 20px;
      left: 0;
      li {
        width: 100px;
        background: #fff;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 5px;
        i {
          margin-right: 5px;
        }
      }
    }
  }
  
}
.wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
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

.remark-text {
  display: inline-block;
  width: 100%;
}
</style>

<script>
import setChineseName from './setChineseName'
import testDataSource from './testDataSource'
import store from './store/index'
import Vue from 'vue'

export default {
  components: {
    setChineseName,
    testDataSource
  },
  props: {
    index: {
      type: Number,
      default: undefined
    },
    type: {
      type: String,
      default: ''
    },
    datas: {
      type: Object,
      default: () => { }
    },
    dictList: {
      type: Array,
      default: () => []
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dictList: {
      handler (newVal) {
        if (newVal.length > 0) {
          this.dictList.map(item => {
            if (item.type == 'select') {
              this.option.select = item.dictList
            } else if (item.type == 'check') {
              this.option.check = item.dictList
            } else {
              this.option.radio = item.dictList
            }
          })
        }
      },
      immediate: true
    },

    datas: {
      handler (newVal) {
        if (JSON.stringify(newVal) != '{}') {
          this.form.name = newVal.fieldName

          this.form.select = ''
          this.form.required = newVal.required ? newVal.required : false
          this.form.date = newVal.valueType == 'date' ? newVal.dateType : ''
          this.form.orderBy = newVal.orderBy
          this.form.placeholder = newVal.placeholder
          this.form.remarkText = newVal.remarkText
          this.form.sqlTxt = newVal.sqlTxt
          this.form.dataSource = newVal.datasourceCode


          // 设置变量的标签
          this.inputForm = {}
          if (newVal.variateLabel) {
            let list = newVal.variateLabel.split(',')
            if (list.length > 0) {
              list.map(item => {
                this.inputIndex++
                Vue.set(this.inputForm, 'input' + this.inputIndex, item)
              })
            }
          }
          if (newVal.valueType == 'remoteQuery' || newVal.valueType == 'remoteCheck') {
            this.option.dataSource = store.dataSources
          }


          if (newVal.valueType == 'select' || newVal.valueType == 'check' || newVal.valueType == 'radio') {
            this.form.select = newVal.dictCode
            this.form.selectList = newVal.selectList
          }
          this.value = newVal.valueType
          this.tipValue = newVal.fieldName
          if (this.value == 'date' && newVal.dateType != '') {
            this.otherValue = newVal.dateType
          } else if ((this.value == 'select' || newVal.valueType == 'check' || newVal.valueType == 'radio') && newVal.dictCode != '') {
            this.otherValue = newVal.dictCode
          }
        }
      },
      immediate: true
    },
    otherValue: {
      handler (newVal) {
        if (newVal != "") {
          this.$emit("getOtherVal", this.index, this.value, newVal)
        }
      }
    },
    tipValue: {
      handler (newVal) {
        if (newVal != "") {
          this.$emit("getTipVal", this.index, this.value, newVal)
        }
      }
    }
  },
  data () {
    return {
      isFirst: true,
      tipImage: require('./src/img/tip.png'),
      tipImage2: require('./src/img/tip2.png'),
      tipImage3: require('./src/img/tip3.png'),
      inputIndex: 0,
      flag: false,
      isTrue: true,
      indexs: 666,
      data: '',
      form: {
        name: '',
        required: true,
        select: '',
        selectList: [{value: ''}],
        remarkText: '',
        date: '',
        dataSource: '', // 数据源的主键
        orderBy: 0,
        placeholder: '',
        sqlTxt: '',
        variateLabel: ''
      },
      inputForm: {
        input0: ''
      },
      option: {
        select: [],
        check: [],
        radio: [],
        dataSource: []
      },
      rules: {
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ],
        required: [
          { required: true, message: '请选择活动区域', trigger: 'blur' }
        ],
        // selectList: [
        //   { required: true, message: '请输入下拉选项', trigger: 'blur' }
        // ],remarkText
        date: [
          { required: true, message: '请选择时间选项', trigger: 'blur' }
        ],
        check: [
          { required: true, message: '请选择复选框选项', trigger: 'blur' }
        ],
        orderBy: [
          { required: true, message: '请输入排序字段', trigger: 'blur' }
        ],
        remarkText: [
          { required: true, message: '请输入提醒内容', trigger: 'blur' }
        ],
        dataSource: [
          { required: true, message: '请选择数据源', trigger: 'blur' }
        ],
        sqlTxt: [
          { required: true, message: '请输入sql语句', trigger: 'blur' }
        ]
      },
      inputFormList: [1],
      checkList: [
        { dictCode: '1', dictName: '是否男生' },
        { dictCode: '2', dictName: '角色类型' },
        { dictCode: '3', dictName: '机构类型' },
        { dictCode: '4', dictName: '用户类型' }
      ],
      centerDialogVisible: false,
      chineseNameDialog: false,
      options: [{
        value: 'text',
        label: '文本'
      }, {
        value: 'select',
        label: '下拉'
      }, {
        value: 'check',
        label: '复选'
      }, {
        value: 'radio',
        label: '单选'
      }, {
        value: 'date',
        label: '时间'
      }, {
        value: 'textarea',
        label: '大文本'
      }, {
        value: 'remoteQuery',
        label: '数据库查询'
      }, {
        value: 'remoteCheck',
        label: '数据库验证'
      }, {
        value: 'remark',
        label: '给填写者提醒文字'
      }],
      rOptions: [{
        value: 'date',
        label: '时间',
      }, {
        value: 'phone',
        label: '电话'
      }],
      value: 'text',
      text: '',
      otherValue: '',
      tipValue: ''
    }
  },
  methods: {
    delInputForm(key) {
      if (Object.keys(this.inputForm).length > 1) {
        delete this.inputForm[key]
        this.$forceUpdate();
      }
    },
    testSql() {
      this.chineseNameDialog = true
      
      // 第一次访问
      if (!this.isFirst) {
        this.$refs['testDataSource'].setLabel(this.inputForm)
      }
      this.isFirst = false
    },

    // 增加输入标签
    addInputForm() {
      this.inputIndex++
      Vue.set(this.inputForm, 'input' + this.inputIndex, '')
    },
    addOption() {
      this.form.selectList.push({value: ''})
    },
    delOption(data, index) {
      if (this.form.selectList.length != 1) {
      this.form.selectList.splice(index, 1)
      }
    },
    checkForm () {
      let is = true
      let isVariate = true // 变量验证
      this.form.selectList.map(item => {
        if (item.value == '') {
          is = false
        }
      })

      Object.values(this.inputForm).map(item => {
        if (item == '') {
          isVariate = false
        }        
      })
      this.isTrue = this.form.name != ''
        && this.form.orderBy != ''
        && this.form.required != undefined
        && (is || (this.value != 'select' && this.value != 'check' && this.value != 'radio'))
        && (this.value != 'remark' || this.form.remarkText != '')
        && ((this.value != 'remoteCheck' && this.value != 'remoteQuery') || (this.form.sqlTxt != '' && this.form.dataSource != '' && isVariate))

      return this.isTrue
    },
    mixVariable() {
      let text = ''
      text = Object.values(this.inputForm).join(',')
      return text
    },
    onSumbit () {
      // 得到字符串数组
      this.form.variateLabel = this.mixVariable()
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.isTrue = true
          this.$emit('getOption', this.index, this.value, this.form)
          this.centerDialogVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    setOption () {
      this.centerDialogVisible = true

      if (this.value == 'remoteQuery' || this.value == 'remoteCheck') {
        this.option.dataSource = store.dataSources
      }
    },
    del () {
      this.$emit("delList", this.index)
    },
    change () {
      this.otherValue = ''
      this.tipValue = ''
      this.$emit("change", this.index, this.value, this.otherValue, this.tipValue)
      this.inputIndex++
      this.inputForm = {}

      Vue.set(this.inputForm, 'input' + this.inputIndex, '')
    
      for (let key in this.form) {
        if (key == 'required') {
          this.form[key] = true
        } else if (key == 'selectList'){
          this.form[key] = [{value: ''}]
        } else if (key != 'orderBy') {
          this.form[key] = ''
        }
      }

    }
  },
  created() {
  }
}
</script>
