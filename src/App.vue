<script setup>
import Header from "@/components/Header.vue";
import RouteTab from "@/components/RouteTab.vue";
import { computed, onMounted, provide, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { API_HOME } from "./api";
import { useStore } from "vuex";
import useWebSocket from "./utils/useWebSocket";
import audioToastPlguin from "./utils/audioToast";

const route = useRoute();
const store = useStore();

const isLoginRouter = computed(() => route.name == "login");

const audio = ref(null);

// 实时报警 心跳间隔一秒
// const alarm = useWebSocket({
// 	heartBeatData: JSON.stringify({ target: "alarm" }),
// 	heartBeatInterval: 1000
// });

// 实时故障 心跳间隔一秒
// const fault = useWebSocket({
// 	heartBeatData: JSON.stringify({ target: "fault" }),
// 	heartBeatInterval: 1000
// });

// loadAudio();

if (localStorage.getItem("token") || sessionStorage.getItem("token")) {
	loadStandList();
	// alarm.connect();
	// fault.connect();
	loadUserInfo();
}

onMounted(() => {
	store.commit("setPauseAudio", pauseAudio);
});

// watch(
// 	() => alarm.message.value,
// 	newVal => {
// 		if (JSON.stringify(newVal) == "[]") {
// 			store.dispatch("handleAlarmList", []);
// 			pauseAudio();
// 			return;
// 		}
// 		if (newVal.some(item => item.mute_status === 0)) {
// 			document.title = `${newVal.length}条报警`;
// 			startAudio();
// 		} else {
// 			document.title = `(云台式)线型光束甲烷气体探测系统`;
// 			pauseAudio();
// 		}
// 		store.dispatch("handleAlarmList", newVal);
// 	}
// );

// watch(
// 	() => fault.message.value,
// 	newVal => {
// 		store.dispatch("handleFaultList", newVal);
// 	}
// );

provide("getData", {
	// alarm,
	// fault,
	loadStandList,
	loadUserInfo
});

function startAudio() {
	if (audio.value.paused) {
		audio.value.play().catch(err => {
			audioToastPlguin({ message: "设备浓度超标" }).then(() => {
				audio.value.play();
			});
		});
	}
}

function pauseAudio() {
	if (!audio.value.paused) {
		audio.value.pause();
	}
}

// async function loadAudio() {
// 	// const res = await API_HOME.getAudio();
// 	// const audioBlob = new Blob([res]);
// 	// const audioUrlObject = URL.createObjectURL(audioBlob);
// 	if (audio.value) {
// 		audio.value.src = audioUrlObject;
// 		audio.value.load();
// 	}
// }

async function loadUserInfo() {
	const res = await API_HOME.getUserInfo();
	store.dispatch("handleUser", res);
}

async function loadStandList() {
	try {
		const { data } = await API_HOME.getStandList();
		await store.dispatch("handleStandList", data);
	} catch (err) {
		console.log("服务器繁忙");
	}
}
</script>

<template>
	<div class="app-wrap" v-cloak>
		<!-- 头部 -->
		<Header></Header>

		<!-- 导航 -->
		<route-tab v-if="!isLoginRouter"></route-tab>

		<!-- 内容区域 -->
		<div
			class="app-main"
			:class="{ login: isLoginRouter }"
		>
			<router-view></router-view>
		</div>
		<audio
			src="./assets/audio/alarm.mp3"
			preload="auto"
			loop
			ref="audio"
		></audio>
	</div>
</template>

<style scoped>
.app-wrap {
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: url("./assets/images/bg.jpg") no-repeat center top;
	background-size: cover;
}

@media screen and (min-height: 1000px) {
	.app-wrap {
		background: url("./assets/images/bg.jpg") no-repeat center top cover, url("./assets/images/home-bg.png") no-repeat left bottom;
	}
}

.app-wrap .app-bg {
	display: block;
	width: 100%;
}

.app-wrap .app-main {
	width: 100%;
	box-sizing: border-box;
	padding-bottom: 12px;
}

.app-wrap .app-main.login {
	padding-bottom: 0;
	flex: 1;
}
</style>
