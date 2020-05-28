<template>
  <div class="demo-drawer__content" style="margin:40px auto">
    <div>
      <el-row>
        <h1 style="margin:10px auto;text-align:center">知识库文章编辑页面</h1>
      </el-row>
    </div>
    <el-form
      :model="form"
      style="width:78%;margin:0px auto"
      ref="dataForm"
      label-position="right"
      :rules="dataFormRules">
      <el-form-item 
        label="文章标题:"
        :label-width="formLabelWidth"
        prop="noticeName"
      >
        <el-input
          v-model.trim="form.noticeName"
          autocomplete="off"
          style="width:100%;"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="关键字:" :label-width="formLabelWidth" >
        <el-input
          v-model.trim="form.noticeSummary"
          autocomplete="off"
          style="width:100%;"
          clearable
        ></el-input>
      </el-form-item>
      <el-row :gutter="10" >
        <el-col :span="8">
          <el-form-item
            
            label="接收机构:"
            :label-width="formLabelWidth"
            prop="noticeAppoint"
          >
              <el-select
                v-model="form.noticeAppoint"
                style="width:100%;"
                placeholder="请选择"
                @change="check(form.noticeAppoint)"
              >
                <el-option
                  v-for="item in WayList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="way">
          <el-form-item
            label="指定机构:"
            :label-width="formLabelWidth"
            prop="orgCode"
          >
          <el-cascader
            v-model="form.orgCode"
            :options="optionsOrg"
            style="width:100%;"
            :props="{ expandTrigger: 'hover',emitPath:false,checkStrictly: true,value:'orgCode', label:'orgName' }"
             @change="handleChange"
           ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="知识库分类:"
            :label-width="formLabelWidth"
            prop="knowledgeCode"
          >
          <el-cascader
            v-model="form.knowledgeCode"
            :options="options"
            style="width:100%;"
            :props="{ expandTrigger: 'hover',emitPath:false,checkStrictly: true,value:'knowledgeCode', label:'knowledgeName' }"
           
           ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-form-item label="公告内容:" :label-width="formLabelWidth" prop="tinymceHtml">
          <el-card style="height:100%;" shadow="never">
            <editor
              id="tinymce"
              v-model="tinymceHtml"
              :init="init"
              style="height:300;"
            ></editor>
          </el-card>
        </el-form-item>
      </el-row>
      <el-row v-if="fileshow">
        <el-form-item
          label="附件上传:"
          :label-width="formLabelWidth"
          prop="fileId"
        >
          <el-upload
            class="upload-demo"
            drag
            ref="upload"
            action="#"
            :file-list="fileList"
            :http-request="uploadFile"
            :on-success="upSuccess"
            :on-error="upError"
            :on-remove="upRemove"
            :show-file-list='showfilelist'
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="fileManage" style="width:95%;margin: 0px auto;" border>
      <el-table-column label="附件名" show-overflow-tooltip prop="fileName" align="center">
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelet(scope.$index, scope.row)"
            >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <center>
      <div class="demo-drawer__footer" style='margin: 10px auto;'>
        <el-button  @click="Back()">返回</el-button>
        <el-button type="primary" @click="submitForm()">修改</el-button>
      </div>
    </center>
  </div>
