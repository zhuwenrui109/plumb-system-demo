<script setup>
import { ref } from "vue";

const standList = ref([
	{
		id: 0,
		value: "选择站点",
		disabled: true,
		child: [
			{
				id: 0,
				value: "选择工艺区",
				disabled: true
			}
		]
	},
	{
		id: 1,
		value: "沈阳分输站",
		child: [
			{
				id: 0,
				value: "过滤区"
			},
			{
				id: 1,
				value: "清管区"
			},
			{
				id: 2,
				value: "空冷区"
			},
			{
				id: 3,
				value: "调压撬区"
			},
			{
				id: 4,
				value: "压缩机组"
			}
		]
	},
	{
		id: 2,
		value: "大连分输站",
		child: [
			{
				id: 0,
				value: "过滤区"
			},
			{
				id: 1,
				value: "清管区"
			},
			{
				id: 2,
				value: "空冷区"
			},
			{
				id: 3,
				value: "调压撬区"
			},
			{
				id: 4,
				value: "压缩机组"
			}
		]
	}
]);

const props = defineProps({
	width: {
		type: Number,
		default: 204
	}
})
const current = defineModel();
const currentStandIndex = ref(0);
const currentAreaIndex = ref(0);

function handleSelectStand() {
	currentAreaIndex.value = 0;
	current.value = {
		stand: standList.value[currentStandIndex.value].value,
		area: standList.value[currentStandIndex.value].child[currentAreaIndex.value].value
	};
}

function handleSelectArea() {
	current.value.area = standList.value[currentStandIndex.value].child[currentAreaIndex.value].value;
}
</script>

<template>
	<div class="global-select-wrap">
		<div class="global-select-item" :style="{ width: width / 192 + 'rem' }">
			<select
				class="global-select"
				:class="{ disabled: standList[currentStandIndex].disabled }"
				v-model="currentStandIndex"
				@change="handleSelectStand"
			>
				<option
					v-for="item in standList"
					:key="item.id"
					:value="item.id"
				>
					{{ item.value }}
				</option>
			</select>
		</div>
		<div class="global-select-item" :style="{ width: width / 192 + 'rem' }">
			<select
				class="global-select"
				:class="{ disabled: standList[currentStandIndex].child[currentAreaIndex].disabled }"
				v-model="currentAreaIndex"
				@change="handleSelectArea"
			>
				<option
					v-for="item in standList[currentStandIndex].child"
					:key="item.id"
					:value="item.id"
				>
					{{ item.value }}
				</option>
			</select>
		</div>
	</div>
</template>

<style scoped>
.global-select-wrap {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	column-gap: 8px;
}

.global-select-wrap .global-select-item {
	position: relative;
	width: 204px;
	height: 36px;
	box-sizing: border-box;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
}

.global-select-wrap .global-select-item::after {
	position: absolute;
	content: "";
	top: 50%;
	right: 14px;
	transform: translateY(-50%);
	width: 8px;
	height: 6px;
	background: url("../assets/images/icon-select-arr.png") no-repeat;
	background-size: 100% 100%;
}

.global-select-wrap .global-select {
	border: none;
	outline: none;
	width: 100%;
	height: 100%;
	font-size: 16px;
	line-height: 32px;
	color: #fff;
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	padding-left: 20px;
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
