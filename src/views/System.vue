<script setup>
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
</script>

<template>
	<div class="system-wrap">
		<div class="title">实时监测窗口数量</div>
		<div class="system-list">
			<div class="system-item">
				<div class="bg">
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
				</div>
				<div class="txt">1个窗口</div>
			</div>
			<div class="system-item chance2 active">
				<div class="bg">
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
				</div>
				<div class="txt">2个窗口</div>
			</div>
			<div class="system-item chance4">
				<div class="bg">
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
				</div>
				<div class="txt">4个窗口</div>
			</div>
			<div class="system-item chance9">
				<div class="bg">
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
					<div class="pic">
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
				</div>
				<div class="txt">9个窗口</div>
			</div>
			<div class="system-item chance16">
				<div class="bg">
					<div
						class="pic"
						v-for="item in 16"
					>
						<img
							src="../assets/images/icon-camera.png"
							alt=""
						/>
					</div>
				</div>
				<div class="txt">16个窗口</div>
			</div>
		</div>
		<SettingButtonBorder class="check-btn">
			<div class="btn">确认选择</div>
		</SettingButtonBorder>
	</div>
</template>

<style scoped>
.system-wrap {
	width: 100%;
}

.system-wrap .title {
	font-size: 18px;
	margin-bottom: 20px;
}

.system-wrap .system-list {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 20px;
	margin-bottom: 380px;
}

.system-wrap .system-list .system-item {
	width: 324px;
	box-sizing: border-box;
  cursor: pointer;
}

.system-wrap .system-list .system-item .bg {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 200px;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
  border-radius: 2px;
	margin-bottom: 16px;
}

.system-wrap .system-list .system-item.active .bg {
  border-color: #B88D3C;
}

.system-wrap .system-list .system-item .bg .pic {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 285px;
	height: 160px;
	box-sizing: border-box;
	background: rgba(116, 116, 116, 0.1);
	border: 1px solid #747474;
}

.system-wrap .system-list .system-item .bg .pic img {
	display: block;
	width: 37px;
	opacity: 0.6;
}

.system-wrap .system-list .system-item .txt {
	font-size: 15px;
	line-height: 1;
	text-align: center;
}

.system-wrap .system-list .system-item.chance2 .bg {
	column-gap: 8px;
}

.system-wrap .system-list .system-item.chance2 .bg .pic {
	width: 140px;
	height: 80px;
}

.system-wrap .system-list .system-item.chance2 .bg .pic img {
	width: 18px;
}

.system-wrap .system-list .system-item.chance4 .bg {
	align-content: center;
	flex-wrap: wrap;
	gap: 6px;
}

.system-wrap .system-list .system-item.chance4 .bg .pic {
	width: 148px;
	height: 84px;
}

.system-wrap .system-list .system-item.chance4 .bg .pic img {
	width: 18px;
}

.system-wrap .system-list .system-item.chance9 .bg {
	align-content: center;
	flex-wrap: wrap;
	gap: 4px 2px;
}

.system-wrap .system-list .system-item.chance9 .bg .pic {
	width: 99px;
	height: 56px;
}

.system-wrap .system-list .system-item.chance9 .bg .pic img {
	width: 13px;
}

.system-wrap .system-list .system-item.chance16 .bg {
	align-content: center;
	flex-wrap: wrap;
	gap: 2px;
}

.system-wrap .system-list .system-item.chance16 .bg .pic {
	width: 74px;
	height: 42px;
}

.system-wrap .system-list .system-item.chance16 .bg .pic img {
	width: 10px;
}

.system-wrap .check-btn {
	width: 290px;
	margin: 0 auto;
}

.system-wrap .btn {
	font-size: 15px;
	line-height: 35px;
	text-align: center;
}
</style>
