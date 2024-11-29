<!-- 头部 -->
<script setup>
import dialogPlguin from "@/utils/dialog";
import { clearToken, tokenExpressInTime } from "@/utils/tool";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const router = useRouter();

const date = ref("");
const time = ref("");
let timer = null;

onMounted(() => {
	timeInit();
	timer = setInterval(timeInit, 1000);
});

onUnmounted(() => {
	clearInterval(timer);
	timer = null;
});

const isHome = computed(() => route.name == "home");

function timeInit() {
	if (route.name == "login") {
		return;
	}
	const tm = new Date();
	const y = tm.getFullYear();
	const m = (tm.getMonth() + 1).toString().padStart(2, "0");
	const d = tm.getDate().toString().padStart(2, "0");
	const hours = tm.getHours().toString().padStart(2, "0");
	const minutes = tm.getMinutes().toString().padStart(2, "0");
	const secound = tm.getSeconds().toString().padStart(2, "0");
	date.value = `${y}年${m}月${d}日`;
	time.value = `${hours}:${minutes}:${secound}`;
}

function handleLogout() {
	isHome.value && store.state.destoryPlugin();
	dialogPlguin({
		message: "是否确认退出登录"
	}).then(
		() => {
			clearToken();
			localStorage.getItem("autoToken") && localStorage.removeItem("autoToken");
			router.push({
				name: "login"
			});
		},
		() => {
			isHome.value && store.state.initPlugin();
		}
	);
}
</script>

<template>
	<div class="wrap">
		<div
			class="time"
			v-if="route.name != 'login'"
		>
			{{ date }} {{ time }}
		</div>
		<img
			src="../assets/images/header-bg.png"
			alt=""
			class="header-bg"
		/>
		<div
			class="logout-wrap"
			v-if="route.name != 'login' && store.state.user.name"
		>
			{{ store.state.user.name }}，欢迎回来！
			<div
				class="logout-btn"
				@click="handleLogout"
			>
				<img
					src="../assets/images/icon-logout.png"
					alt=""
					class="icon"
				/>
				<span>退出登录</span>
			</div>
		</div>
		<div class="line"></div>
		<div class="line right"></div>
	</div>
</template>

<style scoped>
.wrap {
	position: relative;
	width: 100%;
	z-index: 15;
}

.wrap .header-bg {
	display: block;
	width: 100%;
}

.wrap .time {
	position: absolute;
	top: 50%;
	left: 40px;
	transform: translateY(-50%);
	font-size: 16px;
	line-height: 1;
	color: #fff;
	font-weight: lighter;
}

.wrap .logout-wrap {
	position: absolute;
	top: 50%;
	right: 30px;
	transform: translateY(-50%);
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 10px;
	font-size: 12px;
}

.wrap .logout-wrap .logout-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 5px;
	opacity: .7;
	transition: .1s all linear;
	cursor: pointer;
}

.wrap .logout-wrap .logout-btn:hover {
	opacity: 1;
}

.wrap .logout-wrap .logout-btn .icon {
	display: block;
	width: 22px;
}

.wrap .logout-wrap .logout-btn span {
	display: block;
	font-size: 12px;
}

.wrap .line {
	position: absolute;
	left: 0;
	bottom: 0;
	transform: translateY(-50%);
	width: 644px;
	height: 2px;
	background: linear-gradient(to right, transparent 80%, rgba(255, 255, 255, 0.6) 90%);
}

.wrap .line::after {
	position: absolute;
	content: "";
	top: 50%;
	right: 0;
	transform: translate(50%, -50%);
	width: 6px;
	height: 6px;
	background: #fff;
	border-radius: 50%;
}

.wrap .line.right {
	left: auto;
	right: 0;
	transform: rotate(180deg);
}
</style>
