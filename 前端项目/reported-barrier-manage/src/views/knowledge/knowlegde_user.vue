<template>
  <!-- <div style="height: 100%; width: 100%; background-color: #F2F6FC;"> -->
    <div class="">
      <div class="demo_head">
        <div class="demo" >
          <div class="team"
            v-for="(item, index) in getData"
            :key="index">
            <div  :class="item.isChose?'team_item_chose':'team_item'" v-for="(son,i) in item.content" :key="i" @click="changeIsChose(index, son)">
              <el-card 
                @click.native="openSon(index, i, son)"
                :shadow="son.isSonChose?'always':'hover'"
                :body-style="item.isChose?'display: flex':''"
                :class="item.isChose?'All_Style_chose':'All_Style'">
                <img :class="item.isChose?'item_img_chose':'item_img'" :src="require('@/assets/knowledge/'+getImg(i)+'.png')">
                <div class="item_text_chose">
                  <span v-if="item.isChose">{{son.knowledgeName}}</span>
                </div>
                

                <div v-if="!item.isChose" :class="!item.isChose?'item_text_chose':'item_text'">
                  <span class="item_text">{{son.knowledgeName}}</span>
                </div>
              </el-card>
            </div>      
            <transition name="el-zoom-in-top">
              <div v-if="item.isChose" class="transition-box">
                <el-card class="content_zhishi">
                <el-container style="width: 100%; height: 100%">
                  <el-aside class="tree_aside" width="220px">
                    <div>
                      <h2 style="text-align: center">
                        <span>类别名称</span>
                      </h2>
                      
                      <el-tree :data="dataTree" :props="defaultProps" :load="loadNode" lazy @node-click="getContent">
                        <span class='custom-tree-node' slot-scope="{ node, data }">
                          <span class="custom-tree-node" :title="data.knowledgeName">{{data.knowledgeName}}</span>
                        </span>
                      </el-tree>

                    </div>
                  </el-aside>
                  <el-container>

                    <el-main class="text_main">
                      <div class="header">
                        <h2><span>文章名称</span></h2>
                        <el-button @click="shouqi" type="primary" plain style="float: right" size="small">收起</el-button>
                      </div>
                      

                      <el-tabs type="card" v-if="content.length > 0">
                        <el-tab-pane
                          :key="item.noticeName"
                          v-for="(item) in content"
                          :label="item.noticeName"
                        >
                        <!-- 详情内容 -->
                        <knowContentuser
                        :content="item"
                        ></knowContentuser>

                        </el-tab-pane>
                      </el-tabs>
                      <span v-if="content.length == 0" style="margin: 0px auto; color: #909399">
                        无文章
                      </span>
                    </el-main>

                  </el-container>
                </el-container>
                </el-card>
              </div>
            </transition>
          </div>
        </div>

      </div>
    </div>
    
  <!-- </div> -->
 
  
</template>
<script>
import knowContentuser from "../../components/knowledge/knowContent-user"

// 深拷贝
import {objDeepCopy} from '@/utils/index'

