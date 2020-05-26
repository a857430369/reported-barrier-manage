<template>
  <div class="filter-style">
    <el-row type="flex" justify="space-between">
      <el-col :span="24" style="display:flex">
        <div style="margin: 0 10px 10px 0">
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
        <div style="margin: 0 10px 10px 0">
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
        <div style="margin: 0 10px 10px 0">
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
        <div style="margin: 0 10px 10px 0">
          <el-date-picker
            type="datetimerange"
            range-separator="至"
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="timeValue"
          />
        </div>
        <div style="margin: 0 10px 10px 0">
          <el-button
            type="primary"
            size="medium"
            :loading="searchLoading"
            icon="el-icon-search"
            @click="getPersonalPage"
            >搜索</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
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
    getPersonalPage: {
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
