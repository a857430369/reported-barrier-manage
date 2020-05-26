<template>
  <div class="all" ref="providall">
    <el-table :data="list" border fit style="width: 100%">
      <el-table-column
        type="index"
        width="70px"
        label="序号"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        width="155px"
        prop="pre_at"
        label="期望时间"
        sortable
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column>

      <el-table-column
        width="155px"
        sortable
        label="剩余处理时间"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
        <template scope="scope">
          <p v-if="scope.row.countDowm > 0">{{ time(scope.row.countDowm) }}</p>
          <p v-else>已超时</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          pre_at: '2020-05-26',
          countDowm: '',
        },
        {
          pre_at: '2020-05-26 16:18:36',
          countDowm: '',
        },
        {
          pre_at: '2020-05-27',
          countDowm: '',
        },
      ],
      ticker: null,
      d: '',
      h: '',
      m: '',
      s: '',
    }
  },
  created() {
    //请求数据
    //首先循环数组 在 正常的情况下这个数组是后台传递过来的 然后将这个数组中的最后截止时间减去当前时间获得时间戳
    for (let i = 0, len = this.list.length; i < len; i++) {
      const item = this.list[i]
      item.countDowm = new Date(item.pre_at).getTime() - new Date().getTime()
    }
    //this.iconlist = this.list //将改变后的数组赋值给自定义的数组 然后调用计时器 每秒减去指定字段的时间戳 -1000毫秒
    if (this.ticker) {
      //这一段是防止进入页面出去后再进来计时器重复启动
      clearInterval(this.ticker)
    }
    this.beginTimer() //启动计时器减指定字段的时间
  },
  methods: {
    //开启定时器
    beginTimer() {
      this.ticker = setInterval(() => {
        for (let i = 0, len = this.list.length; i < len; i++) {
          const item = this.list[i]
          if (item.countDowm > 0) {
            item.countDowm = item.countDowm - 1000
          }
        }
      }, 1000)
    },
    //格式化时间
    time(time) {
      if (time >= 0) {
        let d = Math.floor(time / 1000 / 60 / 60 / 24)
        let h = Math.floor((time / 1000 / 60 / 60) % 24)
        let m = Math.floor((time / 1000 / 60) % 60)
        let s = Math.floor((time / 1000) % 60)
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        s = s < 10 ? '0' + s : s
        return d + '天' + h + '时' + m + '分' + s + '秒'
      }
    },
  },
  mounted() {},
  destroyed() {},
}
</script>
