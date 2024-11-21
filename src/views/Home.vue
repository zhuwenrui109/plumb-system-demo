<script setup>
import GlobalTitle from "@/components/GlobalTitle.vue";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalTipsItem from "@/components/GlobalTipsItem.vue";
import Control from "@/components/Control.vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import DevicesList from "@/components/DevicesList.vue";
import GlobalBlackContent from "@/components/GlobalBlackContent.vue";
import SpeedController from "@/components/SpeedController.vue";
import GlobalButton from "@/components/GlobalButton.vue";
import PluginWrap from "@/components/PluginWrap.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import useWebSocket from "@/utils/useWebSocket";
import { API_HOME } from "@/api";
import GlobalInput from "@/components/GlobalInput.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import homeToastPlguin from "@/utils/homeToast";
import { getInfo } from "@/utils/pluginController";
import { checkFaultType } from "@/utils/tool";

const router = useRouter();
const store = useStore();

const { WebVideoCtrl } = window;
const currentWiperStatus = ref(false);
const wiperTimer = ref(null);
const alarmScroll = ref(null);
const isBusy = ref(false);
const currentDeviceId = ref("");
const roll = ref(null);
const rollTimer = ref(null);
const pluginDom = ref(null);
const pluginSpeed = ref(10);
const g_iWndIndex = ref(0);
const g_iWndowType = ref(0);
const g_iWndowPage = ref(0);
const deepList = ref([]);
const alarmCheckList = ref([]);
const isPopShow = ref(false);
const form = ref({
	confirm_user: "",
	remark: ""
});
const audio = ref(null);

const standList = computed(() => store.state.standList);
const deviceList = computed(() => store.getters.getDeviceList);
const alarmList = computed(() => store.state.alarmList);
const faultList = computed(() => store.state.faultList);

let socketTimer = null;
let socketStatus = 0;
const socket = new WebSocket("ws://192.168.1.51:8080");

socket.onopen = () => {
	socketStatus = 1;
};

socket.onmessage = msgEvent => {
	const { data } = msgEvent;
	const msg = JSON.parse(data);

	console.log("msg :>> ", msg);
	if (!msg.status) {
		clearInterval(socketTimer);
		socketTimer = null;
		isBusy.value = true;
	}
};

onMounted(() => {
	// setTimeout(testPluginError, 1000 * 10);
	initRoll();
});

onUnmounted(() => {
	destoryRoll();
});

watch(
	() => store.state.iWndIndex,
	() => {
		currentDeviceId.value = "";
	}
);

watch(g_iWndowType, newVal => {
	if (newVal != 1) {
		currentDeviceId.value = "";
	}
});

watch(isPopShow, () => {
	alarmScroll.value.refreshScroll();
});

let timer = null;
watch(pluginSpeed, newVal => {
	if (timer) {
		clearTimeout(timer);
		timer = null;
	}
	timer = setTimeout(() => {
		changeSpeed(newVal);
	}, 1000);
});

// 实时浓度
const concentration = useWebSocket({
	heartBeatData: JSON.stringify({ target: "concentration" }),
	heartBeatInterval: 1000
});

concentration.connect();

watch(
	() => concentration.message.value,
	newVal => {
		deepList.value = [...newVal];
	}
);

function initRoll() {
	console.log("定时器触发周期");
	destoryRoll();
	//定时器触发周期
	rollTimer.value = setInterval(marqueeTest, 1000 * 1);
}

async function marqueeTest() {
	await nextTick();
	let test1 = roll.value;
	let child = roll.value.children;
	//判断组件是否渲染完成
	if (test1.offsetHeight == 0) {
		test1 = roll.value;
	} else {
		//如果列表数量过少不进行滚动
		if (test1.childNodes.length < 5) {
			destoryRoll();
			return;
		}
		//组件进行滚动
		// test1.scrollTop += child[0].offsetHeight;
		let i = 1;
		const childMarginTop = getComputedStyle(child[0]).getPropertyValue("margin-top");
		const childMarginBottom = getComputedStyle(child[0]).getPropertyValue("margin-bottom");
		const scrollTimer = setInterval(() => {
			i++;
			if (i >= child[0].offsetHeight + parseInt(childMarginTop, 10) + parseInt(childMarginBottom, 10)) {
				//获取组件第一个节点
				let a = test1.childNodes[0];
				//删除节点
				test1.removeChild(a);
				//将该节点拼接到组件最后
				test1.append(a);
				clearInterval(scrollTimer);
			}
			test1.scrollTop += 1;
		}, 50);
	}
}

