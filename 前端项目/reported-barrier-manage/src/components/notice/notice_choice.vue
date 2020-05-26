<template>
    <el-row>
    <el-col :span='8'>
    <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align: center">
            <span>机构</span>
        </div>
        <div class="text item" >
          <el-tree
            :data="organization"
            node-key="id"
            ref="tree"
            accordion
            highlight-current
            @node-click='getAll'
            :props="defaultProps">
          </el-tree>
        </div>
    </el-card>
    </el-col>
    <el-col :span='8'>
    <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix" style="text-align: center">
            <span>机构人员</span>
        </div>
        <div class="text item"  style="text-align: center;">
        <el-checkbox-group v-model="checkedGuy" @change='findUser'>
          <el-row>
          <el-col>
         <el-checkbox v-for="item in guy" :label="item.CODE" :key="item.CODE">
           {{item.USER_NAME}}</el-checkbox></el-col></el-row>
        </el-checkbox-group>
        </div>
    </el-card>
    </el-col>
    <el-col :span='8'>
    <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix" style="text-align: center">
            <span>当前机构已选人员</span>
        </div>
        <div class="text item"  v-for="item in AllChioce" :label="item" :key="item.CODE">
          {{item.USER_NAME}} 
          <el-button
            type="text"
            size="mini"
            @click="() => remove(item)">
            删除
          </el-button>
        </div>
    </el-card>
    </el-col>
    </el-row>
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
          }
          
        }
      }
    },
    data() {
      return {
        checkedGuy:[], //机构人员数组
        organization: [],
        All:[],
        AllChioce:[],
        guy: [],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        size:"small",
        tableData: [],
        loading: false, //页面加载
        
      }
    },
    created() {
      this.findORGAll()//查询所有机构
    },
    methods:{
      //获取选中机构人员
      getAll(val){
      if(val.children==''||val.children==null){
        this.loading = true
        let dev = val.orgNo
        this.$api.notice.findUserByOrg(dev).then((res) => {  
            this.guy = res.content
            this.loading=false
            
        })
      }else{
        this.guy=[]
        this.loading=false
      }
      },
      //获取相同的元素
      getArrEqual(arr1, arr2) {
        let newArr = [];
        for (let i = 0; i < arr2.length; i++) {
            for (let j = 0; j < arr1.length; j++) {
                if(arr1[j].CODE === arr2[i].CODE){
                    newArr.push(arr1[j]);
                }
            }
        }
        return newArr;
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
        this.$emit('update:visible', false); // 直接修改父组件的属性
      },
      //根据用户code查询用户信息
      findUser(){
        let dev = this.All
        this.loading = true
        this.$api.notice.findUserDet(dev).then((res) => {  
            this.AllChioce = res.content
            this.loading = false
        })
      },
      //确定
      submitForm(){
        if(this.All.length == 0){
          this.$message({message: '请选择人员！！', type: 'error'})
        }else{
          this.$confirm('确认选择这些人员吗？', '提示', {}).then(() => {
            this.editLoading = false
            this.$emit('getMessage',this.AllChioce);
            this.$emit('update:visible', false);
          })
        }
      },
      //查询所有机构
      findORGAll(){
        this.All=[]
        this.$api.notice.findAllOrg().then((res) => {  
            this.organization = res.content
        })
      },
    }
  }
</script>
<style scoped>
.hide .el-upload--picture-card {
    display: none;
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
</style>