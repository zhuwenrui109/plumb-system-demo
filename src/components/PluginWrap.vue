<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

const g_iWndIndex = defineModel("iWndIndex");
const g_iWndowType = defineModel("iWndowType"); // 分割数量
const { WebVideoCtrl } = window;
const config = {
	szIP: "192.168.1.64", // IP地址
	iPrototocol: 1, // http协议，1表示http协议 2表示https协议
	szPort: "80", // 端口
	szUsername: "admin", // 用户名称
	szPassword: "abcd1234" // 用户密码
};
const szDeviceIdentify = config.szIP + "_" + config.szPort;
let iDevicePort = null;
let iRtspPort = null;
let iChannelID = null;

onMounted(() => {
	console.log("g_iWndowType.value :>> ", g_iWndowType.value);
	initPlugin();
});

onUnmounted(() => {
	WebVideoCtrl.I_DestroyPlugin();
});

watch(g_iWndowType, newVal => {
	console.log('newVal :>> ', newVal);
	changeWndNum(newVal);
})

/**
 * 监控控件初始化
 */
async function initPlugin() {
	WebVideoCtrl.I_InitPlugin({
		bWndFull: false, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
		iWndowType: g_iWndowType.value,
		cbSelWnd: function (xmlDoc) {
			g_iWndIndex.value = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
			console.log("g_iWndIndex.value :>> ", g_iWndIndex.value);
		},
		cbDoubleClickWnd(iWndIndex) {
			g_iWndIndex.value = iWndIndex;
			if (g_iWndowType.value > 1) {
				g_iWndowType.value = 1;
				console.log("g_iWndowType.value :>> ", g_iWndowType.value);
				changeWndNum(1);
			} else {
				g_iWndowType.value = 4;
				changeWndNum(4);
			}
		},
		cbInitPluginComplete() {
			WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin").then(
				() => {
					// 检查插件是否最新
					WebVideoCtrl.I_CheckPluginVersion().then(bFlag => {
						if (bFlag) {
							alert("检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级！");
						}
						loginPlugin();
					});
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
function loginPlugin() {
	WebVideoCtrl.I_Login(config.szIP, config.iPrototocol, config.szPort, config.szUsername, config.szPassword, {
		timeout: 3000,
		success() {
			console.log("成功");
			setTimeout(function () {
				setTimeout(function () {
					getChannelInfo();
				}, 1000);
				getDevicePort();
			}, 10);
		},
		error(oError) {
			if (oError.errorCode == 2001) {
				setTimeout(function () {
					setTimeout(function () {
						getChannelInfo();
					}, 1000);
					getDevicePort();
				}, 10);
			}
			console.log("err :>> ", oError.errorCode);
			console.error("登录失败");
		}
	});
}

// 获取端口
function getDevicePort() {
	if (null == szDeviceIdentify) {
		return;
	}

	const oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify).then(
		oPort => {
			iDevicePort = oPort.iDevicePort;
			iRtspPort = oPort.iRtspPort;
			console.log("获取端口成功! :>> ", szDeviceIdentify);
		},
		oError => {
			const szInfo = "获取端口失败！";
			console.log("szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg :>> ", szDeviceIdentify + szInfo, oError.errorCode, oError.errorMsg);
		}
	);
}

// 获取通道
function getChannelInfo() {
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
			clickStartRealPlay(1);
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
	console.log("iType :>> ", iType);
	WebVideoCtrl.I_ChangeWndNum(iType).then(
		() => {
			console.log('"窗口分割成功！" :>> ', "窗口分割成功！");
		},
		oError => {
			const szInfo = "窗口分割失败！";
			console.log("szInfo, oError.errorCode, oError.errorMsg :>> ", szInfo, oError.errorCode, oError.errorMsg);
		}
	);
}

/**
 * 开始预览
 * @param iStreamType 分割数量
 */
function clickStartRealPlay(iStreamType) {
	const oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value);

	if (null == szDeviceIdentify) {
		return;
	}
	const startRealPlay = function () {
		WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
			iStreamType: iStreamType,
			iChannelID: iChannelID,
			bZeroChannel: false,
			iPort: iRtspPort,
			success: function () {
				console.log("开始预览成功！ :>> ", szDeviceIdentify + " " + szInfo);
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
 * 刷新
 */
function refresh() {
	clickStartRealPlay(1);
}
</script>

<template>
	<div class="plugin-wrap">
		<div class="plugin-refresh" @click="refresh">
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
			/>
			<img
				src="../assets/images/icon-plugin-arr.png"
				alt=""
				class="arr right"
			/>
		</div>
		<div class="plugin-content">
			<div id="divPlugin"></div>
		</div>
		<img
			src="../assets/images/plugin-bg.png"
			alt=""
			class="plugin-bg"
		/>
	</div>
</template>

<style scoped>
.plugin-wrap {
	position: relative;
	width: 100%;
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
}

.plugin-wrap .arr-wrap .arr.right {
	transform: rotate(180deg);
}

.plugin-wrap .plugin-content {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 904px;
	height: 542px;
	box-sizing: border-box;
	padding: 6px 16px;
	background: rgba(225, 133, 43, 0.18);
	border: 1px solid #c16205;
}

.plugin-wrap .plugin-content div {
	width: 100%;
	height: 100%;
}
</style>
