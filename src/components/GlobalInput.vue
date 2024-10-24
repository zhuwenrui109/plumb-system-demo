<script setup>
const props = defineProps({
  placeholder: String
})

const txt = defineModel();
</script>

<template>
	<div class="global-input-wrap">
		<input
			type="text"
			v-model="txt"
			:placeholder="placeholder"
		/>
	</div>
</template>

<style scoped>
.global-input-wrap {
	width: 208px;
	height: 35px;
	box-sizing: border-box;
	padding: 0 22px;
	background: rgba(39, 39, 39, 0.36);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
}

.global-input-wrap input {
	display: block;
	width: 100%;
	font-size: 15px;
	line-height: 30px;
	background: none;
	border: none;
	outline: none;
}

.global-input-wrap input::placeholder {
  color: rgba(255, 255, 255, .4);
}
</style>
