<!-- 报警故障内容 -->
<script setup>
const props = defineProps({
	isSelect: Boolean,
	num: [String, Number],
	title: String,
	date: String
});
const emit = defineEmits(["goDetail"]);
</script>

<template>
	<div
		class="tips-wrap"
		:class="{ select: isSelect }"
	>
		<div class="top-wrap">
			<div
				class="check"
				v-if="isSelect"
			></div>
			<div class="num english">107</div>
			<div class="title-wrap">
				<div class="title">沈阳分输站-过滤区</div>
				<div class="time english">2014-10-13 13:00:00</div>
			</div>
			<img
				src="../assets/images/icon-camera.png"
				alt=""
				class="icon"
				v-if="isSelect"
				@mousedown="emit('goDetail')"
			/>
		</div>
		<slot></slot>
	</div>
</template>

<style scoped>
.tips-wrap {
	padding: 15px 20px 20px;
	background: rgba(42, 42, 42, 0.8);
	box-shadow: inset 0 0 6px 2px rgba(255, 255, 255, 0.4);
	border-radius: 6px;
}

.tips-wrap.select {
	padding: 12px 10px;
}

.tips-wrap .top-wrap {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
	padding-left: 2px;
	padding-right: 8px;
	padding-bottom: 9px;
	border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.tips-wrap.select .top-wrap {
	padding-bottom: 0;
	border: none;
}

.tips-wrap .top-wrap .check {
	width: 12px;
	height: 12px;
	box-sizing: border-box;
	border: 1px solid rgba(108, 108, 108, 1);
	background: rgba(255, 255, 255, 0.17);
	margin-right: 15px;
}

.tips-wrap .top-wrap .num {
	font-size: 16px;
	line-height: 12px;
	color: #fff;
	opacity: 0.6;
	margin-right: 20px;
}

.tips-wrap.select .top-wrap .num {
	padding-right: 20px;
	border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.tips-wrap .top-wrap .title-wrap {
	margin-right: auto;
}

.tips-wrap .top-wrap .title-wrap .title {
	font-size: 16px;
	line-height: 21px;
	color: #fff;
	font-weight: bold;
	margin-bottom: 10px;
}

.tips-wrap .top-wrap .title-wrap .time {
	font-size: 14px;
	line-height: 1;
	color: #fff;
}

.tips-wrap .top-wrap .icon {
	display: block;
	width: 24px;
	cursor: pointer;
}
</style>
