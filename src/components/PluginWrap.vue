<script setup>
import { API_HOME } from "@/api";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
import FormPop from "./FormPop.vue";
import {
	destory,
	ERROR_CODE_LOGIN_REPEATLOGIN,
	getChannelInfo,
	getDevicePort,
	getInfo,
	getTextOverlay,
	init,
	login,
	logout,
	startRealPlay,
	stopRealPlay
} from "@/utils/pluginController";
import CheckToast from "./CheckToast.vue";
import homeToastPlguin from "@/utils/homeToast";

const store = useStore();
const props = defineProps(["deepList"]);

const isCheckShow = ref(false);
const timer = ref(null);
const isPopShow = ref(false);

const windowType = defineModel("iWndowType");

const deviceList = computed(() => store.getters.getDeviceList);
const g_iWndIndex = computed(() => store.state.iWndIndex);
const g_iWndowType = computed(() => store.state.windowCount);
const g_iWndowPage = computed(() => store.state.iWndowPage);

const isLeftArrshow = computed(() => {
	if (((g_iWndowType.value == "1*2" && windowType.value != 1) || g_iWndowType.value == windowType.value) && g_iWndowPage.value > 0 && deviceList.value.length > 1) {
		return true;
	}
	return false;
});

const isRightArrshow = computed(() => {
	if (((g_iWndowType.value == "1*2" && windowType.value != 1) || g_iWndowType.value == windowType.value) && g_iWndowPage.value < deviceList.value.length - 1 && deviceList.value.length > 1) {
		return true;
	}
	return false;
});

watch(windowType, (newVal, oldVal) => {
	// if (!oldVal) {
	// 	initPlugin();
	// 	return;
	// }
	// destoryPlugin(initPlugin);
});

loadWindowCount();

onMounted(() => {
	initPlugin();
	store.dispatch("handleInitPlugin", initPlugin);
	store.dispatch("handleDestoryPlugin", destoryPlugin);
});

defineExpose({
	setTextOverlay
});

async function loadWindowCount() {
	const res = await API_HOME.getWindowCount();
	await store.dispatch("handleWindowCount", res.data.value);
	if (res.data.value == "1*2") {
		windowType.value = 2;
		return;
	}
	windowType.value = res.data.value;
}

onUnmounted(() => {
	store.dispatch("handleIWndIndex", 0);
	destoryPlugin();
});

/**
 * 监控控件初始化
 */
async function initPlugin() {
	try {
		await init({
			bWndFull: false, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
			iWndowType: parseInt(windowType.value, 10),
			cbSelWnd: function (xmlDoc) {
				store.commit("setIWndIndex", parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10));
			},
			cbDoubleClickWnd: async function (iWndIndex) {
				if (g_iWndowType.value == 1) {
					return;
				}
				store.commit("setIWndIndex", iWndIndex);
				if (windowType.value > 1 || windowType.value == "1*2") {
					windowType.value = 1;
				} else {
					windowType.value = g_iWndowType.value == "1*2" ? 2 : g_iWndowType.value;
				}
			},
			cbEvent: function (iEventType, iParam1, iParam2) {
				console.log("----- 插件事件 ------");
				console.log("iEventType :>> ", iEventType);
				console.log("iParam1 :>> ", iParam1);
				console.log("iParam2 :>> ", iParam2);
			}
		});
		if (windowType.value > 1 || windowType.value == "1*2") {
			const loginArr = [];
			console.log("g_iWndowPage.value :>> ", g_iWndowPage.value);
			deviceList.value[g_iWndowPage.value].forEach((item, index, self) => {
				const { monitor_ip, monitor_port, szDeviceIdentify } = item.device;
				const isDuplicate = self.slice(0, index).some(prev => prev.device.monitor_ip === monitor_ip && prev.device.monitor_port === monitor_port);

				if (!isDuplicate) {
					loginArr.push(login(monitor_ip, monitor_port));
				}
			});
			Promise.allSettled(loginArr).then(async results => {
				console.log("results :>> ", results);
				deviceList.value[g_iWndowPage.value].forEach(async (item, index) => {
					const { szDeviceIdentify } = item.device;
					// const { iRtspPort } = await getDevicePort(szDeviceIdentify);
					// await getChannelInfo(szDeviceIdentify);
					await startRealPlay(szDeviceIdentify, {
						iWndIndex: index
					});
				});
			});
		} else {
			const { monitor_ip, monitor_port, szDeviceIdentify } = deviceList.value[g_iWndowPage.value][g_iWndIndex.value].device;
			try {
				await login(monitor_ip, monitor_port);
				const { iRtspPort } = await getDevicePort(szDeviceIdentify);
				await getChannelInfo(szDeviceIdentify);
				await startRealPlay(szDeviceIdentify, {
					iWndIndex: 0,
					iPort: iRtspPort
				});
			} catch (err) {
				if (err.errorCode == ERROR_CODE_LOGIN_REPEATLOGIN) {
					destoryPlugin(initPlugin);
				}
			}
		}
	} catch (err) {
		console.log("err :>> ", err);
		// 初始化失败
		if (err == 3000) {
			isCheckShow.value = true;
		}
	}
}

async function destoryPlugin(callback) {
	const arr = [];
	deviceList.value[g_iWndowPage.value].forEach((item, index, self) => {
		const { monitor_ip, monitor_port } = item.device;
		const isDuplicate = self.slice(0, index).some(prev => prev.device.monitor_ip === monitor_ip && prev.device.monitor_port === monitor_port);

		const info = getInfo(index);
		if (info && !isDuplicate) {
			console.log('info.szDeviceIdentify :>> ', info.szDeviceIdentify);
			arr.push(logout(info.szDeviceIdentify));
		}
	});
	Promise.all(arr)
		.then(async res => {
			await stopRealPlay();
			destory();
			if (timer.value) {
				clearInterval(timer.value);
				timer.value = null;
			}
			callback && callback();
		})
		.catch(err => {
			console.log("destoryPlugin");
			console.log("err :>> ", err);
		});
}

