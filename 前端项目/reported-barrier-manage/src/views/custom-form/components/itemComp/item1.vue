<template>
  <h1>item1</h1>
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
      console.log("item1", newV)
    }
  },
  methods: {
    call() {
      console.log("item1")
    }
  }
}
</script>

<style scoped>

</style>
