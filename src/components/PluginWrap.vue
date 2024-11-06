<script setup>
import { API_HOME } from "@/api";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps(["deepList"]);
const g_iWndIndex = defineModel("iWndIndex");
const g_iWndowType = defineModel("iWndowType"); // 分割数量
const g_iWndowPage = defineModel("iWndowPage"); // 页数

const { WebVideoCtrl } = window;
const config = {
	iPrototocol: 1, // http协议，1表示http协议 2表示https协议
	szUsername: "admin", // 用户名称
	szPassword: "abcd1234" // 用户密码
};
let iDevicePort = null;
let iRtspPort = null;
let iChannelID = null;
let interval = null;

const userType = computed(() => store.state.windowCount);
const deviceList = computed(() => {
	return store.getters.getDeviceList;
});

watch(g_iWndowType, newVal => {
	console.log("newVal :>> ", newVal);
	changeWndNum(newVal);
});

loadWindowCount();

onMounted(() => {
	// initPlugin();
	store.dispatch("handlePluginDom", initPlugin);
});

defineExpose({
	initPlugin
});

async function loadWindowCount() {
	const res = await API_HOME.getWindowCount();
	await store.dispatch("handleWindowCount", res.data.value);
	initPlugin();
}

onUnmounted(() => {
	WebVideoCtrl.I_DestroyPlugin();
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
});

/**
 * 监控控件初始化
 */
function initPlugin() {
	g_iWndowType.value = userType.value;
	WebVideoCtrl.I_InitPlugin({
		bWndFull: false, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
		iWndowType: Number(userType.value),
		cbSelWnd: function (xmlDoc) {
			console.log("xmlDoc :>> ", xmlDoc);
			g_iWndIndex.value = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
		},
		cbDoubleClickWnd(iWndIndex) {
			g_iWndIndex.value = iWndIndex;
			if (g_iWndowType.value > 1) {
				g_iWndowType.value = 1;
				changeWndNum(1);
			} else {
				g_iWndowType.value = 4;
				changeWndNum(4);
			}
		},
		cbInitPluginComplete() {
			WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin").then(
				() => {
					loginPlugin();
				},
				() => {
					alert("插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！");
				}
			);
		}
	});
}

/**
 * 登录
 */
async function loginPlugin() {
	if (!deviceList.value.length) {
		return;
	}
	const list = [...deviceList.value[g_iWndowPage.value]];
	list.forEach((item, index) => {
		if (!item.device) {
			return;
		}
		const { monitor_ip, monitor_port } = item.device;
		console.log("monitor_ip :>> ", monitor_ip);
		console.log("monitor_port :>> ", monitor_port);
		console.log("config.szUsername :>> ", config.szUsername);
		console.log("config.szPassword :>> ", config.szPassword);
		WebVideoCtrl.I_Login(monitor_ip, 1, monitor_port, config.szUsername, config.szPassword, {
			timeout: 5000,
			success() {
				console.log("成功");
				setTimeout(function () {
					setTimeout(function () {
						getChannelInfo(monitor_ip, monitor_port, index);
					}, 1000);
					getDevicePort(monitor_ip, monitor_port);
				}, 10);
			},
			error(oError) {
				if (oError.errorCode == 2001) {
					setTimeout(function () {
						setTimeout(function () {
							getChannelInfo(monitor_ip, monitor_port);
						}, 1000);
						getDevicePort(monitor_ip, monitor_port);
					}, 10);
				}
				console.log("err :>> ", oError.errorCode);
				console.error("登录失败");
			}
		});
	});
}

// 获取端口
function getDevicePort(ip, port) {
	const szDeviceIdentify = `${ip}_${port}`;
	if (null == szDeviceIdentify) {
		return;
	}

	const oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify).then(
		oPort => {
			iDevicePort = oPort.iDevicePort;
			iRtspPort = oPort.iRtspPort;
			console.log("iDevicePort :>> ", iDevicePort);
			console.log("获取端口成功! :>> ", szDeviceIdentify);
		},
		oError => {
			const szInfo = "获取端口失败！";
			console.log("获取端口失败！ :>> ", szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
		}
	);
}

