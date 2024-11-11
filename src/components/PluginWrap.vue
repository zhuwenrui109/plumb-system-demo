<script setup>
import { API_HOME } from "@/api";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useStore } from "vuex";
import FormPop from "./FormPop.vue";

const store = useStore();
const props = defineProps(["deepList"]);
const g_iWndIndex = defineModel("iWndIndex");
const g_iWndowType = defineModel("iWndowType"); // 分割数量
const g_iWndowPage = defineModel("iWndowPage"); // 页数


const isPopShow = ref(false);

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
					// 初始化失败
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
	// if (iType == 1) {
	// 	enableDraw();
	// } else {
	// 	delAllSnapPolygon();
	// }
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
					interval = setInterval(() => {
						console.log("interval");
						setTextOverlay(szDeviceIdentify, iChannelID);
					}, 1000 * 10);
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
 * 设置osg信息
 */
function setTextOverlay(szDeviceIdentify) {
	if (!deviceList.value) {
		return;
	}
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);
	const szUrl = "ISAPI/System/Video/inputs/channels/" + oWndInfo.iChannelID + "/overlays";
	const deviceInfo = getDeviceInfo();
	WebVideoCtrl.I_GetTextOverlay(szUrl, oWndInfo.szDeviceIdentify, {
		success: function (data) {
			$(data).find("TextOverlay").eq(0).find("displayText").eq(0).text(`${deviceInfo.station.name}-${deviceInfo.region.name}`);
			$(data).find("TextOverlay").eq(0).find("positionX").eq(0).text("20");
			$(data).find("TextOverlay").eq(0).find("positionY").eq(0).text("20");
			$(data).find("TextOverlay").eq(1).find("positionY").eq(0).text("5");
			$(data).find("TextOverlay").eq(1).find("displayText").eq(0).text(`浓度:${deviceInfo.gas}ppm.m`);
			$(data).find("TextOverlay").eq(1).find("positionX").eq(0).text("220");
			$(data).find("TextOverlay").eq(1).find("positionY").eq(0).text("5");
			$(data).find("TextOverlay").eq(2).find("displayText").eq(0).text(`光强:${deviceInfo.light}`);
			$(data).find("TextOverlay").eq(2).find("positionX").eq(0).text("380");
			$(data).find("TextOverlay").eq(2).find("positionY").eq(0).text("5");
			var xmldoc = toXMLStr(data);
			var newOptions = {
				type: "PUT",
				data: xmldoc,
				success: function () {
					console.log("绘制osd信息成功");
				},
				error: function (oError) {
					console.log("设置osd信息失败！");
				}
			};

			WebVideoCtrl.I_SendHTTPRequest(szDeviceIdentify, szUrl, newOptions);
		},
		error: function (oError) {
			showOPInfo(szDeviceIdentify + " 设置osd信息失败！", oError.errorCode, oError.errorMsg);
		}
	});
}

function toXMLStr(oXmlDoc) {
	var szXmlDoc = "";

	try {
		var oSerializer = new XMLSerializer();
		szXmlDoc = oSerializer.serializeToString(oXmlDoc);
	} catch (e) {
		try {
			szXmlDoc = oXmlDoc.xml;
		} catch (e) {
			return "";
		}
	}
	if (szXmlDoc.indexOf("<?xml") == -1) {
		szXmlDoc = "<?xml version='1.0' encoding='utf-8'?>" + szXmlDoc;
	}

	return szXmlDoc;
}

/**
 * 获取设备实时信息以及时间
 */
function getDeviceInfo() {
	const { device_id } = deviceList.value[g_iWndowPage.value][g_iWndIndex.value].device;
	const info = props.deepList.find(item => item.device_id == device_id);
	return info;
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
				v-show="g_iWndowType == 4 && deviceList.length > 1"
			/>
			<img
				src="../assets/images/icon-plugin-arr.png"
				alt=""
				class="arr right"
				v-show="g_iWndowType == 4 && deviceList.length > 1"
			/>
		</div>
		<div class="plugin-content">
			<div id="divPlugin">
				<img src="../assets/images/plugin-video-bg.png" alt="">
			</div>
		</div>
		<FormPop v-model="isPopShow" name="温馨提示"></FormPop>
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

.plugin-wrap .plugin-refresh:hover {
	opacity: .7;
	transition: .1s all linear;
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

.plugin-wrap .plugin-content > div img {
	display: block;
	width: 100%;
}
</style>
