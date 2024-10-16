<!-- 公共标题组件 -->
<script setup>
const props = defineProps({
  name: String,
  english: String
})
</script>

<template>
	<div class="title-wrap">
		<div class="title">
			{{ name }}
		</div>
		<div class="english">
      {{ english }}
    </div>
		<div class="right">
			<slot></slot>
		</div>
		<div class="cir left-top"></div>
		<div class="cir right-top"></div>
		<div class="cir left-bottom"></div>
		<div class="cir right-bottom"></div>
	</div>
</template>

<style scoped>
.title-wrap {
	position: relative;
	display: flex;
	align-items: baseline;
	justify-content: space-between;
  box-sizing: border-box;
	padding: 0 20px;
	background: rgba(47, 43, 40, .6);
	box-shadow: inset 0 0 13px 6px rgba(255, 255, 255, .16);
	border: 1px solid #000;
	margin-bottom: 8px;
}

.title-wrap .cir {
	position: absolute;
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background: #9D9E9E;
}

.title-wrap .cir.left-top {
	bottom: 100%;
	right: 100%;
	transform: translate(50%, 50%);
}

.title-wrap .cir.right-top {
	top: 0;
	left: 100%;
	transform: translate(-50%, -50%);
}

.title-wrap .cir.left-bottom {
	top: 100%;
	right: 100%;
	transform: translate(50%, -50%);
}

.title-wrap .cir.right-bottom {
	left: 100%;
	bottom: 0;
	transform: translate(-50%, 50%);
}

.title-wrap .title {
	font-size: 14px;
	line-height: 40px;
	font-weight: bold;
	color: #fff;
  margin-right: 10px;
}

.title-wrap .english {
  font-size: 12px;
  line-height: 1;
  color: #fff;
  opacity: .4;
  margin-right: auto;
	text-transform: uppercase;
}

.title-wrap .right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	column-gap: 6px;
}
</style>
