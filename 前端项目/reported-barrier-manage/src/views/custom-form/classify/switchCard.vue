<template>
	<div class="box">
		<ul>
			<li :class="index == 0 ? 'on' : ''"  v-for="(item,index) in data" :key="item.title">
				<img src="./icon/pointer.png">
				<div class="item-box">
					<img :src="imgList[index % 6]">
					<div class="small-box">
						<div class="title">
							<div>{{ item.classifyName }}</div>
							<!-- <img src="./icon/hot.png"> -->
						</div>
						<div class="know">{{ item.classifyRemark }}</div>
					</div>
				</div>
			</li>
			<div style="clear: both"></div>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		data: Array
	},
	data() {
		return {
      imgList: [
				require("./icon/call.png"), 
      	require("./icon/rober.png"), 
      	require("./icon/message.png"), 
      	require("./icon/worker.png"), 
      	require("./icon/phone.png"), 
				require("./icon/ai.png")
			]
		}
	},
  mounted() {
    let that = this
		let box = document.querySelectorAll(".box ul li")
		$(".box ul li").hover(function(){
      $(this).addClass('on').siblings().removeClass('on');
      that.$emit("getIndex", $(this).index())
		});
	}
}
</script>

<style scoped>
ul{margin: 0;padding: 0; list-style: none;}
a{text-decoration: none;}
h3,p{margin: 0;font-weight: normal;}

.box{
	float: left;
	width: 339px;
}

.box ul li{
	width: 339px;
	height: 86px;
	margin-top: -1px;
	position: relative;
	border: 1px solid #e2e9ea;
	transition: all .6s ease-out;
}

.box ul li>img {
	display: none;
}

.box ul li .item-box img{
	width: 35px;
	height: 35px;
	margin: 20px 0 0 23px;
	transition: all .6s ease-out;
	vertical-align: top;
}
.small-box {
	display: inline-block;
	margin: 33px 0 0 12px;
	font-size: 18px;
  color: #545d69;
	font-family: "SF Pro SC",
	"SF Pro Display",
	"SF Pro Icons",
	"PingFang SC",
	'Microsoft YaHei',
	'WenQuanYi Micro Hei',
	sans-serif;
}

.know {
	font-size: 14px;
	display: none;
}

.on>img:nth-child(1) {
	display: block;
	position: absolute;
	right: -10px;
	top: 50%;
	height: 20px;
	transform: translateY(-50%);
}

.small-box .title {
	font-size: 18px;
	overflow: hidden;
}
.small-box .title div {
	display: inline-block;
	line-height: 18px;
	float: left;
}
.small-box .title img {
	float: left;
}
.on .small-box {
	margin-top: 22px;
	color: #fff;
	cursor: pointer;
}

.on .small-box img {
	display: none;
}

.box ul li .small-box img {
	width: 25px;
	height: 11px;
	margin: 0 0 0 11px;
	vertical-align: top;
}
.on .know {
	display: block;
	font-size: 14px;
	width: 238px;
	margin: 11px 0 25px 0;
}
.box ul .on{
	width: 339px;
	height: 100px;
	text-align: left;
  background: linear-gradient(to left, #18c2c7, #5ce4bd);
}
.box ul .on h3{
	padding-left: 20px;
	color: #FFF;
}
.box ul .on p{
	margin-left: 20px;
	color: #FFF;
}


</style>