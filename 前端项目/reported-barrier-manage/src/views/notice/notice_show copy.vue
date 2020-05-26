<template>
  <div class="topShow">
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <el-tabs type="border-card"  v-model="currTabPane" style="width: 95%; margin: 20px auto;"
          @tab-click="handleClick">
      <el-tab-pane
            v-for="item in tabMapOptions"
            :key="item.key"
            :label="item.label"
            :name="item.key"
          >
            <span slot="label"><i :class="item.icon"></i> {{ item.label }}</span>
          <el-row v-if="value=='1' || value==''">
            <!-- 公告管理 -->
            <manage></manage>
          </el-row>
          <el-row v-if="value=='2' ">
            <!-- 公告记录 -->
            <record></record>
          </el-row>
          <el-row v-if="value=='3' ">
            <!-- 新增公告 -->
            <add ref="add"></add>
          </el-row>
          <el-row v-if="value=='4' ">
            <!-- 通知公告 -->
            <see></see>
          </el-row>
      </el-tab-pane>
      </el-tabs>
    <!-- <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">公告管理</el-menu-item>
      <el-menu-item index="2">公告记录</el-menu-item>
      <el-menu-item index="3">新增公告</el-menu-item>
    </el-menu> -->
    </el-row>
  </div>
 
</template>
  
<script>
import manage from '../../components/notice/notice_Manage.vue'
import record from '../../components/notice/notice_record.vue'
import add from '../../components/notice/notice_Add.vue'
import see from '../notice/notice_see.vue'
export default {
  data() {
    return {
      tableData: [],
      dataFrom:{},
      value: '',
      activeIndex: '1',
      tabMapOptions:[
        { label: '公告管理', key: '1', icon: 'el-icon-edit-outline' },
        { label: '公告记录', key: '2', icon: 'el-icon-document-copy' },
        { label: '新增公告', key: '3', icon: 'el-icon-circle-plus-outline' },
      ],
      currTabPane:'1',
    }
  },
  mounted() {},
  created() {
    //this.findAll()
  },
  components:{
    manage,
    record,
    add,
    see,
  },
  methods: {
    //导航栏事件
    handleSelect(key, keyPath) {
      this.value=keyPath
    },
    handleClick(){
      const currTabPane = this.currTabPane
      if (currTabPane == '1') {
        this.value='1'
      } else if (currTabPane == '2') {
        this.value='2'
      } else if (currTabPane == '3') {
        this.value='3'
        this.$nextTick(function(){
          //  this.$refs.add.init()
           console.log(this.$refs.add)
        })
      } else {
        console.warn('标签页不存在')
      }
    },
  }
}
</script>
<style scoped >
  .row-style {
  margin: 0px;
  width: 100%;
  height: 100%;
  }
  
</style>