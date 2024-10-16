<!-- 黄色内发光框子 -->
<template>
	<div class="global-content-wrap">
		<slot></slot>
	</div>
</template>

<style scoped>
.global-content-wrap {
	border: 2px solid rgba(221, 221, 221, 0.17);
	background: rgba(39, 39, 39, 0.26);
	box-shadow: inset 0 0 30px 15px rgba(69, 49, 13, 0.35);
	border-radius: 2px;
	overflow: hidden;
}
</style>