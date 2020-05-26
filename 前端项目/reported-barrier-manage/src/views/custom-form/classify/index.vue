<template>
<div class="total-container">
	<el-dialog title="通知" :visible.sync="isShowNotionDialog" class="d-f-container" width="60%" top="5vh">
    <div class="total-dialog-table">
	  	<el-table :data="notionList" border fit tooltip-effect="dark">
	  	  <el-table-column property="noticeContent" show-overflow-tooltip label="内容" header-align="center" align="center"></el-table-column>
	  	  <el-table-column property="userName" label="姓名" width="80" header-align="center" align="center"></el-table-column>
	  	  <el-table-column property="createDt" label="日期" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            {{ getBigTime(scope.row.createDt) }}
          </template>					
				</el-table-column>
	  	</el-table>
    </div>
	</el-dialog>

	<section class="main_box">
		<switchCard v-if="show" @getIndex="getIndex" :data="classifyList"></switchCard>
		<smallCard v-if="show" :index="bigClassifyIndex" :data="classifyList"></smallCard>
		<div style="clear: both"></div>
	</section>
</div>	
</template>


<script>
import smallCard from './smallCard'
import switchCard from './switchCard'

export default {
  data() {
    return {
			bigClassifyIndex: 0,
			classifyList: [],
			show: false,
			isShowNotionDialog: false,
			notionList: []
		}
	},
	methods: {
    getBigTime(time) {
      return time.slice(0, 10)
    },		
		getIndex(index) {
			this.bigClassifyIndex = index
		},
		// 得到最新消息
		getNewNews() {
			this.$api.manage.noticeSecurityList().then(res => {
				this.notionList = res.content

				this.notionList = [
  {
    "createCode": "98EAEF948B52F1EAE053470D7C843E12",
    "createDt": "2020-05-25 17:02:57",
    "createIp": "132.110.64.156",
    "lastCode": "98EBFB5DBAAC770EE053470D7C841992",
    "lastDt": "2020-05-26 01:23:42",
    "lastIp": "127.0.0.1",
    "noticeCode": "00000000724a7e3e01724b1219b60003",
    "noticeName": "公告标题2323",
    "noticeSummary": "公告摘要:44",
    "noticeContent": "<p>2323</p>",
    "noticeType": "Z",
    "noticeUrgent": "J",
    "noticeStatus": "S",
    "fileId": "1015,",
    "noticeAppoint": "A",
    "clickCount": 9,
    "expireDt": "2020-05-28 00:00:00",
    "userName": "卓群斐"
  }
]

				if (this.notionList.length > 0) {
					this.isShowNotionDialog = true
				}
			})
		},
	},
	components: {
		smallCard,
		switchCard
    },
  beforeCreate() {
    this.$api.manage.getTree().then(res => {
			this.classifyList = res.content

			this.show = true
    })
	},
	created() {
		if (!this.$store.state.user.isTest) {
			let uId = (this.$store.state.user.isTest ? this.$store.state.user.operCode : this.$storage.getSession('account').operCode)
			let uName = (this.$store.state.user.isTest ? this.$store.state.user.userName : this.$storage.getSession('account').userName)
			whisperChat.init({ uId: uId, uName: uName })
			// 显示客服
			let kefu = document.getElementById("WS-SHOW-CHAT")
			kefu.style.display = 'block'	
		}
		// 得到最新消息
		this.getNewNews()
	},
	destroyed() {
		if (!this.$store.state.user.isTest) {
			// 隐藏客服
			let kefu = document.getElementById("WS-SHOW-CHAT")
			kefu.style.display = 'none'		
		}
	}
}
</script>

<style scoped>
.total-container {
	width: 100%;
	height: 100%;	
	padding: 36px 0;
	background-color: #f7f8fa;
}

.main_box{
	width: 80%;
	min-width: 1017px;
	position: relative;
	margin: 0 auto;
}

.deploy-wrap {
  background: #f7f7f7;
  flex: 1;
  padding: 15px;
  height: 100%;
}
.total-dialog-table {
	max-height: 500px;
	overflow-y: auto;
}
</style>

<style lang="less">
.d-f-container {
  .el-dialog__headerbtn {
    border-radius: 50%;
    font-size: 25px;
    border: 4px solid #c9cbcc;
    color: #c9cbcc;
    width: 40px;
    height: 40px;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #c9cbcc;
  }
}

.total-container .el-table th {
	background-color: #f3f6fb;
}
.total-container .el-table td, .custom_style .el-table th {
    padding: 5px 0;
}
</style>
