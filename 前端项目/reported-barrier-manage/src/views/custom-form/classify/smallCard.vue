<template>
  <div class="box-info">
    <div>
    <p>{{ dataObj.classifyName }}</p>
    <p>{{ dataObj.classifyRemark }}</p>
    {{ test(smallClassifyList) }}
    <div style="overflow: auto">
    <ul class="card-tip" id="" v-if="isShowSmallClassify">
      <li :class="index == 0 ? 'on' : ''" v-for="(item,index) in smallClassifyList"
       :key="item.classifyCode" @mouseover="mouseoverEvent(index)">
        <span><img :src="smallImgList[(index + 5) % 11]">{{ item.classifyName }}</span>
        <span>
          <i class="el-icon-arrow-right"></i>
        </span>
      </li>
    </ul>
    
    <div class="card-content">
      <ul v-if="modelList.length > 0">
        <li v-for="(item,index) in modelList" :key="item.code" @click="writeModel(item)">
          <div class="classify-model">
            <div class="classify-model-title">
              <img :src="smallImgList[(index) % 11]">
              <span>{{ item.modelName }}</span>
            </div>
            <div class="classify-model-remark">
              <span>{{ item.outFieldDesc }}</span>
            </div>
          </div>
        </li>
      </ul>
      <span v-else class="no-have">暂无数据</span>
    </div>

    </div>
    <div style="clear: both"></div>
    </div>
    <div class="box-info-img">
      <img :src="imgSrc">
    </div>
  </div>
</template>

<style scoped>
.classify-model {
  text-align: left;
  width: 100%;
  margin-left: 5px;
  color: #545d69;
  padding: 10px 10px 13px 20px;
  border: 1px solid #eee;
  margin-bottom: 2px;
}
.classify-model:hover {
  background: #eeeff2;
  color: #18b2b4;
}


.classify-model-title {
  margin-bottom: 5px;

}
.classify-model-title img {
  margin-right: 10px;
}

.classify-model-title span {
  font-size: 17px;
}
.classify-model-remark span {
  color: #b5bdca;
  font-size: 13px;
}


</style>

