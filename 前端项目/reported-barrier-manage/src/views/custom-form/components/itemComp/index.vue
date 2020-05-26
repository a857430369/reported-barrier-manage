<template>
  <div>
    <item1 :data="data"></item1>
    <item2 :data="data"></item2>
    <item3 :data="data"></item3>
    <el-input v-model="data" placeholder=""></el-input>
  </div>
</template>

<script>
import item1 from './item1'
import item2 from './item2'
import item3 from './item3'

export default {
  components: {
    item1,
    item2,
    item3
  },
  data() {
    return {
      data: ''
    }
  }
}
</script>

<style scoped>

</style>
