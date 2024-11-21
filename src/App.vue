<script setup>
import Header from "@/components/Header.vue";
import RouteTab from "@/components/RouteTab.vue";
import { computed, provide, watch } from "vue";
import { useRoute } from "vue-router";
import { API_HOME } from "./api";
import { useStore } from "vuex";
import useWebSocket from "./utils/useWebSocket";

const route = useRoute();
const store = useStore();

const isLoginRouter = computed(() => route.name == "login");

// 实时报警
const alarm = useWebSocket({
	heartBeatData: JSON.stringify({ target: "alarm" })
});

// 实时报警
const fault = useWebSocket({
	heartBeatData: JSON.stringify({ target: "fault" })
});

if (localStorage.getItem("token")) {
	loadStandList();
	alarm.connect();
	fault.connect();
	loadUserInfo();
}

watch(
	() => alarm.message.value,
	newVal => {
		// console.log("alarm :>> ", newVal);
		store.dispatch("handleAlarmList", newVal);
	}
);

watch(
	() => alarm.message.value,
	newVal => {
		// console.log("fault :>> ", newVal);
		store.dispatch("handleFaultList", newVal);
	}
);

provide("getData", {
	alarm,
	fault,
	loadStandList,
	loadUserInfo
});
async function loadUserInfo() {
	const res = await API_HOME.getUserInfo();
	store.dispatch("handleUser", res);
}

async function loadStandList() {
	const res = await API_HOME.getStandList();
	await store.dispatch("handleStandList", res.data);
}
</script>

<template>
	<div class="app-wrap">
		<!-- 头部 -->
		<Header></Header>

		<!-- 导航 -->
		<route-tab v-if="!isLoginRouter"></route-tab>

		<!-- 内容区域 -->
		<div class="app-main">
			<router-view></router-view>
		</div>
	</div>
</template>

<style>
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
	padding-bottom: 12px;
	flex: 1;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease-in;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
