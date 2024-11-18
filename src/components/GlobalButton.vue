<!-- 公共按钮组件 -->
<script setup>
const props = defineProps({
	name: String
});
</script>

<template>
	<div class="btn-wrap">
		<div class="dir-border">
			<div class="dir"></div>
		</div>
		<div class="txt">
			{{ name }}
		</div>
	</div>
</template>

<style scoped>
.btn-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100px;
	box-sizing: border-box;
	border: 1px solid;
	border-image: linear-gradient(0deg, #505050, #aeadad) 1 1;
	background: linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(216, 216, 216, 0.3), rgba(84, 84, 84, 0.3));
	opacity: 0.84;
	border-radius: 4px;
	column-gap: 10px;
	cursor: pointer;
}

.btn-wrap:hover {
	background: linear-gradient(0deg, rgba(216, 216, 216, 0.3), rgba(84, 84, 84, 0.3));
}

.btn-wrap .txt {
	font-size: 14px;
	line-height: 26px;
	color: #fff;
}

.btn-wrap .dir-border {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 10px;
	height: 10px;
	box-sizing: border-box;
	border: 1px solid #fff;
	border-radius: 50%;
}

.btn-wrap .dir {
	width: 4px;
	height: 4px;
	background: #fff;
	border-radius: 50%;
}
</style>
