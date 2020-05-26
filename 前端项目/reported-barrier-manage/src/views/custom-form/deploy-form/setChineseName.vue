<template>
  <div>
    <el-table :data="data"
              row-class-name="table-custom"
              header-row-class-name="table-custom"
              border
              style="width: 100%;margin: 10px 0">
      <el-table-column prop="name"
                       label="原字段名">
        <template :slot-scope="name">
          <!-- <el-input v-model="name" placeholder="" size="small"></el-input> -->
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="显示字段名">
        <template :slot-scope="name">
          <!-- <el-input v-model="name" placeholder=""  size="small"></el-input> -->
        </template>                       
      </el-table-column>

      <el-table-column label="操作"
                       width="100px">
        <template slot-scope="item">
          <el-button type="success"
                     @click="delFileCode(item.row)"
                     size="mini">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <i class="el-icon-circle-plus-outline" @click="writeForm('add')"></i>
  </div>

</template>

<script>
export default {
  data() {
    return {
      data: [
        {name: 123},
      ]
    }
  },
  methods: {
    writeForm(type) {
      if (type == 'add') {}
      else {}
      this.writeFormDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
i {
  margin: 10px;
  color: #bfbfbf;
  font-size: 40px;
  text-shadow: 0.2px 0.4px 1px rgba(0,0,0,0.7);  
}
i:hover {
  cursor: pointer;
  color: #8a8a8a;
}

</style>
