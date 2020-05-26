<template>
  <div class="wrap">
    <el-row :gutter="10">
      <el-col :span="7">
        <div class="norRect"
             style="height: 400px;border-radius: 4px;border: 1px solid #EBEEF5;">
          <div class="norTit norTitBg">
            <span>选择机构</span>
          </div>
          <div class="orgTreeBox overScroll">
            <org-tree @handleOrgNodeClick="listPerson"
                      :orgClass="orgClass"></org-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="el-transfer fs-transfer">
          <list-panel title="人员列表"
                      filterable
                      :props="props"
                      :isFar="true"
                      class="my-transfer"
                      :onlyResult="onlyResult"
                      @getSearchList="getSearchList"
                      :listPersonLoading="listPersonLoading"
                      @checked-change="onSourceCheckedChange"
                      :orgClass="orgClass"
                      :parent="'personSelect'"
                      :data="userData"
                      ref="schild"></list-panel>
        </div>
      </el-col>
      <el-col :span="3">
        <div class="el-transfer__buttons">
          <el-button type="primary"
                     class="el-transfer__button is-with-texts"
                     :disabled="rightChecked.length === 0"
                     @click.native="deleteTargetCheckedDatas">
            <span v-if="buttonTexts[0] !== undefined">{{
              buttonTexts[0]
            }}</span>
          </el-button>
          <el-button type="primary"
                     class="el-transfer__button is-with-texts"
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
                      :isFar="false"
                      :orgClass="orgClass"
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
import ListPanel from "./ListPanel";
import OrgTree from "./OrgTree";

export default {
  data() {
    return {
      leftChecked: [],
      rightChecked: [],
      sta: this.statu,
      listPersonLoading: false,
      buttonTexts: ["删除", " 〉〉"],
      props: {
        key: "operCode",
        label: "userName"
      },
      userData: [],
      filterData: []
    };
  },
  props: {
    onlyResult: {
      type: Boolean,
      default: false
    },
    orgClass: {
      type: String,
      default: "plant_001"
    },
    // 用户全部信息
    defaultSelectData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    defaultSelectDataKeys() {
      return this.defaultSelectData.map(item => item[this.props.key]);
    }
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
    getSearchList(list) {
      this.filterData = list
    },
    // 得到左边选中的数组
    onSourceCheckedChange(allCheckedKeys, CheckedChangeKeys) {
      this.leftChecked = allCheckedKeys;
    },
    // 得到右边选中的数组
    onTargetCheckedChange(allCheckedKeys, CheckedChangeKeys) {
      this.rightChecked = allCheckedKeys;
    },
    deleteTargetCheckedDatas() {
      for (let i = 0; i < this.defaultSelectData.length; i++) {
        const item = this.defaultSelectData[i];
        const key = item[this.props.key];
        if (this.rightChecked.indexOf(key) > -1) {
          this.defaultSelectData.splice(i, 1);
          i--;
        }
      }
      this.$emit("selectPerson", this.defaultSelectDataKeys, this.defaultSelectData);
    },
    addToRight() {

      // this.leftChecked code的数组
      if (this.onlyResult) {
        if (this.leftChecked.length > 0) {
          this.defaultSelectData.splice(0, this.defaultSelectData.length)
          this.defaultSelectData.push(this.searchData(this.leftChecked[0]))
        } else {
          return
        }
      } else {
        this.leftChecked.forEach(itemKey => {
          let data = this.searchData(itemKey);
          if (this.defaultSelectDataKeys.indexOf(itemKey) === -1) {
            this.defaultSelectData.push(data);
          }
        });
      }
      this.$emit("selectPerson", this.defaultSelectDataKeys, this.defaultSelectData);
    },
    searchData(itemKey) {
      for (let i = 0; i < this.filterData.length; i++) {
        if (this.filterData[i][this.props.key] === itemKey) {
          return this.filterData[i];
        }
      }
    },
    listPerson(orgNodeData) {
      let params = {
        orgClass: this.orgClass,
        orgCode: orgNodeData.orgCode
      };
      this.listPersonLoading = true
      this.$refs['schild'].setLoading(true)
      this.$api.people
        .findOperator(params)
        .then(res => {
          this.$refs['schild'].setLoading(false)

          this.userData = res.content;
          this.filterData = this.userData;
        })
        .catch(error => {
          this.$refs['schild'].setLoading(false)
          this.$message.error("机构人员查询错误" + error);
          console.error(error);
        });
    }
  },
  components: {
    OrgTree,
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
  overflow-y: auto;
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
