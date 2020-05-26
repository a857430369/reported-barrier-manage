<template>
  <router-view />
</template>

<script>
export default {
  methods: {
    setDownKFData() {
      let param = {
        userCode: this.$store.state.user.operCode,
      }
      this.$api.kfRemote.setDownKFData(param).then((res) => {
        // 客服下线
        if (res.data && res.data && res.data.code == 0) {
          this.delIframe()
        } else {
          this.$message.error('客服退出失败')
        }
      })
    },
  },
  beforeCreate() {
    if (!this.$store.state.user.isTest) {
      let userData = {
        roleCode: this.$storage.getSession('account').currRoleInfo['KFTD_BZXT']
          .roleCode,
        userName: this.$storage.getSession('account').userName,
        operCode: this.$storage.getSession('account').operCode,
        empSms: this.$storage.getSession('account').empSms,
      }
      this.$store.commit('setUser', userData)
    }
  },
  beforeDestroy() {
    // 页面销毁，客服设置为下班
    this.setDownKFData()
  },
}
</script>
