<script setup>
const props = defineProps({
	name: String
});

const isShow = defineModel();
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				class="form-pop-wrap"
				v-show="isShow"
			>
				<div
					class="form-pop-main"
					@click.stop
				>
					<div class="title-wrap">
						<div class="content">
							<div class="title">{{ name }}</div>
							<img
								src="../assets/images/icon-video-close.png"
								alt=""
								class="close"
								@click="isShow = false"
							/>
						</div>
						<img
							src="../assets/images/form-pop-title-bg.png"
							alt=""
							class="bg"
						/>
					</div>
					<slot></slot>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.form-pop-wrap {
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	z-index: 100;
}

.form-pop-wrap .form-pop-main {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 10px;
	width: 509px;
	box-sizing: border-box;
	background: #242424;
	border: 2px solid rgba(221, 221, 221, 0.3);
	border-radius: 2px;
	overflow: hidden;
}

.form-pop-wrap .form-pop-main .title-wrap {
	position: relative;
}

.form-pop-wrap .form-pop-main .title-wrap .bg {
	display: block;
	width: 100%;
}

.form-pop-wrap .form-pop-main .title-wrap .content {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding-left: 20px;
	padding-right: 10px;
}

.form-pop-wrap .form-pop-main .title-wrap .title {
	font-size: 18px;
	font-weight: bold;
}

.form-pop-wrap .form-pop-main .title-wrap .close {
	display: block;
	width: 28px;
	cursor: pointer;
}
</style>
