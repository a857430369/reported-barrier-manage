<template>
  <verify-comp :viewListProp="viewList"
               background="#f7f7f7"
               @setViewList="setViewList"
               @getVerifyReply="getVerifyReply"></verify-comp>
</template>

<script>
import verifyComp from './verifyComponent'

export default {
  components: {
    verifyComp
  },
  data() {
    return {
      viewList: [],
    }
  },
  methods: {
    getVerifyReply(data) {
      this.$emit('getVerifyReply', data)
    },
    setViewList(viewList) {
      let list = this.viewList.map(item => {
        return item.content
      })

      let params = {
        operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode,
        languages: list
      }

      this.$api.deploy.updateCommonLanguage(params).then(res => {
        if (res.code != 0) {
          this.$message.error('修改错误')
        }
      })
    }
  },
  async created() {
    let params = {
      operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode
    }
    await this.$api.deploy.listCommonLanguage(params).then(res => {
      if (res.content) {
       this.viewList = res.content
      }
    })
  }
}
</script>
