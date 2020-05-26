<template>
  <div class="total-contain">
    <div class="main-contain">
      <userSelect :defaultSelectData="userList"
                  :onlyResult="onlyResult"
                  :orgClass="value"
                  @selectPerson="selectPerson"
                  ref="childBlack"></userSelect>
    </div>
    <div class="footer-contain">
      <el-button class="footer-button"
                 @click="modalClose">取消</el-button>
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
    // 是否单选
    onlyResult: {
      type: Boolean,
      default: false
    },
    nodeCode: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      userList: [],
      userCodeList: [],
      isTrue: false,
      checkList: [],
      nameList: [],
      loading: false,
      value:''
    };
  },
  methods: {
    selectPerson(userCodeList, nameList) {
      this.userCodeList = userCodeList; // 名单code的集合
      this.nameList = nameList // 名单的集合
    },
    //对话框页面关闭
    modalClose() {
      this.$emit('modalClose'); // 直接修改父组件的属性
    },
    selectPerson (userCodeList) {
      this.userCodeList = userCodeList;
    },
    async checkUser () {
      if (this.userCodeList.length == 0) {
        this.$message.error('没有选择人员')
        return
      }
      
      let params = {
        userCodeList: this.userCodeList,
        nodeCode: this.nodeCode
      }
      this.isTrue = false
      this.checkList = []
      await this.$api.deploy.checkUser(params).then(res => {
        if (res.content.userCodeList) {
          
          if (res.content.userCodeList.length == 0) {
            this.isTrue = true
          } else {
            this.isTrue = false
            this.checkList = res.content.userCodeList
          }
        } else {
          this.$message.error('系统出错')
        }
      })
    },
    onSumit () {
      this.loading = true
      if(this.userCodeList.length>0){
        this.$confirm('确认选择这些人员吗？', '提示', {}).then(() => {
          this.editLoading = false
          let dev=this.userCodeList
          this.$api.notice.findBZUserAndEMPByUserCode(dev).then((res) => {  
            if (res.code == 0) {
              this.loading = false
              this.$emit('getMessage',res.content);
              this.$emit('update:visible', false);
            }else{
                this.loading = false
                this.$message.error("保存失败");
              }
            })
        })
      }else{
        this.loading = false
        this.$message({message: '已选人员为空！！', type: 'error'})
      }
      // if (!this.isTrue) {
      //   if (this.checkList.length > 0) {
      //     let result = []
      //     this.checkList.map(item => {
      //       this.nameList.map(items => {
      //         if (item == items.operCode && !result.includes(items.userName)) {
      //           result.push(items.userName)
      //         }
      //       })
      //     })

      //     this.$message.error(result.join('，') + '有节点存在此人员')
      //   }
      //   this.loading = false
      //   return
      // }

      let params = { nodeCode: this.nodeCode, userCodeList: this.userCodeList };
      // this.$api.people
      //   .changeNodeAccList(params)
      //   .then(res => {
      //     if (res.code == 0) {
      //     this.loading = false
      //       this.$message.success("保存成功");
      //       this.cancel()
      //     } else {
      //     this.loading = false
      //       this.$message.error("保存失败");
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },
    cancel () {
      this.$emit("onCancel");
    }


  },
  mounted () {
  },
  watch: {
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.total-contain {
  width: 100%;
  // width: 80%;
  // margin: 50px;
  // border: 1px solid #00000060;
  padding: 3px;
  .footer-contain {
    display: flex;
    margin-top: 5px;
    justify-content: flex-end;
  }
}
</style>
