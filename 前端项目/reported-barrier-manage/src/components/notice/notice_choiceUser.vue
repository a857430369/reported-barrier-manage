<template>
<el-dialog width="80%" 
    v-loading="loading"
    :visible.sync="visible"
    :before-close="modalClose"
    :close-on-click-modal="false"
    custom-class='bodyShow'
    title="指定人员清单"
     append-to-body>
  <div class="topShow">
    <el-card class="main-card-notice" shadow="never">
    <el-row align="middle" class="row-style">
      <div class="menuHead">
          <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">系统人员</el-menu-item>
            <el-menu-item><el-divider direction="vertical"></el-divider></el-menu-item>
            <el-menu-item index="2">用户人员</el-menu-item>
          </el-menu>
      </div>
    </el-row>
    <el-row v-if="value=='2' ">
      <!-- 用户人员 -->
      <div >
        <el-card class="MessageNotice" shadow="never">
        <choiceGuy @getMessage='getMessage' @modalClose='getMessage'></choiceGuy>
        </el-card>
      </div>
    </el-row>
    <el-row v-if="value=='1' || value=='' ">
      <!-- 系统人员 -->
      <div >
        <el-card class="MessageNotice" shadow="never" style="line-height: unset">
        <choiceUser @getMessage='getMessage' @modalClose='getMessage'></choiceUser>  
        </el-card>      
      </div>
    </el-row>
    </el-card>
  </div>
</el-dialog>
</template>
  
<script>
import choice from '../../components/notice/notice_choice.vue'
//import choiceGuy from '../../components/notice/notice_choiceGuy.vue'
import choiceGuy from '../../views/notice/choiceGuy/userSelect.vue'
import choiceUser from '../../views/notice/choice/userSelect.vue'
export default {
    props: {
      message:{
      type: Array,
      require: true
      },
      visible: {
        type: Boolean,
        default: false,
      }
    },
  data() {
    return {
      tableData: [],
      dataFrom:{},
      value: '',
      activeIndex: '1',
      loading: false, //页面加载
      size:"small",
    }
  },
  mounted() {},
  created() {
    //this.findAll()
  },
  components:{
    choice,choiceGuy,choiceUser
  },
  methods: {
    //导航栏事件
    handleSelect(key, keyPath) {
      this.value=keyPath
    },
     //对话框页面关闭
      modalClose() {
        this.$emit('update:visible', false); // 直接修改父组件的属性
      },
      //
      getMessage(val){
        this.$emit('getMessage',val);
        this.$emit('update:visible', false);
      }
  }
}
</script>
<style scoped>
  .row-style {
  margin: 0px;
  width: 100%;
  height: 100%;
  }
   .MessageNotice{
      padding: 20px;
      border: 0px solid #EBEEF5;
   }
   .el-menu-demo{
     margin-left: 10px;
   }
</style>
<style>
  .bodyShow .el-dialog__body {
    padding: 0px 20px 30px;
  }
  .main-card-notice .el-card__body{
    padding: 0px
  }
</style>