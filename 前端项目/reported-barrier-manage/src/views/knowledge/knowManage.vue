<template>
  <div class="custom_style">
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <el-tabs
        type="border-card"
        v-model="currTabPane"
        style="width: 99%; margin: 0 auto;"
        class="filter"
        @tab-click="handleSelect"
      >
        <el-tab-pane key="1">
          <span slot="label" style="color:#00BB00	"
            ><i class="el-icon-circle-plus-outline"></i> 新增知识库文章</span
          >
          <Add ref="child" @Jump="Jump"></Add
        ></el-tab-pane>
        <el-tab-pane key="3">
          <span slot="label"
            ><i class="el-icon-edit-outline"></i> 知识库分类管理</span
          >
          <Class></Class
        ></el-tab-pane>
        <!-- <el-tab-pane key="2">
          <span slot="label"
            ><i class="el-icon-document-copy"></i> 知识库分类排序</span>
          <record></record
        ></el-tab-pane> -->
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import Class from '../../components/knowledge/knowClass.vue'
import record from '../../components/notice/notice_record.vue'
import Add from '../../components/knowledge/knowAdd.vue'
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
    Class,
    record,
    Add,
  },
  methods: {
    //
    Jump() {
      this.currTabPane == '1'
    },
    //导航栏事件
    handleSelect(key, keyPath) {
      if (this.currTabPane == '0') {
        this.$refs.child.findDown()
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
