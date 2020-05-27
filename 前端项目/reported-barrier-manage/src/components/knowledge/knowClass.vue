<template>
    <div class="container">
        <el-row :gutter="10" style="margin: 0 auto;width:80%;">
            <el-col :span="8">
            <div class="norRect" style="height:700px;border-radius: 4px;border: 1px solid #EBEEF5;">
                <div class="norTit norTitBg">
                    <el-row>
                    <el-col :span='18'><span>知识库分类树</span></el-col>
                    <el-col :span='6' style='text-align: right'>
                    <!-- <el-button type='text' @click="Addend()" style="margin:0px auto;color:#0c0c0c;padding-right: 22px" >
                      <h3><i class="el-icon-circle-plus-outline"></i>新增</h3></el-button> -->
                      <el-button type='text' @click="Addend()" style="margin:0px auto;color:#0c0c0c;padding-right: 22px" >
                      <h3><i class="el-icon-circle-plus-outline"></i>新增</h3></el-button>
                    </el-col>
                    </el-row>
                </div>
                <el-card shadow="never" style="height:660px;overflow:auto;border: 0px;">
                  <!-- <el-tree
                    :data="data"
                    accordion
                    node-key="id"
                    @node-click='handClick'
                    :expand-on-click-node="false"
                    :render-content="renderContent">
                  </el-tree> -->
                   <el-tree
                    :data="data"
                    accordion
                    node-key="knowledgeCode"
                    @node-click='handClick'
                    :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span class='test'>
                        <span :title="data.knowledgeName">{{ data.knowledgeName }}</span></span>
                        <span >
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => append(data)">
                            添加
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => findWord(data)">
                            详情
                        </el-button>
                        <el-button
                            type="text"
                            size="mini"
                            @click="() => remove(node, data)">
                            删除
                        </el-button>
                        </span>
                    </span>
                    </el-tree>
               </el-card>
            </div>
            </el-col>
            <el-col :span="16">
              <div class="norRect" style="height:700px;border-radius: 4px;border: 1px solid #EBEEF5;" v-if='tpyeDet'>
                <div class="norTit norTitBg" >
                    <span>分类信息</span>
                </div>
                <el-card  shadow="never" style="height:659px;overflow:auto;border: 0px;">
                    <el-form :model="form"
                        v-if='typeNew'
                        ref="dataForm"
                        label="right"
                        label-width="100px"
                        :rules="dataFormRules">
                        <el-form-item 
                            label="分类名称:"
                            prop="knowledgeName"
                        ><el-input
                            v-model.trim="form.knowledgeName"
                            autocomplete="off"
                            style="width:90%;"
                            clearable
                            ></el-input></el-form-item>
                        <el-form-item
                            label="上级分类:"
                        ><el-input
                            disabled
                            v-model.trim="patherName"
                            autocomplete="off"
                            style="width:90%;"
                            clearable
                            ></el-input>
                        </el-form-item>
                        <el-form-item
                            label="描述:"
                        ><el-input
                            v-model.trim="form.knowledgeRemark"
                            type="textarea"
                            autocomplete="off"
                            style="width:90%;"
                            clearable
                            ></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="所含文章:" v-for="(o) in essay" :key="o.noticeCode" style="margin:0px auto;text-align:left">
                          <el-button type="text" class="button" @click="Det(o.noticeCode)">{{o.noticeName}}</el-button>
                        </el-form-item> -->
                        <div  id="button" style="text-align:center;margin:0px auto;">
                          <el-row><el-button type='primary' @click="handleSure()">修改
                           </el-button></el-row></div>
                    </el-form>
                </el-card>
              </div>
              <div class="norRect" style="height:700px;border-radius: 4px;border: 1px solid #EBEEF5;" v-if='notcieDet'>
                <div class="norTit norTitBg" >
                    <span>{{this.Name}}文章详情</span>
                </div>
                <el-card  shadow="never" style="height:659px;overflow:auto;border: 0px;">
                    <el-table border :data="essay" style="margin: 0px auto;">
                      <el-table-column
                        label="文章标题"
                        show-overflow-tooltip
                        prop="noticeName"
                        align="center">
                        <template slot-scope="scope">
                        <el-button type="text" size="small" @click="changeDio(scope.$index, scope.row)" >{{scope.row.noticeName}}</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" fixed="right" align="center" width="300">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type='primary'
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                            >编辑</el-button>
                          <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="handleDelet(scope.$index, scope.row)"
                            >删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                </el-card>
              </div>
            </el-col>
        </el-row>
        <!-- 查看通知对话框模块 -->
        <noticedet v-bind:message="dataForm" ref="dataForm" v-if="dialogDet" :visible.sync="dialogDet" @getAll='findOrg'></noticedet>
        <!-- 对话框 -->
        <el-dialog width="50%" 
        :visible.sync="dialogVisible"
        :before-close="modalClose"
        destroy-on-close
        :close-on-click-modal="false">
        <template slot="title"> 
        <el-row style="margin:0px auto;text-align: center"><h2>新增分类</h2></el-row> 
        </template>
        <typeadd v-bind:dataForm='Message' @Close='Close' ref='dataForm'></typeadd></el-dialog>
        <!-- 编辑对话框模块 -->
        <!-- <el-dialog width="75%" 
        :visible.sync="dialogEdit"
        :before-close="modalCloseEdit"
        :close-on-click-modal="false">
        <template slot="title"> 
        <el-row style="margin:0px auto;text-align: center"><h2>文章编辑</h2></el-row> 
        </template>
        <knowEdit v-bind:message='knowMessage' @getAll='CloseDet'></knowEdit></el-dialog> -->
    </div>
    
