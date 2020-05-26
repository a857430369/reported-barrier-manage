<template>
  <div class="total-contain"
       v-loading="mainLoading">
    <div class="main-contain">
      <userSelect :defaultSelectData="userList"
                  :onlyResult="onlyResult"
                  :orgClass="orgClass"
                  @selectPerson="selectPerson"
                  ref="childBlack"></userSelect>
    </div>
    <div class="footer-contain">
      <el-button class="footer-button"
                 @click="cancel">取消</el-button>
      <el-button type="primary"
                 class="footer-button"
                 @click="onSumit"
                 :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script>
import userSelect from "./userSelect/PersonSelect";

export default {
  components: {
    userSelect
  },
  props: {
    onlyResult: {
      type: Boolean,
      default: false
    },
    nodeCode: {
      type: String,
      default: ""
    },
    orgClass: {
      type: String,
      default: "plant_001"
    },
    modelCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      userList: [],
      userCodeList: [],
      isTrue: false,
      checkList: [],
      nameList: [],
      loading: false,
      mainLoading: false
    };
  },
  methods: {
    selectPerson(userCodeList, nameList) {
      this.userCodeList = userCodeList; // 名单code的集合
      this.nameList = nameList // 名单的集合
    },
    cancel() {
      this.$emit("onCancel");
    },
    async onSumit () {
      this.loading = true
      if (this.nameList.length == 0) {
        this.$message.error('没有选中人员')
        this.loading = false
        return
      }

      let params = { operCode: this.$store.state.user.isTest ? 
                    this.$store.state.user.operCode : 
                    this.$storage.getSession('account').operCode,
                    authorizeOperCode:this.nameList[0].operCode}

      this.$api.query.insertAuthorize(params).then(res => {
        this.loading = false
        if (res.code != 0) {
          this.$message.error('保存失败')
        } else {
          this.$message.success('保存成功')
          this.$emit('onSumitSuccess')
        }
      })
    },
    cancel () {
      this.$emit("onCancel");
    }
  },
  mounted () {
  },
  watch: {
    nodeCode: {
      handler(newVal) {
      },
      immediate: true
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.total-contain {
  width: 100%;
  padding: 3px;
  .footer-contain {
    display: flex;
    margin-top: 5px;
    justify-content: flex-end;
  }
}
</style>
