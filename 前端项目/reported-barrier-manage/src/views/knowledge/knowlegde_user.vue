<template>
  <div :style="{ height: Screanheight + 'px' }" class="content_index">
    <div class="know_user">
      <div style="margin-bottom: 20px; display: flex;">
        <el-input v-model="form.noticeName"></el-input>
        <transition name="el-zoom-in-center">
          <el-button
            style="margin-left: 10px"
            v-if="tabActive"
            type="primary"
            icon="el-icon-search"
            @click="onSearch(1)"
            >搜索</el-button
          >
        </transition>
        <el-button
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-search"
          @click="onSearch(2)"
          >全站搜索</el-button
        >
      </div>
      <div style="display: flex">
        <div>
          <el-button
            type="text"
            class="index_style_set"
            :style="{ color: tabActive ? 'black' : '#3a8ee6' }"
            @click="BackIndex"
            >主页</el-button
          >
        </div>

        <el-tabs
          v-model="tabData"
          type="card"
          @tab-click="handleClick"
          class="width_tab"
          :class="
            tabActive ? 'funtion_content_tab_active' : 'funtion_content_tab'
          "
        >
          <el-tab-pane
            v-for="(item, index) in knowTree"
            :name="item.knowledgeName"
            :key="index"
          >
            <el-popover
              slot="label"
              placement="bottom"
              popper-class="popoverPaddingChange"
              trigger="hover"
            >
              <span slot="reference"
                >{{ item.knowledgeName
                }}<i class="el-icon-arrow-down el-icon--right"></i
              ></span>

              <el-cascader-panel
                v-model="value[index]"
                class="knowCascaderChose"
                @change="handleChangeCas"
                :props="{
                  checkStrictly: true,
                  expandTrigger: 'hover',
                  label: 'knowledgeName',
                  value: 'knowledgeCode',
                }"
                :options="getArr(item)"
              >
                <template slot-scope="{ node, data }">
                  <span>{{ data.knowledgeName }}</span>
                </template>
              </el-cascader-panel>
            </el-popover>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div
        v-if="knowContent.length > 0"
        style="min-height: 80%;max-height:87%;overflow: scroll"
      >
        <div v-if="!isShow">
          <div
            class="content"
            v-for="(item, index) in knowContent"
            :key="index"
            v-loading="loading"
          >
            <div class="content_text">
              <el-link
                :underline="false"
                @click="getContentNotice(item)"
                class="title"
                >{{ item.noticeName }}</el-link
              >
              <p style="font-size: 14px; margin-top: 10px">
                {{ getStr(item.noticeContent) }}
              </p>
              <div class="content_footer">
                <div style="text-align: left;width: 100%;">
                  <p>类别:{{ getName(item.knowledgeCode) }}</p>
                  <p>作者:{{ item.userName }}</p>
                </div>
                <div class="time_content">
                  <i class="el-icon-time">
                    {{ item.createDt }}
                  </i>
                </div>
              </div>
              <el-divider style="margin: 0px"></el-divider>
            </div>
          </div>
        </div>
        <div v-else>
          <knowContentuser :notice="getNotice"> </knowContentuser>
        </div>
      </div>
      <div v-else style="text-align: center; margin: 100px">
        <img :src="require('@/assets/knowledge/notData.png')" />
        <h1 style="color:rgb(208, 208, 208)">暂无数据</h1>
      </div>
      <!-- <div v-if="!isShow" style="min-height: 80%;max-height:87%;overflow: scroll">
       <div class="content" v-for="(item, index) in knowContent" :key="index" v-loading="loading">
          <div class="content_text">
            <el-link :underline="false" @click="getContentNotice(item)" class="title">{{item.noticeName}}</el-link>
            <p style="font-size: 14px; margin-top: 10px">{{getStr(item.noticeContent)}}</p>
            <div class="content_footer">
              <div style="text-align: left;width: 100%;">
              <p>
                类别:{{getName(item.knowledgeCode)}}
              </p>
              <p>
                作者:{{item.userName}}
              </p>
            </div>
            <div class="time_content">
              <i class="el-icon-time">
                {{item.createDt}}
              </i>
            </div>
            </div>
            <el-divider style="margin: 0px"></el-divider>
          </div>
          
        </div>
     </div > -->

      <!-- <div v-if="!isShow">
       <el-pagination
        v-if="allChose"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :total="1000">
      </el-pagination> -->
      <!-- </div> -->

      <!-- <div v-else style="height:87%;">
      <knowContentuser
      :notice="getNotice">

      </knowContentuser>
    </div> -->
    </div>
  </div>
</template>

<script>
import knowContentuser from '../../components/knowledge/knowContent-user'

import { objDeepCopy } from '@/utils/index'

