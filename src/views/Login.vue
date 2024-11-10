<script setup>
import { API_HOME } from "@/api";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import toastPlguin from "@/utils/toast";
import { tokenExpressInTime } from "@/utils/tool";
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const { alarm, fault, loadStandList, loadWindowCount } = inject("getData");

const store = useStore();

const isAutoLogin = ref(false);
// 账号：18804030703；密码：123456；
const username = ref("");
const password = ref("");
const router = useRouter();
const date = ref("");
const time = ref("");
let timer = null;

onMounted(() => {
	console.log("onMounted");
	checkLoginStatus();
	timeInit();
	timer = setInterval(timeInit, 1000);
	if (localStorage.getItem("autoToken")) {
		isAutoLogin.value = true;
	}
});

onUnmounted(() => {
	clearInterval(timer);
	timer = null;
});

watch(
	() => alarm.message.value,
	newVal => {
		console.log("alarm :>> ", newVal);
		store.dispatch("handleAlarmList", newVal);
	}
);

watch(
	() => alarm.message.value,
	newVal => {
		console.log("fault :>> ", newVal);
		store.dispatch("handleFaultList", newVal);
	}
);

function timeInit() {
	const tm = new Date();
	const y = tm.getFullYear();
	const m = (tm.getMonth() + 1).toString().padStart(2, "0");
	const d = tm.getDate().toString().padStart(2, "0");
	const hours = tm.getHours().toString().padStart(2, "0");
	const minutes = tm.getMinutes().toString().padStart(2, "0");
	const secound = tm.getSeconds().toString().padStart(2, "0");
	date.value = `${y}-${m}-${d}`;
	time.value = `${hours}:${minutes}:${secound}`;
}

function checkLoginStatus() {
	// 如果已经登录并且token没过期直接回到上一个页面
	if (localStorage.getItem("token") && !tokenExpressInTime()) {
		let prev = localStorage.getItem("preRoute") ? localStorage.getItem("preRoute") : "/";
		router.push(prev);
		return;
	}
	// 没有登录，自动登录
	const autoToken = JSON.parse(localStorage.getItem("autoToken"));
	if (autoToken) {
		toastPlguin("登录中...")
		username.value = autoToken.username;
		password.value = autoToken.password;
		setTimeout(handleLogin, 1000);
		alarm.connect();
		fault.connect();
		loadStandList();
	}
}

/**
 * 登录
 * @param {Event} e Event
 */
async function handleLogin(e) {
	if (!username || !password) {
		toastPlguin("请检查账号密码是否正确")
	}
	try {
		const { token_type, access_token, expires_in, user_role } = await API_HOME.login({
			account: username.value,
			password: password.value
		});
		// 如果需要自动登录保存账号密码到缓存
		if (isAutoLogin.value) {
			localStorage.setItem(
				"autoToken",
				JSON.stringify({
					username: username.value,
					password: password.value
				})
			);
		}
		const token = token_type + " " + access_token;
		localStorage.setItem("token", token);
		localStorage.setItem("tokenTime", 9999999999999999);
		localStorage.setItem("userRole", user_role);
		let prev = localStorage.getItem("preRoute") ? localStorage.getItem("preRoute") : "/";
		alarm.connect();
		fault.connect();
		loadStandList();
		router.push(prev);
	} catch (err) {
		console.log("err :>> ", err);
	}
}

function toggleAutoLogin() {
	isAutoLogin.value = !isAutoLogin.value;
}
</script>

<template>
	<div class="login">
		<div class="time-wrap">
			<div class="line"></div>
			<div class="time english">{{ date }} {{ time }}</div>
			<div class="line chance"></div>
		</div>
		<home-global-content class="content">
			<div class="form">
				<input
					type="text"
					placeholder="请输入账号"
					v-model="username"
				/>
				<input
					type="password"
					placeholder="请输入密码"
					v-model="password"
					@keyup.enter="handleLogin"
				/>
				<div
					class="btn"
					@mousedown="handleLogin"
				>
					<span>登录</span>
					<img
						src="../assets/images/icon-login-arr.png"
						alt=""
					/>
				</div>
				<div
					class="autoLogin-btn"
					:class="{ check: isAutoLogin }"
					@mousedown="toggleAutoLogin"
				>
					<span class="box"></span>
					<span>自动登录</span>
				</div>
			</div>
		</home-global-content>
		<div class="tips">©2024 大连向量集传感技术有限公司 All Right Reserved</div>
	</div>
</template>

<style scoped>
.login {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: url("../assets/images/login-bg.png") no-repeat top;
	background-size: cover;
}

.login .time-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 46px;
}

.login .time-wrap .line {
	position: relative;
	width: 620px;
	height: 2px;
	background: linear-gradient(to right, transparent 80%, #fff);
}

.login .time-wrap .line.chance {
	transform: rotate(180deg);
}

.login .time-wrap .line::after {
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

.login .time-wrap .time {
	font-size: 32px;
	line-height: 1;
	margin: 0 33px;
}

.login .content {
	width: 342px;
	box-sizing: border-box;
	padding: 35px 40px;
	text-align: right;
	background: rgba(0, 0, 0, 0.4);
	margin-bottom: 276px;
}

.login .content input {
	display: block;
	width: 100%;
	box-sizing: border-box;
	font-size: 16px;
	line-height: 1;
	color: #fff;
	padding: 15px 0;
	border: none;
	outline: none;
	background: transparent;
	border-bottom: 1px solid rgba(151, 151, 151, 0.3);
	transition: 0.3s all ease-in;
	margin-bottom: 18px;
}

.login .content input:last-of-type {
	margin-bottom: 20px;
}

.login .content input:focus {
	border-bottom-color: #fff;
}

.login .content input::placeholder {
	color: #949494;
}

.login .content .btn {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	box-sizing: border-box;
	background: rgba(188, 181, 133, 0.68);
	padding-left: 28px;
	padding-right: 20px;
	margin-bottom: 14px;
	cursor: pointer;
}

.login .content .btn span {
	display: block;
	font-size: 16px;
	line-height: 44px;
}

.login .content .btn img {
	display: block;
	width: 20px;
}

.login .content .autoLogin-btn {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	font-size: 14px;
	line-height: 1;
	color: #949494;
	cursor: pointer;
}

.login .content .autoLogin-btn span {
	display: block;
}

.login .content .autoLogin-btn .box {
	position: relative;
	width: 12px;
	height: 12px;
	box-sizing: border-box;
	border: 1px solid #979797;
	margin-right: 4px;
}

.login .content .autoLogin-btn .box::after {
	position: absolute;
	content: "";
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 6px;
	height: 6px;
	background: #fff;
	opacity: 0;
	transition: 0.1s all ease-in;
}

.login .content .autoLogin-btn.check .box::after {
	opacity: 1;
}

.login .tips {
	font-size: 14px;
	line-height: 1;
	color: #949494;
}
</style>