// 获取通道
function getChannelInfo(ip, port, index) {
	const szDeviceIdentify = `${ip}_${port}`;
	if (null == szDeviceIdentify) {
		return;
	}

	// 模拟通道
	WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
		success: function (xmlDoc) {
			console.log("xmlDoc :>> ", xmlDoc);
			var oChannels = $(xmlDoc).find("VideoInputChannel");

			$.each(oChannels, function (i) {
				var id = $(this).find("id").eq(0).text(),
					name = $(this).find("name").eq(0).text();
				iChannelID = id;
				if ("" == name) {
					name = "Camera " + (i < 9 ? "0" + (i + 1) : i + 1);
				}
			});
			clickStartRealPlay(szDeviceIdentify, index);
		},
		error: function (oError) {
			console.log(
				'szDeviceIdentify + " 获取模拟通道失败！", oError.errorCode, oError.errorMsg :>> ',
				szDeviceIdentify + " 获取模拟通道失败！",
				oError.errorCode,
				oError.errorMsg
			);
		}
	});
}

/**
 * 切换分割数
 * @param iType 分割数量
 */
async function changeWndNum(iType) {
	await nextTick();
	if (iType == 1) {
		enableDraw();
	} else {
		delAllSnapPolygon();
	}
	if ("1*2" == iType) {
		WebVideoCtrl.I_ArrangeWindow(iType).then(
			() => {
				console.log("窗口分割成功！");
			},
			oError => {
				console.log("窗口分割失败！");
			}
		);
	} else {
		WebVideoCtrl.I_ChangeWndNum(parseInt(iType, 10)).then(
			() => {
				console.log("窗口分割成功！");
			},
			oError => {
				console.log("窗口分割失败！");
			}
		);
	}
}

/**
 * 开始预览
 * @param iWndIndex 在哪一个窗口预览
 */
function clickStartRealPlay(szDeviceIdentify, iWndIndex) {
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);

	if (null == szDeviceIdentify) {
		return;
	}
	const startRealPlay = function () {
		console.log("szDeviceIdentify :>> ", szDeviceIdentify);
		WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
			iStreamType: 1,
			iChannelID: iChannelID,
			bZeroChannel: false,
			iPort: iRtspPort,
			iWndIndex,
			success: function () {
				console.log("开始预览成功！ :>> ", szDeviceIdentify);
				if (g_iWndowType.value == "1*2") {
					changeWndNum(g_iWndowType.value);
				}
				if (userType.value == 1) {
					enableDraw();
				}
			},
			error: function (oError) {
				console.log("开始预览失败！ :>> ", szDeviceIdentify, oError.errorCode, oError.errorMsg);
			}
		});
	};

	if (oWndInfo != null) {
		// 已经在播放了，先停止
		WebVideoCtrl.I_Stop({
			success: function () {
				startRealPlay();
			}
		});
	} else {
		startRealPlay();
	}
}

/**
 * 启用多边形绘制
 */
function enableDraw() {
	WebVideoCtrl.I_SetPlayModeType(6).then(
		() => {
			// g_bEnableDraw = true;
			console.log("启用绘制成功！");
			interval = setInterval(() => {
				const info = getDeviceInfo();
				setSnapPolygon(info);
			}, 1000);
		},
		oError => {
			console.log("启用绘制失败！ :>> ", oError.errorCode, oError.errorMsg);
		}
	);
}

/**
 * 获取设备实时信息以及时间
 */
function getDeviceInfo() {
	const { device_id } = deviceList.value[g_iWndowPage.value][g_iWndIndex.value].device;
	const info = props.deepList.find(item => item.device_id == device_id);
	console.log("info :>> ", info);
	return info;
}

function getTime() {
	const tm = new Date();
	const y = tm.getFullYear();
	const m = (tm.getMonth() + 1).toString().padStart(2, "0");
	const d = tm.getDate().toString().padStart(2, "0");
	const hours = tm.getHours().toString().padStart(2, "0");
	const minutes = tm.getMinutes().toString().padStart(2, "0");
	const secound = tm.getSeconds().toString().padStart(2, "0");
	return `${y}-${m}-${d} ${hours}:${minutes}:${secound}`;
}