</template>
<script>
import typeadd from "../../components/knowledge/knowTypeadd"
import noticedet from "../../components/notice/notice_details"
import knowEdit from '../../components/knowledge/knowEdit'
export default {
  data() {
    return {
        Name:'',
        data:[],
        form:{},
        TypeList:[],
        dataFormRules:{
          knowledgeName: [{ required: true, message: '请输入分类名称', trigger: 'blur' },],
        },
        pageRequest: { pageNum: 1, pageSize: 15}, 
        patherName:'',
        essay:[],
        dataForm:{value:'',fileId:'',expireDt:''},
        dialogVisible:false,
        dialogEdit:false,
        Message:'',
        tpyeDet:true,
        notcieDet:false,
        dialogDet:false,
        flag:0,
        knowMessage:[],
        typeNew:false,
        test:[],
    }
  },
  created(){
    this.findOrg()
  },
  components:{
    typeadd,
    noticedet,
    knowEdit
  },
  methods: {
      //分页换页刷新
      // refreshPageRequest: function (pageNum) {
      //   this.pageRequest.pageNum = pageNum
      //   this.findWord()
      // },
      //关闭对话框
      modalClose(done) {
        this.$confirm('确认关闭？')
            .then(_ => {
              done();
              // this.typeNew=false
            })
            .catch(_ => {});
      },
      //
      modalCloseEdit(done){
        this.$confirm('确认关闭？')
            .then(_ => {
              done();
              // this.typeNew=false
            })
            .catch(_ => {});
      },
      //
      Close(){
        this.dialogVisible=false
        this.findOrg()
        // this.typeNew=false
      },
      //
      CloseDet(){
        this.dialogEdit=false
        this.findWord(this.test)
      },
      //
      handleEdit(id,val){
        this.knowMessage=val
        // this.knowMessage.orgCode=
        // this.dialogEdit=true
        this.$router.push({
          path: '/knowlegdeEdit',
          query: {
            message: this.knowMessage.noticeCode
          }
        })
      },
      //文章删除
      handleDelet(id,val){
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.editLoading = true
        let dev = val.noticeCode
        this.$api.notice.delInfo(dev).then((res) => {
          this.editLoading = false
          if (res.code == 0) {
            this.$message({ message: '删除成功', type: 'success' })
            this.findWord(val)
          } else {
            this.$message({ message: '删除失败', type: 'error' })
          }
        })
      })
      },
      //显示通知
      changeDio(id,val){
        this.dialogDet=true
        this.dataForm=Object.assign({}, val)
        this.dataForm.value='1'
      },
      //
      handleSure(){
        this.$confirm('确认修改吗？', '提示', {}).then(() => {
          this.editLoading = true
          let dev =this.form
          this.$api.knowManage.editInfo(dev).then((res) => {
              this.editLoading = false
              if (res.code == 0) {
                  this.$message({ message: '修改成功', type: 'success' })
                  this.findOrg()
              } else {
                  this.$message({ message: '修改失败, ', type: 'error' })
              }
          })
        })
      },
      //查询所有分类
      findOrg(){
        this.$api.knowManage.findAll().then((res) => {
          this.data = res.content
        })
      },
      //组织树点击事件
      handClick(val){ 
        if(this.flag==0){
          this.tpyeDet=true
          this.typeNew=true
          this.notcieDet=false
          let dev = val.knowledgeCode
          this.$api.knowManage.findByCode(dev).then((res) => {
            this.form = res.content
            // this.findWord(this.form)
            if(this.form.patherCode!=0){
            this.findpather(this.form.patherCode)
            }else{
              this.patherName='无'
            }
          })
        }else{
          this.tpyeDet=false
          this.notcieDet=true
          this.flag=0
        }
      },
      //
      findpather(val){
        let dev = val
        this.$api.knowManage.findByCode(dev).then((res) => {
          this.patherName = res.content.knowledgeName
        })
      },
      //查询分类下的文章
      findWord(val){
        // this.tpyeDet=false
        // this.notcieDet=true
        this.test=val
        this.Name=val.knowledgeName
        this.flag=1
        let dev = { condition: {knowledgeCode:val.knowledgeCode,noticeStatus:'S'}, rule: {}, page: {} }
        dev.page = {
          pageNumber: this.pageRequest.pageNum,
          pageSize: this.pageRequest.pageSize,
          direction: 'DESC',
          property: 'lastDt',
        }
        let demo ={noticeRecord:dev,flag:0}
        this.$api.notice.getPage(dev).then((res) => {
          this.essay = res.content.list
        })
      },
      //增加
      Addend() {
        this.dialogVisible=true
        this.Message=''
        // this.Message={knowledgeName:'',konwledgeCode:'',knowledgeRemark:''}
      },
      //增加
      append(data) {
        this.dialogVisible=true
        this.Message=data.knowledgeCode
      },
      //删除
      remove(node, data) {
        this.$confirm('确认删除吗？', '提示', {}).then(() => {
          this.editLoading = true
          let dev =data.knowledgeCode
          this.$api.knowManage.delInfo(dev).then((res) => {
              this.editLoading = false
              if (res.code == 0) {
                  this.$message({ message: '删除成功', type: 'success' })
                  this.findOrg()
                  this.typeNew=false
              } else {
                  this.$message({ message: '删除失败, ', type: 'error' })
              }
          })
        })
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{data.knowledgeName}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>增加</el-button>
              <el-button size="mini" type="text" on-click={ () => this.findWord(data) }>详情</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>);
      }
  }
}
</script>
<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    /* display: block; */
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis; 
  }
  .test{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis; 
  }
</style>
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

<style lang="scss" scoped>
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