<!-- 报警故障内容 -->
<script setup>
const props = defineProps({
	isSelect: Boolean,
	num: [String, Number],
	title: String,
	date: String,
	id: [String, Number],
	standName: String,
	areaName: String,
	time: String,
	checkList: Array
});
const emit = defineEmits(["goDetail", "handleCheck"]);

function handleClick() {
	if (!props.isSelect) {
		return;
	}
	emit('goDetail', props.id);
}
</script>

<template>
	<div
		class="tips-wrap"
		:class="{ select: isSelect }"
		@click="handleClick"
	>
		<div class="top-wrap">
			<div
				class="check"
				v-if="isSelect"
				@click.stop="emit('handleCheck', id)"
			>
				<Transition name="fade">
					<img
						src="../assets/images/icon-hook.png"
						alt=""
						v-show="checkList.includes(id)"
					/>
				</Transition>
			</div>
			<div class="num english">{{ id }}</div>
			<div class="title-wrap">
				<div class="title">{{ standName }}-{{ areaName }}</div>
				<div class="time english">{{ time }}</div>
			</div>
			<img
				src="../assets/images/icon-camera.png"
				alt=""
				class="icon"
				v-if="isSelect"
				
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
	cursor: pointer;
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
	position: relative;
	width: 16px;
	height: 16px;
	box-sizing: border-box;
	border: 1px solid rgba(108, 108, 108, 1);
	background: rgba(255, 255, 255, 0.17);
	margin-right: 15px;
	cursor: pointer;
}

.tips-wrap .top-wrap .check img {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: block;
	width: 80%;
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
	width: 0;
	padding-right: 20px;
	flex: 1;
}

.tips-wrap .top-wrap .title-wrap .title {
	font-size: 16px;
	line-height: 21px;
	color: #fff;
	font-weight: bold;
	margin-bottom: 10px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tips-wrap .top-wrap .title-wrap .time {
	font-size: 14px;
	line-height: 1;
	color: #fff;
}

.tips-wrap .top-wrap .icon {
	display: block;
	width: 24px;
}
</style>
