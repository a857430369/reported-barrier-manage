<template>
  <el-dialog width="72%" 
    v-loading="loading"
    :visible.sync="visible"
    :before-close="modalClose"
    :close-on-click-modal="false"
    :show-close="false"
    append-to-body>
    <template slot="title"> 
        <div>
          <el-row >
          <!-- <el-col :span='12' v-if="read">
            <span style="margin:0px auto;text-align:left" >
            <h3><i :class="this.message.isRead='E'?'el-icon-success':'el-icon-warning-outline'" 
            :style="this.message.isRead='E'?'color:green':'color:red'"></i>
            {{this.message.isRead='E'?'已阅':'未阅'}}</h3></span></el-col>
          <el-col :span='12'> -->
            <span style="margin:0px auto;text-align:right"><h4>已阅次数：{{this.message.clickCount}}</h4></span>
            <!-- </el-col> -->
          </el-row>
          <h1 style='text-align:center'><span  style="margin:0px 20px 0px 28px">{{this.message.noticeName}}</span>
          <span style="color:red">{{this.message.noticeUrgent=='J'?'(紧急通知)':''}}</span></h1>
          </div>  
          <el-row style="margin:10px auto;text-align: center">
            <!-- <h3 v-if="sendUser">发布者：{{this.message.sendName}}</h3> -->
            </el-row> 
    </template>
    <div id="app" style="text-align:left;margin:-60px auto;width:95%;">
        <el-divider></el-divider>
            <el-row  >
              <el-col>
                <h4 style='text-align:center'>
                  <span style='margin:0px 30px 0px 0px'>{{this.message.createDt}}</span>
                  <span>{{this.message.sendName}}</span>
                </h4>
              </el-col>
              </el-row> 
        <el-divider></el-divider>
      <el-row>
        <!-- <el-col :span='3'><h3>通知内容：</h3></el-col>
      <el-col :span='21' style="text-align:left">
        <el-card style="width:95%"  shadow="never"><h3 v-html="this.message.noticeContent" ></h3></el-card></el-col> -->
        <h3 v-html="this.message.noticeContent" ></h3>
      </el-row>
      <el-row>
      <el-form v-if="play" label-width='55px' >
      <el-form-item label="附件：" v-for="(o) in filelist" :key="o.fileId" style="margin:0px auto;text-align:left">
        <el-button type="text" class="button" @click="Download(o)">{{o.fileName}}</el-button></el-form-item>
      </el-form>
      </el-row>
      <el-row></el-row>
    </div>
    <div style="height:70px"></div>
    <div  id="button" style="text-align:center;margin:0px auto">
      <el-row><el-button style="" type='primary' @click="handleSure">{{this.message.value=='0'?'我已阅读':'确定'}}</el-button></el-row></div>
  </el-dialog>
</template>
<script>
import {downloadFile} from '@/utils/index'
export default {
    props: {
      message:{
        type: Object,
        default: () => ({})
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        loading:false,
        filelist:[],
        play:true,
        read:false,
        sendUser:true,
      }
    },
    created() {
      this.findFile()
    },
    methods:{
      //对话框页面关闭
      modalClose() {
        this.$emit('update:visible', false); // 直接修改父组件的属性
      },
      //确定按钮事件
      handleSure() {
        if(this.message.value=='0'){
          if(this.message.noticeAppoint=='A'){
            let a =JSON.parse(sessionStorage.getItem("noticeCode"))
            if(a !=null ){
              var b = a.some(item => {
              return item === this.message.noticeCode
              })
              if(!b){
                a.push(this.message.noticeCode)
              }
            }else{
              a=[]
              a.push(this.message.noticeCode)
            }
            sessionStorage.setItem("noticeCode",JSON.stringify(a));//设置key和value的值
          }
          let dev={noticeCode:this.message.noticeCode,noticeAppoint:this.message.noticeAppoint}
          this.$api.noticeRecord.editInfo(dev).then((res) => {  
            if(res.code == 0) {
              this.$emit('update:visible', false);
              this.$emit('getAll');
            } else {
              this.$message({message: '操作失败 ', type: 'error'})
            }
          })
        }else{
          this.$emit('update:visible', false);
        }
      },
      //查询附件列表
      findFile(){
        // let con = ''
        // if(this.message.value=='0'){
        //   this.con = '1'
        // }else{
        //   this.con = '0'
        // }
        if(this.message.value!='0'){ this.sendUser=false }
        if(this.message.noticeAppoint=='E' ){
          this.read=true
        }else if(this.message.noticeAppoint=='F'){
          this.read=true
        }else{
          this.read=false
        }
        let dev={noticeCode:this.message.noticeCode,flag:0}
        console.log(dev)
        this.$api.notice.findNoticeDetiles(dev).then((res) => { 
          if(res.content.file.length>0){
            this.filelist=res.content.file
            this.play=true
          }else{
            this.play=false
          }
        })
      },
      //下载附件
      Download(val){
        let dev = val.fileId
        this.$api.file.downloadExcel(dev).then((res) => {
          downloadFile(res.data, val.fileName)
        })
      },
    },
}
</script>

<style scoped lang="less">
 /deep/ .el-form-item__label{
   text-align:right;
   width:100px
 }
 /deep/.el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 15px 0;
}
</style>