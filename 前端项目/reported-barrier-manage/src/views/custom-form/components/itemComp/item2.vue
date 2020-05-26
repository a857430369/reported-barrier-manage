<template>
  <h1>item2</h1>
</template>

<script>
export default {
  props: {
    data: String
  },  
  data() {
    return {}
  },
  watch: {
    data(newV) {
      console.log("item2", newV)
    }
  },
  methods: {
    call() {
      console.log("item2")
    }
  }  
}
</script>

<style scoped>

</style>
