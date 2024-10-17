<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "设备管理"
  }
})
</script>

<template>
	<div class="setting-top-handller">
		<div class="left">
			<div class="title">
				{{ title }}
			</div>
			<div class="left-handle">
				<slot name="left"></slot>
			</div>
		</div>
		<div class="handle-list">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<style scoped></style>
