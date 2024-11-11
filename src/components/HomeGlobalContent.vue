<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ObserveDom from "@better-scroll/observe-dom";
import ScrollBar from "@better-scroll/scroll-bar";

BScroll.use(MouseWheel);
BScroll.use(ObserveDom);
BScroll.use(ScrollBar);

const props = defineProps({
	isNeedScroll: {
		type: Boolean,
		default: false,
		required: false
	},
	isAutoScroll: {
		type: Boolean,
		default: false,
		required: false
	},
	isNeedScrollBar: {
		type: Boolean,
		default: false,
		required: false
	}
});

const wrap = ref(null);
const scrollBar = ref(null);
let scroll = null;
let timer = null;

onMounted(() => {
	if (props.isNeedScroll) {
		// 初始化滚动
		initScroll();
	}
});

onUnmounted(() => {
	if (props.isNeedScroll) {
		destroyScroll(timer);
	}
});

/**
 * BScroll 初始化
 */
function initScroll() {
	const scrollbar = props.isNeedScrollBar
		? {
				customElements: [scrollBar.value],
				fade: false,
				interactive: true,
				scrollbarTrackClickable: true
		  }
		: false;
	scroll = new BScroll(wrap.value, {
		scrollX: false,
		scrollY: true,
		observeDOM: true,
		scrollbar,
		mouseWheel: !props.isAutoScroll ? true : false,
		disableMouse: true,
		disableTouch: true
	});
}

/**
 * 刷新列表
 */
function refreshScroll() {
	scroll.refresh();
}

/**
 * 销毁BScroll
 */
function destroyScroll() {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
	scroll.destroy();
}
</script>

<!-- 黑底黄描边框子 -->
<template>
	<div class="global-content-wrap">
		<div
			class="global-content-list"
			ref="wrap"
		>
			<slot></slot>
		</div>
		<div
			class="custom-vertical-scrollbar"
			ref="scrollBar"
			v-if="props.isNeedScrollBar"
		>
			<div class="custom-horizontal-indicator"></div>
		</div>
	</div>
</template>

<style scoped>
.global-content-wrap {
	position: relative;
	box-sizing: border-box;
	margin: 10px auto 0;
	background: rgba(0, 0, 0, 0.7);
	border: 1px solid rgba(134, 87, 43, 0.42);
}

.global-content-wrap .global-content-list {
	height: 100%;
	overflow: hidden;
}

.global-content-wrap .custom-vertical-scrollbar {
	position: absolute;
	top: 10px;
	right: 7px;
	width: 4px;
	height: 90%;
}

.global-content-wrap .custom-vertical-scrollbar .custom-horizontal-indicator {
	width: 100%;
	height: 74px;
	background: #fff;
	opacity: 0.4;
	border-radius: 2px;
}

.global-content-wrap::after {
	position: absolute;
	content: "";
	top: -2px;
	left: 0;
	width: 100%;
	height: 6px;
	box-sizing: border-box;
	border: 2px solid #d7d7d7;
	border-bottom: none;
	opacity: 0.3;
}
</style>
