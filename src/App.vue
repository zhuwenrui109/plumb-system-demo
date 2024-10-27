<script setup>
import Header from "@/components/Header.vue";
import RouteTab from "@/components/RouteTab.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isLoginRouter = computed(() => route.name == "login");
</script>

<template>
	<div
		class="app-wrap"
	>
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
	transition: opacity .2s ease-in;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
