<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="7">
        <div class="norRect"
             style="height: 400px;border-radius: 4px;border: 1px solid #f7f7f7;">
          <!-- style="height: 400px;border-radius: 4px;border: 1px solid #EBEEF5;"> -->
          <div class="norTit norTitBg">
            <span>选择机构</span>
          </div>
          <div class="orgTreeBox overScroll">
            <node-tree :modelCode="modelCode"
                       :planType="planType"
                       :formCode="formCode"
                       :isAuthorize="isAuthorize"
                       @isHightNode="isHightNode"
                       @handleNodeClick="listPerson"
                       @getNodeData="getNodeData"></node-tree>
          </div>
        </div>
      </el-col>

      <el-col :span="7">
        <div class="el-transfer fs-transferfs-transfer">
          <list-panel title="人员列表"
                      filterable
                      :props="props"
                      class="my-transfer"
                      :isDisable="true"
                      @checked-change="onSourceCheckedChange"
                      :parent="'personSelect'"
                      :data="userData"
                      ref="schild"></list-panel>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="el-transfer__buttons">
          <el-button type="primary"
                     class="el-transfer__button is-with-texts"
                     :disabled="leftDisable"
                     @click.native="deleteTargetCheckedDatas">
            <span v-if="buttonTexts[0] !== undefined">{{
              buttonTexts[0]
            }}</span>
          </el-button>
          <el-button type="primary"
                     class="el-transfer__button is-with-texts"
                     :disabled="rightDisable"
                     style="margin-left: 0"
                     @click.native="addToRight">
            <span v-if="buttonTexts[1] !== undefined">{{
              buttonTexts[1]
            }}</span>
          </el-button>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="el-transfer fs-transfer">
          <list-panel title="已选人员"
                      filterable
                      class="my-transfer"
                      :props="props"
                      :data="defaultSelectData"
                      @checked-change="onTargetCheckedChange"></list-panel>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { listPersionByOrg } from '@/config/getData'
import ListPanel from "./ListPanel";
import nodeTree from "./nodeTree";

export default {
  data() {
    return {
      sta: this.statu,
      buttonTexts: ["删除", " 〉〉"],
      props: {
        key: "operCode",
        label: "userName"
      },
      userData: [],
      filterData: [],
      nodeObj: {
        codeLevel: null, // 当前节点的层数
        nodeName: '',
        nodeCode: ''
      },
      resultList: [],
      // 用户全部信息
      defaultSelectData: [],
      optNodeUser: {},
      rightOptNodeUser: {},
      rightDisable: true,
      leftDisable: true,
      limitTime: ''
    };
  },
  props: {
    isAuthorize: {
      type: Number,
      default: 0
    },
    modelCode: {
      type: String,
      required: true
    },
    planType: {
      type: Number,
      required: true
    },
    formCode: Number
  },
  computed: {
    // defaultSelectDataKeys() {
    //   return this.defaultSelectData.map(item => item[this.props.key]);
    // }
  },
  watch: {
    defaultSelectData: {
      handler(newVal) {
        if (this.$refs.schild) {
          this.$refs.schild.resetCheck();
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    // 得到节点信息
    getNodeData(nodeData) {
      this.$emit('getNodeData', nodeData)
    },
    isHightNode() {
      this.$emit('isHightNode')
    },
    // 得到左边选中的数组
    onSourceCheckedChange(allCheckedData, rightDisable) {
      // this.leftChecked = allCheckedKeys;
      this.optNodeUser = allCheckedData
      this.rightDisable = rightDisable
    },
    // 得到右边选中的数组
    onTargetCheckedChange(allCheckedKeys, leftDisable) {
      this.rightOptNodeUser = allCheckedKeys
      this.leftDisable = leftDisable
    },
    deleteTargetCheckedDatas() {
      // 找出当前当前结果里面的节点
      let delIndex = -1
      this.resultList.map((item,index) => {
        if (item.nodeCode == this.nodeObj.nodeCode) {
          delIndex = index
        }
      })
      // 删除
      this.defaultSelectData = []
      this.resultList.splice(delIndex, 1)
      this.$emit('getResultList', this.resultList)

    },
    test(data) {
    },
    addToRight() {
      // this.leftChecked code的数组
      // this.leftChecked.forEach(itemKey => {
        // if (this.defaultSelectDataKeys.indexOf(itemKey) === -1) {
        //   this.defaultSelectData.push(data);
        // }



      // });
      // this.$emit("selectPerson", this.defaultSelectDataKeys);
      this.defaultSelectData = [].concat(this.optNodeUser)

      let is = true

      this.resultList = this.defaultSelectData
       this.$emit('getResultList', this.resultList)



      this.resultList = []

      this.defaultSelectData = [].concat(this.optNodeUser)


      if(this.defaultSelectData.length > 0) {

        this.resultList.push({
          limitTime: (this.limitTime == '' ? null : this.limitTime),
          nodeCode: this.nodeObj.nodeCode,
          nodeName: this.nodeObj.nodeName,
          codeLevel: this.nodeObj.codeLevel,
          userData: this.defaultSelectData,
          operType: 2
        })
      }

       this.$emit('getResultList', this.resultList)


    },
    searchData(itemKey) {
      for (let i = 0; i < this.filterData.length; i++) {
        if (this.filterData[i][this.props.key] === itemKey) {
          return this.filterData[i];
        }
      }
    },
    // 点击节点的回调函数
    listPerson(orgNodeData) {
      this.limitTime = orgNodeData.limitTime
      this.optNodeUser = {}
      this.nodeObj = {
        nodeCode: orgNodeData.code,
        nodeName: orgNodeData.nodeName,
        codeLevel: orgNodeData.codeLevel
      }

      this.$api.people.listNodeAccUser({nodeCode: orgNodeData.code}).then(res => {
        this.userData = res.content
      })
      this.defaultSelectData = []

      this.resultList.map(item => {
        if (item.nodeCode == this.nodeObj.nodeCode) {
           this.defaultSelectData = item['userData']
        }
      })
    }
  },
  components: {
    nodeTree,
    ListPanel
  }
};
</script>

<style lang="scss" scoped>
.el-transfer__buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 143px;
}

.orgTreeBox {
  height: 90%;
  background-color: #fff;
}

.norTit {
  // background-color: rgb(11, 165, 255);
  background-color: skyblue;
  color: #fff;
  line-height: 40px;
  span {
    font-size: 16px;
    margin: 21px;
    color: #303133;
    font-weight: 400;
  }
}
</style>

<style lang="scss">
.my-transfer {
  .el-transfer-panel__body {
    height: 356px;
    overflow: auto;
  }
  .el-transfer-panel__list {
    overflow: unset;
  }
}
.norRect {
  .orgTreeBox {
    .el-tree__empty-text {
      top: 7%;
    }
  }
}
</style>
