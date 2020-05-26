<template>
  <div>
    <div class="org-container">
      <p class="title">
        支撑机构树
      </p>
      <div class="org-box">
        <el-input
          class="filter-text"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          prefix-icon="el-icon-search"
        >
        </el-input>
        <div class="org-content">
          <el-tree
            class="filter-tree"
            :data="orgTree"
            node-key="orgCode"
            :props="orgTreeProps"
            default-expand-all
            highlight-current
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="orgTree"
          >
          </el-tree>
        </div>
      </div>
    </div>

    <div class="user-container">
      <div class="user-selected">
        <p class="title">
          选中的用户
        </p>
        <div>
          <span style="margin-left:22px" v-if="selectedUser.userCode">{{
            `${selectedUser.orgName}-${selectedUser.userName}`
          }}</span>
        </div>
      </div>

      <div class="user-list">
        <p class="title">
          用户列表
        </p>
        <div class="user-list-radio">
          <el-tree
            :data="userList"
            show-checkbox
            node-key="userCode"
            :props="userProps"
            @check-change="handleCheckChange"
            ref="userTree"
          >
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterText: '',
      orgTree: [], //机构树
      orgTreeProps: {
        children: 'children',
        label: 'orgName',
      },
      userList: [],
      userProps: {
        label: 'userName',
      },
      currOrg: undefined, //当前机构
      currUser: undefined, //当前用户
      selectedUser: {
        orgName: '',
        orgCode: '',
        userName: '',
        userCode: '',
      },
    }
  },
  mounted() {},
  created() {
    this.getOrgTree()
  },
  watch: {
    filterText(val) {
      this.$refs.orgTree.filter(val)
    },
  },
  methods: {
    //机构树节点
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    //点击节点
    handleNodeClick(data) {
      const children = data.children
      // if (children.length == 0) {
      const _this = this
      _this.currOrg = data
      _this.getOnLineUser(data.orgCode)
      // }
    },
    //用户节点发生变化
    handleCheckChange(data, checked, indeterminate) {
      const _this = this
      if (checked) {
        _this.selectedUser = {
          orgCode: _this.currOrg.orgCode,
          orgName: _this.currOrg.orgName,
          userCode: data.userCode,
          userName: data.userName,
        }
        //设置选中状态
        _this.setCheckedKeys(data.userCode)
        _this.transferData()
      }
    },
    //传递数据
    transferData() {
      const _this = this
      _this.$emit('selectedUser', _this.selectedUser)
    },
    //设置选中状态
    setCheckedKeys(userCode) {
      this.$refs.userTree.setCheckedKeys([userCode])
    },
    //清空用户节点
    resetChecked() {
      this.$refs.userTree.setCheckedKeys([])
    },
    //查询机构树
    getOrgTree() {
      const _this = this
      this.$api.record
        .getOrgTree()
        .then((res) => {
          _this.orgTree = res.content
        })
        .catch((error) => {})
    },
    //根据机构查询用户
    getOnLineUser(orgCode) {
      const _this = this
      const params = { orgCode: orgCode }
      this.$api.record
        .getOnLineUser(params)
        .then((res) => {
          _this.userList = res.content
        })
        .catch((error) => {})
    },
  },
}
</script>
<style>
.org-container input.el-input__inner {
  height: 32px;
  width: 100%;
  font-size: 12px;
  display: inline-block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 16px;
  padding-right: 10px;
  padding-left: 30px;
}

.org-container .el-input__icon {
  line-height: 33px;
}
</style>

<style scoped>
.title {
  text-align: center;
  border-bottom: 1px solid #dcdfe6;
  background-color: #0ba5ff;
  color: #fff;
  font-size: 14px;
  line-height: 40px;
}
.org-container {
  height: 500px;
  width: 59%;
  float: left;
  display: block;
  resize: vertical;
  line-height: 1.5;
  box-sizing: border-box;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.org-box {
  padding: 5px 15px;
}
.user-container {
  height: 500px;
  width: 39%;
  margin-left: 5px;
  float: left;
}
.org-content {
  height: 390px;
  width: 100%;
  overflow-x: hidden;
}
.user-container .user-selected {
  height: 247px;
  width: 100%;
  display: block;
  resize: vertical;
  line-height: 1.5;
  box-sizing: border-box;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.user-container .user-list {
  height: 247px;
  width: 100%;
  margin-top: 6px;
  display: block;
  resize: vertical;
  line-height: 1.5;
  box-sizing: border-box;
  font-size: inherit;
  color: #606266;
  background-color: #fff;
  background-image: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.user-list-radio {
  height: 180px;
  width: 100%;
  margin-top: 6px;
  overflow-x: hidden;
}
/* 滚动条的宽度 */
.org-container ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/* 滚动条的滑块 */
.org-container ::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}
</style>
