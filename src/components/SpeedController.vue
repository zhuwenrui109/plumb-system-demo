<script setup>
import { computed, onMounted, ref } from "vue";

const props = defineProps({
	disabled: {
		type: Boolean,
		default: true
	}
})
const speed = defineModel("speed");

const wrap = ref(null);
const wrapWidth = ref(0);

const lineWidth = computed(() => (Math.round(wrapWidth.value / 7) * speed.value) + "px");

onMounted(() => {
	wrapWidth.value = wrap.value.clientWidth;
})

function handleSpeed(key) {
	console.log('props.disabled :>> ', props.disabled);
	if (props.disabled) {
		return
	}
	switch (key) {
		case 0:
      if (speed.value <= 1) return;
			speed.value--;
			break;

		case 1:
			if (speed.value >= 7) return;
			speed.value++;
			break;

		default:
			break;
	}
	console.log("speed.value :>> ", speed.value);
}
</script>

<template>
	<div class="speed-controller-wrap">
		<div class="top-wrap">
			<div class="num english" v-for="(item, index) in 8">{{ index }}</div>
			<!-- <div class="num english">0</div>
			<div class="num english">3</div>
			<div class="num english">5</div>
			<div class="num english">7</div> -->
		</div>
		<div class="btn-wrap">
			<img
				src="../assets/images/icon-speed-arr.png"
				alt=""
				class="btn"
				@mousedown="handleSpeed(0)"
			/>
			<!-- 速度条 -->
			<div class="line-wrap">
				<div class="line" ref="wrap">
					<div :style="{ width: lineWidth }"></div>
				</div>
			</div>
			<img
				src="../assets/images/icon-speed-arr.png"
				alt=""
				class="btn right"
				@mousedown="handleSpeed(1)"
			/>
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
	display: block;
	width: 22px;
	flex-shrink: 0;
	cursor: pointer;
}

.speed-controller-wrap .btn-wrap .btn.right {
	transform: rotate(180deg);
}

.speed-controller-wrap .btn-wrap .line-wrap {
  width: 232px;
	background: url("../assets/images/speed-controller-bg.png") no-repeat;
	background-size: cover;
	padding: 8px 0;
}

.speed-controller-wrap .btn-wrap .line-wrap .line {
	width: 100%;
	height: 14px;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.4);
	box-shadow: inset 0 0 7px 3px rgba(92, 92, 92, 0.4);
	border: 1px solid rgba(108, 108, 108, 0.3);
}

.speed-controller-wrap .btn-wrap .line-wrap .line div {
	width: 10%;
	height: 100%;
	background: #be163d;
	opacity: 1;
  transition: .1s all linear;
}
</style>
