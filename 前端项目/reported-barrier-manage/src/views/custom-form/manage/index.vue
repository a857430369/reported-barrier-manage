<template>
  <el-tabs class="layout-content"
           v-model="comName"
           @tab-click="handleClick">
    <el-tab-pane label="模板管理"
                 name="deployManage"></el-tab-pane>
    <el-tab-pane label="表单管理"
                 name="queryManage"></el-tab-pane>

    <component :is="comName"></component>

  </el-tabs>
</template>
<script>
import deployManage from './deployManage'
import queryManage from './queryManage'

  export default {
    components: {
      deployManage,
      queryManage
    },
    data() {
      return {
        comName: 'deployManage'
      };
    },
    methods: {
      handleClick(tab, event) {
      }
    },
    watch: {}
  };
</script>

<style lang="scss" scoped>
.layout-content {
  overflow: hidden;
  width: 95%;
  margin: 0 auto;
  padding-top: 10px;
}
</style>
