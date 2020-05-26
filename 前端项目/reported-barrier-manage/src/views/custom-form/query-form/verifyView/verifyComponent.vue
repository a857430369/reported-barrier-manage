<template>
  <div :style="background == '' ? '' : 'background: ' + background">
    <div class="major-contain">
      <div class="option-contain">
        <h3>签名意见</h3>
      </div>
      <div class="main-contain">
        <el-row>
          <el-col :span="12">
            <p>请选中您的常用意见</p>
            <ul>
              <div class="empty"
                   style="text-align: center"
                   v-if="viewList.length == 0">输入到左边内容进行存储</div>

              <li v-else
                  v-for="(item,index) in viewList"
                  :key="index"
                  :style="index == viewIndex ? 'background: #ccc' : ''"
                  @click="saveViewIndex(index)"
                  @dblclick="addView(item.content)">{{ item.content }}</li>
            </ul>
            <el-button size="mini"
                       type="primary"
                       @click="choose">使用意见</el-button>
            <el-button size="mini"
                       type="success"
                       @click="toUp">上移</el-button>
            <el-button size="mini"
                       type="warning"
                       @click="toDown">下移</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="delView">删除</el-button>
          </el-col>
          <el-col :span="12">
            <p>请选中您的常用意见</p>
            <textarea type="textarea"
                      class="textarea-content"
                      v-model="textareas">
            </textarea>

            <el-button size="mini"
                       type="primary"
                       @click="addViewList">存为常用</el-button>
            <el-button size="mini"
                       type="success"
                       @click="textareas = ''">清空</el-button>

          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    background: {
      type: String,
      default: ''
    },
    viewListProp: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      textareas: '',
      viewIndex: -1,
    }
  },
  watch: {
    textareas: {
      handler(newVal) {
        this.$emit('getVerifyReply', this.textareas)
      }
    },
    viewListProp: {
      handler(newVal) {
        if (newVal.length > 0) {
          this.viewIndex = 0
        }
      }
    }
  },
  computed: {
    viewList() {
      return this.viewListProp
    }
  },
  methods: {
    addViewList() {
      if (this.textareas != '') {
        this.viewList.push({ content: JSON.parse(JSON.stringify(this.textareas)) })
        this.$emit('setViewList', this.viewList)
      }
    },
    saveViewIndex(index) {
      this.viewIndex = index
    },
    addView(view) {
      this.textareas = view
    },
    delView() {
      if (this.viewIndex > -1) {
        this.viewList.splice(this.viewIndex, 1)
        this.viewIndex = -1

        this.$emit('setViewList', this.viewList)
      }
    },
    toUp() {
      if (this.viewIndex > 0) {
        let one = JSON.parse(JSON.stringify(this.viewList[this.viewIndex - 1]))
        let two = JSON.parse(JSON.stringify(this.viewList[this.viewIndex]))
        Vue.set(this.viewList, this.viewIndex, one)
        Vue.set(this.viewList, this.viewIndex - 1, two)
        this.viewIndex--

        this.$emit('setViewList', this.viewList)
      }
    },
    toDown() {
      if (this.viewIndex > -1 && this.viewIndex != this.viewList.length) {
        let one = JSON.parse(JSON.stringify(this.viewList[this.viewIndex]))
        let two = JSON.parse(JSON.stringify(this.viewList[this.viewIndex + 1]))
        Vue.set(this.viewList, this.viewIndex + 1, one)
        Vue.set(this.viewList, this.viewIndex, two)
        this.viewIndex++

        this.$emit('setViewList', this.viewList)
      }
    },
    choose() {
      if (this.viewList[this.viewIndex]) {
        this.textareas = this.viewList[this.viewIndex].content
      }
    }
  },
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
.major-contain {
  margin: 0 auto;
  width: 95%;
  margin-bottom: 30px;
  .option-contain {
    width: 100%;
    height: 50px;
    background: skyblue;
    border-radius: 1%;
    display: flex;
    align-items: left;
    padding-left: 10px;
  }
  .main-contain {
    padding-top: 5px;
    width: 100%;
    background: #f7f7f7;
    border: 1px solid #00000020;
    border-radius: 1%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
ul {
  list-style: none;
  border-style: inset;
  padding: 2px;
  height: 100px;
  overflow-x: auto;
  overflow-y: scroll;
  li {
    padding: 1px 0;
    cursor: pointer;
  }
  li:hover {
    background: #ccc;
  }
}
.but-layout {
  display: flex;
}
.verify-win {
  list-style: none;
  border-style: inset;
  padding: 2px;
  height: 100px;
}
.textarea-content {
  border-style: inset;
  height: 100px;
  outline-style: none;
  background-color: #f7f7f7;
  width: 100%;
  margin-bottom: 12px;
}
.empty {
  text-align: center;
  color: #00000060;
  margin-top: 30px;
}
</style>

