<template>
  <el-tooltip class="item" effect="light" :content="timeContent" placement="top">
    <li class="el-timeline-item line-item-my">
      <span :style="'color:' + colorList[index % 4]">{{timestamp}}</span>
      <font class="point">
        <label v-if="reverse ? index != 0 : index != length - 1"></label>
        <span :style="'background:' + colorList[index % 4]"></span>
      </font>
      <span :style="'color:' + colorList[index % 4]">
        {{ timeContent }}
      </span>
    </li>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.line-item-my {
  width: 100%;
  padding: 0;
  white-space: pre;
  overflow-x: hidden;
  overflow-y: hidden;
  text-overflow: ellipsis;
  padding-left: 10px;
  text-align: left;
  &>span {
    display: inline-block;
    &:last-child {
      display: unset;
    }
  }
}

.point {
  display: inline-block;
  width: 13px;
  height: 40px;
  vertical-align: top;
  position: relative;
  margin: 2px 0 0 5px;
  span {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 4px;
  }
  label {
    height: 120%;
    width: 0.8px;
    background-color: #ccc;
    display: inline-block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 4px;
  }
}
</style>

<script>
  export default {
    data() {
      return {
        colorList: ['#39abff', '#ff3f74', '#5b3ef8', '#fb7700']
      }
    },

    name: 'ElTimelineItem',

    inject: ['timeline'],

    props: {
      timestamp: String,
      timeContent: String,
      index: Number,
      length: Number,
      hideTimestamp: {
        type: Boolean,
        default: false
      },
      reverse: Boolean,
      placement: {
        type: String,
        default: 'bottom'
      },

      type: String,

      color: String,

      size: {
        type: String,
        default: 'normal'
      },

      icon: String
    }
  };
</script>
