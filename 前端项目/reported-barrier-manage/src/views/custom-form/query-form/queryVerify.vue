<template>
  <el-table :data="treeData"
            v-loading="loading.verify"
            style="width: 100%;margin: 10px 0;"
            row-key="code"
            border
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column prop="nodeName"
                     label="节点名称"
                     align="center"
                     header-align="center"                     
                     >
      <template slot-scope="scope">
        {{ scope.row.nodeName + (scope.row.operType == '2' ? '-审核' : '') }}
      </template>
    </el-table-column>
    <el-table-column prop="userName"
                     label="用户名"
                     align="center"
                     header-align="center"
                     width="100"
                     >
    </el-table-column>
    <el-table-column prop="verify"
                     label="审核状态"
                     align="center"
                     header-align="center"    
                     width="100"
                     >
      <template slot-scope="scope">
        <el-tag :type="getTagType(scope.row)">{{ getStateName(scope.row) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="verifyReply"
                     label="审核内容"
                     align="center"
                     header-align="center"
                     >
    </el-table-column>

    <el-table-column prop="createDate"
                     label="开始时间"
                     align="center"
                     header-align="center"
                     width="160"                   
                     >
    </el-table-column>
    <el-table-column prop="finishTime"
                     label="结束时间"
                     align="center"
                     header-align="center" 
                     width="160"

                     >
    </el-table-column>
    <el-table-column prop="handlingTime"
                     label="处理时间"
                     align="center"
                     header-align="center" 
                     width="160"                   
                     >
    </el-table-column>
    <el-table-column label="操作"
                     align="center"
                     header-align="center"
                     width="100"  
    >
      <template slot-scope="main">
        <el-button @click="returnVerify(main.row)"
                   v-if="isAutoVerify && 
                          (main.row.operCode != ($store.state.user.isTest ? $store.state.user.operCode : $storage.getSession('account').operCode))"
                   type="primary"
                   size="mini">退回</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: { orderCode: Number },
  data() {
    return {
      isAutoVerify: false,
      
      loading: {
        form: false,
        verify: false,
        file: false
      },
      list: [],
      fieldList: [],
      showform: {
      },
      tableData: [],
      verifyReply: '',
      treeData: []
  }},
  watch: {
    orderCode(newV) {
      if (newV != '') {
        this.getVerifyData()
      }
    },
    immediate: true
  },
  created() {
    this.getVerifyData()
  },
  methods: {
    getVerifyData() {
      this.loading.verify = true
      this.$api.people.listNeedPlanAcc({formCode: this.orderCode}).then(res => {
        this.loading.verify = false
        this.treeData = res.content
      })
    },
    // 得到tag的标签
    getTagType(row) {
      if (row.operType != '2') {
        return 'success'
      } else {
        if (row.verify == '1') {
          return 'primary'
        } else {
          return 'success'
        }
      }
    },
    // 得到字典的名称
    getStateName(row) {
      if (row.operType == '3') {
        return '通知申请人'
      } else if (row.operType == '1') {
        return '提出申请'
      } else {
        if (row.verify == '2') {
          return '审核通过'
        } else if (row.verify == '3') {
          return '审核不通过'
        } else {
          return '未审核'
        }
      }
    },
    returnVerify(data) {
        this.$prompt('确认要进行这个操作，确认请输入退回说明', '退回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(({ value }) => {
          this.returnVerifyReply = value
          del()
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '退回取消'
          });       
        });


      let del = () =>  {
        let params = {
          code: this.planAccCode, // 当前用户planAcc表的主键
          returnCode: data.code, // 这条记录planAcc表的主键
          operCode: this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode,
          returnOperCode: data.operCode, //被退回人
          formCode: this.formCode,
          modelCode: this.modelCode,
          verifyData: {
            verifyResult: 3,
            verifyReply: this.returnVerifyReply
          }
        }
        this.$api.query.updateNeedPlanAcc(params).then(res => {
          if(res.code == '0') {
            this.$message.success('退回成功')
            this.isAutoVerify = false

            this.$emit('onCancel')
            this.$emit('search')

          } else {
            this.$message.error('退回失败')
          }
        })
      }
    }    
  }
}
</script>
