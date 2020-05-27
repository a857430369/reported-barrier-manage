<template>
  <div class="custom_style" style='margin: 20px auto;'>
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <el-tabs
        type="border-card"
        v-model="currTabPane"
        style="width: 99%; margin: 0px auto;"
        class="filter"
        @tab-click="handleSelect"
      >
        <el-tab-pane key="1">
          <span slot="label" style='color:#00BB00	'
            ><i class="el-icon-circle-plus-outline" ></i> 新增公告</span
          >
          <add ref="add"></add
        ></el-tab-pane>
        <el-tab-pane key="2">
          <span slot="label"
            ><i class="el-icon-document-copy"></i> 公告管理</span
          >
          <record  ref='children'></record
        ></el-tab-pane>
        <el-tab-pane key="3">
          <span slot="label"
            ><i class="el-icon-edit-outline"></i> 草稿箱</span
          >
          <manage ref='chlid'></manage
        ></el-tab-pane>
      </el-tabs>
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
      dataFrom: {},
      value: '',
      currTabPane: '',
    }
  },
  mounted() {},
  created() {
    //this.findAll()
  },
  components: {
    manage,
    record,
    add,
    see,
  },
  methods: {
    //导航栏事件
    handleSelect(key, keyPath) {
      if(this.currTabPane=='1'){
        this.$refs.chlid.findAll();
      }else if(this.currTabPane=='2'){
        this.$refs.children.findRecordAll();
      }
    },
    handleClick() {
      const currTabPane = this.currTabPane
      if (currTabPane == '1') {
        this.value = '1'
      } else if (currTabPane == '2') {
        this.value = '2'
      } else if (currTabPane == '3') {
        this.value = '3'
        this.$nextTick(function() {
          //  this.$refs.add.init()
          console.log(this.$refs.add)
        })
      } else {
        console.warn('标签页不存在')
      }
    },
  },
}
</script>
<style scoped lang="less">
.row-style {
  margin: 0px;
  width: 100%;
  height: 100%;
}
</style>