function handleChangePage(type) {
	if (!type && g_iWndowPage.value > 0) {
		destoryPlugin(() => {
			store.commit("setIWndPage", g_iWndowPage.value - 1);
			store.commit("setIWndIndex", 0);
			initPlugin();
		});
	}
	if (type && g_iWndowPage.value < deviceList.value.length) {
		destoryPlugin(() => {
			store.commit("setIWndPage", g_iWndowPage.value + 1);
			store.commit("setIWndIndex", 0);
			initPlugin();
		});
	}
}

/**
 * 设置osg信息
 */
async function setTextOverlay() {
	if (!deviceList.value) {
		return;
	}
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
	console.log('oWndInfo :>> ', oWndInfo);
	if (!oWndInfo) {
		return;
	}
	const szUrl = "ISAPI/System/Video/inputs/channels/" + oWndInfo.iChannelID + "/overlays";
	const deviceInfo = getDeviceInfo(oWndInfo.szDeviceIdentify);
	await getTextOverlay(szUrl, oWndInfo.szDeviceIdentify, deviceInfo);
}

/**
 * 获取设备实时信息
 */
function getDeviceInfo(szDeviceIdentify) {
	const { device_id } = deviceList.value[g_iWndowPage.value].find(item => item.device.szDeviceIdentify == szDeviceIdentify).device;
	const info = props.deepList.find(item => item.device_id == device_id);
	return info;
}

function closePlugin() {
	windowType.value = g_iWndowType.value == "1*2" ? 2 : g_iWndowType.value;
	destoryPlugin(() => {
		store.commit("setIWndPage", 0);
		initPlugin();
	});
}

/**
 * 刷新
 */
function refresh() {
	destoryPlugin(() => {
		initPlugin();
	});
}
</script>

<template>
	<div class="plugin-wrap">
		<div
			class="plugin-refresh"
			@click="refresh"
		>
			<img
				src="../assets/images/icon-refresh.png"
				alt=""
			/>
			<span>刷新</span>
		</div>
		<Transition name="fade">
			<div
				class="plugin-close"
				v-show="(g_iWndowType > 1 || g_iWndowType == '1*2') && windowType == 1"
				@click="closePlugin"
			>
				<img
					src="../assets/images/icon-home-close.png"
					alt=""
				/>
				<span>关闭</span>
			</div>
		</Transition>
		<div class="arr-wrap">
			<img
				src="../assets/images/icon-plugin-arr.png"
				alt=""
				class="arr"
				v-show="isLeftArrshow"
				@click="handleChangePage(0)"
			/>
			<img
				src="../assets/images/icon-plugin-arr.png"
				alt=""
				class="arr right"
				v-show="isRightArrshow"
				@click="handleChangePage(1)"
			/>
		</div>
		<div class="plugin-content">
			<div id="divPlugin">
				<img
					src="../assets/images/plugin-video-bg.png"
					alt=""
				/>
			</div>
		</div>
		<FormPop
			v-model="isPopShow"
			name="温馨提示"
		></FormPop>
		<CheckToast
			name="温馨提示"
			v-model="isCheckShow"
		></CheckToast>
	</div>
</template>

<style scoped>
.plugin-wrap {
	position: relative;
	width: 100%;
	height: 100%;
}

.plugin-wrap .plugin-bg {
	display: block;
	width: 100%;
}

.plugin-wrap .plugin-refresh {
	position: absolute;
	top: 10px;
	right: 26px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 10px;
	cursor: pointer;
}

.plugin-wrap .plugin-close {
	position: absolute;
	top: 50px;
	right: 26px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 10px;
	cursor: pointer;
}

.plugin-wrap .plugin-close img {
	display: block;
	width: 24px;
}

.plugin-wrap .plugin-close span {
	display: block;
	font-size: 16px;
	line-height: 24px;
}

.plugin-wrap .plugin-refresh:hover {
	opacity: 0.7;
	transition: 0.1s all linear;
}

.plugin-wrap .plugin-close:hover {
	opacity: 0.7;
	transition: 0.1s all linear;
}

.plugin-wrap .plugin-refresh img {
	display: block;
	width: 24px;
}

.plugin-wrap .plugin-refresh span {
	display: block;
	font-size: 16px;
	line-height: 24px;
}

.plugin-wrap .arr-wrap {
	position: absolute;
	top: 50%;
	left: 0;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	box-sizing: border-box;
	padding-left: 70px;
	padding-right: 66px;
}

.plugin-wrap .arr-wrap .arr {
	position: absolute;
	left: 70px;
	display: block;
	width: 40px;
	cursor: pointer;
}

.plugin-wrap .arr-wrap .arr.right {
	left: auto;
	right: 66px;
}

.plugin-wrap .arr-wrap .arr.right {
	transform: rotate(180deg);
}

.plugin-wrap .arr-wrap .arr.disable {
	opacity: 0.4;
	cursor: none;
}

.plugin-wrap .plugin-content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 904px;
	height: 95%;
	box-sizing: border-box;
	padding: 6px 16px;
	background: rgba(225, 133, 43, 0.18);
	border: 1px solid #c16205;
}

.plugin-wrap .plugin-content > div {
	width: 100%;
	height: 100%;
}

.plugin-wrap .plugin-content > div img {
	display: block;
	width: 100%;
}
</style>
