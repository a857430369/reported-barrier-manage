<template>
  <div class="dashboard-container">
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/workDesk/classify" style="margin: 20px">
        <el-button type="primary" icon="el-icon-top-left">分类管理</el-button>
      </router-link>
      <router-link to="/workDesk/parameter" style="margin: 20px">
        <el-button type="primary" icon="el-icon-top-right">参数管理</el-button>
      </router-link>
    </el-row>
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/workDesk/pendingPool" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >待处理工单池</el-button
        >
      </router-link>
      <router-link to="/workDesk/allPool" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >全部工单池</el-button
        >
      </router-link>
    </el-row>
    <!-- <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/pendingList" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >待处理列表</el-button
        >
      </router-link>
      <router-link to="/beingProcessedList" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >处理中列表</el-button
        >
      </router-link>
    </el-row> -->
    <!-- <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/processedList" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >已处理列表</el-button
        >
      </router-link>
      <router-link to="/grouping" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >分组管理</el-button
        >
      </router-link>
    </el-row> -->
    <!-- <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/user" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >用户管理</el-button
        >
      </router-link>
    </el-row> -->
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/workDesk/workorderList" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >用户下单列表</el-button
        >
      </router-link>
      <router-link to="/workDesk/employeesList" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >专员处理列表</el-button
        >
      </router-link>
    </el-row>
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/cf-classify" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >分类入口</el-button
        >
      </router-link>
      <router-link to="/workDesk" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion">工作台</el-button>
      </router-link>
    </el-row>
    <el-row type="flex" justify="center" align="middle" class="row-style">
      <router-link to="/cf-index" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion"
          >审核管理</el-button
        >
      </router-link>
      <router-link to="/test" style="margin: 20px">
        <el-button type="primary" icon="el-icon-s-promotion">测试</el-button>
      </router-link>
    </el-row>
  </div>
</template>
<style scoped>
.row-style {
  margin: 20px;
  width: 100%;
  height: 100%;
}
</style>
