<script setup>
const state = defineModel();
</script>

<template>
	<div
		class="switch-wrap"
		:class="{ active: state == '1' }"
	>
		<div class="switch"></div>
	</div>
</template>

<style scoped>
.switch-wrap {
	position: relative;
	width: 48px;
	height: 20px;
	background: #444646;
	border-radius: 2px;
	cursor: pointer;
}

.switch-wrap .switch {
	position: absolute;
	top: 50%;
	left: 5px;
	transform: translateY(-50%);
	width: 18px;
	height: 12px;
	background: #fff;
	border-radius: 2px;
	transition: 0.2s all ease-in;
}

.switch-wrap.active {
	background: #de881a;
}

.switch-wrap.active .switch {
	transform: translate(19px, -50%);
}
</style>
