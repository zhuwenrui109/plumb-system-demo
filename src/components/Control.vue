<script setup>
import { API_HOME } from '@/api';
import toastPlguin from '@/utils/toast';
import { computed } from 'vue';
import { useStore } from 'vuex';

const pageindex = defineModel("page")
const deviceIndex = defineModel("device");
const store = useStore();

const deviceList = computed(() => store.getters.getDeviceList);

/**
 * 控制云台方向
 * @param {String} type 0：停止，1：上，2：下,3:左，4：右，5：左上，6：右上，7：左下，8：右下，9：开启自动巡航
 */
async function handleControl(key) {
	const res = await API_HOME.handleDirection({
		device_id: deviceList.value[pageindex.value][deviceIndex.value].device.device_id,
		value: key
	})
	console.log('res :>> ', res);
}

async function handleAuto() {
	const res = await API_HOME.getAutoStatus({
		device_id: deviceList.value[pageindex.value][deviceIndex.value].device.device_id
	})
	if (!res.data.status) {
		handleControl(9);
	} else {
		const res = await API_HOME.closeAuto({
			device_id: deviceList.value[pageindex.value][deviceIndex.value].device.device_id
		})
		console.log('res :>> ', res);
	}
}
</script>

<template>
	<div class="control-wrap">
		<div class="control-content">
			<div
				class="triangle top"
				@mousedown="handleControl('1')"
				@mouseup="handleControl('0')"
			>
				<img
					src="../assets/images/icon-arr-right.png"
					alt=""
					class="arr"
				/>
			</div>
			<div
				class="triangle left"
				@mousedown="handleControl('3')"
				@mouseup="handleControl('0')"
			>
				<img
					src="../assets/images/icon-arr-right.png"
					alt=""
					class="arr"
				/>
			</div>
			<div
				class="triangle right"
				@mousedown="handleControl('4')"
				@mouseup="handleControl('0')"
			>
				<img
					src="../assets/images/icon-arr-right.png"
					alt=""
					class="arr"
				/>
			</div>
			<div
				class="triangle bottom"
				@mousedown="handleControl('2')"
				@mouseup="handleControl('0')"
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
			<img
				src="../assets/images/control-auto-active.png"
				alt=""
				class="auto-btn active"
				@click="handleAuto"
			/>
		</div>
	</div>
</template>

<style scoped>
.control-wrap {
	width: 218px;
	height: 218px;
	box-sizing: border-box;
	padding: 8px;
	margin: 0 auto;
	background: #000;
	border-radius: 50%;
	border: 1px solid transparent;
}

.control-wrap.control-wrap-active {
	border-color: #ffe3c6;
	/* transition: .2s all ease-in; */
}

.control-wrap .control-content {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border-radius: 50%;
	overflow: hidden;
}

.control-wrap .control-content .triangle.left {
	position: relative;
	width: 50%;
	height: 100%;
	background: linear-gradient(to bottom, #1c1918, #28201c, #4d4c4b 70%) no-repeat;
	cursor: pointer;
	transition: .3s all ease-in;
}

.control-wrap.control-wrap-active .control-content .triangle.left:hover {
	background: linear-gradient(to bottom, #301D09, #301D09, #553A21 70%) no-repeat;
}

.control-wrap .control-content .triangle.left .arr {
	position: absolute;
	top: 50%;
	right: 60px;
	transform: translateY(-50%) rotate(180deg);
	display: block;
	width: 8px;
	opacity: 0.4;
}

.control-wrap .control-content .triangle.right {
	position: relative;
	width: 50%;
	height: 100%;
	background: linear-gradient(to bottom, #1c1918, #28201c, #4d4c4b 70%) no-repeat;
	cursor: pointer;
}

.control-wrap.control-wrap-active .control-content .triangle.right:hover {
	background: linear-gradient(to bottom, #301D09, #301D09, #553A21 70%) no-repeat;
}

.control-wrap .control-content .triangle.right .arr {
	position: absolute;
	top: 50%;
	left: 60px;
	transform: translateY(-50%);
	display: block;
	width: 8px;
	opacity: 0.4;
}

.control-wrap .control-content .triangle.top {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	height: 50%;
	background: linear-gradient(to bottom, #58524f 60%, #322923) no-repeat;
	clip-path: polygon(100% 0, 0 0, 50% 100%);
	cursor: pointer;
	z-index: 10;
}

.control-wrap .control-content .triangle.top .arr {
	position: absolute;
	left: 50%;
	bottom: 60px;
	transform: translateX(-50%) rotate(-90deg);
	display: block;
	width: 8px;
	opacity: 0.4;
}

.control-wrap.control-wrap-active .control-content .triangle.top:hover {
	background: linear-gradient(to bottom, #301D09, #553A21 70%) no-repeat;
}

.control-wrap .control-content .triangle.bottom {
	position: absolute;
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 100%;
	height: 50%;
	background: linear-gradient(to bottom, #1b1918 10%, #28201c 30%, #4d4c4c) no-repeat;
	clip-path: polygon(50% 0, 0 100%, 100% 100%);
	cursor: pointer;
	z-index: 10;
}

.control-wrap.control-wrap-active .control-content .triangle.bottom:hover {
	background: linear-gradient(to bottom, #301D09, #301D09, #553A21 70%) no-repeat;
}

.control-wrap .control-content .triangle.bottom .arr {
	position: absolute;
	left: 50%;
	top: 60px;
	transform: translateX(-50%) rotate(90deg);
	display: block;
	width: 8px;
	opacity: 0.4;
}

.control-wrap.control-wrap-active .control-content .triangle.top .arr,
.control-wrap.control-wrap-active .control-content .triangle.right .arr,
.control-wrap.control-wrap-active .control-content .triangle.bottom .arr,
.control-wrap.control-wrap-active .control-content .triangle.left .arr {
	opacity: 1;
	/* transition: .2s all ease-in; */
}

.control-wrap .control-content .border {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: block;
	width: 74px;
	pointer-events: none;
	z-index: 15;
}

.control-wrap .control-content .auto-btn {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: block;
	width: 58px;
	cursor: pointer;
	z-index: 15;
}

.control-wrap .control-content .auto-btn.active {
	display: none;
}

.control-wrap.control-wrap-active .control-content .auto-btn {
	display: none;
}

.control-wrap.control-wrap-active .control-content .auto-btn.active {
	display: block;
}
</style>