function destoryRoll() {
	if (rollTimer.value) {
		clearInterval(rollTimer.value);
		rollTimer.value = null;
	}
}

/**
 * 测试浓度超标警报录制视频
 */
function testPluginError() {
	console.log("测试浓度超标警报录制视频");
	const test = {
		id: 0,
		title: "2级别",
		value: "1000ppm.m",
		ip: "192.168.1.64"
	};
	capturePicData();
	alarmList.value.push(test);
}

async function changeSpeed(value) {
	if (!currentDeviceId.value) {
		return;
	}
	const res = await API_HOME.handleSpeed({
		device_id: currentDeviceId.value,
		value
	});
}

function goPlugin(id) {
	const { href } = router.resolve({
		name: "realAlarm"
	});
	window.open(href, "_blank");
}

/**
 * 抓图并上传
 */
function capturePicData() {
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);
	console.log("oWndInfo :>> ", oWndInfo);
	if (oWndInfo != null) {
		WebVideoCtrl.I_CapturePicData(g_iWndIndex.value).then(
			function (data) {
				console.log("抓图成功并上传:>> ", data);
			},
			function () {
				console.log("抓图失败！ :>> ", oWndInfo.szDeviceIdentify);
			}
		);
	}
}

/**
 * 开始控制
 */
async function handlePlugin() {
	if (g_iWndowType.value != 1) {
		return;
	}
	if (currentDeviceId.value) {
		currentDeviceId.value = "";
		return;
	}
	if (!socketStatus) {
		homeToastPlguin("服务器繁忙");
		return;
	}
	const { code } = await API_HOME.startContrl({
		device_id: currentDeviceId.value
	});
	const { szDeviceIdentify } = getInfo(0);
	const { device_id } = deviceList.value[g_iWndowPage.value].find(item => item.device.szDeviceIdentify == szDeviceIdentify).device;
	currentDeviceId.value = device_id;
	const socketParams = {
		target: "contrl",
		user_id: store.state.user.id,
		device_id: currentDeviceId.value
	};
	socket.send(JSON.stringify(socketParams));
	console.log('socketTimer :>> ', socketTimer);
	if (!socketTimer) {
		socketTimer = setInterval(() => {
			socket.send(JSON.stringify(socketParams));
		}, 1000);
	}
}

/**
 * 变倍（放大缩小）
 * @param type 放大/缩小
 */
function handlePluginZoom(type) {
	if (!currentDeviceId.value) {
		return;
	}
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
	if (g_iWndowType.value == 1 && oWndInfo) {
		WebVideoCtrl.I_PTZControl(type, false, {
			iWndIndex: 0,
			success: function (xmlDoc) {
				console.log("xmlDoc :>> ", xmlDoc);
				console.log("调焦成功 :>> ", oWndInfo.szDeviceIdentify);
			},
			error: function (oError) {
				console.log("调焦失败！ :>> ", oWndInfo.szDeviceIdentify);
			}
		});
	}
}

/**
 * 停止变倍（放大缩小）
 * @param type 10:放大; 11:缩小
 */
function handleStopPluginZoom(type) {
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
	if (g_iWndowType.value == 1 && oWndInfo) {
		WebVideoCtrl.I_PTZControl(type, true, {
			iWndIndex: 0,
			iPTZSpeed: pluginSpeed.value,
			success: function (xmlDoc) {
				console.log("xmlDoc :>> ", xmlDoc);
				console.log("停止调焦成功！ :>> ", oWndInfo.szDeviceIdentify);
			},
			error: function (oError) {
				console.log("停止调焦失败！ :>> ", oWndInfo.szDeviceIdentify);
			}
		});
	}
}

function toggleCheckAlarm(id) {
	if (alarmCheckList.value.includes(id)) {
		alarmCheckList.value.splice(alarmCheckList.value.indexOf(id), 1);
	} else {
		alarmCheckList.value.push(id);
	}
}

async function openWiper() {
	if (!currentDeviceId.value || (wiperTimer.value && !action)) {
		return;
	}
	currentWiperStatus.value = true;
	await API_HOME.handleWiper({
		device_id: currentDeviceId.value,
		action: 0
	});
	wiperTimer.value = setTimeout(() => {
		currentWiperStatus.value = false;
		wiperTimer.value = null;
		closeWiper();
	}, 1000 * 40);
}

async function closeWiper() {
	if (!currentDeviceId.value) {
		return;
	}
	if (wiperTimer.value) {
		currentWiperStatus.value = false;
		clearTimeout(wiperTimer.value);
		wiperTimer.value = null;
	}

	await API_HOME.handleWiper({
		device_id: currentDeviceId.value,
		action: 1
	});
}

