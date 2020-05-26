<template>
  <el-form
    ref="ruleForm"
    label-width="150px"
    v-loading="loading.form"
    style="min-height: 286px;margin-bottom: 10px"
    class="demo-ruleForm"
  >
    <el-row :gutter="20" style="margin-bottom: 10px;text-align: center">
      <h1>{{ title }}</h1>
    </el-row>
    <el-row>
      <el-col
        :span="
          item.valueType == 'textarea' ||
          item.valueType == 'remark' ||
          item.valueType == 'remoteQuery'
            ? 22
            : 11
        "
        v-for="(item, index) in showform"
        :key="index"
      >
        <!-- 普通表单-开始 -->
        <el-form-item
          v-if="item.valueType != 'remoteQuery'"
          :label="item.fieldName + ':'"
          :style="'height: ' + item.valueType == 'textarea' ? '80px' : '40px'"
          :prop="'key-' + index"
        >
          {{ item.fieldValue }}
        </el-form-item>
        <!-- 普通表单-结束 -->

        <!-- 数据库相关接口-开始 -->
        <el-form-item
          v-else
          :label="item.fieldName + ':'"
          style="height:80px"
          :prop="'key-' + index"
        >
          <div class="remote-data vv-992c">
            <el-form :model="item.fieldValue" :inline="false">
              <el-form-item
                :label="key + ': '"
                v-for="key in Object.keys(item.fieldValue)"
                :key="key"
              >
                {{ item.fieldValue[key] }}
              </el-form-item>
            </el-form>
          </div>
        </el-form-item>
        <!-- 数据库相关接口-结束 -->
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: { orderCode: Number },
  data() {
    return {
      title: '',
      loading: {
        form: false,
      },
      list: [],
      fieldList: [],
      showform: {},
      form: {
        verifyResult: '',
        verifyReply: '',
      },
      verifyReply: '',
      verifyResult: '',
    }
  },
  watch: {
    orderCode(newV) {
      if (newV != '') {
        this.getFormData()
      }
    },
    immediate: true,
  },
  methods: {
    getFormData() {
      this.$api.query
        .listNeedValueByFormCode({ formCode: this.orderCode })
        .then((res) => {
          this.loading.form = false
          this.showform = res.content.filter((item) => {
            return item.valueType && item.valueType != 'title'
          })
          this.showform = []
          res.content.forEach((item) => {
            if (!item.valueType) return
            if (item.valueType != 'title') {
              if (item.valueType == 'remoteQuery') {
                item.fieldValue = JSON.parse(item.fieldValue)
              }
              this.showform.push(item)
            } else {
              this.title = item.fieldValue
            }
          })
        })
    },
  },
  created() {
    this.getFormData()
  },
}
</script>

<style lang="scss" scoped>
.remote-data {
  .el-form-item {
    display: inline-block;
    margin-right: 60px;
  }
}
</style>

<style>
.vv-992c .el-form-item__content {
  display: inline-block;
}
</style>
