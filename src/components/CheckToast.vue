<script setup>
import { API_HOME } from "@/api";
import SettingButtonBorder from "./SettingButtonBorder.vue";

const props = defineProps({
	name: String
});

const isShow = defineModel();

async function handleDownload() {
	// {url}/sdk/HCWebSDKPlugin.exe
	const res = await API_HOME.getSdkFile();
	console.log("res :>> ", res);
	const dom = document.createElement("a");
	const url = window.URL.createObjectURL(res);
	dom.href = url;
	dom.download = decodeURI("HCWebSDKPlugin.exe");
	dom.style.display = "none";
	document.body.appendChild(dom);
	dom.click();
	dom.parentNode.removeChild(dom);
	window.URL.revokeObjectURL(url);
}

function reload() {
	window.location.reload();
}
</script>

<template>
	<Transition name="fade">
		<div
			class="form-pop-wrap"
			v-show="isShow"
		>
			<div class="pop-tips">未检测到驱动程序，请重试</div>
			<div
				class="form-pop-main"
				@click.stop
			>
				<div class="title-wrap">
					<div class="content">
						<div class="title">{{ name }}</div>
						<img
							src="../assets/images/icon-video-close.png"
							alt=""
							class="close"
							@click="isShow = false"
						/>
					</div>
					<img
						src="../assets/images/form-pop-title-bg.png"
						alt=""
						class="bg"
					/>
				</div>
				<div class="list">
					<div class="item">
						<div class="tips">系统使用前请先安装</div>
						<div class="tips chance">监控设备软件驱动程序</div>
						<SettingButtonBorder
							class="btn"
							type="clear"
							@click="handleDownload"
						>
							驱动程序下载
						</SettingButtonBorder>
					</div>
					<div class="item">
						<div class="tips">安装完成后，点下方按钮刷新该界面登录使用。</div>
						<SettingButtonBorder
							class="btn"
							@click="reload"
						>
							已成功安装设备驱动程序
						</SettingButtonBorder>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style scoped>
.form-pop-wrap {
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	z-index: 100;
}

.form-pop-wrap .pop-tips {
	font-size: 15px;
	line-height: 40px;
	color: #ff4a19;
	padding: 0 32px;
	background: rgba(0, 0, 0, 0.6);
	border-radius: 2px;
	margin-bottom: 10px;
}

.form-pop-wrap .form-pop-main {
	width: 509px;
	box-sizing: border-box;
	background: #242424;
	border: 2px solid rgba(221, 221, 221, 0.3);
	border-radius: 2px;
	overflow: hidden;
}

.form-pop-wrap .form-pop-main .title-wrap {
	position: relative;
}

.form-pop-wrap .form-pop-main .title-wrap .bg {
	display: block;
	width: 100%;
}

.form-pop-wrap .form-pop-main .title-wrap .content {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding-left: 20px;
	padding-right: 10px;
}

.form-pop-wrap .form-pop-main .title-wrap .title {
	font-size: 18px;
	font-weight: bold;
}

.form-pop-wrap .form-pop-main .title-wrap .close {
	display: block;
	width: 28px;
	cursor: pointer;
}

.form-pop-wrap .form-pop-main .list {
	padding: 30px 25px 40px;
}

.form-pop-wrap .form-pop-main .list .item {
	padding-bottom: 22px;
	border-bottom: 1px solid rgba(175, 201, 187, 0.2);
	margin-bottom: 28px;
}

.form-pop-wrap .form-pop-main .list .item:last-child {
	margin-bottom: 0;
	padding-bottom: 0;
	border-bottom: none;
}

.form-pop-wrap .form-pop-main .list .item .tips {
	font-size: 15px;
	line-height: 24px;
	text-align: center;
}

.form-pop-wrap .form-pop-main .list .item .tips.chance {
	color: #ea7e4e;
}

.form-pop-wrap .form-pop-main .list .item .btn {
	width: 220px;
	margin: 14px auto 0;
}
</style>
