<template>
<div class="total-container">
	<el-dialog :visible.sync="isShowNotionDialog" class="d-f-container" width="60%" top="5vh">
    <div class="total-dialog-table-notian">
			<h2>{{ notionList.length > 0 ? notionList[0].noticeName : '' }}</h2>
    	<el-divider></el-divider>
				<h3 class="noRead-notice-header">
					<span>{{ notionList.length > 0 ? getBigTime(notionList[0].createDt) : '' }}</span>
					<span>{{ notionList.length > 0 ? notionList[0].userName : '' }}</span>
				</h3>
    	<el-divider></el-divider>
			<div class="noRead-notice-content" style="text-align: unset">
				<div class="main-content" v-html="notionList.length > 0 ? notionList[0].noticeContent : ''"></div>
			</div>

			<div>123</div>
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

// 				this.notionList = [
// 					{
// 	"createCode": "ff80808169bee3150169c2552e9001d7",
// 	"userName": "卓群斐",
//   "createDt": "2020-05-26 16:24:26",
//   "createIp": "132.110.64.156",
//   "lastCode": "ff80808169bee3150169c2552e9001d7",
//   "lastDt": "2020-05-26 16:24:26",
//   "lastIp": "132.110.64.156",
//   "noticeCode": "00000000724f407a0172501531d20006",
//   "noticeName": "关于AD域密码修改的公告",
//   "noticeSummary": null,
//   "noticeContent": "<p><span style=\"font-size: 14pt;\">近来有同事反映使用省统一VPN、办公云等系统时，用帐号登录出现新密码无效只认旧密码的情况。经过排查，发现是由于微软的AD域服务器软件存在BUG，具体为在WINDOWS2003和2016共存的环境下，密码修改后会偶然发生帐号supplementalCredentials属性没有被更新成功，会导致旧密码使用MD5加密方式仍然可以登录的情况发生。</span></p>\n<p><span style=\"font-size: 14pt;\">目前正在组织解决，在该问题解决之前，若使用中出现类似密码故障，请用网页浏览器登录acc.gdtel.com进行密码修改。修改密码后，一般情况下新密码可正常使用；若修改密码后仍不正常，请继续修改成别的密码。</span></p>",
//   "noticeType": "S",
//   "noticeUrgent": "P",
//   "noticeStatus": "S",
//   "fileId": "",
//   "noticeAppoint": "A",
//   "clickCount": 0,
//   "expireDt": null,
//   "knowledgeCode": null
// }
// 				]

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
			let uId = this.$storage.getSession('account').operCode
			let uName = this.$storage.getSession('account').userName
			let token = this.$storage.getSession('token')
			whisperChat.init({ uId: uId, uName: uName, token: token })
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

<style lang="less" scoped>
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
.total-dialog-table-notian {
	padding: 10px;

	&>h2 {
		padding: 10px 0 20px;
		text-align: center;
		font-weight: 550;
	}
	.el-divider--horizontal {
		margin: 15px 0;
	}
}

.noRead-notice-header {

}

.noRead-notice-content {
	.to-people {}

	.main-content {
		background: #fafafe;		
	}
}

.noRead-notice-footer {
	display: flex;
	// justify-content:flex-start;
	flex-direction:row-reverse;

	&>div {
		margin-top: 10px;
    display: flex;
    flex-direction: column;
		width: 100px;
		&>p {
			text-align: left;
		}
	}
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
	.el-dialog__header {
		padding: 0;
	}
}

.total-container .el-table th {
	background-color: #f3f6fb;
}
.total-container .el-table td, .custom_style .el-table th {
    padding: 5px 0;
}
</style>
