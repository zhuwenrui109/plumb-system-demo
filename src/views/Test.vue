<script setup>
import GlobalTitle from "@/components/GlobalTitle.vue";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalTipsItem from "@/components/GlobalTipsItem.vue";
import Control from "@/components/Control.vue";
import { computed, onMounted, ref, watch } from "vue";
import DevicesList from "@/components/DevicesList.vue";
import GlobalBlackContent from "@/components/GlobalBlackContent.vue";
import SpeedController from "@/components/SpeedController.vue";
import GlobalButton from "@/components/GlobalButton.vue";
import PluginWrap from "@/components/PluginWrap.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import useWebSocket from "@/utils/useWebSocket";
import { API_HOME } from "@/api";
import toastPlguin from "@/utils/toast";
import FormPop from "@/components/FormPop.vue";
import GlobalInput from "@/components/GlobalInput.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";

const router = useRouter();
const store = useStore();

const { WebVideoCtrl } = window;
const pluginDom = ref(null);
const pluginSpeed = ref(10);
const g_iWndIndex = ref(0);
const g_iWndowType = ref(4);
const g_iWndowPage = ref(0);
const deepList = ref([]);
const alarmCheckList = ref([]);
const isPopShow = ref(false);
const form = ref({
	confirm_user: "",
	remark: ""
});
const path = ref("");

const standList = computed(() => store.state.standList);
const deviceList = computed(() => store.getters.getDeviceList[g_iWndowPage.value]);
const alarmList = computed(() => store.state.alarmList);
const faultList = computed(() => store.state.faultList);

onMounted(() => {
	// setTimeout(testPluginError, 1000 * 10);
});

watch(isPopShow, newVal => {
	if (newVal) {
		WebVideoCtrl.I_DestroyPlugin();
	} else {
		pluginDom.value.initPlugin();
	}
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
	heartBeatData: JSON.stringify({ target: "concentration" })
});

concentration.connect();

watch(
	() => concentration.message.value,
	newVal => {
		deepList.value = [...newVal];
	}
);

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
	const res = await API_HOME.handleSpeed({
		device_id: deviceList.value[g_iWndIndex.value].device.device_id,
		value
	});
}

