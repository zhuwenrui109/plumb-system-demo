<script setup>
import { ref, watch } from "vue";
import { SimplePlayer } from "xgplayer";
import Start from "xgplayer/es/plugins/start";
import PC from "xgplayer/es/plugins/pc";
import Progress from "xgplayer/es/plugins/progress";
import Time from "xgplayer/es/plugins/time";
import Play from "xgplayer/es/plugins/play";
import Error from "xgplayer/es/plugins/error";
import { I18N } from "xgplayer";
import ZH from "xgplayer/es/lang/zh-cn";

I18N.use(ZH);

import "xgplayer/dist/index.min.css";

const props = defineProps({
	videoUrl: String
});

const isShow = defineModel();

const videoWrap = ref(null);
let videoPlayer = null;

watch(isShow, newVal => {
	if (newVal) {
		initVideoPlayer();
	} else {
		setTimeout(destoryVideoPlayer, 300);
	}
});

function initVideoPlayer() {
	videoPlayer = new SimplePlayer({
		el: videoWrap.value,
		url: props.videoUrl,
		height: "100%",
		width: "100%",
		autoplayMuted: true,
		closeVideoDblclick: true,
		commonStyle: {
			playedColor: "#5f371c"
		},
		plugins: [Start, PC, Progress, Play, Time, Error]
	});
}

function destoryVideoPlayer() {
	videoPlayer.destroy();
	videoPlayer = null;
}
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				class="video-pop-wrap"
				v-show="isShow"
			>
				<div class="video-pop">
					<div
						class="video"
						ref="videoWrap"
					></div>
					<img
						src="../assets/images/icon-video-close.png"
						alt=""
						class="close"
						@click="isShow = false"
					/>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.video-pop-wrap {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	z-index: 1000;
}

.video-pop {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 922px;
	height: 534px;
	box-sizing: border-box;
	padding: 10px;
	background-color: #000;
	border: 1px solid #747474;
}

.video-pop .video {
	width: 100%;
	height: 100%;
}

.video-pop .close {
	position: absolute;
	right: 0;
	bottom: calc(100% + 15px);
	cursor: pointer;
}
</style>