</template>
<script>
import noticechoice from 'components/notice/notice_choiceUser'
import noticechoiceGuy from 'components/notice/notice_choiceGuy'
import quill from 'components/notice/vue-quill-editor'
import tinymce from '../../../public/static/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import url from '../../../public/static/tinymce/zh_CN.js'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import '../../../public/static/tinymce/plugins/media'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/template'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/help'
import 'tinymce/plugins/autosave'
//富文本框属性
const toolbarOptions = []
export default {
  // props: {
  //   message:{
  //       type: Object,
  //       default: () => ({})
  //   },
  //   visible: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  components: {
    noticechoice,
    noticechoiceGuy,
    quill,
    tinymce,
    Editor,
  },
  //监听器
  watch: {
    // noticeType(newVal,oldVal) {
    //   if(newVal!=oldVal){
    //     this.form.noticeContent=''
    //   }
    // }
    // message(newV) {
    //       this.findDown()
          
    //   }
  },
  data() {
    return {
      message:'',
      fileList: [],
      fileManage:[],
      options: [],
      optionsOrg:[],
      showfilelist:false,
      knowledge:false,//知识库分类
      Summary:true,//概要显示
      SummaryWord:false,//关键字显示
      NoUrgent:true,//紧急度显示
      fileshow: true, //附件上传显示
      contentIs: true, //富文本框显示
      contentshow: false, //文本框显示
      loading: false, //上传进度显示
      time: false, //过期时间显示
      form: {
        noticeAppoint: 'A',
        fileId: '',
        noticeType: 'K',
        noticeUrgent: 'P',
        noticeContent: '',
        knowledgeCode:'',
        orgCode:'',
      },
      way: false, //指点按钮显示
      fileAll: [], //所有文件数组
      dialogChange: false,
      dialogChangeGuy: false,
      //表单规则
      dataFormRules: {
        noticeName: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur',
          },
        ],
        orgCode:[
          { required: true, message: '请选择机构分类', trigger: 'change' },
        ],
        knowledgeCode:[
          { required: true, message: '请选择知识库分类', trigger: 'change' },
        ],
        noticeType: [
          { required: true, message: '请选择通知类型', trigger: 'change' },,
        ],
        noticeSummary: [
          { required: true, message: '请输入公告摘要', trigger: 'blur' },
        ],
        noticeUrgent: [
          { required: true, message: '请选择紧急度', trigger: 'change' },
        ],
        noticeAppoint: [
          { required: true, message: '请选择接收人群', trigger: 'change' },
        ],
        noticeContent: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
        expireDt: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
      },
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      quillUpdateVio: false, // 根据视频上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {},
          },
        },
      },
      header: {
        // token: sessionStorage.token
      }, // 有的图片服务器要求请求头需要有token
      formLabelWidth: '100px', //from表单文本长度
      //通知类型
      TypeList: [
        {
          id: 'S',
          label: '系统通知',
        },{
          id: 'Z',
          label: '报障通知',
        },
      ],
      //紧急度
      UrgentList: [
        {
          id: 'P',
          label: '普通',
        },
        {
          id: 'J',
          label: '紧急',
        },
      ],
      //指定接受人员
      assign: [],
      //接受范围
      WayList: [
        {
          id: 'A',
          label: '所有',
        },
        {
          id: 'F',
          label: '指定',
        },
      ],
      content: '',
      //设置时间选择段
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000
        },
      },
      content: this.value,
      tinymceHtml: '',
      resimg: '', //上传img的url
      resVideo: '', //上传视频的url
      uploaded: false, //有没有上传完成
      init: {
        language_url: url, // 语言包的路径
        language: 'zh_CN', //语言
        skin_url: '/static/tinymce/skins/ui/oxide', // skin路径，注意这个，很多网上教程都是skins/lightgray，但是发现其实并没有这个玩意儿
        plugins:
          'print preview searchreplace autolink directionality visualblocks visualchars image link media template code codesample table hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help autosave ',
        toolbar: [
          'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent |  blockquote subscript superscript removeformat |',
          'styleselect formatselect fontselect fontsizeselect | bullist numlist |table image media charmap emoticons hr pagebreak insertdatetime print preview  ',
        ],
        height: 500,
        font_formats:
          "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        file_picker_types: 'image media',
        file_picker_callback: (callback, value, meta) => {
          //文件分类
          var filetype =
            '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4'
          //后端接收上传文件的地址
          var upurl = '/tinymce/upload/file'
          //为不同插件指定文件类型及后端地址
          switch (meta.filetype) {
            case 'image':
              filetype = '.jpg, .jpeg, .png, .gif'
              upurl = '/tinymce/upload/image' //接受图片的地址
              break
            case 'media':
              filetype = '.mp3, .mp4'
              upurl = '/tinymce/upload/media' //接受媒体文件的地址
              break
            case 'file':
            default:
          }
          let Allurl = 'http://132.110.64.161:30001/kftd/yzmh/uploadFile'
          if (meta.filetype == 'image') {
            let input = document.createElement('input') //创建一个隐藏的input
            input.setAttribute('accept', filetype)
            input.setAttribute('type', 'file')
            let that = this
            input.onchange = function() {
              let file = this.files[0] //选取第一个文件
              // console.log(file)
              that.uploadImg(file, 'image') // 上传视频拿到url
              //console.log(that.uploaded+'111')
              if (that.uploaded) {
                // this.resVideo,
                callback(Allurl + that.resimg) //将url显示在弹框输入框中
              } else {
                setTimeout(() => {
                  //设置几秒后再去取数据
                  callback(Allurl + that.resimg)
                }, 1000)
              }
            }
            //触发点击
            input.click()
          }
          let self = this
          if (meta.filetype == 'media') {
            //创建一个隐藏的type=file的文件选择input
            let input = document.createElement('input')
            input.setAttribute('accept', filetype)
            input.setAttribute('type', 'file')
            let that = this
            input.onchange = function() {
              let file = this.files[0] //选取第一个文件
              // console.log(file)
              that.uploadImg(file, 'media') // 上传视频拿到url
              //console.log(that.uploaded+'111')
              if (that.uploaded) {
                // this.resVideo,
                callback(Allurl + that.resVideo) //将url显示在弹框输入框中
              } else {
                setTimeout(() => {
                  //设置几秒后再去取数据
                  callback(Allurl + that.resVideo)
                }, 1000)
              }
            }
            //触发点击
            input.click()
            // input.onchange = function(){
            //   let file = this.files[0];//只选取第一个文件。如果要选取全部，后面注意做修改
            //   let xhr, formData;
            //   xhr = new XMLHttpRequest();
            //   xhr.open('POST', 'http://localhost:8082/api/file/uploadFile?fileType=P');
            //   xhr.withCredentials = self.credentials;
            //   xhr.upload.onprogress = function (e) {
            //     // 进度(e.loaded / e.total * 100)
            //     let percent=e.loaded / e.total * 100;
            //     if(percent<100){
            //           tinymce.activeEditor.setProgressState(true);//是否显示loading状态：1（显示）0（隐藏）
            //     }else{
            //           tinymce.activeEditor.setProgressState(false);
            //     }
            //   };
            //   xhr.onerror = function () {
            //     //根据自己的需要添加代码
            //     tinymce.activeEditor.setProgressState(false);
            //     return;
            //   };
            //   xhr.onload = function () {
            //     let json;
            //     if (xhr.status < 200 || xhr.status >= 300) {
            //       console.log('HTTP 错误: ' + xhr.status);
            //       return;
            //     }
            //     json = JSON.parse(xhr.responseText);
            //     json.content.filePath = json.content.filePath.slice(3)
            //     //假设接口返回JSON数据为{status: 0, msg: "上传成功", data: {location: "/localImgs/1546434503854.mp4"}}
            //     if(json.code==0){
            //       //接口返回的文件保存地址
            //       let mediaLocation=Allurl+json.content.filePath;
            //       callback(mediaLocation, { title: file.name });
            //     }else{
            //       console.log(json.msg);
            //       return;
            //     }

            //   };
            //   formData = new FormData();
            //   //假设接口接收参数为file,值为选中的文件
            //   formData.append('file', file);
            //   console.log(formData)
            //   //正式使用将下面被注释的内容恢复
            //   xhr.send(formData);
            // }
            // //触发点击
            // input.click();
          }
        },
      },
    }
  },
  mounted() {
    tinymce.init({})
  },
  created() {
    this.findDown()
  },
  methods: {
    //获取指定的人员名单
    getAll(msg) {
      this.assign = msg
    },
    //
    handleChange(val){
      console.log(val)
    },
    //
    handleDelet(id,val){
      for(let i=0;i<this.fileManage.length;i++){
        if(this.fileManage[i].fileId==val.fileId){
          this.fileManage.splice(i,1)
          // delete this.fileManage[i]
        }
      }
    },
    //
    Back(){
      this.$router.push({
          path: '/knowManage',
        })
    },
    // 上传文件方法
    uploadFile(param) {
      const form = new FormData()
      form.append('file', param.file, param.file.name)
      let params = {
        fileType: 'F',
      }
      this.$api.notice.Upload(form).then((res) => {
        if (res.code === 0) {
          this.fileManage.push(res.content)
          this.$message({
            message: '上传成功',
            type: 'success',
          })
        } else {
          this.$message.error('未知错误')
        }
      })
    },
    //显示指定按钮
    check(val) {
      if (val == 'F') {
        this.form.noticeType = 'K'
        this.way = true //显示指定按钮
        this.contentIs = true //显示富文本框
        this.contentshow = false //文本框不显示
        this.knowledge=false
        this.NoUrgent=true
      } else {
        this.way = false
        this.form.noticeType = 'K'
        this.contentIs = true
        this.contentshow = false
        this.knowledge=false
        this.NoUrgent=true
      }
    },
    //附件上传组件显示
    file(val) {
      if (val == 'M') {
        this.fileshow = false
        this.contentIs = false
        this.contentshow = true
        this.NoUrgent=true
        this.Summary=true
        this.knowledge=false
        this.SummaryWord=false
        this.form.noticeUrgent = 'P'
        this.form.knowledgeCode=''
        this.Urgent(this.form.noticeUrgent)
        this.form.noticeContent = ''
      } else if(val == 'S'){
        this.fileshow = true
        this.contentIs = true
        this.knowledge=false
        this.Summary=true
        this.SummaryWord=false
        this.contentshow = false
        this.NoUrgent=true
        this.form.knowledgeCode=''
        this.form.noticeUrgent = 'P'
        this.Urgent(this.form.noticeUrgent)
        this.form.noticeContent = ''
      }else if(val == 'Z'){
        this.fileshow = true
        this.NoUrgent=false
        this.knowledge=false
        this.contentIs = true
        this.contentshow = false
        this.Summary=true
        this.form.knowledgeCode=''
        this.SummaryWord=false
        this.form.noticeUrgent = 'J'
        this.Urgent(this.form.noticeUrgent)
        this.form.noticeContent = ''
      }else if(val == 'K'){
        this.fileshow = true
        this.NoUrgent=false
        this.contentIs = true
        this.knowledge=true
        this.Summary=false
        this.SummaryWord=true
        this.contentshow = false
        this.form.noticeUrgent = 'P'
        this.Urgent(this.form.noticeUrgent)
        this.form.noticeContent = ''
      }
    },
    //查询所有知识库分类
    findDown(){
      this.message=this.$route.query.message
      this.form={
        noticeAppoint: 'A',
        fileId: '',
        noticeType: 'K',
        noticeUrgent: 'P',
        noticeContent: '',
      }
      let dev ={noticeCode:this.message,flag:'1'}
      this.$api.notice.findNoticeDetiles(dev).then((res) => {
        if (res.code == 0) {
          this.form=res.content.notice
          this.form.orgCode=res.content.orgCode
          this.tinymceHtml=this.form.noticeContent
          this.fileManage=res.content.file
          this.check(this.form.noticeAppoint)
        }else{
          this.$message.error('请检查网络！')
        }
      })
      this.tinymceHtml=this.form.noticeContent
      this.$api.knowManage.findAll().then((res) => {
        if (res.code == 0) {
          this.options=res.content
        }else{
          this.$message.error('请检查网络！')
        }
      })
      this.$api.notice.findAllBZXTOrg().then((res) => {
        if (res.code == 0) {
          this.optionsOrg=res.content
        }else{
          this.$message.error('请检查网络！')
        }
      })
    },
    //过期时间显示
    Urgent(val) {
      if (val == 'J') {
        this.time = true
      } else {
        this.time = false
      }
    },
    //选择人员页面显示
    handleChoice() {
      this.dialogChange = true
      // this.dialogChangeGuy=true
    },
    //富文本框内容改变事件
    onEditorChange({ editor, html, text }) {
      this.form.noticeContent = html
    },
    //上传附件成功
    upSuccess(res, file, filelist) {
      this.fileAll = filelist
    },
    //文件移除
    upRemove(file, fileList, idx) {
      // let arr = this.fileAll.map(item => {
      //   let name = fileList.find(get => {
      //     return get.fileName = item.fileName
      //   })
      //   console.log(name,'name')
      //   return
      // })
      let a = []
      for (let i = 0; i < this.fileAll.length; i++) {
        for (let j = 0; j < fileList.length; j++) {
          if (this.fileAll[i].fileName == fileList[j].name) {
            a.push(this.fileAll[i])
          }
        }
      }
      this.fileAll = a
    },
    //上传附件失败
    upError() {
      this.$message.error('附件上传失败！')
    },
    //富文本上传图片视频
    uploadImg(file, type) {
      let content = file
      let formData = new FormData()
      formData.append('file', content)
      this.$api.notice.Upload(formData).then((res) => {
        if (res.code == 0) {
          if (type == 'image') {
            this.resimg = res.content.filePath
            this.resimg = this.resimg.slice(3)
          } else if (type == 'media') {
            this.resVideo = res.content.filePath
            this.resVideo = this.resVideo.slice(3)
          }
          this.uploaded = true
        }
      })
    },
    //保存
    Nsave() {
      if (this.form.noticeType == 'S' || this.form.noticeType == 'Z'|| this.form.noticeType == 'K') {
        this.form.noticeContent = this.tinymceHtml
      }
      let length = this.form.noticeContent.length
      if (length == 0) {
        this.$message({ message: '通告内容不能为空！！', type: 'error' })
      } else if (length > 10000) {
        this.$message({
          message: '通告内容不能超过10000个字符！！',
          type: 'error',
        })
      } else {
        for (let i = 0; i < this.fileAll.length; i++) {
          this.form.fileId = this.fileAll[i].fileId + ',' + this.form.fileId
        }
        if (
          this.form.noticeAppoint == 'F' &&
          (this.assign == '' || this.assign == null)
        ) {
          this.$message({ message: '指定人员不能为空！！', type: 'error' })
        } else {
          this.$refs.dataForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认保存吗？', '提示', {}).then(() => {
                this.editLoading = true
                this.form.noticeStatus = 'D'
                let dev = { notice: {}, user: [] }
                dev.notice = Object.assign({}, this.form)
                dev.user = this.assign
                this.$api.notice.saveInfo(dev).then((res) => {
                  this.editLoading = false
                  if (res.code == 0) {
                    location.reload()
                    this.$message({ message: '保存成功', type: 'success' })
                  } else {
                    this.$message({ message: '保存失败, ', type: 'error' })
                  }
                })
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
      }
    },
    //修改
    submitForm() {
      this.form.fileId=''
      const activeEditor = tinymce.activeEditor
      const editBody = activeEditor.getBody()
      activeEditor.selection.select(editBody)
      var textContent = activeEditor.selection.getContent({ format: 'text' })
      this.form.noticeText=textContent
      this.form.noticeContent = this.tinymceHtml
      let length = this.form.noticeContent.length
      if (length == 0) {
        this.$message({ message: '通告内容不能为空！！', type: 'error' })
      }  else {
        for (let i = 0; i < this.fileManage.length; i++) {
            this.form.fileId = this.fileManage[i].fileId + ',' + this.form.fileId
          }
          this.$refs.dataForm.validate((valid) => {
            if (valid) {
              this.$confirm('确认修改吗？', '提示', {}).then(() => {
                this.editLoading = true
                this.form.noticeStatus = 'S'
                if(this.form.noticeAppoint=='A'){
                  this.form.orgCode=''
                }
                let dev = {notice:this.form,orgCode:this.form.orgCode}
                this.$api.notice.editInfoNotice(dev).then((res) => {
                  this.editLoading = false
                  if (res.code == 0) {
                    this.$message({ message: '修改成功', type: 'success' })
                    this.$emit('getAll')
                  } else {
                    this.$message({ message: '修改失败, ', type: 'error' })
                  }
                })
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
      }
      // if (this.form.noticeType == 'S' || this.form.noticeType == 'Z' || this.form.noticeType == 'K') {
      //   this.form.noticeContent = this.tinymceHtml
      // }
      // let length = this.form.noticeContent.length
      // if (length == 0) {
      //   this.$message({ message: '通告内容不能为空！！', type: 'error' })
      // }  else {
      //   for (let i = 0; i < this.fileAll.length; i++) {
      //     this.form.fileId = this.fileAll[i].fileId + ',' + this.form.fileId
      //   }
      //     this.$refs.dataForm.validate((valid) => {
      //       if (valid) {
      //         this.$confirm('确认发布吗？', '提示', {}).then(() => {
      //           this.editLoading = true
      //           if (this.form.noticeAppoint == 'A') {
      //             this.assign = []
      //           }
      //           this.form.noticeStatus = 'S'
      //           let dev = { notice: {}, data:this.form.orgCode }
      //           dev.notice = Object.assign({}, this.form)
      //           this.$api.notice.saveKnowledgeInfo(dev).then((res) => {
      //             this.editLoading = false
      //             if (res.code == 0) {
      //               this.$message({ message: '发布成功', type: 'success' })
      //               location.reload()
      //             } else {
      //               this.$message({ message: '发布失败, ', type: 'error' })
      //             }
      //           })
      //         })
      //       } else {
      //         console.log('error submit!!')
      //         return false
      //       }
      //     })
      // }
    },
  },
}
</script>

<style lang="less" scoped>
.demo-drawer__content {
  margin: 30px auto;
}
/deep/.el-form-item__content{
  line-height: unset!important
}
</style>