/**
 * 设备消音
 */
async function handleAlarmMuted() {
	if (!alarmCheckList.value.length) {
		homeToastPlguin("请选择报警信息");
		return;
	}
	const alarm_ids = [...alarmCheckList.value];
	try {
		const res = await API_HOME.alarmMuted({
			alarm_ids
		});
		if (res.code == 200) {
			alarmCheckList.value = [];
			store.state.pauseAudio();
			homeToastPlguin("已消音");
		} else {
			homeToastPlguin("消音失败");
		}
	} catch (err) {
		homeToastPlguin("消音失败");
	}
}

function showCheckForm() {
	if (!alarmCheckList.value.length) {
		homeToastPlguin("请选择报警信息");
		return;
	}
	form.value.confirm_user = store.state.user.name;
	isPopShow.value = true;
}

async function submitCheckList() {
	const { confirm_user, remark } = form.value;
	if (!confirm_user && !remark) {
		homeToastPlguin("请检查确认人和备注");
		return;
	}
	try {
		const { code } = await API_HOME.submitCheckAlarm({
			alarm_ids: alarmCheckList.value,
			confirm_user,
			remark
		});
		if (code == 200) {
			isPopShow.value = false;
			homeToastPlguin("确认报警成功");
		} else {
			homeToastPlguin("提交失败");
		}
	} catch (err) {
		homeToastPlguin("提交失败");
	}
}
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
					<devices-list
						:list="standList"
						v-model:type="g_iWndowType"
					></devices-list>
				</home-global-content>
			</div>
			<!-- 监控视频 -->
			<div class="home-item chance">
				<PluginWrap
					ref="pluginDom"
					:deepList="deepList"
					v-model:iWndowType="g_iWndowType"
				></PluginWrap>
			</div>
			<!-- 云台控制 -->
			<div class="home-item control-item">
				<global-title
					name="云台控制"
					english="PTZ control"
				>
					<Transition name="fade">
						<div
							class="control-tips"
							v-show="g_iWndowType > 1"
						>
							云台不可控
						</div>
					</Transition>
				</global-title>
				<!-- 设备列表内容 -->
				<home-global-content>
					<div
						class="control-direction"
						:class="{ active: currentDeviceId && !isBusy, ready: g_iWndowType == 1 && !currentDeviceId }"
					>
						<control
							:class="{ 'control-wrap-active': currentDeviceId && !isBusy, 'control-wrap-disabled': g_iWndowType > 1 }"
							v-model="currentDeviceId"
						></control>
						<div
							class="start-control"
							@click="handlePlugin"
						>
							{{ !currentDeviceId ? "开始控制" : isBusy ? "占用中..." : "云台控制中" }}
						</div>
						<GlobalBlackContent>
							<div
								class="control-item zoom"
								:class="{ active: currentDeviceId }"
							>
								<span class="name">视频放大/缩小</span>
								<span
									class="icon"
									@mousedown="handlePluginZoom(10)"
									@mouseup="handleStopPluginZoom(10)"
								>
									<img
										src="../assets/images/icon-bigger.png"
										alt=""
									/>
								</span>
								<span
									class="icon"
									@mousedown="handlePluginZoom(11)"
									@mouseup="handleStopPluginZoom(11)"
								>
									<img
										src="../assets/images/icon-smaller.png"
										alt=""
									/>
								</span>
							</div>
						</GlobalBlackContent>
						<GlobalBlackContent>
							<div
								class="control-item wiper"
								:class="{ active: currentDeviceId }"
							>
								<span class="name">雨刷开/关</span>
								<span
									class="icon"
									@click="openWiper"
								>
									<img
										src="../assets/images/icon-wipers-on.png"
										alt=""
									/>
								</span>
								<span
									class="icon"
									:class="{ active: !currentWiperStatus }"
									@click="closeWiper"
								>
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
								<SpeedController
									:class="{ active: currentDeviceId }"
									v-model:speed="pluginSpeed"
									:disabled="!currentDeviceId"
								></SpeedController>
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
					:isNeedScroll="false"
				>
					<div
						class="density-list"
						ref="roll"
					>
						<div
							class="density-item"
							v-for="item in deepList"
							:key="item.device_id"
						>
							<div class="area-name">{{ item.station.name }}-{{ item.region.name }}</div>
							<div class="density-num">
								浓度: <span class="english">{{ item.gas }}ppm.m</span>
							</div>
							<div class="density-num">
								光强: <span class="english">{{ item.light }}</span>
							</div>
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
						<GlobalButton
							name="报警消音"
							@click="handleAlarmMuted"
						></GlobalButton>
						<GlobalButton
							name="确认报警"
							@click="showCheckForm"
						></GlobalButton>
						<GlobalButton
							name="历史报警"
							@click="router.push({ name: 'alarm' })"
						></GlobalButton>
					</div>
				</global-title>
				<home-global-content
					class="alarm-wrap"
					:isNeedScroll="true"
					:isNeedScrollBar="true"
					ref="alarmScroll"
				>
					<div
						class="alarm-list"
						v-show="!isPopShow"
					>
						<global-tips-item
							:isSelect="true"
							class="alarm-item"
							v-for="item in alarmList"
							:key="item.alarm_id"
							:id="item.alarm_id"
							:stand-name="item.station.name"
							:area-name="item.region.name"
							:time="item.created_at"
							:check-list="alarmCheckList"
							@go-detail="goPlugin"
							@handle-check="toggleCheckAlarm"
						>
							<div class="alarm">
								<img
									src="../assets/images/icon-warning.png"
									alt=""
									class="icon"
								/>
								<div class="level">{{ item.level }}级别</div>
								<div class="english">{{ item.density }}PPM.M</div>
							</div>
						</global-tips-item>
					</div>
					<div
						class="alarm-check-form"
						v-show="isPopShow"
					>
						<div class="title-wrap">
							<span>确认报警</span>
							<img
								src="../assets/images/icon-video-close.png"
								alt=""
								@click="isPopShow = false"
							/>
						</div>
						<div class="form-wrap">
							<div class="form-item">
								<div class="name">确认人</div>
								<GlobalInput
									class="form-input"
									placeholder="请输入"
									v-model="form.confirm_user"
								></GlobalInput>
							</div>
							<div class="form-item">
								<div class="name">备注</div>
								<div class="txt-area-box">
									<textarea
										placeholder="请输入"
										rows="5"
										v-model="form.remark"
									></textarea>
								</div>
							</div>
							<div class="form-item">
								<div class="name"></div>
								<SettingButtonBorder
									class="btn"
									@click="submitCheckList"
								>
									确认提交
								</SettingButtonBorder>
								<SettingButtonBorder
									class="btn"
									type="clear"
									@click="isPopShow = false"
								>
									取消
								</SettingButtonBorder>
							</div>
						</div>
					</div>
				</home-global-content>
			</div>
			<!-- 实时故障 -->
			<div class="home-item fault-item">
				<global-title
					name="实时故障"
					english="fault"
				></global-title>
				<home-global-content
					class="fault-wrap"
					:is-need-scroll="true"
					:is-need-scroll-bar="true"
				>
					<div class="fault-list">
						<global-tips-item
							:isSelect="false"
							v-for="(item, index) in faultList"
							:key="index"
							:id="item.device_id"
							:time="item.created_at"
							:stand-name="item.station.name"
							:area-name="item.region.name"
							class="fault-item"
						>
							<div class="fault">
								<div class="top">
									<img
										src="../assets/images/icon-warning.png"
										alt=""
										class="icon"
									/>
									<div class="title">{{ checkFaultType(item.type) + "故障" }}</div>
								</div>
								<!-- <div class="content">处理方法：拆掉，组装</div> -->
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
	height: 550px;
	background: url("../assets/images/plugin-bg.png") no-repeat;
	background-size: 100% 100%;
	/* background-position: center center; */
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
	height: 496px;
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
	color: #888889;
	border: 1px solid #505050;
	background: linear-gradient(to top, rgba(166, 166, 166, 0.3), rgba(86, 86, 86, 0.3));
	border-radius: 2px;
	margin-bottom: 12px;
}

