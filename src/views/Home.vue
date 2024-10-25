<script setup>
import GlobalTitle from "@/components/GlobalTitle.vue";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalTipsItem from "@/components/GlobalTipsItem.vue";
import Control from "@/components/Control.vue";
import { reactive, ref } from "vue";
import DevicesList from "@/components/DevicesList.vue";
import GlobalBlackContent from "@/components/GlobalBlackContent.vue";
import SpeedController from "@/components/SpeedController.vue";
import GlobalButton from "@/components/GlobalButton.vue";
import PluginWrap from "@/components/PluginWrap.vue";

const isSelect = ref(false);
const areaList = reactive([
	{
		id: 0,
		name: "营口分输站",
		count: "20",
		child: [
			{
				id: "0",
				name: "过滤区",
				count: "20"
			},
			{
				id: "1",
				name: "清管区",
				count: "20"
			},
			{
				id: "2",
				name: "空冷区",
				count: "20"
			},
			{
				id: "3",
				name: "调压撬区",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			}
		]
	},
	{
		id: 1,
		name: "大连分输站",
		count: "20",
		child: [
			{
				id: "0",
				name: "过滤区",
				count: "20"
			},
			{
				id: "1",
				name: "清管区",
				count: "20"
			},
			{
				id: "2",
				name: "空冷区",
				count: "20"
			},
			{
				id: "3",
				name: "调压撬区",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			}
		]
	},
	{
		id: 2,
		name: "沈阳分输站",
		count: "20",
		child: [
			{
				id: "0",
				name: "过滤区",
				count: "20"
			},
			{
				id: "1",
				name: "清管区",
				count: "20"
			},
			{
				id: "2",
				name: "空冷区",
				count: "20"
			},
			{
				id: "3",
				name: "调压撬区",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			}
		]
	},
	{
		id: 3,
		name: "葫芦岛分输站",
		count: "20",
		child: [
			{
				id: "0",
				name: "过滤区",
				count: "20"
			},
			{
				id: "1",
				name: "清管区",
				count: "20"
			},
			{
				id: "2",
				name: "空冷区",
				count: "20"
			},
			{
				id: "3",
				name: "调压撬区",
				count: "20"
			},
			{
				id: "4",
				name: "压缩机组",
				count: "20"
			}
		]
	}
]);
</script>

