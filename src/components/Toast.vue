<script setup>
const props = defineProps({
	message: String
});
</script>

<template>
	<Teleport to="body">
		<div class="toast-wrap">
			<div class="content">
				{{ message }}
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.toast-wrap {
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	z-index: 1000;
}

.toast-wrap .content {
	/* width: 240px; */
	/* height: 52px; */
	box-sizing: border-box;
	padding: 10px 20px;
	background: repeating-linear-gradient(116deg, transparent, transparent 10px, rgba(0, 0, 0, 0.2) 15px, rgba(0, 0, 0, 0.2) 26px);
	background-size: 100% 60px;
	background-color: #631d13;
	animation: ani2 0.2s infinite alternate ease-in-out, ani 0.7s infinite both linear;
	background-color: rgba(98, 22, 12, 1);
	box-shadow: inset 0 0 9px 4px rgba(252, 69, 44, 0.8);
	border: 1px solid rgba(255, 160, 102, 0.8);
	border-radius: 4px;
	font-size: 14px;
	/* line-height: 50px; */
	text-align: center;
}

@keyframes ani {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 0 60px;
	}
}
</style>
