<template>
<div class="total-container">
	<el-dialog :visible.sync="isShowNotionDialog" class="d-f-container" width="60%" top="5vh">
    <div class="total-dialog-table-notian">
			<h2>{{ notionObj.noticeName }}</h2>
    	<el-divider></el-divider>
				<h3 class="noRead-notice-header">
					<span style="margin-right: 20px">{{ notionObj.createDt }}</span>
					<span>{{ notionObj.userName }}</span>
				</h3>
    	<el-divider></el-divider>
			<div class="noRead-notice-content" style="text-align: unset">
				<div class="main-content" v-html="notionObj.noticeContent"></div>
			</div>

			<div class="total-dialog-table-arrow">
				<span>
					<i class="el-icon-back" @click="setNotionIndex('-')"></i>
				</span>
				<label>第{{ notionIndex+1 }}条 / 共{{ notionList.length }}条</label>
				<span>
					<i class="el-icon-right" @click="setNotionIndex('+')"></i>
				</span>
			</div>

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
			notionList: [],
			notionIndex: 0
		}
	},
	computed: {
		notionObj() {
			if (this.notionList.length > 0) {
				return this.notionList[this.notionIndex]
			} else {
				return {}
			}
		}
	},
	methods: {
		setNotionIndex(type) {
			if (type == '+') {
				(this.notionList.length > this.notionIndex + 1) && this.notionIndex++
			} else {
				(this.notionIndex > 0) && this.notionIndex--
			}
		},
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

				if (this.notionList.length > 0) {
					this.isShowNotionDialog = true
					this.notionIndex = 0
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

.noRead-notice-content {
	.main-content {
		background: #fafafe;		
	}
}

.noRead-notice-footer {
	display: flex;
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

.total-dialog-table-arrow {
	text-align: center;
	margin-top: 15px;

	label {
		vertical-align: top;
		line-height: 30px;
		display: inline-block;
		margin: 0 20px;
	}

	span {
		text-align: initial;
		display: inline-block;
		background: #ccc;
		height: 30px;
		width: 84px;
		position: relative;
		border-radius: 4px;		
		i {
			position: absolute;
			font-size: 16px;
			width: 100%;
    	height: 100%;
			line-height: 30px;
			transition: padding-left 0.5s;
			color: #000;	
		}
	}
	span:first-child {
		i {
			padding-left: 30px;
		}
		i:hover {
			padding-left: 0;
			cursor: pointer;
		}
	}
	span:last-child {
		i {
			padding-left: 30px;
		}
		i:hover {
			padding-left: 60px;
			cursor: pointer;
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
