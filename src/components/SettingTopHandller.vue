<script setup>
const props = defineProps({
	title: {
		type: String,
		default: "设备管理"
	}
});
</script>

<template>
	<div class="setting-top-handller">
		<div class="title">
			{{ title }}
		</div>
		<div class="left-handle">
			<slot name="left"></slot>
		</div>
		<slot name="right"></slot>
	</div>
</template>

<style scoped>
.setting-top-handller {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 16px 0;
	flex-shrink: 0;
}

.setting-top-handller .title {
	font-size: 20px;
	line-height: 36px;
	font-weight: bold;
	margin-right: 30px;
}

.setting-top-handller .left-handle {
	margin-right: auto;
}
</style>
