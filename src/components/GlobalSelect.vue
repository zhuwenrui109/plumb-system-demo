<script setup>

const props = defineProps({
  list: Array,
	id: {
		type: String,
		default: "value"
	},
	name: {
		type: String,
		default: "value"
	}
});
const current = defineModel();
</script>

<template>
	<div class="global-select-wrap">
		<select
			class="global-select"
			:class="{ disabled: current === '' }"
			v-model="current"
		>
			<option
				v-for="(item, index) in list"
				:key="index"
				:value="item[id]"
			>
				{{ item[name] }}
			</option>
		</select>
	</div>
</template>

<style scoped>
.global-select-wrap {
	position: relative;
	width: 164px;
	height: 36px;
	box-sizing: border-box;
	padding: 0 20px;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
  border-radius: 2px;
}

.global-select-wrap::after {
	position: absolute;
	content: "";
	top: 50%;
	right: 14px;
	transform: translateY(-50%);
	width: 8px;
	height: 6px;
	background: url("../assets/images/icon-select-arr.png") no-repeat;
	background-size: 100% 100%;
	pointer-events: none;
}

.global-select-wrap .global-select {
	border: none;
	outline: none;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 32px;
	color: #fff;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	background: none;
}

.global-select-wrap .global-select.disabled {
	opacity: 0.4;
}

.global-select-wrap .global-select option {
	font-size: 14px;
	color: #000;
}
</style>
