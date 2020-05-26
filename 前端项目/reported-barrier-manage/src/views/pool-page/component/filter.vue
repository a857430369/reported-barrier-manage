<template>
  <el-row type="flex" justify="space-between">
    <el-col :span="24" style="display:flex">
      <div class="div_margin">
        <el-select
          v-model="searchParams.recordClassifyName"
          placeholder="请选择大类"
          clearable
          @change="changeHandel"
        >
          <el-option
            v-for="item in recordClassifyOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="div_margin">
        <el-select
          v-model="searchParams.recordClassifySmallName"
          placeholder="请选择小类"
          clearable
        >
          <el-option
            v-for="item in recordClassifySmallOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="div_margin">
        <el-select
          v-model="searchParams.urgentGrade"
          placeholder="请选择优先级"
          clearable
        >
          <el-option
            v-for="item in urgentGradeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="div_margin">
        <el-select
          v-model="searchParams.receiptSource"
          placeholder="请选择工单来源"
          clearable
        >
          <el-option
            v-for="item in receiptSourceOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="div_margin">
        <el-input
          placeholder="请输入工单创建人"
          class="filter-item"
          v-model.trim="searchParams.createName"
          @keyup.enter.native="findWorkOrderList('search')"
        />
      </div>
      <div class="div_margin">
        <el-date-picker
          type="datetimerange"
          range-separator="至"
          start-placeholder="期望开始时间"
          end-placeholder="期望结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="timeValue"
        />
      </div>
      <div class="div_margin">
        <el-button
          type="primary"
          size="medium"
          :loading="searchLoading"
          icon="el-icon-search"
          @click="findWorkOrderList('search')"
          >搜索</el-button
        >
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    classifyList: {
      type: Array,
      required: true,
    },
    recordClassifyOption: {
      type: Array,
      required: true,
    },
    urgentGradeOption: {
      type: Array,
      required: true,
    },
    branchRecordOption: {
      type: Array,
      required: true,
    },
    receiptSourceOption: {
      type: Array,
      required: true,
    },
    recordFlowOption: {
      type: Array,
      required: true,
    },
    recordFlow: {
      type: String,
      required: true,
    },
    findWorkOrderList: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      timeValue: '',
      searchLoading: false,
      searchParams: {
        recordName: '', // 工单标题
        recordFlow: '', // 工单流程进度
        recordClassifyName: '', // 大类名称
        recordClassifySmallName: '', // 小类名称
        urgentGrade: '', // 分类优先级
        createName: '', // 工单创建人
      },
      recordClassifySmallOption: [], //小类列表
    }
  },
  mounted() {},
  created() {
    this.searchParams.recordFlow = this.recordFlow
  },
  methods: {
    //大类被选中时
    changeHandel() {
      const val = this.searchParams.recordClassifyName
      if (val) {
        //提取小类列表
        const classifyList = JSON.parse(JSON.stringify(this.classifyList))
        for (let [index, item] of classifyList.entries()) {
          if (item.classifyName === val) {
            let childrenList = item.children
            let recordClassifySmallOption = []
            for (let [index, item] of childrenList.entries()) {
              recordClassifySmallOption.push({
                value: item.classifyName,
                label: item.classifyName,
              })
            }
            this.recordClassifySmallOption = recordClassifySmallOption
            break
          }
        }
      } else {
        //清除小类列表
        this.recordClassifySmallOption = []
      }
      this.searchParams.recordClassifySmallName = ''
    },
  },
}
</script>
<style lang="less" scoped>
.div_margin {
  margin: 0 10px 10px 0;
}
</style>
