<template>
  <div>
    <el-form :model="form" label-width="120px">

      <el-form-item label="SQL语句">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="sqlTxt">
        </el-input>
      </el-form-item>

      <el-form-item label="变量的标签" class="input-label">
        <div style="display: inline-block;position: relative"  v-for="item in inputArray" :key="item.key">
          {{ item.key + '：' }}
          <el-input v-model="item.value" placeholder="变量值"></el-input>
        </div>
      </el-form-item>

      <div class="remote-form" v-if="type == 'remoteQuery'">
        <el-form label-width="150px">
          <el-form-item v-for="key in Object.keys(queryForm)" :key="key" :label="key">
            <el-input v-model="queryForm[key]" placeholder="" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>

      <el-form-item>
        <el-button type="primary" @click="testConnect" :loading="loading" :disabled="loading">测试连接</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import Vue from 'vue'

export default {
  props: {
    sql: String,
    type: String,
    label: Object,
    dataSourceCode: String,
  },
  data() {
    return {
      inputIndex: 0,
      data: [
        {name: 123},
      ],
      form: {
        sql: '',
      },
      sqlTxt: '',
      inputForm: {},
      queryForm: {},
      inputArray: [],
      loading: false
    }
  },
  watch: {
    sql: {
      handler(newV) {
        this.sqlTxt = newV
      },
      immediate: true
    },
    label: {
      handler (newV) {
        this.inputForm = {}
        this.inputArray = []
        Object.values(newV).map(item => {
          if (newV) {
            Vue.set(this.inputForm, item, '')
            this.inputArray.push({
              key: item, value: ''
            })
          }
        })
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    setLabel (label) {
      this.inputForm = {}
      this.inputArray = []
      Object.values(label).map(item => {
        if (item) {
          Vue.set(this.inputForm, item, '')
            this.inputArray.push({
              key: item, value: ''
            })

        }
      })
    },
    delInputForm(key) {
      if (Object.keys(this.inputForm).length > 1) {
        delete this.inputForm[key]
        this.$forceUpdate();     
      }
    },
    // 增加输入标签
    addInputForm() {
      this.inputIndex++
      Vue.set(this.inputForm, 'input' + this.inputIndex, '')
    },
    writeForm(type) {
      if (type == 'add') {}
      else {}
      this.writeFormDialog = true
    },
    onCancel() {
      this.$emit('onCancel')
    },
    testConnect() {
      this.loading = true
      let paramList = this.inputArray.map(item => {return item.value})

      let params = {
        datasourceCode: this.dataSourceCode,
        sqlTxt: this.sqlTxt,
        param: paramList
      }

      this.$api.dataSource.dataList(params).then(res => {
        this.loading = false
        if (res.content && res.content.length > 0) {
          this.queryForm = res.content[0]
          this.$message.success('测试成功')
        } else {
          this.$message.error('测试不成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.remote-form {
  .el-form {
    &:nth-child(1){
      margin-top: 10px;

      .el-form-item {
        margin: 5px 0;
        width: 300px;
        display: inline-block;
      }      
    }
  }
}


.input-label {
  .el-input {
    width: 130px;
    margin-right: 5px;
  }
  .del-label {
    position: absolute;
    right: 6px;
    top: 1px;
    font-size: 13px;
    color: #aaa;
  }
  .add-label {
    font-size: 25px;
    color: #bfbfbf;      
    vertical-align: sub;
    text-shadow: 0.2px 0.4px 1px rgba(0,0,0,0.7);
    &:hover {
      cursor: pointer;
      color: #8a8a8a;
    }
  }
}
</style>
