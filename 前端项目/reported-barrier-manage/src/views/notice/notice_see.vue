<template>
  <div class="custom_style">
    <el-card class="box-card" style="width: 99%; margin: 0 auto;">
      <div class="filter">
        <el-row type="flex" justify="space-between" style="height:36px">
          <el-form
            :model="Select"
            style="margin:0px;height:40px;margin-left:0px;"
          >
            <!--搜索功能模块 -->
            <el-col :span="5">
              <el-form-item>
                <el-input
                  v-model="Select.noticeName"
                  style="width:96%"
                  placeholder="请输入通知标题"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-select
                  v-model="Select.noticeType"
                  style="width:96%"
                  clearable
                  placeholder="请选择通知类型"
                >
                  <el-option
                    v-for="item in typeNotice"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-select
                  v-model="Select.noticeUrgent"
                  style="width:96%"
                  clearable
                  placeholder="请选择紧急度"
                >
                  <el-option
                    v-for="item in typeUrgent"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-date-picker
                  v-model="Select.seleceDate"
                  style="width:96%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd hh:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  @click="findPage()"
                  size="medium"
                  >搜索</el-button
                >
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-card>
    <el-tabs
      type="border-card"
      v-model="currTabPane"
      style="width: 99%; margin: 5px auto;"
      @tab-click="handleClick"
    >
      <el-tab-pane key="1" name="1">
        <span slot="label"><i class="el-icon-document"></i> 全部通告</span>
        <tableGuy :Form="form" v-if="test" ref="child"></tableGuy
      ></el-tab-pane>
      <el-tab-pane key="2" name="2">
        <span slot="label"
          ><i class="el-icon-warning-outline" style="color:red"></i>
          未读通告</span
        >
        <tableGuy :Form="form1" v-if="test1" ref="child"></tableGuy
      ></el-tab-pane>
      <el-tab-pane key="3" name="3">
        <span slot="label"
          ><i class="el-icon-circle-check" style="color:#00BB00"></i>
          已读通告</span
        >
        <tableGuy :Form="form2" v-if="test2" ref="child"></tableGuy
      ></el-tab-pane>
      <el-tab-pane key="4" name="4">
        <span slot="label"><i class="el-icon-info"></i> 全员通告</span>
        <tableGuy :Form="form3" v-if="test3" ref="child"></tableGuy
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import noticedet from '../../components/notice/notice_details'
import noticeUrgency from '../../components/notice/notice_Urgency'
import tableGuy from '../../components/notice/notice_userShow'
export default {
  components: {
    noticedet,
    noticeUrgency,
    tableGuy,
  },
  data() {
    return {
      tableData: [],
      dataForm: { value: '' },
      value: false,
      From: '',
      form: ['', ''],
      form1: ['F', 'F'],
      form2: ['E', 'F'],
      form3: ['', 'A'],
      test: true,
      test1: false,
      test2: false,
      test3: false,
      Select: {
        noticeName: '',
        noticeType: '',
        noticeUrgent: '',
        seleceDate: '',
      },
      typeNotice: [
        {
          id: 'S',
          label: '系统通知',
        },
        {
          id: 'Z',
          label: '报障通知',
        },
        {
          id: 'M',
          label: '短信通知',
        },
      ],
      typeUrgent: [
        {
          id: 'P',
          label: '普通',
        },
        {
          id: 'J',
          label: '紧急',
        },
      ],
    }
  },
  mounted() {},
  created() {
    this.getAll()
  },
  methods: {
    //模糊查询
    findPage() {
      this.$refs['child'].findPage(this.Select)
    },
    getAll() {
      this.currTabPane = '1'
    },
    handleClick(tab, event) {
      const currTabPane = this.currTabPane
      this.Select = {
        noticeName: '',
        noticeType: '',
        noticeUrgent: '',
        seleceDate: '',
      }
      if (currTabPane == '1') {
        this.test = true
        this.test1 = false
        this.test2 = false
        this.test3 = false
      } else if (currTabPane == '2') {
        this.test1 = true
        this.test = false
        this.test2 = false
        this.test3 = false
      } else if (currTabPane == '3') {
        this.test2 = true
        this.test = false
        this.test1 = false
        this.test3 = false
      } else if (currTabPane == '4') {
        this.test3 = true
        this.test = false
        this.test2 = false
        this.test1 = false
      } else {
        console.warn('标签页不存在')
      }
    },
  },
}
</script>
<style scoped lang="less">
.row-style {
  margin: 10px;
  width: 100%;
  height: 100%;
}
.bottom {
  margin-top: 0px;
  line-height: 12px;
}
.switchChange {
  display: block;
  position: absolute;
  left: 400px;
}
.button {
  padding: 0;
  float: right;
}
.time {
  padding: 0;
  float: left;
}
.status {
  padding: 0;
  float: left;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.el-table__body td {
  max-height: 23px !important;
  overflow: hidden !important;
}
/deep/.el-form-item__content {
  line-height: 35px;
  position: relative;
  font-size: 14px;
}
</style>
