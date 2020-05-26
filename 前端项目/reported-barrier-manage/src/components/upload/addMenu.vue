<template>
<div>
  <el-dialog
    title="添加目录"
    :visible.sync="visible"
    width="30%"
    :before-close="modalClose">
    <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="menuName">
          <span class="allSize">目录名称</span>
          <el-input
            style="width: 100%"
            placeholder="请输入目录名称"
            v-model.trim="form.menuName"
            clearable>
          </el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="modalClose()">取 消</el-button>
      <el-button type="primary" @click="onSubmitMenu('form')">添 加</el-button>
    </span>
  </el-dialog>
</div>
  
</template>

<script>
export default {
  // 父组件传递数据
  props:  {
    visible: {
      type: Boolean,
      default: false
    },
    menuCode: {
      type: String
    }
  },
  // 默认数据
  data() {
    return {
      form: {
        menuName: '',
        patherCode: ''
      },
      rules:{
        menuName: [
            { required: true, message: '请输入目录名称', trigger: 'blur' },
            { min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur' }
        ]
      },
      menuData: []
    }
  },
  // 创建dom前渲染
  created() {
    this.getAllFMenu()
  },
  // 所有方法
  methods: {
    //  获取所有父类菜单
    getAllFMenu() {
      this.$api.fileMenu.getMenuAll().then((res) => {
        this.menuData = res.content
      })
    },
    // 提交表单
    onSubmitMenu(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否新增该目录','提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then( () => {
            let patherCode = this.menuCode
            this.form.patherCode = patherCode
            const get = this.menuData.some(item => {
              return item.menuName === this.form.menuName
            });
            if(!get){
              this.$api.fileMenu.addMenu(this.form).then((res) => {
                if(res.code === 0) {
                  this.$message({message:'成功', type: 'success'})
                  this.$emit('getMenuAll')
                  this.$emit('getAll')
                  this.modalClose()
                }
                else {this.$message('未知错误')}
              })
            }else{
              this.form = {
                menuName: '',
                patherCode: ''
              }
              this.$message({
                type:'info',
                message:'名字重复请重新输入'
              })
            }
            
          }).catch( (err) => {
            this.$message({
              type: 'info',
              message: '已取消新增'
            });
          })
        } else {
          alert('请完成输入!');
          return false;
        }
      });
    },
    modalClose() {
      this.form={
        menuName: '',
        patherCode: ''
      }
      this.$emit('update:visible',false)
    },
  }
}
</script>

<style scoped>
.allSize{
  color: #989ca5; 
  font-weight: 700;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
</style>