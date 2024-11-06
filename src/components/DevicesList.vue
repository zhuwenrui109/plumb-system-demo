<!-- 设备列表 -->
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import GlobalContent from "./GlobalContent.vue";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import ObserveDom from "@better-scroll/observe-dom";
import ScrollBar from "@better-scroll/scroll-bar";
import { useStore } from "vuex";

BScroll.use(MouseWheel);
BScroll.use(ObserveDom);
BScroll.use(ScrollBar);

const store = useStore();
const page = defineModel("page");
const index = defineModel("index");
const type = defineModel("type");
const props = defineProps({
	list: {
		type: Array,
		default: [],
		required: true
	},
	isNeedScroll: {
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

const areaNavScroll = ref(null);
const scrollBar = ref(null);
let scroll = null;

const deviceList = computed(() => store.getters.getDeviceList);
const currentNavIndex = computed(() => {
	if (!deviceList.value.length) {
		return -1;
	}
	return deviceList.value[page.value][index.value].sIndex;
});

onMounted(() => {
	// 初始化滚动
	initScroll();
});

onUnmounted(() => {
	destroyScroll();
});

/**
 * BScroll 初始化
 */
function initScroll() {
	scroll = new BScroll(areaNavScroll.value, {
		scrollX: false,
		scrollY: true,
		observeDOM: true,
		scrollbar: {
			customElements: [scrollBar.value],
			fade: false,
			interactive: true,
			scrollbarTrackClickable: true
		},
		mouseWheel: true,
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
	scroll.destroy();
}

function handleCheckArea(sIndex, rIndex) {
	const current = deviceList.value[page.value].findIndex(item => item.sIndex == sIndex && item.rIndex == rIndex);
	if (current >= 0) {
		index.value = current;
		type.value = 1;
	}
}

function toggleSite(sIndex) {
	if (!props.list.length) {
		return;
	}
	// currentNavIndex.value = currentNavIndex.value == index ? -1 : index;
	deviceList.value.forEach((item, pageIndex) => {
		const current = item.findIndex(item => item.sIndex == sIndex);
		if (current >= 0) {
			index.value = current;
			page.value = pageIndex;
			refreshScroll();
			return;
		}
	});
	// const current = deviceList.value;
}
</script>

<template>
	<GlobalContent>
		<div
			class="area-nav"
			ref="areaNavScroll"
		>
			<div class="area-nav-content">
				<div
					class="area-nav-first"
					:class="{ active: currentNavIndex >= 0 && currentNavIndex == siteIndex }"
					v-for="(site, siteIndex) in list"
					:key="site.station_id"
					@click="toggleSite(siteIndex)"
				>
					<div class="area-nav-first-top">
						<img
							src="../assets/images/active-bg.png"
							alt=""
							class="active-bg"
						/>
						<img
							src="../assets/images/icon-area-camera.png"
							alt=""
							class="icon"
						/>
						<div class="name">{{ site.name }}</div>
						<div class="count english">{{ site.regions_count }}</div>
						<img
							src="../assets/images/icon-arr-right.png"
							alt=""
							class="arr"
						/>
					</div>
					<div
						class="area-nav-secound"
						v-show="currentNavIndex >= 0 && currentNavIndex == siteIndex && site.regions.length"
					>
						<div
							class="area-nav-secound-item"
							v-for="(area, areaIndex) in site.regions"
							:key="area.station_id"
							@click.stop="handleCheckArea(siteIndex, areaIndex)"
						>
							<div class="area-name">
								{{ area.name }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="custom-vertical-scrollbar"
				ref="scrollBar"
			>
				<div class="custom-horizontal-indicator"></div>
			</div>
		</div>
	</GlobalContent>
</template>

<style scoped>
.area-nav {
	position: relative;
	height: 470px;
	box-sizing: border-box;
	overflow: hidden;
}

.area-nav .custom-vertical-scrollbar {
	position: absolute;
	top: 50%;
	right: 8px;
	width: 4px;
	height: 90%;
	border-radius: 2px;
	transform: translateY(-50%) translateZ(0);
}

.area-nav .custom-vertical-scrollbar .custom-horizontal-indicator {
	width: 100%;
	height: 110px;
	border-radius: 2px;
	background-color: #fff;
	opacity: 0.2;
}

.area-nav .area-nav-content {
	position: relative;
	padding: 12px 14px;
}

.area-nav .area-nav-content .area-nav-first .area-nav-first-top {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 16px 20px;
	border: 1px solid transparent;
	cursor: pointer;
	overflow: hidden;
}

.area-nav .area-nav-first.active .area-nav-first-top {
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.1);
	border-color: rgba(255, 255, 255, 0.23);
	border-radius: 2px;
	transition: 0.3s all linear;
}

.area-nav .area-nav-first .area-nav-first-top .icon {
	display: block;
	width: 14px;
	margin-right: 16px;
}

.area-nav .area-nav-first .area-nav-first-top .name {
	font-size: 16px;
	line-height: 18px;
	margin-right: auto;
}

.area-nav .area-nav-first .area-nav-first-top .count {
	font-size: 16px;
	line-height: 18px;
	margin-right: 14px;
}

.area-nav .area-nav-first .area-nav-first-top .arr {
	display: block;
	width: 6px;
}

.area-nav .area-nav-first .area-nav-first-top .active-bg {
	position: absolute;
	top: 50%;
	right: 100%;
	transform: translate(50%, -50%);
	width: 47px;
	height: 76px;
	opacity: 0;
}

.area-nav .area-nav-first.active .area-nav-first-top .active-bg {
	opacity: 1;
	transition: 0.3s all linear;
}

.area-nav .area-nav-first.active .area-nav-first-top .arr {
	transform: rotate(90deg);
	transition: 0.3s all linear;
}

.area-nav .area-nav-first .area-nav-secound {
	position: relative;
	box-sizing: border-box;
	padding-top: 2px;
	padding-bottom: 30px;
	margin-bottom: 14px;
}

.area-nav .area-nav-first .area-nav-secound::before {
	position: absolute;
	content: "";
	left: 50%;
	bottom: 0;
	transform: translateX(-50%);
	width: 300px;
	height: 1px;
	background: rgba(255, 255, 255, 0.2);
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 14px;
	padding-left: 64px;
	padding-right: 40px;
	cursor: pointer;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item:last-child {
	padding-bottom: 0;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item .area-name {
	font-size: 16px;
	line-height: 1;
	color: #a6a6a6;
	transition: 0.3s all linear;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item .area-count {
	font-size: 16px;
	color: rgba(255, 255, 255, 0.6);
	transition: 0.3s all linear;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item:hover .area-name {
	color: #fff;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item:hover .area-count {
	color: #fff;
}

.area-nav .area-nav-first .area-nav-secound .bottom-wrap .home-item {
	width: 722px;
}
</style>
