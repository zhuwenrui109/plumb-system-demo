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

const currentStandIndex = ref(-1);
const areaNavScroll = ref(null);
const scrollBar = ref(null);
let scroll = null;

const deviceList = computed(() => store.getters.getDeviceList);
const g_iWndIndex = computed(() => store.state.iWndIndex);
const g_iWndPage = computed(() => store.state.iWndowPage);
const currentNav = computed(() => {
	const obj = {
		sIndex: -1,
		rIndex: -1
	};
	if (!deviceList.value.length || type.value > 1 || type.value == "1*2") {
		return obj;
	}
	obj.sIndex = deviceList.value[g_iWndPage.value][g_iWndIndex.value].sIndex;
	obj.rIndex = deviceList.value[g_iWndPage.value][g_iWndIndex.value].rIndex;
	return obj;
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

function handleCheckArea(area) {
	if (currentNav.value.rIndex == area.rIndex) {
		return;
	}
	deviceList.value.forEach((pageList, pageIndex) => {
		pageList.forEach((item, index) => {
			if (item.device.device_id == area.device.device_id) {
				store.commit("setIWndPage", pageIndex);
				store.commit("setIWndIndex", index);
				if (type.value > 1 || type.value == "1*2") {
					type.value = 1;
				} else {
					store.state.destoryPlugin(store.state.initPlugin);
				}
				return;
			}
		});
	});
}

function toggleSite(sIndex) {
	if (!props.list[sIndex].regions.length) {
		return;
	}
	currentStandIndex.value = currentStandIndex.value == sIndex ? -1 : sIndex;
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
					:class="{ active: currentStandIndex == siteIndex || (currentNav.sIndex >= 0 && currentNav.sIndex == siteIndex) }"
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
						v-show="(currentStandIndex == siteIndex || (currentNav.sIndex >= 0 && currentNav.sIndex == siteIndex)) && site.regions.length"
					>
						<div
							class="area-nav-secound-item"
							v-for="(area, areaIndex) in site.regions"
							:key="area.station_id"
							:class="{ active: currentNav.sIndex == siteIndex && currentNav.rIndex == areaIndex }"
							@click.stop="handleCheckArea(area)"
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
	width: 0;
	font-size: 16px;
	line-height: 18px;
	margin-right: auto;
	flex: 1;
	padding-right: 10px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
	padding-top: 10px;
	padding-bottom: 25px;
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
	padding: 7px 64px;
	cursor: pointer;
	margin-bottom: 14px;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item.active {
	background: rgba(101, 69, 37, 0.8);
	border: 1px solid #000;
	box-shadow: inset 0 0 10px 5px rgba(255, 207, 150, 0.6);
	border-radius: 2px;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item:last-child {
	margin-bottom: 0;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item .area-name {
	font-size: 16px;
	line-height: 1;
	color: #a6a6a6;
	transition: 0.3s all linear;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.area-nav .area-nav-first .area-nav-secound .area-nav-secound-item.active .area-name {
	color: #fff;
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