export default {
  data(){
    return{
      data:[],
      dataDalei:[],
      dataTree: [],
      getImgIndex: 0,
      getData:[], // 保存数据
      zhiData: [], // 可修改数据
      dialogTableVisible: false,
      defaultProps: {
        children: 'children',
        label: 'knowledgeName'
      },
      content: []
    }
  },

  components: {
    knowContentuser,
  },
  created() {
  },
  mounted() {
    this.getDalei()
  },
  methods:{
    // 收起
    shouqi() {
      this.getData = objDeepCopy(this.zhiData)
    },
    // 获取文章
    async getContent(data) {
      await this.$api.knowManage.findKnowledgeByUser(data.knowledgeCode).then((res) => {
        this.content = res.content
      })
    },
    // 获取树结构
    openSon(index, i, son) {
      this.getData = objDeepCopy(this.zhiData)
      this.dataTree = []
      this.content = []
      let tree = []
      this.getData[index].content[i].isSonChose = true
      tree.push(son)
      this.dataTree = tree
      this.getContent(son)
    },
    // 获取大类
    async getDalei() {
      let code = 0
      await this.getDataZhiskiku(code)
      await this.getMatrix(this.dataDalei,4)
    },

    // 获取数据API
    async getDataZhiskiku(code) {
      if(code === 0) {
        await this.$api.knowManage.getDalei(code).then((res) => {
          this.dataDalei = res.content
        })
      }
      else{
        await this.$api.knowManage.getDalei(code).then((res) => {
          this.dataTree = res.content
        })
      }
    },

    // 懒加载
    loadNode(node, resolve) {
      if(node.level > 0) {
        this.$api.knowManage.getDalei(node.data.knowledgeCode).then((res)=> {
          setTimeout(() => {
            resolve(res.content);
          },100)
        })
      }else{
        resolve(this.dataTree);
      }
    },

    changeIsChose(item, son) {
      this.getData[item].isChose = true
    },

    // 数据处理
    getMatrix(arr, subArrayNum) {
      arr.forEach(item => {
        item.isSonChose = false
      })
      // 定义一个数组，长度为原数组的总长度除以subArrayNum向上取整
      var res = new Array(Math.ceil(arr.length / subArrayNum));
      // 遍历该数组
      for (let i = 0; i < res.length; i++) {
          // 令数组每一个值都为空数组，即生成二维数组
          res[i] = new Array();
          // 为二维数组数据设置为空字符串
          for (let j = 0; j < i % subArrayNum; j++) {
              res[i][j] = '';
          }
      }

      // 给二维数组添加数据
      for (let i = 0; i < arr.length; i++) {
          res[parseInt(i / subArrayNum)][i % subArrayNum] = arr[i];
      }
      res.forEach((item,index) => {
        let defaultZhi = {
          id: index,
          name: "zhishi"+index,
          isChose: false,
          isItemChose: false,
          content: item
        }
        this.zhiData.push(defaultZhi)
      })
      this.getData = objDeepCopy(this.zhiData)
    },

    // 图片处理
    getImg(i){
      var str = ['shebeiguanli','changjingguanli','daibanshixiang','fenzuguanli','fuwudiqiu','gongnengdingyi'
                  ,'hezuohuobanmiyueguanli','huowudui','icon_renwujincheng','jichuguanli','jizhanguanli','peiwangyindao'
                  ,'quanxianshenpi','xiaoxi','yingyongguanli','yunyingguanli','zhanghaoquanxianguanli','zidingyi','zuzhiqunzu']
      let img = str[i]
      return img
    }
  }
}
</script>
<style scoped>
.header{
  display: flex;
  justify-content: space-between;
}
.demo_head{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.custom-tree-node{
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 8px;
}
.team{
  width: 1300px;
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
}
.transition-box {
  margin-top: 5px;
  height: 850px;
  width: 100%;
}

.team_item{
  width: 24%;
  margin: 5px;
}
.team_item_chose{
  margin:0px 4px;
  width: 24%;
}


.All_Style{
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 10%;
  cursor:pointer;
}
.All_Style_chose{
  width: 100%;
  height: 100%;
  /* text-align: center; */
  padding-top: 5%;
  cursor:pointer;
}

.item_img{
  width: 80px;
  height: 80px;
}
.item_img_chose{
  width: 40px;
  height: 40px;
}
.item_text{
  font-size: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.item_text_chose{
  font-size: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.content_zhishi {
  width: 100%;
  height: 100%;
}
.tree_aside{
  height: 100%;
  border-right-width: 2px;
  border-right-style: solid;
  border-right-color: rgb(159, 218, 218);
}
.text_main{
  padding-left: 20px; 
  padding-top: 0px; 
}
.tree_node{
  border: 1px solid red;
}
.text{
  border: 1px solid red;
}
</style>
<style>
.content_zhishi .el-card__body{
  width: 100%;
  height: 100%;
}
</style>