<template>
  <el-table :data="tableData" border style="width: 100%;margin: 10px 0">
    <el-table-column
      prop="fileName"
      label="附件名称"
      header-align="center"
      align="center"
    >
    </el-table-column>

    <el-table-column
      prop="fileSize"
      label="附件大小"
      width="180"
      header-align="center"
      align="center"
    >
    </el-table-column>
    <el-table-column
      prop="userName"
      label="创建人"
      width="180"
      header-align="center"
      align="center"
    >
    </el-table-column>

    <el-table-column
      prop="createDt"
      label="创建时间"
      width="180"
      header-align="center"
      align="center"
    >
    </el-table-column>

    <el-table-column
      prop="orgName"
      label="所在部门"
      width="180"
      header-align="center"
      align="center"
    >
    </el-table-column>

    <el-table-column label="操作" header-align="center" align="center">
      <template slot-scope="item">
        <el-button type="primary" @click="download(item.row)" size="mini"
          >下载</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { downloadFile } from '@/utils/index'
export default {
  props: { recordCode: Number },
  data() {
    return {
      loading: {
        file: false,
      },
      list: [],
      fieldList: [],
      showform: {},
      tableData: [],
    }
  },
  watch: {
    orderCode(newV) {
      if (newV != '') {
        this.getFileData()
      }
    },
    immediate: true,
  },
  created() {
    this.getFileData()
  },
  methods: {
    getFileData() {
      this.loading.file = true
      this.$api.write
        .fileInfo({ recordCode: this.recordCode, type: 'Record' })
        .then((res) => {
          this.loading.file = false
          this.tableData = res.content
        })
    },
    download(data) {
      this.$api.common.downloadFile({ fileId: data.fileId }).then((res) => {
        downloadFile(res.data, data.fileName)
      })
    },
    // 将时间转化为 yyyy-MM-dd HH:MM:SS
    formatTime(data) {
      return myTime(data.uploadTime)

      function myTime(date) {
        var arr = date.split('T')
        var d = arr[0]
        var darr = d.split('-')

        var t = arr[1]
        var tarr = t.split('.000')
        var marr = tarr[0].split(':')

        var dd =
          parseInt(darr[0]) +
          '/' +
          parseInt(darr[1]) +
          '/' +
          parseInt(darr[2]) +
          ' ' +
          parseInt(marr[0]) +
          ':' +
          parseInt(marr[1]) +
          ':' +
          parseInt(marr[2])
        return dd
      } // 数字补0操作

      function addZero(num) {
        return num < 10 ? '0' + num : num
      }

      function formatDateTime(date) {
        var time = new Date(Date.parse(date))
        time.setTime(time.setHours(time.getHours() + 8))
        var Y = time.getFullYear() + '-'
        var M = addZero(time.getMonth() + 1) + '-'
        var D = addZero(time.getDate()) + ' '
        var h = addZero(time.getHours()) + ':'
        var m = addZero(time.getMinutes()) + ':'
        var s = addZero(time.getSeconds())
        return Y + M + D
      }
    },
  },
}
</script>
