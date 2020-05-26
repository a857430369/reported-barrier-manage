<template>
    <div  >
      <el-row :gutter="10">
      <el-col :span="7">
        <div class="norRect"
             style="height: 400px;border-radius: 4px;border: 1px solid #EBEEF5;">
          <div class="norTit norTitBg">
            <span>选择机构</span>
          </div>
          <div class="orgTreeBox overScroll">
            <div class="main-contain">
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
                  :expand-on-click-node="expandClickNode"
                  :props="defaultProps"
                  @node-click="nodeClick"
                  node-key="id"
                  :filter-node-method="filterNode"
                  ref="orgTree">
          </el-tree>
        </div>
        </div>
        </div>
        </div>
      </el-col>
      <el-col :span="17">
        <el-transfer
          style="text-align: left; display: inline-block;"
          v-model="file"
          filterable
          :titles="['人员', '已选人员']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="data">
          <span slot-scope="{ option }">{{ option.label}}</span>
        </el-transfer>
      </el-col>
      </el-row>
        <div class="footer-contain">
          <el-button class="footer-button"
                    @click="modalClose">取消</el-button>
          <el-button type="primary"
                    class="footer-button"
                    @click="submitForm"
                    :loading="loading">保存</el-button>
        </div>
      </div>
    
</template>
<script>
  export default {
    props: {
      message:{
        type: Array,
      require: true
      },
      visible: {
        type: Boolean,
        default: false,
      }
    },
    //监听器
    watch: {
      checkedGuy(newVal,oldVal) {
        if(newVal.length>oldVal.length){
          this.All = this.mergeArray(this.All,newVal)//去重
        }
        else if(newVal.length<oldVal.length){
          if(newVal.length!=0){
            let dev =this.diffArray(oldVal,newVal)//留下不同
            this.All =  this.diffArray(this.All,dev)//留下不同
          }else{
            this.All = newVal
          }
          
        }
      }
    },
    data() {
      return {
        data: [],
        file: [],
        userData:[],
        filterText: "",
        expandClickNode: false,
        defaultProps: {
        children: "children",
        label: "orgName"
        },
        orgTreeData: [],
        renderFunc(h, option) {
          return <span>{ option.key } - { option.label }</span>;
        },
        checkedGuy:[], //机构人员数组
        organization: [],
        All:[],
        //AllChioce:[],
        guy: [],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        size:"small",
        tableData: [],
        loading: false, //页面加载
        size:"small",
        isIndeterminate:false,
        checkAll:false,
      }
    },
    created() {
      //this.getAll()//查询所有用户
      this.getAllOrg()
    },
    methods:{
      filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
      },
      getAllOrg(){
        this.loading = true
      //  查询机构树
      this.$api.notice
        .findAllBZXTOrg()
        .then(res => {
          this.loading = false
          this.orgTreeData = res.content;
          // 默认点击佛山分公司
          if (this.orgTreeData.length > 0 && this.orgTreeData[0]) {
            //this.$emit("handleOrgNodeClick", this.orgTreeData[0]);
            this.nodeClick(this.orgTreeData[0])
          }
        })
        .catch(error => {
        this.loading = false
          console.error(error);
        });
      },
      //
      nodeClick(orgNodeData) {
      let params = {
        orgCode: orgNodeData.orgCode,
        userName: ''
      };
      this.orgCode=orgNodeData.orgCode
      this.$api.notice
        .findUserAndPhone(params)
        .then(res => {
          this.guy = res.content
            const generateData = _ => {
            const data = [];
            for (let i = 0; i < this.guy.length; i++) {
              data.push({
                key: this.guy[i].CODE,
                label:this.guy[i].USER_NAME,
              });
            }
            return data;
            };
            this.data=generateData()
        })
        .catch(error => {
          this.$message.error("机构人员查询错误" + error);
          console.error(error);
        });
      },
      //获取所有用户
      getAll(){
        this.All=[]
        this.$api.notice.findUserAll().then((res) => {  
            this.guy = res.content
            const generateData = _ => {
            const data = [];
            for (let i = 0; i < this.guy.length; i++) {
              data.push({
                key: this.guy[i].CODE,
                label:this.guy[i].USER_NAME,
              });
            }
            return data;
            };
            this.data=generateData()
        })
        // this.$api.notice.findUserByOrg().then((res) => {  
        //     this.guy = res.content
        // })
      },
      //去重
     mergeArray(arr1, arr2){
        for (var i = 0 ; i < arr1.length ; i ++ ){
            for(var j = 0 ; j < arr2.length ; j ++ ){
            if (arr1[i] === arr2[j]){
              arr1.splice(i,1); //利用splice函数删除元素，从第i个位置，截取长度为1的元素
            }
            }
        }
        //alert(arr1.length)
        for(var i = 0; i <arr2.length; i++){
        arr1.push(arr2[i]);
        }
        return arr1;
      },
      //留下不同
      diffArray(arr1, arr2){
        return arr1.concat(arr2).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
      },
      //新数组返回
      indexOf (val) {
      for (var i = 0; i < this.checkedGuy.length; i++) {
      if (this.checkedGuy[i] == val) return i;
      }
      return -1;
      },
      //删除人员
      remove(val){
        var index = this.indexOf(val);
          if (index > -1) {
          this.checkedGuy.splice(index, 1);
          }
          this.All =  this.diffArray(this.All,val)
      },
      //对话框页面关闭
      modalClose() {
        this.$emit('getMessage'); 
      },
      //对话框改变事件且根据用户code查询用户信息
      findUser(value){
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.guy.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.guy.length;
        // let dev = this.All
        // this.loading = true
        // this.$api.notice.findUserDet(dev).then((res) => {  
        //     this.AllChioce = res.content
        //     this.loading = false
        // })
      },
      //全选
      handleCheckAllChange(val) {
        this.checkedGuy = val ? this.guy : [];
        this.isIndeterminate = false;  
      },
      //确定
      submitForm(){
        if(this.file.length == 0){
          this.$message({message: '请选择人员！！', type: 'error'})
        }else{
          this.$confirm('确认选择这些人员吗？', '提示', {}).then(() => {
            this.editLoading = false
            let dev = this.file
            this.$api.notice.findUserDet(dev).then((res) => {  
              if (res.code == 0) {
                this.All = res.content
                this.$emit('getMessage',this.All);
                this.$emit('update:visible', false);
              }else{
                this.$message.error("保存失败");
              }
            })
          })
        }
      },
    }
  }
</script>
<style scoped lang="less">
.orgClass {
  padding-top: 15px;
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
.hide .el-upload--picture-card {
    display: none;
}
.orgTree {
  height: 87%;
  overflow: auto;
}
.filterSearch-input {
  margin: 15px;
  width: auto;
  display: block;
  margin-top: 0;
}
.filterSearch-input .el-input__inner {
  border-radius: 16px;
}
/deep/ .el-transfer-panel{
  width:300px ! important;
  height:400px ! important;
}
/deep/ .el-transfer-panel .el-transfer-panel__header {
  background: skyblue
}
/deep/ .el-transfer-buttons {
  background: skyblue
  
}
.change{
  float:left;
}
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 5px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 300px;
    margin:20px auto;
    height: 500px;
    overflow:auto;
  }
  .el-checkbox-group .el-checkbox{ 
    width: 70px;  
    }
     .footer-contain {
    display: flex;
    margin-top: 5px;
    justify-content: flex-end;
  }
</style>