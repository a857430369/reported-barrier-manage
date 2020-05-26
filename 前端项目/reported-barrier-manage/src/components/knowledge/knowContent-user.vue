<template>
  <div class="hexin">
    <h2 class="header"><span>{{noticeContent.noticeName}}</span></h2>
    <h3 class="header_fuzhu"><span>发布时间:{{noticeContent.createDt}}</span></h3>
    <el-divider></el-divider>
    <div  v-html="noticeContent.noticeContent" class="content">{{noticeContent.noticeContent}}</div>
    <div v-if="flag(noticeContent.noticeCode)">
      <div>

      </div>
      <div style="text-align: left">
        <div v-for="(item, index) in noticeContent.file" :key="index">
          <span>附件：<el-button type="text" @click="downloadContentFile(item)">{{item.fileName}}</el-button></span>
          
        </div>
      </div>
      
    </div>
    
  </div>
  
</template>

<script>
import {downloadFile,objDeepCopy} from '@/utils/index'

export default {

  data() {
    return {
      noticeContent: objDeepCopy(this.content),
      flagContent: false
    }
  },

  props:['content'],

  methods: {
    flag(code) {
      this.getFileList(code)
      return this.flagContent
    },
    // 获取附件
    async getFileList(code) {
      let form = {
        noticeCode: code,
        flag: 1
      }
      await this.$api.notice.findNoticeDetiles(form).then((res) => {
        if(res.content.file.length > 0){
          this.noticeContent.file = res.content.file
        }
      })
      if(this.noticeContent.file){
        this.flagContent = true
      }else{
        this.flagContent = false
      }

    },
    
    // 附件下载接口
    downloadContentFile(item) {
      this.$api.file.downloadExcel(item.fileId).then((res) => {
        console.log(res)
        if(res.status === 200) {
          console.log('1')
          downloadFile(res.data, item.fileName)
        }
      })
    }
  }

  
}
</script>

<style scoped>
.hexin{
  text-align: center;
}
.header{
  font-size: 40px
}
.header_fuzhu{
  font-size: 20px
}
.content{
  text-align: left;
}

</style>