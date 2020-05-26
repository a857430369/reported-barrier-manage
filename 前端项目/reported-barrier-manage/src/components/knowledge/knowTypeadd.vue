<template>
    <div>
        <el-form :model="form"
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
                v-if='tagType'
                ></el-input>
                <el-cascader
                    v-if='twoType'
                    v-model="form.konwledgeCode"
                    :options="options"
                    style="width:100%;"
                    :props="{ expandTrigger: 'hover',emitPath:false,checkStrictly: true,value:'knowledgeCode', label:'knowledgeName' }"
                ></el-cascader>
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
            <div  id="button" style="text-align:center;margin:0px auto;">
                <el-row>
                    <el-button  @click="handleChange()">取消
                    </el-button>
                    <el-button type='primary' @click="handleSure()">确定
                </el-button></el-row></div>
        </el-form>
    </div>
</template>
<script>
export default {
   props:{
       dataForm:null
   },
  data() {
    return {
        form:{patherCode:''},
        dataFormRules:{
          knowledgeName: [{ required: true, message: '请输入分类名称', trigger: 'blur' },],
        },
        patherName:'',
        tagType:true,
        twoType:false,
        options:[],
    }
  },
  created(){
    this.findName()
  },
  watch: {
      dataForm(newV) {
          this.findName()
      }
  },
  methods:{
      //
      findName(){
          this.patherName=''
          if(this.dataForm!=''){
            let dev = this.dataForm
            this.$api.knowManage.findByCode(dev).then((res) => {
                this.patherName = res.content.knowledgeName
            })
          }
      },
      //
      handleChange(){
          this.$confirm('确认关闭吗？', '提示', {}).then(() => {
            this.$emit('Close')
          })
      },
      //
      handleSure(){
          this.$refs.dataForm.validate((valid) => {
            if (valid) {
                this.$confirm('确认保存吗？', '提示', {}).then(() => {
                    this.editLoading = true
                    if(this.dataForm==''||this.dataForm==null){
                        this.form.patherCode='0'
                    }else{
                        this.form.patherCode=this.dataForm
                    }
                    let dev =this.form
                    this.$api.knowManage.saveInfo(dev).then((res) => {
                        this.editLoading = false
                        if (res.code == 0) {
                            this.$message({ message: '新增成功', type: 'success' })
                            this.$emit('Close')
                        } else {
                            this.$message({ message: '新增失败, ', type: 'error' })
                        }
                    })
                })
            } else {
              console.log('error submit!!')
              return false
            }
          })
      }
  }
}
</script>