/**
 * 清空图形
 */
function delAllSnapPolygon() {
	if (interval) {
		clearInterval(interval);
		interval = null;
	}
	WebVideoCtrl.I_ClearSnapInfo(g_iWndIndex).then(
		() => {
			console.log("清空图形成功！");
			disableDraw();
		},
		oError => {
			console.log("清空图形失败！ :>> ", oError.errorCode, oError.errorMsg);
		}
	);
}

/**
 * 禁用多边形绘制
 */
function disableDraw() {
	WebVideoCtrl.I_SetSnapDrawMode(0, -1).then(
		() => {
			console.log("禁用绘制成功！");
		},
		oError => {
			console.log("禁用绘制失败！");
		}
	);
}

/**
 * 设置图形，页面打开时可以设置以前设置过的图形
 */
function setSnapPolygon(deviceInfo) {
	WebVideoCtrl.I_ClearSnapInfo(g_iWndIndex.value);
	const time = getTime();
	var szInfo = "<?xml version='1.0' encoding='utf-8'?>";
	szInfo += "<SnapPolygonList>";
	szInfo += "<SnapPolygon>";
	szInfo += "<id>1</id>";
	szInfo += "<polygonType>0</polygonType>";
	szInfo += `<tips>${deviceInfo.station.name}-${deviceInfo.region.name}      </tips>`;
	szInfo += `<tips>浓度:${deviceInfo.gas}ppm.m      </tips>`;
	szInfo += `<tips>光强:${deviceInfo.light}      </tips>`;
	szInfo += `<tips>${time}</tips>`;
	szInfo += "<isClosed>true</isClosed>";
	szInfo += "<color><r>236</r><g>198</g><b>157</b></color>";
	szInfo += "<pointList>";
	szInfo += "<point><x>0</x><y>0.9</y></point>";
	szInfo += "<point><x>1</x><y>0.9</y></point>";
	szInfo += "<point><x>1</x><y>1</y></point>";
	szInfo += "<point><x>0</x><y>1</y></point>";
	szInfo += "</pointList>";
	szInfo += "</SnapPolygon>";
	szInfo += "</SnapPolygonList>";

	WebVideoCtrl.I_SetSnapPolygonInfo(g_iWndIndex.value, szInfo).then(
		() => {
			console.log("设置图形成功！");
		},
		oError => {
			console.log("设置图形失败！ :>> ", oError.errorCode, oError.errorMsg);
		}
	);
}

/**
 * 退出登录
 */
function logout() {
	// var szDeviceIdentify = $("#ip").val();

	if (null == szDeviceIdentify) {
		return;
	}

	WebVideoCtrl.I_Logout(szDeviceIdentify).then(
		() => {
			console.log("退出成功！");
		},
		() => {
			console.log("退出失败！");
		}
	);
}

/**
 * 刷新
 */
function refresh() {
	deviceList.value[g_iWndowPage.value].forEach((item, index) => {
		const { monitor_ip, monitor_port } = item.device;
		clickStartRealPlay(`${monitor_ip}_${monitor_port}`, index);
	});
}
</script>

<template>
	<div class="plugin-wrap">
		<div
			class="plugin-refresh"
			@mousedown="refresh"
		>
			<img
				src="../assets/images/icon-refresh.png"
				alt=""
			/>
			<span>刷新</span>
		</div>
		<div class="arr-wrap">
			<img
				src="../assets/images/icon-plugin-arr.png"
				alt=""
				class="arr"
				:class="{ disable: deviceList.length == 1 }"
			/>
			<img
				src="../assets/images/icon-plugin-arr.png"
				alt=""
				class="arr right"
				:class="{ disable: deviceList.length == 1 }"
			/>
		</div>
		<div class="plugin-content">
			<div id="divPlugin"></div>
		</div>
		<!-- <img
			src="../assets/images/plugin-bg.png"
			alt=""
			class="plugin-bg"
		/> -->
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
	cursor: pointer;
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
	display: block;
	width: 40px;
	cursor: pointer;
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
</style>
