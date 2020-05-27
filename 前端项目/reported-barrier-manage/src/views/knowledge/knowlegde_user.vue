<template>
<div style="height: 937px;width: 100%; background-color: #f2f3f5">
  <div class="know_user" >
    <div style="margin-bottom: 20px; display: flex;">
      <el-input v-model="form.noticeName"></el-input>
      <transition name="el-zoom-in-center">
        <el-button style="margin-left: 10px" v-if="tabActive" type="primary" icon="el-icon-search" @click="onSearch(1)">搜索</el-button>
      </transition>
      <el-button style="margin-left: 10px" type="primary" icon="el-icon-search" @click="onSearch(2)">全站搜索</el-button>
    </div>
    <div style="display: flex">

      <div>
        <el-button type="text" class="index_style_set" :style="{color : tabActive?'black':'#3a8ee6'}" @click="BackIndex">主页</el-button>
      </div>

      <el-tabs v-model="tabData" type="card" @tab-click="handleClick"  class="width_tab" :class="tabActive?'funtion_content_tab_active':'funtion_content_tab'">

        <el-tab-pane 
        v-for="(item, index) in knowTree"
        :key="index">

          <el-popover
            slot="label"
            placement="bottom"
            trigger="click">
            <span slot="reference">{{item.knowledgeName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
              
              <el-cascader-panel
                v-model="value[index]"
                class="knowCascaderChose"
                @change="handleChangeCas"
                :props="{ checkStrictly: true, expandTrigger: 'hover', label: 'knowledgeName', value: 'knowledgeCode' }"
                :options="getArr(item)">
                <template slot-scope="{ node, data }">
                  <span>{{ data.knowledgeName }}</span>
                </template>
              </el-cascader-panel>

          </el-popover>

          
        </el-tab-pane>
      </el-tabs>
    </div>
    
     
     <div v-if="!isShow" style="height: 90%;overflow: scroll">
       <div class="content" v-for="(item, index) in knowContent" :key="index" v-loading="loading">
          <div class="content_text">
            <el-link :underline="false" @click="getContentNotice(item)" class="title">{{item.noticeName}}</el-link>
            <p style="font-size: 14px; margin-top: 10px">{{getStr(item.noticeContent)}}</p>
            <div class="content_footer">
              <div style="text-align: left;width: 100%;">
              <p>
                类别:{{getName(item.knowledgeCode)}}
              </p>
              <p>
                作者:{{item.userName}}
              </p>
            </div>
            <div class="time_content">
              <i class="el-icon-time">
                {{item.createDt}}
              </i>
            </div>
            </div>
            <el-divider style="margin: 0px"></el-divider>
          </div>
          
        </div>
     </div >

     <!-- <div v-if="!isShow">
       <el-pagination
        v-if="allChose"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000">
      </el-pagination> -->
     <!-- </div> -->

    <div v-else>
      <knowContentuser
      :notice="getNotice">

      </knowContentuser>
    </div>
    

  </div>
  
  
</div>
  
</template>

<script>
import knowContentuser from "../../components/knowledge/knowContent-user"


export default {

  data() {
    return {
      tabActive: false,
      loading: true,
      tabData: '',
      value: {},
      knowContent: [],
      knowData: [],
      knowTree: [],
      form:{
        knowledgeCode: '',
        noticeName: ''
      },
      onSearchFlag: 1,
      isShow: false,
      getNotice: {}
      
    }
  },

  components:{
    knowContentuser
  },

  mounted() {
    this.getIndexContent(this.form)
    this.getTreeKnow()
    this.getAllKnow()
  },

  methods: {
    test() {
      console.log('我被赋予技能了')
    },

    // 前50个字
    getStr(html) {
      // html =  "<div style='margin-top: 20px; text-align: justify; color: #333333; font-family: 'Microsoft YaHei'; font-size: 24.96px; background-color: #f8f8f8;'>这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。 培根说过一句富有哲理的话，深窥自己的心，而后发觉一切的奇迹在你自己。带着这句话，我们还要更加慎重的审视这个问题： 既然如此， 就我个人来说，疫情防护对我的意义，不能不说非常重大。 这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。 黑格尔在不经意间这样说过，只有永远躺在泥坑里的人，才不会再掉进坑里。这不禁令我深思。 在这种困难的抉择下，本人思来想去，寝食难安。 总结的来说， 笛卡儿曾经说过，读一切好书，就是和许多高尚的人谈话。这不禁令我深思。 在这种困难的抉择下，本人思来想去，寝食难安。</div><div style='margin-top: 20px; text-align: justify; color: #333333; font-family: 'Microsoft YaHei'; font-size: 24.96px; background-color: #f8f8f8;'>　　而这些并不是完全重要，更加重要的问题是， 一般来讲，我们都必须务必慎重的考虑考虑。 吉姆&middot;罗恩曾经说过，要么你主宰生活，要么你被生活主宰。这似乎解答了我的疑惑。 总结的来说， 我们一般认为，抓住了问题的关键，其他一切则会迎刃而解。 迈克尔&middot;F&middot;斯特利说过一句富有哲理的话，最具挑战性的挑战莫过于提升自我。这句话语虽然很短，但令我浮想联翩。 我们不得不面对一个非常尴尬的事实，那就是， 疫情防护，发生了会如何，不发生又会如何。 那么， 吉格&middot;金克拉在不经意间这样说过，如果你能做梦，你就能实现它。这似乎解答了我的疑惑。 疫情防护因何而发生？ 我们一般认为，抓住了问题的关键，其他一切则会迎刃而解。 现在，解决疫情防护的问题，是非常非常重要的。 所以， 一般来讲，我们都必须务必慎重的考虑考虑。 既然如何， 疫情防护，到底应该如何实现。 总结的来说， 可是，即使是这样，疫情防护的出现仍然代表了一定的意义。 俾斯麦在不经意间这样说过，失败是坚忍的最后考验。带着这句话，我们还要更加慎重的审视这个问题： 本人也是经过了深思熟虑，在每个日日夜夜思考这个问题。 马克思在不经意间这样说过，一切节省，归根到底都归结为时间的节省。这启发了我， 了解清楚疫情防护到底是一种怎么样的存在，是解决一切问题的关键。 培根在不经意间这样说过，合理安排时间，就等于节约时间。这句话语虽然很短，但令我浮想联翩。 经过上述讨论， 我们都知道，只要有意义，那么就必须慎重考虑。 拿破仑&middot;希尔曾经提到过，不要等待，时机永远不会恰到好处。这似乎解答了我的疑惑。 总结的来说。</div><div style='margin-top: 20px; text-align: justify; color: #333333; font-family: 'Microsoft YaHei'; font-size: 24.96px; background-color: #f8f8f8;'>　　可是，即使是这样，疫情防护的出现仍然代表了一定的意义。 从这个角度来看， 疫情防护，发生了会如何，不发生又会如何。 从这个角度来看， 一般来讲，我们都必须务必慎重的考虑考虑。 带着这些问题，我们来审视一下疫情防护。 杰纳勒尔&middot;乔治&middot;S&middot;巴顿说过一句富有哲理的话，接受挑战，就可以享受胜利的喜悦。带着这句话，我们还要更加慎重的审视这个问题： 经过上述讨论， 疫情防护的发生，到底需要如何做到，不疫情防护的发生，又会如何产生。 歌德曾经提到过，没有人事先了解自己到底有多大的力量，直到他试过以后才知道。这句话语虽然很短，但令我浮想联翩。 疫情防护的发生，到底需要如何做到，不疫情防护的发生，又会如何产生。 我们不得不面对一个非常尴尬的事实，那就是， 总结的来说， 这种事实对本人来说意义重大，相信对这个世界也是有一定意义的。 培根在不经意间这样说过，要知道对好事的称颂过于夸大，也会招来人们的反感轻蔑和嫉妒。我希望诸位也能好好地体会这句话。 既然如此， 现在，解决疫情防护的问题，是非常非常重要的。 所以， 富勒说过一句富有哲理的话，苦难磨炼一些人，也毁灭另一些人。这不禁令我深思。 我们一般认为，抓住了问题的关键，其他一切则会迎刃而解。 对我个人而言，疫情防护不仅仅是一个重大的事件，还可能会改变我的人生。 经过上述讨论， 生活中，若疫情防护出现了，我们就不得不考虑它出现了的事实。 我们都知道，只要有意义，那么就必须慎重考虑。 这样看来， 每个人都不得不面对这些问题。 在面对这种问题时， 要想清楚，疫情防护，到底是一种怎么样的存在。 我们不得不面对一个非常尴尬的事实，那就是， 既然如此。</div><div style='margin-top: 20px; text-align: justify; color: #333333; font-family: 'Microsoft YaHei'; font-size: 24.96px; background-color: #f8f8f8;'>　　现在，解决疫情防护的问题，是非常非常重要的。 所以， 一般来说， 了解清楚疫情防护到底是一种怎么样的存在，是解决一切问题的关键。 疫情防护的发生，到底需要如何做到，不疫情防护的发生，又会如何产生。 要想清楚，疫情防护，到底是一种怎么样的存在。 既然如此， 总结的来说， 疫情防护，发生了会如何，不发生又会如何。 这样看来， 从这个角度来看， 吉格&middot;金克拉在不经意间这样说过，如果你能做梦，你就能实现它。这不禁令我深思。 疫情防护，发生了会如何，不发生又会如何。 就我个人来说，疫情防护对我的意义，不能不说非常重大。</div>"
      html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n').replace(/<br\/?>/gi, '\n')
            .replace(/<[^>/]+>/g, '').replace(/(\n)?<\/([^>]+)>/g, '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ')
            .replace(/<img[^>]+src\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>/g, '')
            .replace('&middot', '');
      return html = html.slice(0, 200)
    },

    // 主页
    BackIndex() {
      this.isShow = false
      this.tabActive = false
      this.form={
        knowledgeCode: '',
        noticeName: ''
      }
      this.getIndexContent(this.form)
      this.getAllKnow()
    },

    // 获取详情页
    getContentNotice(item) {
      this.isShow = true
      this.getNotice = item
    },

    // 搜索
    // 1为当前页
    // 2为全站
    onSearch(val) {
      this.isShow = false
      if(val === 1){
        this.onSearchFlag = 1
        this.getIndexContent(this.form)
      }else{
        this.onSearchFlag = 2
        this.form.knowledgeCode = ''
        this.getIndexContent(this.form)
      }
      
    },

    // 转变数组
    getArr(item) {
      let arr = [item]
      return arr
    },

    // 主页获取名字
    getName(code) {
      let getIndex = 0
      var get = this.knowData.some((item, index) => {
        if(item.knowledgeCode === code) {
          getIndex = index
        }
      })
      // console.log(getIndex,code,'这是什么')
      return this.knowData[getIndex].knowledgeName
    },

    // 获取树形结构
    async getTreeKnow(){
      await this.$api.knowUser.findAll().then((res) => {
        if(res) {
          this.loading = false
          if(res.code === 0) {
            this.knowTree = res.content

            for (let n = 0; n < this.knowTree.length; n++) {
              this.value[n] = [this.knowTree[n].knowledgeCode]
            }
          }
        }
      })
    },
 
    // 获取所有知识类
    async getAllKnow(){
      await this.$api.knowUser.findAllTable().then((res) => {
        if(res){
          this.loading = false
          if(res.code === 0) {
            this.knowData = res.content
          }
        }
      })
    },

    // 主页获取内容
    getIndexContent(form) {

      this.$api.knowUser.findKnowledgeByNoticeName(form).then((res) => {
        if(res) {
          this.loading = false
          if(res.code === 0) {
            this.knowContent = res.content
            if(this.onSearchFlag === 1){
              this.form.noticeName = ''
            }else{
              this.form = {
                knowledgeCode: '',
                noticeName: ''
              }
            }
            
          }
        }else{
          this.loading = true
        }
      })
    },

    handleChange(value) {
      
      
    },
    
    handleChangeCas(val) {
      console.log(val)
      let getIndex = 0
      this.form.knowledgeCode = val[val.length -1]
      this.knowTree.some((item, index) => {
        if(item.knowledgeCode === val[0]){
          getIndex = index
        }
      })
      this.getIndexContent(this.form)
    },
    
    handleClick(item) {
      this.isShow = false
      this.tabActive = true
      this.form.knowledgeCode = this.knowTree[item.index].knowledgeCode
      this.value[item.index] = [this.knowTree[item.index].knowledgeCode]
      this.getIndexContent(this.form)

    },

    // 分页功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    
  }
}
</script>

<style scoped>
.know_user{
  width: 1200px;
  height: 100%;
  margin: 0px auto;
  padding: 30px;
}
.content{
  display: flex;
}
.content_text{
  margin: 10px;
  width: 100%;
}
.title{
  color: black;
  font-size: 2em;
}
.content_footer{
  width: 100%;
  margin-top: 4%;
  display: flex;
}
.time_content{
  text-align: right;
  width: 100%;
  margin: 1%;
}
.width_tab{
  width: 95%
}
.index_style_set{
  margin: 2px;
  width: 54px
}
</style>
<style>
.funtion_content_tab_active .el-tabs__item.is-active {
    color:#3a8ee6;
    border-bottom-color:#f2f3f5!important;
}
.funtion_content_tab .el-tabs__item.is-active {
    color:#303133;
    border-bottom-color:#e4e7ed!important;
}
.knowCascaderChose .el-radio {
  width: 100%!important;
  height: 100%!important;
  z-index: 10!important;
  position: absolute!important;
  top: 10px!important;
  right: 10px!important;
}
.knowCascaderChose.is-bordered{
  border: 1px solid #ffffff;
}

.knowCascaderChose .el-radio__input {
  visibility: hidden!important;
}
  /* 这个样式针对IE有用，不考虑IE的可以不用管*/
.knowCascaderChose .el-cascader-node__postfix {
  top: 10px!important;
} 
.content_text .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 7px 0;
}
.knowCascaderChose .el-cascader-menu {
    min-width: auto;
    box-sizing: border-box;
    color: #606266;
}

</style>