<script>
export default {
  data() {
    return {
      modelList: [],
      imgList: [
        require("./icon/classify/bigImg1.png"), 
        require("./icon/classify/bigImg2.png"), 
        require("./icon/classify/bigImg3.png"), 
        require("./icon/classify/bigImg4.png"), 
        require("./icon/classify/bigImg5.png"), 
        require("./icon/classify/bigImg6.png")
      ],
      smallImgList: [
        require("./icon/small/icon1.png"), 
        require("./icon/small/icon2.png"), 
        require("./icon/small/icon3.png"), 
        require("./icon/small/icon4.png"), 
        require("./icon/small/icon5.png"), 
        require("./icon/small/icon6.png"),
        require("./icon/small/icon7.png"),
        require("./icon/small/icon8.png"),
        require("./icon/small/icon9.png"),
        require("./icon/small/icon10.png")
      ],
      isShowSmallClassify: true,
      scCode: '',
      bcCode: '',
      imgSrc: '',
      dataObj: {},
      cache: {},
      scIndex: 0  
    }
  },
  computed: {
    smallClassifyList() {
      return this.dataObj['children']
    }
  },  
  props: {
    index: Number,
		data: Array
  },
  watch: {
    // 大类的下标
    index(newV) {
      if (newV > -1) {
        this.isShowSmallClassify = true,
        this.scIndex = 0
        this.getDataObj(newV)
      }
    },
    // 小类的下标
    scIndex(newV) {
      if (newV > -1) {
        this.getModelData()
      }
    },
  },
  methods: {
    test(data) {
      console.log('data', data)
    },
    writeModel(data) {
      let writeStore = require('../write-form/store/index')
      let param = {
        modelCode: data.code,
        verifyType: data.verifyType,
        bigClassifyCode: this.bcCode,
        smallClassifyCode: this.scCode
      }
      writeStore.store.setModel(param)

      this.$router.push({
        path: '/cf-write',
      })

    },
    // 得到模板数组数据
    getModelData() {
      this.modelList = []

      this.bcCode = this.dataObj['classifyCode']
      if (!(this.dataObj['children'] && this.dataObj['children'][this.scIndex] && this.dataObj['children'][this.scIndex]['classifyCode'])) {
        this.isShowSmallClassify = false
        return
      }
      this.scCode = this.dataObj['children'][this.scIndex]['classifyCode']
      // 检查是否需要小类
      this.checkSmallClassify()

      if (this.cache[this.bcCode] && this.cache[this.bcCode][this.scCode]) {
        this.modelList = this.cache[this.bcCode][this.scCode]

      } else {
        this.$api.manage.listModelByAll({ classifyCode: this.scCode }).then(res => {
          this.modelList = res.content
          !this.cache[this.bcCode] && (this.cache[this.bcCode] = {})
          this.cache[this.bcCode][this.scCode] = this.modelList
        })
      }
    },
    checkSmallClassify() {
      let bcName = this.dataObj['classifyName']
      let scLength = this.dataObj['children'].length
      let scName = this.dataObj['children'][this.scIndex]['classifyName']

      if (scLength == 1 && bcName == scName) {
        this.isShowSmallClassify = false
      }
    },
    mouseoverEvent(index) {
      let domList = document.querySelectorAll(".card-tip li")
      $(domList[index]).addClass('on').siblings().removeClass('on');
      this.scIndex = index
    },
    getDataObj(index) {
      this.imgSrc = this.imgList[index % 6],
      this.dataObj = this.data[index]
      this.getModelData()
    },
    unbindEvent() {
      $(".card-tip li").unbind()
    },
    bindEvent() {
      var that = this
      $(".card-tip li").hover(function () {
        $(this).addClass('on').siblings().removeClass('on');
        that.scIndex = $(this).index()
      })
    }
  },
  mounted() {
    this.bindEvent()
    this.getDataObj(this.index)
  }
}
</script>

<style lang="less" scoped>
.box-info {
  --classify-model: 300px;
  float: left;  
  width: calc(100% - 339px);
  min-width: 615px;
  color: #828992;
  padding-left: 50px;
  padding-top: 25px;
  box-sizing: border-box;
  background-color: #f7f8fa;
  font-family: 'Microsoft YaHei', '微软雅黑';
}
.box-info-img {
  text-align: center;
}

.box-info>div>p:nth-child(1) {
  font-size: 30px;
  color: #545d69;  
}
.box-info>div>p:nth-child(2) {
  margin: 24px 0 24px;
  font-size: 14px;
  color: #545d69;  
}
.card-tip {
  width: var(--classify-model);
  background: #f0f1f4;
  color: #828992;
  float: left;
  border-radius: 5px 0px 0px 5px;
  li {
    text-align: left;
    border-bottom: 1px solid #ccc;
    font-size: 20px;
    font-family: 'Microsoft YaHei', '微软雅黑';
    position: relative;
    padding: 23px 0;

    span {
      display: inline-block;
      img {
        padding: 0 10px;
      }
      &:first-child {
        margin-left: 5px;
        width: calc(88% - 10px);
        margin-right: 5px;
      }
      &:last-child {
        width: 12%;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    i {
      text-align: right;
    };
    &:last-child {
      border-bottom: unset;
    }
    span {
      &:last-child {
        display: inline-block;
        float: right;
      }
    }
  }
  .on {
    color: #3fcbce;
    cursor: pointer;
  }
}
.card-content {
  width: calc(100% - var(--classify-model));
  padding-right: 50px;
  text-align: center;
  float: left;
  ul {
    margin-left: 5px;
  }
  ul li {
    display: block;
    color: #8c939e;    
    font-size: 16px;
    box-sizing: border-box;
    &:hover {
      cursor: pointer;
    }
  }
}
.no-have {
  text-align: center;
  margin-top: 42px;
  font-size: 16px;
  margin-top: 23px;
  display: inline-block;
}

</style>
