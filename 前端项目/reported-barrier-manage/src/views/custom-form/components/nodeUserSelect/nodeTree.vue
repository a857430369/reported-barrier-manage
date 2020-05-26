<template>
  <div class="orgClass">
    <el-input v-if="isShowSearch"
              placeholder="输入关键字进行过滤"
              prefix-icon="el-icon-search"
              v-model="filterText"
              size="small"
              class="filterSearch-input">
    </el-input>

    <el-tree class="orgTree overScroll"
             :data="nodeTreeData"
             default-expand-all
             :show-checkbox="showCheckBox"
             :expand-on-click-node="expandClickNode"
             :props="defaultProps"
             @node-click="nodeClick"
             node-key="id"
             :filter-node-method="filterNode"
             ref="orgTree">
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTest: true,
      filterText: "",
      defaultProps: {
        children: "children",
        label: "nodeName"
      },
      nodeTreeData: [],
      expandClickNode: false,
      chooseOrgTree: ""
    };
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    }
  },
  props: {
    modelCode: {
      type: String,
      required: true
    },
    formCode: Number,
    height: {
      type: Number
    },
    value: {
      type: String
    },
    showCheckBox: {
      type: Boolean,
      default: false
    },
    orgClass: {
      type: String,
      default: "plant_001"
    },
    isShowSearch: {
      type: Boolean,
      default: true
    },
    planType: {
      type: Number,
      required: true
    },
    isAuthorize: {
      type: Number,
      default: 0
    }    
  },
  computed: {},
  mounted() {
    if (this.value === "") {
      this.chooseOrgTree = "";
    }
    this.listOrgs();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.nodeName.indexOf(value) !== -1;
    },
    listOrgs() {
      let params = {
        formCode: this.formCode,
        planType: this.planType,
        modelCode: this.modelCode,
        isAuthorize: this.isAuthorize,
        operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode
      };

     if (this.nodeTreeData.length == 0) {
        this.$api.people.listNeedTreeByModelCode(params).then(res => {

          if (res.content && res.content.length > 0) {

              if (res.content[0].isHightNode) {
                this.$emit('isHightNode')
              } else {
                this.nodeTreeData = res.content;
                this.$emit('getNodeData', this.nodeTreeData)
                this.$emit("handleNodeClick", this.nodeTreeData[0])
              }
          } else {
            this.$emit('isHightNode')
          }
        })
      } else {
        this.$emit('getNodeData', this.nodeTreeData)
        this.$emit("handleNodeClick", this.nodeTreeData[0]);
      }
    },
    // 点击机构节点
    nodeClick(data, node, el) {
      this.$emit("handleNodeClick", data);
    }
  }
};
</script>
<style lang="scss">
.filterSearch-input .el-input__inner {
  border-radius: 16px;
}
</style>

<style lang="scss" scoped>
.orgClass {
  height: 100%;
  padding-top: 15px;
}

.filterSearch-input {
  margin: 15px;
  width: auto;
  display: block;
  margin-top: 0;
}

.orgTree {
  height: 87%;
  overflow: auto;
}
</style>

<style lang="scss">
// .orgTree {
//   .el-tree-node {
//     background-color: skyblue;
//     color: #fff;
//   }
// }
</style>
