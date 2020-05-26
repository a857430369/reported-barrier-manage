<template>
  <h1>item3</h1>
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
      console.log("item3", newV)
    }
  },
  methods: {
    call() {
      console.log("item3")
    }
  }  
}
</script>

<style scoped>

</style>
