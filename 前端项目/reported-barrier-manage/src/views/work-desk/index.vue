<template>
  <div class="workDesk">
    <el-dialog title="短信提示" :visible.sync="isShowNotions" width="30%">
      <div class="deploy-wrap">
        <el-form ref="form" :model="notionForm" label-width="80px">
          <el-form-item label="短信标题:">
            <h4>{{ notionForm.noticeName }}</h4>
          </el-form-item>
          <el-form-item label="短信内容:">
            <h4>{{ notionForm.noticeContent }}</h4>
          </el-form-item>
          <el-form-item label="创建人:">
            <h4>{{ notionForm.userName }}</h4>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          @click="isShowNotions = false"
          style="float: right"
          >确 定</el-button
        >
        <div style="clear: both"></div>
      </div>
    </el-dialog>

    <el-dialog
      title="工单详情"
      :visible.sync="isWorkOrders"
      width="80%"
      top="5vh"
      v-if="isWorkOrders"
    >
      <workOrderList :formCode="recordCode" />
    </el-dialog>

    <audio
      src="./mp3/ding.mp3"
      id="music"
      controls="controls"
      style="display: none"
    ></audio>
    <div class="workDesk-card">
      <div class="left-item-card">
        <ul class="small-card">
          <li @click="getRouter('/employeesList', 'router')">
            <p style="--color: #fe9900">
              <img src="./img/icon/icon1.png" />
            </p>
            <p style="--color: #ff8800">
              <span>{{ numObj.handlingNum }}</span>
              <span>待处理</span>
            </p>
          </li>
          <li @click="getRouter('/pendingPool', 'router')">
            <p style="--color: #915fff">
              <img src="./img/icon/icon2.png" />
            </p>
            <p style="--color: #7259ff">
              <span>{{ numObj.dispatchingNum }}</span>
              <span>工单池</span>
            </p>
          </li>

          <li>
            <p style="--color: #4cbdff">
              <img src="./img/icon/icon3.png" />
            </p>
            <p style="--color: #3caaff">
              <span></span>
              <span>电话留言</span>
            </p>
          </li>
          <li
            @click="toKfHtml()"
            :class="isHaveNoRead ? 'small-card-light' : ''"
          >
            <p style="--color: #fe5454">
              <img src="./img/icon/icon4.png" />
            </p>
            <p style="--color: #ff4546">
              <span>{{ numObj.noReadNewNum }}</span>
              <span>在线客服</span>
            </p>
          </li>
        </ul>
        <div class="left-main-contain" style="overflow: hidden">
          <span>
            <!-- 组件 -->
            <div class="table-card">
              <div class="table-title">
                <i class="iconfont icon-tongzhi"></i>
                <span>通知公告</span>
                <span>--Annoucement</span>

                <span @click="getRouter('/noticeSee', 'router')"
                  ><img src="./img/more.gif" style="width: 57px;"
                /></span>
              </div>
              <div class="table-contain">
                <div class="workDesk-table">
                  <el-table
                    @row-click="showNotions"
                    :data="noticeTableData"
                    tooltip-effect="light"
                    style="width: 100%"
                    header-row-class-name="workDesk-table-header"
                  >
                    <el-table-column
                      prop="noticeName"
                      show-overflow-tooltip
                      label="标题"
                    >
                    </el-table-column>
                    <el-table-column prop="userName" label="发布人" width="80">
                    </el-table-column>
                    <el-table-column
                      prop="createDt"
                      label="发布时间"
                      width="90"
                    >
                      <template slot-scope="scope">
                        {{ getBigTime(scope.row.createDt) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 组件 -->
          </span>
          <span>
            <!-- 组件 -->
            <div class="table-card">
              <div class="table-title">
                <i class="iconfont icon-gongneng"></i>
                <span>常用功能</span>
                <span>--Common</span>
              </div>
              <div class="table-contain is-have-table-border">
                <div class="workDesk-common-function">
                  <div class="wd-c-f-box">
                    <div
                      v-for="(leftItem, index) in topCommonData"
                      :key="leftItem.content"
                      class="wd-c-f-item-box"
                      :style="{
                        '--workDesk-item-backColor':
                          topCommonCss[index % 3].itemBack,
                      }"
                      @click="getRouter(leftItem.routeName, leftItem.jumpType)"
                    >
                      <div
                        class="item-left-box"
                        :style="{
                          '--workDesk-item-backColor':
                            topCommonCss[index % 3].leftBack,
                        }"
                      >
                        <i
                          :class="topCommonCss[index % 3].leftIcon"
                          :style="{
                            '--workDesk-common-icon':
                              topCommonCss[index % 3].leftIconColor,
                          }"
                        ></i>
                      </div>
                      <div class="item-right-box">
                        <span>{{ leftItem.content }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="wd-c-f-box">
                    <div
                      v-for="(leftItem, index) in bottomCommonData"
                      :key="leftItem.content"
                      class="wd-c-f-item-box"
                      :style="{
                        '--workDesk-item-backColor':
                          bottomCommonCss[index % 3].itemBack,
                      }"
                      @click="getRouter(leftItem.routeName, leftItem.jumpType)"
                    >
                      <div
                        class="item-left-box"
                        :style="{
                          '--workDesk-item-backColor':
                            bottomCommonCss[index % 3].leftBack,
                        }"
                      >
                        <i
                          :class="bottomCommonCss[index % 3].leftIcon"
                          :style="{
                            '--workDesk-common-icon':
                              bottomCommonCss[index % 3].leftIconColor,
                          }"
                        ></i>
                      </div>
                      <div class="item-right-box">
                        <span>{{ leftItem.content }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- 左箭头 -->
                  <div
                    class="workDesk-common-left-pointer workDesk-common-pointer"
                    @click="setCommonIndex('-')"
                  >
                    <i class="el-icon-caret-left"></i>
                  </div>

                  <!-- 右箭头 -->
                  <div
                    class="workDesk-common-rigth-pointer workDesk-common-pointer"
                    @click="setCommonIndex('+')"
                  >
                    <i class="el-icon-caret-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <!-- 组件 -->
          </span>
        </div>
        <div class="left-main-contain">
          <span>
            <!-- 组件 -->
            <div class="table-card">
              <div class="table-title">
                <i class="iconfont icon-ziyuan" style="font-size: 14px"></i>
                <span>知识库</span>
                <span>--Knowledge</span>
                <span @click="getRouter('/knowlegdeUser', 'router')"
                  ><img src="./img/more.gif" style="width: 57px;"
                /></span>
              </div>
              <div class="table-contain">
                <div class="workDesk-table">
                  <el-table
                    :data="fileTableData"
                    style="width: 100%"
                    tooltip-effect="light"
                    @row-click="getKnowledgeInfo($event, 'know')"
                    header-row-class-name="workDesk-table-header"
                  >
                    <el-table-column
                      prop="noticeName"
                      show-overflow-tooltip
                      label="标题"
                    >
                    </el-table-column>
                    <el-table-column prop="userName" label="发起人" width="80">
                    </el-table-column>
                    <el-table-column
                      prop="createDt"
                      label="发布时间"
                      width="90"
                    >
                      <template slot-scope="scope">
                        {{ getBigTime(scope.row.createDt) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 组件 -->
          </span>
          <span>
            <!-- 组件 -->
            <div class="table-card" style="overflow-x: auto;" id="history">
              <div class="table-title">
                <i class="iconfont icon-rili"></i>
                <span>历史工单</span>
                <span>--History</span>
              </div>

              <div
                class="table-contain custom-date-picker"
                style="width: 100%;"
              >
                <custom-date
                  style="display: block-inline"
                  v-model="historyTime"
                ></custom-date>

                <custom-time-line
                  v-if="activities.length > 0"
                  :reverse="false"
                  style="display: block-inline"
                >
                  <custom-time-line-item
                    :reverse="false"
                    v-for="(activity, index) in activities"
                    :key="index"
                    :index="index"
                    :length="activities.length"
                    :timestamp="getSmallTime(activity.createDt)"
                    :timeContent="activity.recordName"
                    @getTimeItem="getOrderInfo(activity)"
                  >
                  </custom-time-line-item>
                </custom-time-line>
                <ul v-else>
                  <span id="historyIsNoData">暂无数据</span>
                </ul>
              </div>
            </div>
            <!-- 组件 -->
          </span>
        </div>
      </div>
      <div class="right-item-card">
        <div class="sign-in">
          <!-- 组件 -->
          <div class="table-card">
            <div class="table-title">
              <i class="iconfont icon-daqia"></i>
              <span>打卡</span>
            </div>
            <div class="table-contain table-contain-background">
              <div class="table-sign-in">
                <transition name="el-zoom-in-bottom">
                  <div class="signin-state-but" v-show="workStateType">
                    <span>
                      <el-button
                        :type="signInType != 'E' ? '' : 'primary'"
                        size="mini"
                        round
                        @click="setSignIn('E')"
                        >上线</el-button
                      >
                    </span>
                    <span>
                      <el-button
                        :type="signInType != 'M' ? '' : 'primary'"
                        size="mini"
                        round
                        @click="setSignIn('M')"
                        >忙碌</el-button
                      >
                    </span>
                    <span>
                      <el-button
                        :type="signInType != 'O' ? '' : 'primary'"
                        size="mini"
                        round
                        @click="setSignIn('O')"
                        >离开</el-button
                      >
                    </span>
                  </div>
                </transition>

                <!-- 73d13d -->
                <div
                  class="signIn-big-button"
                  @mouseenter="showWorkSmallBut = true"
                  @mouseleave="showWorkSmallBut = false"
                  :style="
                    'background-color:' +
                      (workStateType ? '#73d13d' : '#f85c5d')
                  "
                  style="--big-position: 6px;--big-width: 69px;"
                >
                  <span>{{ workStateType ? '上班' : '离线' }}</span>

                  <transition name="el-zoom-in-left">
                    <div
                      class="signIn-small-button"
                      v-show="showWorkSmallBut"
                      @click="setSignIn('tran')"
                    >
                      {{ !workStateType ? '上班' : '离线' }}
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
          <!-- 组件 -->
        </div>
        <div class="my-info">
          <!-- 组件 -->
          <div class="table-card">
            <div class="table-title">
              <i class="iconfont icon-gerenxinxi"></i>
              <span>数据统计</span>
            </div>
            <div class="table-contain is-have-table-border">
              <div class="person-information">
                <div
                  id="myChart"
                  :style="{ width: '100%', height: '183px' }"
                  style="margin-bottom: 8px;"
                ></div>
                <div
                  id="myChart1"
                  :style="{ width: '100%', height: '183px' }"
                ></div>
                <!-- 上箭头 -->
                <div
                  class="workDesk-common-top-pointer workDesk-common-pointer"
                  @click="setCommonIndex('up')"
                >
                  <i class="el-icon-caret-top"></i>
                </div>

                <!-- 下箭头 -->
                <div
                  class="workDesk-common-bottom-pointer workDesk-common-pointer"
                  @click="setCommonIndex('down')"
                >
                  <i class="el-icon-caret-bottom"></i>
                </div>
              </div>
            </div>
          </div>
          <!-- 组件 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { downloadFile } from '@/utils/common'
import { getDayStartEnd, debounce } from './js/index'
import workOrderList from '@/components/work-order/queryGeneral'
import customDate from '@/components/date-picker/index'
import customTimeLine from '@/components/cumstom-timeline/timeline/index'
import customTimeLineItem from '@/components/cumstom-timeline/timeline-item/index'

export default {
  components: {
    workOrderList,
    customDate,
    customTimeLine,
    customTimeLineItem,
  },
  methods: {
    getOrderInfo(data) {
      this.isWorkOrders = true
      this.recordCode = data.recordCode
    },
    getKfManageData() {
      if (!this.$store.state.user.isTest) {
        let token = this.$storage.getSession('token')
        this.$api.kfRemote.getSeller({ token: token }).then((res) => {
          if (res.data && res.data.data && res.data.data.url) {
            this.kfDialogUrl = res.data.data.url
          }
        })
      } else {
        let token =
          'A5203B72F5F628EFE053470D7C848665OhdAzUCKkeyWordnOuXnB9eCWIsnt1PPjNOnQkeyWord1590462531387'
        this.$api.kfRemote.getSeller({ token: token }).then((res) => {
          if (res.data && res.data.data && res.data.data.url) {
            this.kfDialogUrl = res.data.data.url
          }
        })
      }
    },
    showNotions(data) {
      if (data.noticeType == 'M') {
        Object.keys(data).map((key) => {
          this.notionForm[key] = data[key]
        })
        this.isShowNotions = true
      } else {
        this.getKnowledgeInfo(data, 'notice')
      }
    },
    toKfHtml() {
      if (this.signInType == 'E') {
        if (this.kfIframeUrl) {
          window.open(this.kfIframeUrl, '_blank')
        } else {
          this.$message.error('系统异常')
        }
      } else {
        this.$message.warning('上线才能登录客服')
      }
    },
    getMusic() {
      let audio = document.getElementById('music')
      audio.play()
    },
    getKnowledgeInfo(data, type) {
      let path = ''
      type === 'know'
        ? (path = '/workDesk/knowledgeShow')
        : (path = '/workDesk/annoucementShow')

      this.$router.push({
        path,
        query: {
          noticeCode: data.noticeCode,
          type: 'workDesk',
        },
      })
    },
    getBigTime(time) {
      return time.slice(0, 10)
    },
    getEchart() {
      this.setEchartOption(this.optionList[this.echartIndex * 2], 'myChart')
      this.setEchartOption(
        this.optionList[this.echartIndex * 2 + 1],
        'myChart1'
      )
    },
    setEchartOption(option, id) {
      this.$nextTick(() => {
        var myChart = this.$echarts.init(document.getElementById(id))
        // 绘制图表
        myChart.clear()
        myChart.setOption(option)
      })
    },
    // 设置常用功能的下标
    setCommonIndex(type) {
      if (type == '+') {
        if (this.filterCommonData.length > (this.allCommonIndex + 1) * 6) {
          this.allCommonIndex++
        }
      } else if (type == '-') {
        if (this.allCommonIndex > 0) {
          this.allCommonIndex--
        }
      } else if (type == 'down') {
        if (this.optionList.length > (this.echartIndex + 1) * 2) {
          this.echartIndex++
          this.getEchart()
        }
      } else if (type == 'up') {
        if (this.echartIndex > 0) {
          this.echartIndex--
          this.getEchart()
        }
      }
    },
    getRouter(routeName, jumpType) {
      if (jumpType == 'dialog') {
        if (this.kfDialogUrl) {
          window.open(this.kfDialogUrl, '_blank')
        } else {
          this.$message.error('客服管理出现错误!')
        }
      } else {
        if (routeName) {
          this.$router.push({
            path: '/workDesk' + routeName,
            query: {
              type: 'workDesk',
            },
          })
        }
      }
    },
    getSmallTime(time) {
      return time.substring(11, 16)
    },
    initSetSignIn() {
      this.signInType = 'E'
    },
    setSignIn(type) {
      if (type == 'tran') {
        if (this.signInType == 'F') {
          type = 'E'
        } else {
          type = 'F'
        }
      }

      this.signInType = type
      // 设置客服上线
      this.kfIframeUrl = ''
      // 状态是上线客服就上线
      if (this.signInType == 'E') {
        this.workStateType = true
        this.setUpKFData()
      } else {
        if (this.signInType == 'F') {
          this.workStateType = false
        } else {
          this.workStateType = true
        }
        clearInterval(this.kfTime)
        this.setDownKFData()
      }

      this.$api.workdesk.updateState({ state: this.signInType }).then((res) => {
        this.signInType == 'F' && this.$message.success('离线成功！')
        this.signInType == 'E' && this.$message.success('上线成功！')
        this.signInType == 'M' && this.$message.warning('切换忙碌！')
        this.signInType == 'O' && this.$message.warning('切换离开！')
      })
    },
    getNum() {
      this.$api.workdesk.getRecordNum().then((res) => {
        this.numObj.handlingNum = res.content.handlingNum
        this.numObj.dispatchingNum = res.content.dispatchingNum
        this.numObj.itsmNum = res.content.itsmNum
      })
    },
    getSystemNotices() {
      this.$api.workdesk.getSystemNotices().then((res) => {
        if (Array.isArray(res.content)) {
          this.noticeTableData = res.content.slice(0, 5)
        }
      })
    },
    getDownloadFiles() {
      this.$api.workdesk.getNoticesKnowledge().then((res) => {
        if (Array.isArray(res.content)) {
          this.fileTableData = res.content.slice(0, 5)
        }
      })
    },
    getTimeListData() {
      let param = getDayStartEnd(this.historyTime)
      this.$api.workdesk.getByDate(param).then((res) => {
        this.activities = res.content
      })
    },
    getUser() {
      this.$api.workdesk.getUser().then((res) => {
        this.workStateType = res.content.attributeState != 'F'
        this.signInType = res.content.attributeState
        if (this.signInType == 'E') {
          this.setUpKFData()
        }
      })
    },
    getButAuthorityList() {
      let param = {
        codes: [
          this.$store.state.user.operCode,
          this.$store.state.user.roleCode,
        ],
      }
      this.$api.workdesk.getButAuthorityList(param).then((res) => {
        res.content['wk-common'] &&
          (this.butAuthorityList = res.content['wk-common'])

        this.filterCommonData = this.allCommonData.filter((item) => {
          return this.butAuthorityList.indexOf(item.butCode) != -1
        })
      })
    },
    getOption() {
      let bgColor = '#fff'
      let title = '总量'
      let color = [
        '#0E7CE2',
        '#FF8352',
        '#E271DE',
        '#F8456B',
        '#00FFFF',
        '#4AEAB0',
      ]
      let echartData = [
        {
          name: '好评',
          value: '40',
        },
        {
          name: '一般',
          value: '20',
        },
        {
          name: '好',
          value: '10',
        },
        {
          name: '差评',
          value: '30',
        },
      ]

      let formatNumber = function(num) {
        let reg = /(?=(\B)(\d{3})+$)/g
        return num.toString().replace(reg, ',')
      }
      let total = echartData.reduce((a, b) => {
        return a + b.value * 1
      }, 0)

      let option = {
        backgroundColor: '#ebf6fc',
        color: color,
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
        title: [
          {
            text: '{name|' + title + '}\n{val|' + formatNumber(total) + '}',
            top: 'center',
            left: 'center',
            textStyle: {
              rich: {
                name: {
                  fontSize: 14,
                  fontWeight: 'normal',
                  color: '#666666',
                  padding: [10, 0],
                },
                val: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#333333',
                },
              },
            },
          },
          {
            text: '工单评价情况',
            top: '2%',
            left: 'center',
            textStyle: {
              fontWeight: 450,
              fontSize: 17,
            },
          },
        ],
        series: [
          {
            type: 'pie',
            radius: ['45%', '60%'],
            center: ['50%', '54%'],
            data: echartData,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2,
              },
            },
            labelLine: {
              normal: {
                length: 10,
                length2: 40,
                lineStyle: {
                  color: '#e6e6e6',
                },
              },
            },
            label: {
              normal: {
                formatter: (params) => {
                  return (
                    '{icon|●}{name|' +
                    params.name +
                    '}{value|' +
                    formatNumber(params.value) +
                    '}'
                  )
                },
                padding: [15, -50, 25, -50],
                rich: {
                  icon: {
                    fontSize: 12,
                  },
                  name: {
                    fontSize: 10,
                    padding: [0, 10, 0, 4],
                    color: '#666666',
                  },
                  value: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#333333',
                  },
                },
              },
            },
          },
        ],
      }
      return option
    },
    // 得到echart1
    getOption1() {
      // 科目
      var subjects = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      // 成绩
      var grade = [85, 130, 90, 30, 90, 70]
      let option = {
        backgroundColor: '#ebf6fc',
        title: {
          text: '每周完成单',
          x: 'center',
          top: '2%',
          textStyle: {
            fontWeight: 450,
            fontSize: 17,
          },
        },
        grid: {
          containLabel: true,
          top: '22%',
          left: '3%',
          right: '3%',
          bottom: '2%',
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            textStyle: {
              fontSize: 12,
            },
          },
          data: subjects,
        },
        yAxis: {
          name: '完成数',
          splitLine: {
            show: false,
          },
        },
        series: [
          {
            type: 'bar',
            barWidth: '30%',
            label: {
              normal: {
                show: true,
                position: 'top',
              },
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#0286ff',
                  },
                  {
                    offset: 0.5,
                    color: '#027eff',
                  },
                  {
                    offset: 1,
                    color: '#00feff',
                  },
                ]),
                barBorderRadius: [50, 50, 0, 0],
                shadowColor: '#BABABA',
                shadowBlur: 5,
              },
            },
            data: [85, 130, 90, 30, 90, 70],
          },
        ],
      }
      return option
    },
    getOption2() {
      var dataArr = [
        {
          value: 91,
          name: '综合订单评分',
        },
      ]
      var color = new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: '#5CF9FE', // 0% 处的颜色
        },
        {
          offset: 0.17,
          color: '#468EFD', // 100% 处的颜色
        },
        {
          offset: 0.9,
          color: '#468EFD', // 100% 处的颜色
        },
        {
          offset: 1,
          color: '#5CF9FE', // 100% 处的颜色
        },
      ])
      var colorSet = [
        [0.91, color],
        [1, '#ccc'],
      ]
      var rich = {
        white: {
          fontSize: 30,
          color: '#fff',
          fontWeight: '500',
          padding: [70, 0, 0, 0],
        },
        bule: {
          fontSize: 40,
          fontFamily: 'DINBold',
          color: '#fff',
          fontWeight: '700',
          padding: [70, 0, 0, 0],
          // top: 'center'
        },
        size: {
          height: 10,
          padding: [0, 0, 0, 0],
        },
      }
      var option = {
        backgroundColor: '#ebf6fc',
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%',
        },
        series: [
          {
            type: 'gauge',
            name: '外层辅助',
            center: ['50%', '60%'],
            radius: '92%',
            startAngle: '225',
            endAngle: '-45',
            splitNumber: '100',
            pointer: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 1,
              },
            ],

            axisLine: {
              show: true,
              lineStyle: {
                color: [[1, '#00FFFF']],
                width: 2,
                opacity: 1,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              length: 20,
              lineStyle: {
                color: '#051932',
                width: 0,
                type: 'solid',
              },
            },
            axisLabel: {
              show: false,
            },
          },
          {
            type: 'gauge',
            radius: '84%',
            center: ['50%', '60%'],
            startAngle: '225',
            endAngle: '-45',
            pointer: {
              show: false,
            },
            detail: {
              formatter: function(value) {
                var num = Math.round(value)
                return '{bule|' + num + '}{white|分}'
              },
              rich: rich,
              offsetCenter: ['0', '50%'],
            },
            data: dataArr,
            title: {
              show: true,
              offsetCenter: [0, -94],
              fontWeight: 450,
              fontSize: 17,
              textAlign: 'center',
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colorSet,
                width: 10,
                // shadowBlur: 15,
                // shadowColor: '#B0C4DE',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              length: 25,
              lineStyle: {
                color: '#00377a',
                width: 2,
                type: 'solid',
              },
            },
            axisLabel: {
              show: false,
            },
          },
          {
            name: '灰色内圈', //刻度背景
            type: 'gauge',
            z: 2,
            radius: '70%',
            startAngle: '225',
            endAngle: '-45',
            center: ['50%', '60%'],
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, '#018DFF']],
                width: 2,
                opacity: 1, //刻度背景宽度
              },
            },
            splitLine: {
              show: false,
            },
            // data: [{
            //     show: false,
            //     value: '80'
            // }], //作用不清楚
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            detail: {
              show: 0,
            },
          },
          {
            name: '白色圈刻度',
            type: 'gauge',
            radius: '70%',
            center: ['50%', '60%'],
            startAngle: 225, //刻度起始
            endAngle: -45, //刻度结束
            z: 4,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 7, //刻度节点线长度
              lineStyle: {
                width: 2,
                color: 'rgba(1,244,255, 0.9)',
              }, //刻度节点线
            },
            axisLabel: {
              color: 'rgba(255,255,255,0)',
              fontSize: 12,
            }, //刻度节点文字颜色
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                name: '',
              },
            ],
          },
          {
            //内圆
            type: 'pie',
            radius: '64%',
            center: ['50%', '60%'],
            z: 1,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.8,
                  [
                    {
                      offset: 0,
                      color: '#4978EC',
                    },
                    {
                      offset: 0.5,
                      color: '#519ee2',
                    },
                    {
                      offset: 1,
                      color: '#226fb2',
                    },
                  ],
                  false
                ),
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            label: {
              show: false,
            },
            tooltip: {
              show: false,
            },
            data: [100],
          },
        ],
      }
      return option
    },
    getOption3() {
      let option = {
        title: {
          text: '订单数据分析',
          left: 'center',
          textStyle: {
            fontWeight: 450,
            fontSize: 17,
          },
        },

        backgroundColor: '#ebf6fc',
        grid: {
          top: '0%',
        },
        tooltip: {
          show: false,
          trigger: 'item',
          padding: [5, 10],
        },
        radar: {
          // shape: 'circle',
          center: ['50%', '56%'],
          radius: '60%',
          splitNumber: 4,
          nameGap: 2,
          name: {
            textStyle: {
              color: '#999',
              borderRadius: 3,
              padding: [5, 5],
            },
          },
          indicator: [
            {
              name: '已处理数',
              max: 10,
            },
            {
              name: '已审核数',
              max: 10,
            },
            {
              name: '派单数',
              max: 10,
            },
            {
              name: '处理',
              max: 10,
            },
            {
              name: '完成数',
              max: 10,
            },
            {
              name: '好评数',
              max: 10,
            },
          ],
        },
        series: [
          {
            name: '风险评估',
            type: 'radar',
            areaStyle: {
              normal: {
                width: 1,
                opacity: 0.7,
              },
            },
            data: [
              {
                itemStyle: {
                  normal: {
                    color: '#67abff',
                    lineStyle: {
                      color: '#67abff',
                    },
                  },
                },
                value: [3, 5, 8, 9, 10, 8],
              },
            ],
          },
        ],
      }
      return option
    },
    setDownKFData() {
      if (this.$store.state.user.isTest) {
        return
      }

      let param = {
        userCode: this.$store.state.user.operCode,
      }
      // let param = {
      //   token = this.$storage.getSession('token')
      // }

      this.$api.kfRemote.setDownKFData(param).then((res) => {
        // 客服下线
        if (res.data && res.data && res.data.code == 0) {
          this.delIframe()
        } else {
          this.$message.error('客服退出失败')
        }
      })
    },
    // 登录客服
    setUpKFData() {
      if (this.$store.state.user.isTest) {
        return
      }
      let param = {
        userCode: this.$store.state.user.isTest
          ? this.$store.state.user.operCode
          : this.$storage.getSession('account').operCode,
        userName: this.$store.state.user.isTest
          ? this.$store.state.user.userName
          : this.$storage.getSession('account').userName,
        userPhone: this.$store.state.user.empSms,
      }
      this.$api.kfRemote.setUpKFData(param).then((res) => {
        if (res.data && res.data.data && res.data.data.url) {
          this.kfIframeUrl = res.data.data.url
          this.createIframe()
          clearInterval(this.kfTime) // 清除时间
          this.kfTime = setInterval(() => {
            this.getNoReadNew()
          }, 10000)
        } else {
          this.$message.error('客服上线失败')
        }
      })
    },
    // 创建iframe
    createIframe() {
      this.delIframe()
      let kfIframe = document.createElement('iframe')
      kfIframe.src = this.kfIframeUrl
      kfIframe.id = 'workdesk-kf-iframe'
      kfIframe.style.display = 'none'
      let body = document.getElementsByTagName('body')
      body[0].appendChild(kfIframe)
    },
    delIframe() {
      // 有iframe的dom代码
      let haveIframe = document.getElementById('workdesk-kf-iframe')
      if (haveIframe) {
        document.body.removeChild(haveIframe)
      }
    },
    getNoReadNew() {
      if (this.$store.state.user.isTest) {
        return
      }

      let param = {
        userCode: this.$store.state.user.isTest
          ? this.$store.state.user.operCode
          : this.$storage.getSession('account').operCode,
      }
      this.$api.kfRemote.getNoReadNew(param).then((res) => {
        if (res.data && res.data.data && res.data.data.unread_num) {
          if (
            this.numObj.noReadNewNum != res.data.data.unread_num &&
            this.numObj.noReadNewNum > 0
          ) {
            this.getMusic()
          }
          this.numObj.noReadNewNum = res.data.data.unread_num
          this.isHaveNoRead = this.numObj.noReadNewNum > 0
        }
      })
    },
  },
  computed: {
    topCommonData() {
      let list = this.filterCommonData.slice(
        this.allCommonIndex * 6,
        this.allCommonIndex * 6 + 6
      )
      return list.splice(0, 3)
    },
    bottomCommonData() {
      let list = this.filterCommonData.slice(
        this.allCommonIndex * 6,
        this.allCommonIndex * 6 + 6
      )
      return list.splice(3)
    },
  },
  data() {
    return {
      recordCode: null,
      isShowNotions: false,
      isWorkOrders: false,
      numObj: {
        handlingNum: 0,
        dispatchingNum: 0,
        itsmNum: 0,
        noReadNewNum: 0,
      },
      numTime: 0,
      kfTime: 0,
      userCode: '',
      reverse: true,
      isHaveNoRead: false,
      showWorkSmallBut: false,
      butAuthorityList: [],
      activities: [],
      allCommonIndex: 0,
      echartIndex: 0,
      kfIframeUrl: '',
      kfDialogUrl: '',
      notionForm: {},
      topCommonCss: [
        {
          itemBack: '#29da27',
          leftBack: '#e3f9e4',
          leftIcon: 'el-icon-s-order',
          leftIconColor: '#04ba03',
        },
        {
          itemBack: '#fe8282',
          leftBack: '#f9e5e6',
          leftIcon: 'el-icon-s-data',
          leftIconColor: '#ff2422',
        },
        {
          itemBack: '#b18bff',
          leftBack: '#efe7ff',
          leftIcon: 'el-icon-s-claim',
          leftIconColor: '#5539ff',
        },
      ],
      bottomCommonCss: [
        {
          itemBack: '#9bd4ff',
          leftBack: '#ebf4f9',
          leftIcon: 'el-icon-coin',
          leftIconColor: '#1499fe',
        },
        {
          itemBack: '#feb765',
          leftBack: '#ffefdb',
          leftIcon: 'el-icon-user',
          leftIconColor: '#fe8a00',
        },
        {
          itemBack: '#ffa9bb',
          leftBack: '#ffdfe8',
          leftIcon: 'el-icon-phone',
          leftIconColor: '#f65076',
        },
      ],
      filterCommonData: [],
      allCommonData: [
        {
          //   content: 'ITSM',
          //   routeName: '',
          // },{
          //   content: 'CRM',
          //   routeName: '',
          // },{
          //   content: 'OA',
          //   routeName: ''
          // },{
          //     content: '电话',
          //     routeName: '',
          // },{
          content: '抢单',
          routeName: '/pendingPool',
          butCode: 'fight-order',
          jumpType: 'router',
        },
        {
          content: '公告管理',
          routeName: '/noticeShow',
          butCode: 'notion-manage',
          jumpType: 'router',
        },
        {
          content: '流程管理',
          routeName: '/cf-deployManage',
          butCode: 'model-manage',
          jumpType: 'router',
          // },{
          //   content: '分类管理',
          //   routeName: '/classify',
          //   butCode: 'classify-manage'
        },
        {
          content: '资源管理',
          routeName: '/upload',
          butCode: 'resource-manage',
          jumpType: 'router',
        },
        {
          content: '历史工单',
          routeName: '/workorderList',
          butCode: 'history-order',
          jumpType: 'router',
        },
        {
          content: '全部工单',
          routeName: '/allPool',
          butCode: 'all-order',
          jumpType: 'router',
        },
        {
          content: '知识库',
          routeName: '/knowManage',
          butCode: 'knowledge-store',
          jumpType: 'router',
        },
        {
          content: '客服管理',
          routeName: '/',
          butCode: 'knowledge-store',
          jumpType: 'dialog',
        },
      ],
      historyTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      noticeTableData: [],
      fileTableData: [],
      tableHeaderClass: 'tableHeaderClass',
      signInType: 1,
      workStateType: true,
      optionList: [
        this.getOption(),
        this.getOption1(),
        this.getOption2(),
        this.getOption3(),
      ],
    }
  },
  watch: {
    historyTime(newV) {
      debounce(this.getTimeListData, 100)
    },
  },
  mounted() {},
  created() {
    this.numTime = setInterval(() => {
      this.getNum()
    }, 20000)
    this.getNum()
    this.getUser() // 如果查到状态是E,就设置客服上线
    this.getSystemNotices()
    this.getDownloadFiles()
    this.getTimeListData()
    this.getEchart()
    this.getNoReadNew()
    this.getButAuthorityList()
    this.getKfManageData()
  },
  beforeDestroy() {
    clearInterval(this.numTime)
    clearInterval(this.kfTime)
  },
}
</script>

<style scoped>
@import url('./css/index.css');
@import url('./font/iconfont.css');

.custom-date-picker > div {
  display: inline-block;
}

.custom-date-picker > ul {
  display: inline-block;
  vertical-align: top;
  width: calc(100% - 313px);
  height: 214px;
  padding: 5px 0;
  overflow-y: auto;
  text-align: center;
}
.custom-date-picker > ul > span {
  text-align: center;
  margin-top: 10px;
  color: #909399;
  display: inline-block;
}

.common-font-workdesk {
  color: #666;
  font-weight: 400;
  letter-spacing: 0;
  font: 13px 'Microsoft YaHei', '微软雅黑';
}

.deploy-wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
}
</style>

<style>
.deploy-wrap .el-dialog__body {
  padding: 22px 20px;
}
.workDesk .el-dialog__body {
  padding: 22px 20px;
}

.workDesk-card .el-table__row:hover {
  cursor: pointer;
}
</style>
