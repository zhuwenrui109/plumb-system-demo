<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
	disabled: {
		type: Boolean,
		default: true
	}
});
const speed = defineModel("speed");

const timer = ref(null);

const lineWidth = computed(() => Math.round((speed.value / 30) * 100) + "%");

onMounted(() => {});

onUnmounted(() => {
	if (timer.value) {
		clearInterval(timer.value);
	}
});

function handleMousedown(key) {
	timer.value = setInterval(() => {
		handleSpeed(key);
	}, 200);
}

function handleMouseup() {
	if (timer.value) {
		clearInterval(timer.value);
		timer.value = null;
	}
}

function handleSpeed(key) {
	if (props.disabled) return;
	switch (key) {
		case 0:
			if (speed.value <= 1) return;
			speed.value--;
			break;

		case 1:
			if (speed.value >= 30) return;
			speed.value++;
			break;

		default:
			break;
	}
}

/**
 * 点击跳转对应数值
 * @param { Event } event 元素事件
 */
function handleClick(event) {
	const container = event.currentTarget;
	const rect = container.getBoundingClientRect();
	const clickPosition = event.clientX - rect.left; // 点击位置相对容器左侧的距离
	const newProgress = Math.round((clickPosition / rect.width) * 30); // 计算新的进度值
	speed.value = newProgress;
}
</script>

<template>
	<div class="speed-controller-wrap">
		<div class="top-wrap">
			<!-- <div class="num english" v-for="(item, index) in 8">{{ index }}</div> -->
			<div class="num english">0</div>
			<div class="num english">10</div>
			<div class="num english">20</div>
			<div class="num english">30</div>
		</div>
		<div class="btn-wrap">
			<div
				class="btn left"
				@mousedown="handleMousedown(0)"
				@mouseup="handleMouseup"
				@click="handleSpeed(0)"
			>
				<img
					src="../assets/images/icon-select-arr.png"
					alt=""
				/>
			</div>
			<!-- <img
				src="../assets/images/icon-speed-arr.png"
				alt=""
				class="btn"
				@mousedown="handleMousedown(0)"
				@mouseup="handleMouseup"
			/> -->
			<!-- 速度条 -->
			<div
				class="line-wrap"
				@click="handleClick"
			>
				<div class="line">
					<div :style="{ width: lineWidth }"></div>
				</div>
			</div>
			<div
				class="btn right"
				@mousedown="handleMousedown(1)"
				@mouseup="handleMouseup"
				@click="handleSpeed(1)"
			>
				<img
					src="../assets/images/icon-select-arr.png"
					alt=""
				/>
			</div>
			<!-- <img
				src="../assets/images/icon-speed-arr.png"
				alt=""
				class="btn right"
				@mousedown="handleMousedown(1)"
				@mouseup="handleMouseup"
			/> -->
		</div>
	</div>
</template>

<style scoped>
.speed-controller-wrap {
	width: 100%;
	box-sizing: border-box;
	/* padding: 10px 15px 12px; */
}

.speed-controller-wrap .top-wrap {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 232px;
	margin: 0 auto 8px;
}

.speed-controller-wrap .top-wrap .num {
	font-size: 12px;
}

.speed-controller-wrap .btn-wrap {
	display: flex;
	justify-content: space-between;
}

.speed-controller-wrap .btn-wrap .btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 30px;
	box-sizing: border-box;
	background-color: rgba(40, 40, 40, 0.8);
	border: 1px solid rgba(108, 108, 108, 0.8);
	box-shadow: inset 0 0 7px 3px rgba(92, 92, 92, 0.79);
	border-radius: 2px;
	flex-shrink: 0;
}

.speed-controller-wrap.active .btn-wrap .btn:hover {
	box-shadow: inset 0 0 7px 3px #82725f;
	cursor: pointer;
}

.speed-controller-wrap .btn-wrap .btn img {
	display: block;
	width: 6px;
}

.speed-controller-wrap .btn-wrap .btn.left img {
	transform: rotate(90deg);
}

.speed-controller-wrap .btn-wrap .btn.right img {
	transform: rotate(-90deg);
}

.speed-controller-wrap .btn-wrap .line-wrap {
	width: 232px;
	background: url("../assets/images/speed-controller-bg.png") no-repeat;
	background-size: cover;
	padding: 8px 0;
}

.speed-controller-wrap .btn-wrap .line-wrap .line {
	position: relative;
	width: 100%;
	height: 14px;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.4);
	box-shadow: inset 0 0 7px 3px rgba(92, 92, 92, 0.4);
	border: 1px solid rgba(108, 108, 108, 0.3);
}

.speed-controller-wrap.active .btn-wrap .line-wrap .line {
	cursor: pointer;
}

.speed-controller-wrap .btn-wrap .line-wrap .line div {
	position: absolute;
	top: 0;
	left: 0;
	width: 10%;
	height: 100%;
	background: #be163d;
	opacity: 1;
	transition: 0.1s all linear;
}
</style>
