<template>
  <div class="total-contain"
       v-loading="loading">
    <div class="main-contain">
      <nodeUserSelect @selectPerson="selectPerson"
                      @getNodeData="getNodeData"
                      @getResultList="getResultList"
                      @isHightNode="isHightNode"
                      :modelCode="modelCode"
                      :planType="planType"
                      :orgClass="orgClass"
                      ref="childBlack"></nodeUserSelect>
    </div>
    <div class="footer-contain">
      <el-button type="primary"
                 :loading="disabled"
                 :disabled="disabled"
                 class="footer-button"
                 @click="onSumit">保存</el-button>
      <el-button type="success"
                 class="footer-button"
                 @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import nodeUserSelect from "../components/nodeUserSelect/PersonSelect";

export default {
  components: {
    nodeUserSelect
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    planType: {
      type: Number,
      required: true
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
      required: true
    }
  },
  data() {
    return {
      loading: false,
      userList: [],
      resultList: [],
      userCodeList: [],
      alrNodeListList: []
    };
  },
  methods: {
    isHightNode() {
      this.$emit('isHightNode')
    },
    checkNode() {
      // 严谨型
      if (this.planType == '1') {
      // // 严谨型
        let arr = [...this.alrNodeListList]
        let indexList = []
        arr.map((item,index) => {
          this.resultList.map(items => {
            if (item.level == items.codeLevel && !indexList.includes(items.codeLevel)) {
              indexList.push(items.codeLevel)
            }
          })
        })
        let data = arr.filter(item => {
            return !indexList.includes(item.level)
        })

        if (data.length > 0) {
          this.$message.error(`\"${data[0].nodeName}\"级别的人员不能为空`)

          return false
        }

      } else {
        // 松散型
        if (this.resultList.length == 0) {
          this.$message.error('最顶级人员不能为空')
          return false          
        }

      }
      return true
    },
    // 得到返回结果
    getResultList(resultList) {
      this.resultList = resultList
    },
    // 将节点存储起来
    getNodeData(nodeData) {
      this.alrNodeListList = this.getNodeGrade(nodeData, [], [])
    },
    getNodeGrade(nodeData, arr, list) {
      if (nodeData && nodeData.length > 0) {
        let item = nodeData[0]
        if (!list.includes(item.codeLevel)) {
          arr.push({
            level: item.codeLevel,
            nodeName: item.nodeName
          })
          list.push(item.codeLevel)
        }

        this.getNodeGrade(item.children, arr, list)

      } else {
        return
      }
      return arr
    },
    selectPerson(userCodeList) {
      this.userCodeList = userCodeList;
    },
    cancel() {
      this.$emit("onCancel");
    },
    selectPerson (userCodeList) {
      this.userCodeList = userCodeList;
    },
    onSumit () {
      let params = { nodeCode: this.nodeCode, userCodeList: this.userCodeList };

      if (this.checkNode()) {
        this.$emit('getPlanAccData', this.resultList)
      }
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
        let params = {
          nodeCode: this.nodeCode
        };
        this.loading = true
        this.$api.people
          .listNodeAccUser(params)
          .then(res => {
            this.loading = false

            if (res.code == 0) {
              this.userList = res.content;
            } else {
              this.$message.error("查询已选人员错误");
            }
          })
          .catch(error => {
            this.loading = false
            console.log(error);
          });
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
