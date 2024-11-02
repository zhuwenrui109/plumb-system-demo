<script setup>
const props = defineProps({
	type: {
		type: String,
		default: "search"
	}
});
</script>

<template>
	<div
		class="setting-button-border-wrap"
		:class="{ clear: type == 'clear' }"
	>
		<slot></slot>
	</div>
</template>

<style scoped>
.setting-button-border-wrap {
	height: 35px;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 31px;
	text-align: center;
	padding: 0 16px;
	background: linear-gradient(0deg, rgba(130, 97, 26, 1) 0%, rgba(58, 45, 26, 1) 60%, rgba(39, 31, 26, 1) 100%) no-repeat;
	border: 2px solid rgba(255, 217, 168, 0.5);
	border-radius: 2px;
	cursor: pointer;
}

.setting-button-border-wrap.clear {
	background: linear-gradient(to bottom, #271f1a 50%, #6e645e) no-repeat;
	border: 2px solid rgba(188, 188, 188, 0.5);
}
</style>
