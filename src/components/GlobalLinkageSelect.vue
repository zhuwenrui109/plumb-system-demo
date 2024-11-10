<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps({
	width: {
		type: Number,
		default: 204
	},
	needName: {
		type: Boolean,
		default: false
	}
});
const currentStandId = defineModel("standId");
const currentAreaId = defineModel("areaId");

const standList = computed(() => {
	const arr = [
		{
			name: "选择站点",
			station_id: "",
			regions: [
				{
					name: "选择工艺区",
					region_id: ""
				}
			]
		}
	];

	return [...arr, ...store.state.standList];
});

const areaList = computed(() => standList.value.find(item => item.station_id == currentStandId.value));

function handleSelectStand() {
	if (!areaList.value.regions[0]) {
		areaList.value.regions.push({
			name: "暂无工艺区",
			region_id: ""
		});
	}
	if (areaList.value.regions[0].region_id) {
		areaList.value.regions.unshift({
			name: "选择工艺区",
			region_id: ""
		});
	}
	// currentAreaId.value = areaList.value.regions[0].region_id;
}
</script>

<template>
	<div class="global-select-wrap">
		<div class="global-select-content">
			<div class="name" v-if="needName">
				所属场站
			</div>
			<div
				class="global-select-item"
				:style="{ width: width / 192 + 'rem' }"
			>
				<select
					class="global-select"
					:class="{ disabled: currentStandId == '' }"
					v-model="currentStandId"
					@change="handleSelectStand"
				>
					<option
						v-for="item in standList"
						:key="item.station_id"
						:value="item.station_id"
						v-show="item.regions"
					>
						{{ item.name }}
					</option>
				</select>
			</div>
		</div>
		<div class="global-select-content">
			<div class="name" v-if="needName">
				所属工艺区
			</div>
			<div
				class="global-select-item"
				:style="{ width: width / 192 + 'rem' }"
			>
				<select
					class="global-select"
					:class="{ disabled: currentAreaId == '' }"
					v-model="currentAreaId"
					@change="handleSelectArea"
				>
					<option
						v-for="item in areaList.regions"
						:key="item.region_id"
						:value="item.region_id"
					>
						{{ item.name }}
					</option>
				</select>
			</div>
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

.global-select-wrap .global-select-content .name {
	font-size: 14px;
	margin-bottom: 8px;
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
