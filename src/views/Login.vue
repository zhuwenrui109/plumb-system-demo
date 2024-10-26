<script setup>
import { alogin } from "@/api";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const isAutoLogin = ref(false);
const username = ref("");
const password = ref("");
const router = useRouter();

function login(e) {
  // alogin({
  //   account: username.value,
  //   password: username.value
  // })
  localStorage.setItem("token", JSON.stringify({
    username: username.value,
    password: password.value
  }))
  let prev = localStorage.getItem("preRoute");
  router.push(prev);
}

function toggleAutoLogin() {
  isAutoLogin.value = !isAutoLogin.value;
}
</script>

<template>
	<div class="login">
		<div class="time-wrap">
			<div class="line"></div>
			<div class="time english">2014-10-13 13:00:00</div>
			<div class="line chance"></div>
		</div>
		<home-global-content class="content">
			<div class="form">
				<input type="text" placeholder="请输入账号" v-model="username" />
				<input type="password" placeholder="请输入密码" v-model="password" @keyup.enter="login" />
				<div class="btn" @click="login">
					<span>登录</span>
					<img
						src="../assets/images/icon-login-arr.png"
						alt=""
					/>
				</div>
				<div class="autoLogin-btn" :class="{ check: isAutoLogin }" @click="toggleAutoLogin">
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
  background: rgba(0, 0, 0, .4);
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
  border-bottom: 1px solid rgba(151, 151, 151, .3);
  transition: .3s all ease-in;
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
  transition: .1s all ease-in;
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