.top-wrap .home-item .control-direction.active .start-control {
	color: #fff;
	border-color: #aeadad;
	background: linear-gradient(to top, rgba(166, 166, 166, 0.3), rgba(86, 86, 86, 0.3));
	box-shadow: inset 0 0 9px 3px rgba(255, 255, 255, 0.19);
	cursor: pointer;
}

.top-wrap .home-item .control-direction.ready .start-control {
	color: #fff;
	background: rgba(101, 69, 37, 0.8);
	border-color: #000;
	box-shadow: inset 0 0 10px 5px rgba(255, 207, 150, 0.6);
	cursor: pointer;
}

.top-wrap .home-item .control-direction .control-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	column-gap: 10px;
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
	border: solid 1px transparent;
	background-origin: border-box;
	background-clip: content-box, border-box;
	background-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 1)), linear-gradient(to top, #505050, #aeadad);
	box-shadow: inset 0 -5px 15px 3px rgba(39, 39, 39, 0.8);
	border-radius: 2px;
	overflow: hidden;
	opacity: 0.8;
}

.top-wrap .home-item .control-direction .control-item.active {
	cursor: pointer;
}

.top-wrap .home-item .control-direction .control-item.zoom.active .icon:hover {
	background-image: linear-gradient(to bottom, rgba(98, 98, 98, 0.8), rgba(54, 49, 47, 0.8), rgba(39, 39, 39, 0.8)),
		linear-gradient(to top, #505050, #aeadad);
	cursor: pointer;
}

.top-wrap .home-item .control-direction .control-item.wiper .icon.active {
	background-image: linear-gradient(to bottom, rgba(98, 98, 98, 0.8), rgba(54, 49, 47, 0.8), rgba(39, 39, 39, 0.8)),
		linear-gradient(to top, #505050, #aeadad);
}

.top-wrap .home-item .control-direction .control-item .icon img {
	display: block;
	width: 18px;
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
	height: 180px;
	box-sizing: border-box;
	padding: 0 20px 0 15px;
}

.bottom-wrap .home-item .density-wrap .density-list {
	height: 100%;
	overflow-y: scroll;
	/* padding: 10px 0; */
}

.bottom-wrap .home-item .density-wrap .density-list::-webkit-scrollbar {
	display: none;
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
	margin: 8px 0;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item .area-name {
	width: 45%;
	box-sizing: border-box;
	padding-right: 10px;
	font-size: 14px;
	color: #fff;
	opacity: 0.6;
	flex-shrink: 0;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item .density-num {
	font-size: 14px;
}

.bottom-wrap .home-item .density-wrap .density-list .density-item .density-num:nth-of-type(2) {
	flex: 1;
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
	height: 180px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 8px 4px;
	padding: 8px 0;
	padding-right: 15px;
	padding-left: 8px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-list .alarm-item {
	width: 342px;
	box-sizing: border-box;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-check-form {
	background: rgba(39, 39, 39, 1);
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-check-form .title-wrap {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	line-height: 36px;
	font-weight: bold;
	background: url("../assets/images/form-pop-title-bg.png") no-repeat;
	background-size: 100% 100%;
	padding-left: 36px;
	padding-right: 20px;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-check-form .title-wrap span {
	display: block;
}

.bottom-wrap .home-item.alarm-item .alarm-wrap .alarm-check-form .title-wrap img {
	display: block;
	width: 30px;
	cursor: pointer;
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
	animation: ani2 0.2s infinite alternate ease-in-out, ani 0.7s infinite both linear;
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
	height: 180px;
	box-sizing: border-box;
	padding: 0 15px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	flex-wrap: wrap;
	padding: 8px 0;
	gap: 8px 4px;
	column-gap: 10px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item {
	width: 320px;
}

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item .fault .top {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	background: repeating-linear-gradient(116deg, transparent, transparent 10px, rgba(0, 0, 0, 0.2) 15px, rgba(0, 0, 0, 0.2) 26px);
	background-size: 100% 60px;
	background-color: rgba(68, 32, 3, 0.8);
	box-shadow: inset 0 0 9px 4px rgba(238, 149, 53, 0.8);
	padding: 11px 0;
	padding-left: 27px;
	border-radius: 4px;
	animation: ani2 0.2s infinite alternate ease-in-out, ani 0.7s infinite both linear;
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

.form-wrap {
	width: 100%;
	box-sizing: border-box;
	padding: 12px 40px 10px;
}

.form-wrap .form-item {
	display: flex;
	align-items: baseline;
	justify-content: flex-start;
	column-gap: 6px;
	width: 100%;
	margin-bottom: 8px;
}

.form-wrap .form-item:last-child {
	margin-bottom: 0;
}

.form-wrap .form-item .name {
	width: 44px;
	font-size: 14px;
	flex-shrink: 0;
}

.form-wrap .form-item .form-input {
	flex: 1;
}

.form-wrap .form-item .txt-area-box {
	height: 54px;
	box-sizing: border-box;
	padding: 10px 22px;
	background: rgba(39, 39, 39, 0.36);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
	flex: 1;
}

.form-wrap .form-item .txt-area-box textarea {
	display: block;
	width: 100%;
	height: 100%;
	font-size: 14px;
	border: none;
	outline: none;
	resize: none;
	background: none;
}

.form-wrap .form-item .btn {
	width: 125px;
}

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
		opacity: 0.3;
	}
	100% {
		opacity: 1;
	}
}
</style>