<template>
	<div class="wrap">
		<div class="top-wrap">
			<!-- 设备列表 -->
			<div class="home-item">
				<global-title
					name="设备列表"
					english="devices"
				></global-title>
				<!-- 设备列表内容 -->
				<home-global-content class="devices-content">
					<devices-list :list="areaList"></devices-list>
				</home-global-content>
			</div>
			<!-- 监控视频 -->
			<div class="home-item chance">
				<PluginWrap></PluginWrap>
			</div>
			<!-- 云台控制 -->
			<div class="home-item control-item">
				<global-title
					name="云台控制"
					english="PTZ control"
				>
					<div class="control-tips">云台不可控</div>
				</global-title>
				<!-- 设备列表内容 -->
				<home-global-content>
					<div class="control-direction">
						<control></control>
						<div class="start-control disabled">开始控制</div>
						<GlobalBlackContent>
							<div class="control-item">
								<span class="name">视频放大/缩小</span>
								<span class="icon">
									<img
										src="../assets/images/icon-bigger.png"
										alt=""
									/>
								</span>
								<span class="icon">
									<img
										src="../assets/images/icon-smaller.png"
										alt=""
									/>
								</span>
							</div>
						</GlobalBlackContent>
						<GlobalBlackContent>
							<div class="control-item">
								<span class="name">雨刷开/关</span>
								<span class="icon">
									<img
										src="../assets/images/icon-wipers-on.png"
										alt=""
									/>
								</span>
								<span class="icon">
									<img
										src="../assets/images/icon-wipers-off.png"
										alt=""
									/>
								</span>
							</div>
						</GlobalBlackContent>
						<GlobalBlackContent>
							<div class="control-speed-item">
								<div class="name">速度调整</div>
								<SpeedController></SpeedController>
							</div>
						</GlobalBlackContent>
					</div>
				</home-global-content>
			</div>
		</div>

		<div class="bottom-wrap">
			<!-- 实时浓度 -->
			<div class="home-item">
				<global-title
					name="实时浓度"
					english="concentration"
				></global-title>
				<home-global-content
					class="density-wrap"
					:isNeedScroll="true"
					:isAutoScroll="true"
				>
					<div class="density-list">
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
						<div class="density-item">
							<div class="area-name">沈阳分输站-过滤区</div>
							<div class="density-num">浓度: <span class="english">1000ppm.m</span></div>
							<div class="density-num">光强: <span class="english">9</span></div>
						</div>
					</div>
				</home-global-content>
			</div>
			<!-- 实时报警 -->
			<div class="home-item alarm-item">
				<global-title
					name="实时报警"
					english="alarm"
				>
					<div class="alarm-btn-list">
						<GlobalButton name="报警消音"></GlobalButton>
						<GlobalButton name="确认报警"></GlobalButton>
						<GlobalButton name="历史报警"></GlobalButton>
					</div>
				</global-title>
				<home-global-content
					class="alarm-wrap"
					:isNeedScroll="true"
					:isNeedScrollBar="true"
				>
					<div class="alarm-list">
						<global-tips-item
							:isSelect="true"
							class="alarm-item"
						>
							<div class="alarm">
								<img
									src="../assets/images/icon-warning.png"
									alt=""
									class="icon"
								/>
								<div class="level">2级别</div>
								<div class="english">1000ppm.m</div>
							</div>
						</global-tips-item>
						<global-tips-item
							:isSelect="true"
							class="alarm-item"
						>
							<div class="alarm">
								<img
									src="../assets/images/icon-warning.png"
									alt=""
									class="icon"
								/>
								<div class="level">2级别</div>
								<div class="english">1000ppm.m</div>
							</div>
						</global-tips-item>
						<global-tips-item
							:isSelect="true"
							class="alarm-item"
						>
							<div class="alarm">
								<img
									src="../assets/images/icon-warning.png"
									alt=""
									class="icon"
								/>
								<div class="level">2级别</div>
								<div class="english">1000ppm.m</div>
							</div>
						</global-tips-item>
						<global-tips-item
							:isSelect="true"
							class="alarm-item"
						>
							<div class="alarm">
								<img
									src="../assets/images/icon-warning.png"
									alt=""
									class="icon"
								/>
								<div class="level">2级别</div>
								<div class="english">1000ppm.m</div>
							</div>
						</global-tips-item>
					</div>
				</home-global-content>
			</div>
			<!-- 实时故障 -->
			<div class="home-item fault-item">
				<global-title
					name="实时故障"
					english="fault"
				></global-title>
				<home-global-content class="fault-wrap">
					<div class="fault-list">
						<global-tips-item
							:isSelect="isSelect"
							class="fault-item"
						>
							<div class="fault">
								<div class="top">
									<img
										src="../assets/images/icon-warning.png"
										alt=""
										class="icon"
									/>
									<div class="title">云台通讯故障</div>
								</div>
								<div class="content">处理方法：拆掉，组装</div>
							</div>
						</global-tips-item>
						<global-tips-item
							:isSelect="isSelect"
							class="fault-item"
						>
							<div class="fault">
								<div class="top">
									<img
										src="../assets/images/icon-warning.png"
										alt=""
										class="icon"
									/>
									<div class="title">云台通讯故障</div>
								</div>
								<div class="content">处理方法：拆掉，组装</div>
							</div>
						</global-tips-item>
					</div>
				</home-global-content>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrap {
	width: 1890px;
	margin: 0 auto;
}

.top-wrap {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	column-gap: 12px;
	margin-bottom: 8px;
}

.top-wrap .home-item {
	width: 372px;
}

.top-wrap .home-item.control-item {
	width: 348px;
}

.top-wrap .home-item.chance {
	width: 1148px;
}

.top-wrap .home-item .control-tips {
	font-size: 14px;
	line-height: 1;
	color: #e4a612;
}

.top-wrap .home-item .devices-content {
	padding: 12px 10px 10px;
}

.top-wrap .home-item .control-direction {
	height: 526px;
	box-sizing: border-box;
	padding: 8px 16px 22px 10px;
}

.top-wrap .home-item .control-direction .control-wrap {
	margin-bottom: 10px;
}

.top-wrap .home-item .control-direction .start-control {
	width: 320px;
	margin: 0 auto;
	box-sizing: border-box;
	font-size: 14px;
	line-height: 28px;
	text-align: center;
	/* background: #654525; */
	background: rgba(101, 69, 37, 0.8);
	border: 1px solid #000;
	box-shadow: inset 0 0 10px 5px rgba(255, 207, 150, 0.6);
	border-radius: 2px;
	cursor: pointer;
	margin-bottom: 12px;
}

.top-wrap .home-item .control-direction .start-control.disabled {
	opacity: .6;
}

.top-wrap .home-item .control-direction .start-control.check {
	border: 1px solid #aeadad;
	background: linear-gradient(to top, rgba(166, 166, 166, .3), rgba(86, 86, 86, .3));
	box-shadow: inset 0 0 9px 3px rgba(255, 255, 255, .19);
}

