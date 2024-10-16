<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
	<!-- tab切换 -->
	<div class="tab-wrap">
		<div class="tab-content">
			<div
				class="tab-item active"
				@click="router.push('test')"
			>
				实时监测
			</div>
			<div class="tab-item">历史报警</div>
			<div class="tab-item">历史故障</div>
			<div class="tab-item">系统管理</div>
		</div>
		<img
			src="../assets/images/tab-bg.png"
			class="bg"
		/>
	</div>
</template>

<style scoped>
.tab-wrap {
	position: relative;
	width: 712px;
	margin: 0 auto;
}

.tab-wrap .tab-content {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 0 88px;
	overflow: hidden;
}

.tab-wrap .tab-content .tab-item {
	position: relative;
	font-size: 14px;
	color: #fff;
	opacity: 0.5;
	cursor: pointer;
	transition: 0.2s all linear;
}

.tab-wrap .tab-content .tab-item::after {
	position: absolute;
	content: "";
	left: 50%;
	bottom: -11px;
	transform: translateX(-50%);
	width: 110px;
	height: 24px;
	background: url("../assets/images/tab-active.png") no-repeat;
	background-size: 100% 100%;
	opacity: 0;
	transition: 0.2s all linear;
}

.tab-wrap .tab-content .tab-item.active::after {
	opacity: 1;
}

.tab-wrap .tab-content .tab-item.active {
	font-weight: bold;
	opacity: 1;
}

.tab-wrap .bg {
	display: block;
	width: 100%;
}
</style>
