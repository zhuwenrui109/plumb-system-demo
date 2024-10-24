<script setup>
import { nextTick, onMounted, onUnmounted, ref } from "vue";

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
const g_iWndIndex = ref(0);
let iChannelID = null;

onMounted(() => {
	initPlugin();
});

onUnmounted(() => {
	WebVideoCtrl.I_DestroyPlugin();
});

async function initPlugin() {
	await nextTick();
	WebVideoCtrl.I_InitPlugin({
		bWndFull: false, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
		iWndowType: 4,
		bDebugMode: true,
		cbDoubleClickWnd(iWndIndex, bFullScreen) {
			console.log("当前放大的窗口编号：" + iWndIndex);
		},
		cbInitPluginComplete: function () {
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

	var oPort = WebVideoCtrl.I_GetDevicePort(szDeviceIdentify).then(
		oPort => {
			iDevicePort = oPort.iDevicePort;
			iRtspPort = oPort.iRtspPort;
			console.log('szDeviceIdentify + " 获取端口成功！" :>> ', szDeviceIdentify + " 获取端口成功！");
		},
		oError => {
			var szInfo = "获取端口失败！";
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
				// oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
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

// 开始预览
function clickStartRealPlay(iStreamType) {
	var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex.value),
		// bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
		szInfo = "";

	if ("undefined" === typeof iStreamType) {
		iStreamType = parseInt(1, 10);
	}

	if (null == szDeviceIdentify) {
		return;
	}
	var startRealPlay = function () {
		WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
			iStreamType: iStreamType,
			iChannelID: iChannelID,
			bZeroChannel: false,
			iPort: iRtspPort,
			success: function () {
				szInfo = "开始预览成功！";
				console.log('szDeviceIdentify + " " + szInfo :>> ', szDeviceIdentify + " " + szInfo);
			},
			error: function (oError) {
				console.log(
					'szDeviceIdentify + " 开始预览失败！", oError.errorCode, oError.errorMsg :>> ',
					szDeviceIdentify + " 开始预览失败！",
					oError.errorCode,
					oError.errorMsg
				);
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
</script>

<template>
	<div class="plugin-wrap">
		<div class="plugin-refresh">
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
