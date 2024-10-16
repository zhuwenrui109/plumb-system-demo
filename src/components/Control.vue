<!-- 云台上下左右控制 -->
<script setup>

function handleControl(key) {
  console.log('key :>> ', key);
}
</script>

<template>
	<div class="control-wrap">
		<div
			class="triangle top"
			@click="handleControl('top')"
		>
			<img
				src="../assets/images/icon-arr-right.png"
				alt=""
				class="arr"
			/>
		</div>
		<div
			class="triangle left"
			@click="handleControl('left')"
		>
			<img
				src="../assets/images/icon-arr-right.png"
				alt=""
				class="arr"
			/>
		</div>
		<div
			class="triangle right"
			@click="handleControl('right')"
		>
			<img
				src="../assets/images/icon-arr-right.png"
				alt=""
				class="arr"
			/>
		</div>
		<div
			class="triangle bottom"
			@click="handleControl('bottom')"
		>
			<img
				src="../assets/images/icon-arr-right.png"
				alt=""
				class="arr"
			/>
		</div>
		<img
			src="../assets/images/control-border.png"
			alt=""
			class="border"
		/>
		<img
			src="../assets/images/control-auto.png"
			alt=""
			class="auto-btn"
		/>
	</div>
</template>

<style scoped>
.control-wrap {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 217px;
	height: 217px;
	margin: 0 auto;
	box-sizing: border-box;
	border: 8px solid #000;
	border-radius: 50%;
	overflow: hidden;
}

.control-wrap .triangle.left {
	position: relative;
	width: 50%;
	height: 100%;
	background: linear-gradient(to bottom, #1C1918, #28201C, #4D4C4B 70%) no-repeat;
	cursor: pointer;
}

.control-wrap .triangle.left .arr {
	position: absolute;
	top: 50%;
	right: 60px;
	transform: translateY(-50%) rotate(180deg);
	display: block;
	width: 8px;
	opacity: .4;
}

.control-wrap .triangle.right {
	position: relative;
	width: 50%;
	height: 100%;
	background: linear-gradient(to bottom, #1C1918, #28201C, #4D4C4B 70%) no-repeat;
	cursor: pointer;
}

.control-wrap .triangle.right .arr {
	position: absolute;
	top: 50%;
	left: 60px;
	transform: translateY(-50%);
	display: block;
	width: 8px;
	opacity: .4;
}

.control-wrap .triangle.top {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	height: 50%;
	background: linear-gradient(to bottom, #58524F 60%, #322923) no-repeat;
	clip-path: polygon(100% 0, 0 0, 50% 100%);
	cursor: pointer;
	z-index: 10;
}

.control-wrap .triangle.top .arr {
	position: absolute;
	left: 50%;
	bottom: 60px;
	transform: translateX(-50%) rotate(-90deg);
	display: block;
	width: 8px;
	opacity: .4;
}

.control-wrap .triangle.bottom {
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 100%;
	height: 50%;
	background: linear-gradient(to bottom, #1b1918 10%, #28201C 30%, #4d4c4c) no-repeat;
	clip-path: polygon(50% 0, 0 100%, 100% 100%);;
	cursor: pointer;
	z-index: 10;
}

.control-wrap .triangle.bottom .arr {
	position: absolute;
	left: 50%;
	top: 60px;
	transform: translateX(-50%) rotate(90deg);
	display: block;
	width: 8px;
	opacity: .4;
}

.control-wrap .border {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: block;
	width: 74px;
	pointer-events: none;
	z-index: 15;
}

.control-wrap .auto-btn {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: block;
	width: 58px;
	cursor: pointer;
	z-index: 15;
}
</style>