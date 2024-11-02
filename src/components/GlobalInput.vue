<script setup>
const props = defineProps({
  placeholder: String,
	reg: {
		type: [RegExp, null],
		default: null
	},
	mode: {
		type: String,
		default: "text"
	}
})

const txt = defineModel();
</script>

<template>
	<div class="global-input-wrap">
		<input
			:type="mode"
			v-model="txt"
			:placeholder="placeholder"
		/>
		<div class="tips" v-show="reg && !reg.test('txt')">
			检查输入内容
		</div>
	</div>
</template>

<style scoped>
.global-input-wrap {
	position: relative;
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
	height: 100%;
	font-size: 15px;
	background: none;
	border: none;
	outline: none;
}

.global-input-wrap input::placeholder {
  color: rgba(255, 255, 255, .4);
}

.global-input-wrap .tips {
	position: absolute;
	top: 50%;
	right: 10px;
	transform: translateY(-50%);
	font-size: 12px;
	line-height: 1;
	color: #EA5426;
	pointer-events: none;
}
</style>