function goPlugin() {
	console.log("gogogogo");
	g_iWndowType.value = 1;
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
 * 把监控全屏
 */
function handlePlugin() {
	g_iWndowType.value = g_iWndowType.value > 1 ? 1 : 4;
}

/**
 * 变倍（放大缩小）
 * @param type 放大/缩小
 */
function handlePluginZoom(type) {
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);
	if (g_iWndowType.value == 1 && oWndInfo) {
		WebVideoCtrl.I_PTZControl(type, false, {
			iWndIndex: g_iWndIndex.value,
			success: function (xmlDoc) {
				iPTZSpeed: pluginSpeed.value, console.log("xmlDoc :>> ", xmlDoc);
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
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);
	if (g_iWndowType.value == 1 && oWndInfo) {
		WebVideoCtrl.I_PTZControl(type, true, {
			iWndIndex: g_iWndIndex.value,
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

// 开始录像
function clickStartRecord() {
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);
	console.log("oWndInfo :>> ", oWndInfo);
	if (oWndInfo != null) {
		const szFileName = oWndInfo.szDeviceIdentify + "_" + oWndInfo.iChannelID + "_" + new Date().getTime();

		WebVideoCtrl.I_StartRecord(szFileName, {
			bDateDir: true, //是否生成日期文件
			success: function () {
				toastPlguin("开始录像成功！");
				console.log("开始录像成功！");
			},
			error: function (oError) {
				toastPlguin("开始录像失败！");
				console.log("开始录像失败！");
			}
		});
	}
}

// 停止录像
function clickStopRecord() {
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);
	console.log("oWndInfo :>> ", oWndInfo);
	if (oWndInfo != null) {
		WebVideoCtrl.I_StopRecord({
			success: function () {
				toastPlguin("停止录像成功！");
				console.log("停止录像成功！");
			},
			error: function (oError) {
				toastPlguin("停止录像失败！");
				console.log("停止录像失败！");
			}
		});
	}
}

// 获取本地参数
let g_oLocalConfig = null;
function clickGetLocalCfg() {
	WebVideoCtrl.I_GetLocalCfg().then(
		oLocalConfig => {
			g_oLocalConfig = oLocalConfig;
			g_oLocalConfig.secretKey = "\x7F\x7F\x7F\x7F\x7F\x7F\x7F\x7F";
			path.value = oLocalConfig.recordPath;
		},
		oError => {
			console.log("本地配置获取失败！");
		}
	);
}

// 设置本地参数
async function clickSetLocalCfg() {
	g_oLocalConfig.secretKey = await WebVideoCtrl.I_GetEncryptString(g_oLocalConfig.secretKey);
	WebVideoCtrl.I_SetLocalCfg(g_oLocalConfig).then(
		() => {
			console.log("配置设置成功");
		},
		oError => {
			console.log("配置设置失败");
		}
	);
}

// 打开选择框 0：文件夹  1：文件
function clickOpenFileDlg() {
	WebVideoCtrl.I_OpenFileDlg(0).then(
		function (szDirPath) {
			if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
				path.value = szDirPath;
				g_oLocalConfig.recordPath = szDirPath;
				clickSetLocalCfg();
			}
		},
		function () {
			console.log("打开文件路径失败");
		}
	);
}

/**
 * 设备消音
 */
async function handleAlarmMuted() {
	if (!alarmCheckList.value.length) {
		toastPlguin("请检查是否选择");
		return;
	}
	const alarm_ids = [...alarmCheckList.value];
	try {
		const res = await API_HOME.alarmMuted({
			alarm_ids
		});
		if (res.code == 200) {
			alarmCheckList.value = [];
		} else {
			toastPlguin("消音失败");
		}
	} catch (err) {
		toastPlguin("消音失败");
	}
}

function showCheckForm() {
	if (!alarmCheckList.value.length) {
		toastPlguin("请检查是否选择");
		return;
	}
	isPopShow.value = true;
}

async function submitCheckList() {
	const { confirm_user, remark } = form.value;
	if (!confirm_user && !remark) {
		toastPlguin("请检查确认人和备注");
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
		} else {
			toastPlguin("提交失败");
		}
	} catch (err) {
		toastPlguin("提交失败");
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
						v-model:page="g_iWndowPage"
						v-model:index="g_iWndIndex"
						v-model:type="g_iWndowType"
					></devices-list>
				</home-global-content>
			</div>
			<!-- 监控视频 -->
			<div class="home-item chance">
				<PluginWrap
					ref="pluginDom"
					:deepList="deepList"
					v-model:iWndIndex="g_iWndIndex"
					v-model:iWndowType="g_iWndowType"
					v-model:iWndowPage="g_iWndowPage"
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
						:class="{ active: g_iWndowType == 1 }"
					>
						<control
							:class="{ 'control-wrap-active': g_iWndowType == 1 }"
							v-model:device="g_iWndIndex"
							v-model:page="g_iWndowPage"
						></control>
						<div
							class="start-control"
							@mousedown="handlePlugin"
						>
							{{ g_iWndowType > 1 ? "开始控制" : "云台控制中" }}
						</div>
						<GlobalBlackContent>
							<div class="control-item">
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
								<SpeedController
									v-model:speed="pluginSpeed"
									:disabled="g_iWndowType > 1"
								></SpeedController>
							</div>
						</GlobalBlackContent>
					</div>
				</home-global-content>
			</div>
		</div>

		<div class="bottom-wrap">
			<GlobalButton
				name="开始录像"
				@click="clickStartRecord"
			></GlobalButton>
			<GlobalButton
				name="停止录像"
				@click="clickStopRecord"
			></GlobalButton>
			<GlobalButton
				name="获取路径"
				@click="clickGetLocalCfg"
			></GlobalButton>
			<div class="path-txt">
				{{ path }}
			</div>
			<GlobalButton
				name="设置路径"
				@click="clickOpenFileDlg"
			></GlobalButton>
		</div>
	</div>
	<FormPop
		name="确认报警"
		v-model="isPopShow"
	>
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
				<SettingButtonBorder
					class="btn"
					@click="submitCheckList"
				>
					确认提交
				</SettingButtonBorder>
			</div>
		</div>
	</FormPop>
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
	background: rgba(101, 69, 37, 0.8);
	border: 1px solid #000;
	box-shadow: inset 0 0 10px 5px rgba(255, 207, 150, 0.6);
	border-radius: 2px;
	cursor: pointer;
	margin-bottom: 12px;
}

.top-wrap .home-item .control-direction.active .start-control {
	border: 1px solid #aeadad;
	background: linear-gradient(to top, rgba(166, 166, 166, 0.3), rgba(86, 86, 86, 0.3));
	box-shadow: inset 0 0 9px 3px rgba(255, 255, 255, 0.19);
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
	cursor: pointer;
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
	justify-content: flex-start;
	column-gap: 10px;
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
	height: 200px;
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
	height: 200px;
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

.bottom-wrap .home-item.fault-item .fault-wrap .fault-list .fault-item .fault {
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
	margin-bottom: 14px;
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
	padding: 24px 40px 35px;
}

.form-wrap .form-item {
	width: 100%;
	margin-bottom: 24px;
}

.form-wrap .form-item:last-child {
	margin-bottom: 0;
}

.form-wrap .form-item .name {
	font-size: 14px;
	margin-bottom: 8px;
}

.form-wrap .form-item .form-input {
	width: 100%;
}

.form-wrap .form-item .txt-area-box {
	height: 115px;
	box-sizing: border-box;
	padding: 10px 22px;
	background: rgba(39, 39, 39, 0.36);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
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
	width: 208px;
	margin: 0 auto;
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
