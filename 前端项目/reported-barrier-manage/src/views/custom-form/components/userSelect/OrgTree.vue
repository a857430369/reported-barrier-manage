<template>
  <div class="orgClass"
       v-loading="loading">
    <el-input placeholder="输入关键字进行过滤"
              prefix-icon="el-icon-search"
              v-model="filterText"
              size="small"
              class="filterSearch-input">
    </el-input>

    <el-tree class="orgTree overScroll"
             :data="orgTreeData"
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
      filterText: "",
      defaultProps: {
        children: "children",
        label: "orgName"
      },
      orgTreeData: [],
      expandClickNode: false,
      chooseOrgTree: "",
      loading: false
    };
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val);
    }
  },
  props: {
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
      return data.orgName.indexOf(value) !== -1;
    },
    listOrgs() {
      this.loading = true
      let params = {
        orgClass: this.orgClass
      };

      //  查询机构树
      this.$api.people
        .findByOrgClass(params)
        .then(res => {

          this.loading = false
          this.orgTreeData = res.content;

          // 默认点击佛山分公司
          if (this.orgTreeData.length > 0 && this.orgTreeData[0]) {
            this.$emit("handleOrgNodeClick", this.orgTreeData[0]);
          }
        })
        .catch(error => {
        this.loading = false
          console.error(error);
        });
    },
    // 点击机构节点
    nodeClick(data, node, el) {
      this.$emit("handleOrgNodeClick", data);
      // $("#abc").css("background-color", "yellow");
      $(el).css("backgroundColor", "skyblue");
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