export default {
  data() {
    return {
      tabActive: false,
      loading: true,
      tabData: '新浪新闻（记录身边大小事情）',
      value: {},
      changeValue: {},
      knowContent: [],
      knowData: [],
      knowTree: [],
      form: {
        knowledgeCode: '',
        noticeName: '',
      },
      onSearchFlag: 1,
      isShow: false,
      getNotice: {},
      Screanheight: window.innerHeight - 30,
    }
  },

  components: {
    knowContentuser,
  },

  mounted() {
    this.getIndexContent(this.form)
    this.getTreeKnow()
    this.getAllKnow()
  },

  methods: {
    // 前50个字
    getStr(html) {
      html = html
        .replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
        .replace(/<br\/?>/gi, '\n')
        .replace(/<[^>/]+>/g, '')
        .replace(/(\n)?<\/([^>]+)>/g, '')
        .replace(/\u00a0/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/<img[^>]+src\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>/g, '')
        .replace(/&middo/g, '')
        .replace(/&rdquo;|&ldquo;/g, '')
      return (html = html.slice(0, 200))
    },

    // 主页
    BackIndex() {
      this.tabActive = false
      this.value = objDeepCopy(this.changeValue)
      this.form = {
        knowledgeCode: '',
        noticeName: '',
      }
      this.getIndexContent(this.form)
      this.getAllKnow()
    },

    // 获取详情页
    getContentNotice(item) {
      this.isShow = true
      this.getNotice = item
    },

    // 搜索
    // 1为当前页
    // 2为全站
    onSearch(val) {
      if (val === 1) {
        this.onSearchFlag = 1
        this.getIndexContent(this.form)
      } else {
        this.onSearchFlag = 2
        this.form.knowledgeCode = ''
        this.value = objDeepCopy(this.changeValue)
        this.tabActive = false
        this.getIndexContent(this.form)
      }
    },

    // 转变数组
    getArr(item) {
      let arr = [item]
      return arr
    },

    // 主页获取名字
    getName(code) {
      let getIndex = 0
      var get = this.knowData.some((item, index) => {
        if (item.knowledgeCode === code) {
          getIndex = index
        }
      })
      return this.knowData[getIndex].knowledgeName
    },

    // 获取树形结构
    async getTreeKnow() {
      await this.$api.knowUser.findAll().then((res) => {
        if (res) {
          this.loading = false
          if (res.code === 0) {
            this.knowTree = res.content

            for (let n = 0; n < this.knowTree.length; n++) {
              this.value[n] = []
            }
            this.changeValue = objDeepCopy(this.value)
          }
        } else {
          this.loading = true
        }
      })
    },

    // 获取所有知识类
    async getAllKnow() {
      await this.$api.knowUser.findAllTable().then((res) => {
        if (res) {
          this.loading = false
          if (res.code === 0) {
            this.knowData = res.content
          }
        }
      })
    },

    // 主页获取内容
    getIndexContent(form) {
      this.$api.knowUser.findKnowledgeByNoticeName(form).then((res) => {
        if (res) {
          this.loading = false
          if (res.code === 0) {
            this.knowContent = res.content
            this.isShow = false
            if (this.onSearchFlag === 1) {
            } else {
              this.form.knowledgeCode = ''
            }
          }
        } else {
          this.loading = true
        }
      })
    },

    handleChange(value) {},

    handleChangeCas(val) {
      this.value = objDeepCopy(this.changeValue)

      let getIndex = 0
      let getName = ''
      this.form.knowledgeCode = val[val.length - 1]
      this.knowTree.some((item, index) => {
        if (item.knowledgeCode === val[0]) {
          getIndex = index
        }
        if (item.knowledgeCode === val[0]) {
          getName = item.knowledgeName
        }
      })
      this.tabActive = true
      this.tabData = getName
      this.value[getIndex] = val
      let form = {
        knowledgeCode: this.form.knowledgeCode,
        noticeName: '',
      }
      this.getIndexContent(form)
    },

    handleClick(item) {
      this.value = objDeepCopy(this.changeValue)
      this.tabActive = true
      this.form.knowledgeCode = this.knowTree[item.index].knowledgeCode
      this.value[item.index] = [this.knowTree[item.index].knowledgeCode]
      let form = {
        knowledgeCode: this.form.knowledgeCode,
        noticeName: '',
      }
      this.getIndexContent(form)
    },

    // 分页功能
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
  },
}
</script>

<style scoped>
.know_user {
  width: 95%;
  min-width: 765px;
  height: 100%;
  margin: 0px auto;
  padding: 30px;
}
.content {
  display: flex;
}
.content_text {
  margin: 10px;
  width: 100%;
}
.title {
  color: black;
  font-size: 2em;
}
.content_footer {
  width: 100%;
  margin-top: 4%;
  display: flex;
}
.time_content {
  text-align: right;
  width: 100%;
  margin: 1%;
}
.width_tab {
  width: 95%;
}
.index_style_set {
  margin: 2px;
  width: 54px;
}
.content_index {
  height: 20%;
  width: 100%;
  background-color: #f2f3f5;
}
</style>
<style>
.funtion_content_tab_active .el-tabs__item.is-active {
  color: #3a8ee6;
  border-bottom-color: #f2f3f5 !important;
}
.funtion_content_tab .el-tabs__item.is-active {
  color: #303133;
  border-bottom-color: #e4e7ed !important;
}
.knowCascaderChose .el-radio {
  width: 100% !important;
  height: 100% !important;
  z-index: 10 !important;
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
}
.knowCascaderChose.is-bordered {
  border: 1px solid #ffffff;
}

.knowCascaderChose .el-radio__input {
  visibility: hidden !important;
}
/* 这个样式针对IE有用，不考虑IE的可以不用管*/
.knowCascaderChose .el-cascader-node__postfix {
  top: 10px !important;
}
.content_text .el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 7px 0;
}
.knowCascaderChose .el-cascader-menu {
  /* min-width: auto; */
  box-sizing: border-box;
  color: #606266;
}
.popoverPaddingChange {
  padding: 0px;
}
.popoverPaddingChange .knowCascaderChose .el-cascader-menu {
  width: 100%;
}
</style>
