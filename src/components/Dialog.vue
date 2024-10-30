<script setup>
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";

const props = defineProps({
	checkButton: Function,
	cancelButton: Function
});
</script>

<template>
	<div class="dialog-wrap">
		<div class="dialog-content">
			<div class="title-wrap">
				<div class="content">
					<div class="title">温馨提示</div>
					<img
						src="../assets/images/icon-video-close.png"
						alt=""
						class="close"
						@click="cancelButton"
					/>
				</div>
				<img
					src="../assets/images/dialog-title-bg.png"
					alt=""
					class="bg"
				/>
			</div>
			<div class="main">是否确认删除所选内容</div>
			<div class="btn-list">
				<SettingButtonBorder
					type="clear"
					class="btn"
					@click="cancelButton"
				>
					取消
				</SettingButtonBorder>
				<SettingButtonBorder
					class="btn"
					@click="checkButton"
				>
					确认
				</SettingButtonBorder>
			</div>
		</div>
	</div>
</template>

<style scoped>
.dialog-wrap {
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
}

.dialog-wrap .dialog-content {
	width: 242px;
	padding-bottom: 38px;
	box-sizing: border-box;
	background: #242424;
	border: 2px solid rgba(221, 221, 221, 0.3);
	border-radius: 2px;
	overflow: hidden;
}

.dialog-wrap .dialog-content .title-wrap {
	position: relative;
	margin-bottom: 40px;
}

.dialog-wrap .dialog-content .title-wrap .bg {
	display: block;
	width: 100%;
}

.dialog-wrap .dialog-content .title-wrap .content {
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

.dialog-wrap .dialog-content .title-wrap .title {
	font-size: 18px;
	font-weight: bold;
}

.dialog-wrap .dialog-content .title-wrap .close {
  display: block;
  width: 28px;
  cursor: pointer;
}

.dialog-wrap .dialog-content .main {
	font-size: 15px;
	text-align: center;
	margin-bottom: 35px;
}

.dialog-wrap .dialog-content .btn-list {
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.dialog-wrap .dialog-content .btn-list .btn {
	width: 80px;
	box-sizing: border-box;
	text-align: center;
}
</style>
