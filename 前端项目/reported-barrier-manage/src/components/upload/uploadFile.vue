<template>
<div>
  <el-dialog
    title="上传文件"
    :visible.sync="visible"
    width="35%"
    class="uploadBody"
    :before-close="modalClose">
    <div class="uploadFile">
      <el-form :model="form" ref="form" :rules="rules">
        <span class="allSize">文件名称</span>
        <el-form-item prop="fileName">
          <el-input
            style="width:360px"
            placeholder="请输入文件名称"
            v-model="form.fileName"></el-input>
        </el-form-item>
        <span class="allSize">文件描述</span>
        <el-form-item>
          <el-input
          type="textarea"
          :rows="2"
          autosize
          style="margin-bottom: 10px;width: 360px"
          maxlength="200"
          show-word-limit
          placeholder="请输入文件描述内容"
          v-model="form.textarea">
        </el-input>
        </el-form-item>
      </el-form>
      <span class="allSize">文件上传</span>
      <el-upload
        class="upload-demo"
        drag
        :file-list="filelist"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
        :limit='1'
        :http-request="upLoadFile"
        action=""
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="modalClose()">取 消</el-button>
      <el-button type="primary" @click="onSubmitMenu('form')">上 传</el-button>
    </span>
  </el-dialog>
</div>
  
</template>

<script>
import {objDeepCopy} from '@/utils/index'

export default {
  data() {
    return {
      data: [],
      url:'',
      textarea: '',
      fileName:'',
      form:{
        fileName:'',
        textarea:''
      },
      rules:{
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur' }
        ]
      },
      fileCheck: {
        "condition": {                  //条件查询，可为空,键值对实体 例如: 
          "fileStatus":"E",          //必选，状态：E-有效、F-删除
          "fileType":"F",           //必选，类型(F-附件下载，P-普通附件)
          menuCode:'',
          "fileName":" "
        },
        rule:{},
        "page": {}
      },
      newFile: null,
      filelist:[],
      limit:0,
      total: 0

    }
  },
  props:  {
    visible: {
      type: Boolean,
      default: false
    },
    menuCode: {
      type: String
    }
  },
  methods: {
    // 去重
    async checkName() {
      this.fileCheck.condition.fileName=this.form.fileName
      this.fileCheck.condition.menuCode = this.menuCode
      let flag = false
      await this.$api.file.getAll(this.fileCheck).then((res) => {
        this.total = res.content.total
      }).catch((e) => {
        console.log(e)
      })
      console.log(this.total)
      if(this.total === 0 ){
        flag = true
      }else{
        flag = false
      }
      console.log(flag)
      return flag
    },

    // 文件移除
    handleRemove(file, fileList) {
      //console.log(file, fileList)
      this.filelist = fileList
      this.form.fileName = ''
    },

    // 超出文件数量
    handleExceed(files, fileList){
      if(fileList.length === 1){
        this.$message.error('最多只能上传一个文件');
      }
    },


    // 上传自定义方法
    upLoadFile(parm) {
      this.newFile = parm.file
      const isLt10M = this.newFile.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
        this.filelist = []
      }else{
        //console.log(this.filelist)
        //console.log('1')
        this.form.fileName = parm.file.name.split('.')[0]
      }
    },
    // 提交表单
    async  onSubmitMenu(formName) {
      await this.checkName()
       this.$refs[formName].validate((valid) => {
         
         if(valid){
           if(this.total == 0 ){
              let code = objDeepCopy(this.menuCode)
              if(code === 'str'){
                code = ""
              }
              const data ={
                "menucode":code,
                "fileRemark":this.form.textarea
              }
              const form = new FormData();
              form.append("file", this.newFile);
              console.log(form.get('file'))
              this.$api.file.uploadFile(form, data).then((res) => {
                if(res.code === 0 ){
                  let fileConten = res.content
                  fileConten.fileName = this.form.fileName
                  fileConten.menuCode = code
                  fileConten.fileRemark = this.form.textarea
                  console.log(fileConten)
                  this.$api.file.updateFileName(fileConten).then((res) => {
                    if(res.code === 0){
                      this.$message({type: 'success', message: '上传成功'})
                      this.modalClose()
                    }else{
                      this.$message('错误')
                    }
                  }).catch((e) => {
                    console.log('修改错误',e)
                  })
                }
              }).catch((e) => {
                console.log(e)
              })
           }else{
             this.$message('文件名称已存在，请重新命名')
           }
         }
       })
    },
    // 关闭对话框方法
    modalClose() {
      this.$emit('getAllFile')
      this.$emit('update:visible',false)
    },
  }
}
</script>

<style scoped>
.uploadFile {
  margin-left: 25%;
}
.allSize{
  color: #989ca5; 
  font-weight: 700;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
.upload-demo{
  width: 66%;
}
</style>
<style>
.uploadBody .el-dialog__body {
    padding: 0px 0px;
    padding-bottom: 50px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
}
</style>