.top-wrap .home-item .control-direction .control-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	column-gap: 10px;
	height: 54px;
	box-sizing: border-box;
	padding: 0 12px;
}

.top-wrap .home-item .control-direction .control-item .name {
	font-size: 14px;
	margin-right: auto;
	opacity: 0.4;
}

.top-wrap .home-item .control-direction .control-item .icon {
	display: block;
	width: 58px;
	box-sizing: border-box;
	/* , linear-gradient(to top, #505050, #aeadad) */
	border: solid 1px transparent;
	background-origin: border-box;
	background-clip: content-box, border-box;
	background-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 1)), linear-gradient(to top, #505050, #aeadad);
	box-shadow: inset 0 -5px 15px 3px rgba(39, 39, 39, 0.8);
	border-radius: 2px;
	overflow: hidden;
	opacity: 0.8;
	cursor: pointer;
}

.top-wrap .home-item .control-direction .control-item .icon img {
	display: block;
	width: 20px;
	margin: 9px auto 10px;
}

.top-wrap .home-item .control-direction .control-speed-item {
	padding: 8px 12px;
}

.top-wrap .home-item .control-direction .control-speed-item .name {
	font-size: 14px;
	margin-bottom: 14px;
	opacity: 0.4;
}

.top-wrap .home-item .control-direction .black-wrap {
	margin-bottom: 10px;
}

.top-wrap .home-item .control-direction .black-wrap:last-of-type {
	margin-bottom: 0;
}

.bottom-wrap {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.bottom-wrap .home-item {
	width: 448px;
}

.bottom-wrap .home-item .density-wrap {
	height: 200px;
	box-sizing: border-box;
	padding: 0 20px 0 15px;
}

.bottom-wrap .home-item .density-wrap .density-list {
	padding: 10px 0;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 30px;
	box-sizing: border-box;
	padding: 0 18px;
	border: 1px solid rgba(119, 111, 99, 0.8);
	background: #363636;
	border-radius: 4px;
	margin-bottom: 8px;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item:last-child {
	margin-bottom: 0;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item .area-name {
	font-size: 16px;
	color: #fff;
	opacity: 0.6;
	margin-right: 22px;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item .density-num {
	font-size: 16px;
	margin-right: 22px;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item .density-num .english {
	font-size: 16px;
	color: #ecc69d;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item .density-num:last-of-type {
	margin-right: 0;
}

.bottom-wrap .home-item.alarm-item {
	width: 720px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap {
	height: 202px;
	padding-right: 15px;
	padding-left: 8px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 8px 4px;
	padding: 8px 0;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list .alarm-item {
	width: 342px;
	box-sizing: border-box;
}

.bottom-wrap .home-item .alarm-btn-list {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	column-gap: 6px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list .alarm-item .alarm {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 8px 20px;
	background: repeating-linear-gradient(116deg, transparent, transparent 10px, rgba(0, 0, 0, 0.2) 15px, rgba(0, 0, 0, 0.2) 26px);
	background-size: 100% 60px;
	background-color: #631d13;
	/* animation: ani2 0.7s infinite alternate linear, ani 0.7s infinite both linear; */
	box-shadow: inset 0 0 12px 5px #a11e1d;
	border-radius: 3px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list .alarm-item .alarm .icon {
	display: block;
	width: 28px;
	margin-right: 26px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list .alarm-item .alarm .level {
	font-size: 16px;
	margin-right: auto;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list .alarm-item .alarm .english {
	font-size: 18px;
}

.bottom-wrap .home-item.fault-item {
	width: 689px;
}

.bottom-wrap .home-item.fault-item .fault-wrap {
	height: 202px;
	box-sizing: border-box;
	padding: 8px 15px 30px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	column-gap: 10px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item {
	width: 320px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item .fault {
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item .fault .top {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: 14px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item .fault .top .icon {
	display: block;
	width: 22px;
	margin-right: 18px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item .fault .top .title {
	font-size: 14px;
	font-weight: bold;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item .fault .content {
	font-size: 14px;
	color: #fff;
	opacity: 0.6;
}

/* .slide-enter-active, .slide-leave-active {
  transform: scaleY(1);
}

.slide-enter, .slide-leave-to {
  transform: scaleY(0);
} */

@keyframes ani {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 0 60px;
	}
}

@keyframes ani2 {
	0% {
		box-shadow: inset 0 0 12px 5px #a11e1d;
	}
	100% {
		box-shadow: inset 0 0 12px 7px #a11e1d;
	}
}
</style>
