<script setup>
import { API_HOME } from "@/api";
import { onMounted, ref, watch } from "vue";

const DISABLE_STAND = {
	name: "选择站点",
	station_id: ""
};
const DISABLE_AREA = {
	name: "选择工艺区",
	region_id: ""
};

const props = defineProps({
	width: {
		type: Number,
		default: 204
	},
	needName: {
		type: Boolean,
		default: false
	},
	disableInfo: {
		type: Boolean,
		default: true
	}
});
const currentStandId = defineModel("standId");
const currentAreaId = defineModel("areaId");

const standList = ref([]);
const areaList = ref([]);

defineExpose({
	standList,
	areaList
});

watch(currentStandId, newVal => {
	if (!newVal) {
		areaList.value.splice(1, areaList.value.length);
	} else {
		loadAreaList(newVal);
	}
});

onMounted(() => {
	loadStandList();
})

async function loadStandList() {
	const res = await API_HOME.getAllStand();
	if (props.disableInfo) {
		standList.value = [].concat([DISABLE_STAND, ...res.data]);
		areaList.value = [].concat([DISABLE_AREA]);
	} else {
		standList.value = [].concat(res.data);
		currentStandId.value = res.data[0].station_id;
		// areaList.value = [].concat([DISABLE_AREA]);
		loadAreaList(res.data[0].station_id);
	}
}

async function loadAreaList(id) {
	const { data } = await API_HOME.getAllArea(id);
	areaList.value.splice(1, areaList.value.length);
	// areaList.value.push(...data);
	if (props.disableInfo) {
		areaList.value = [].concat([DISABLE_AREA, ...data]);
	} else {
		areaList.value = [].concat(data);
		currentAreaId.value = data[0].region_id;
	}
}

function handleSelectStand() {
	currentAreaId.value = "";
}
</script>

<template>
	<div class="global-select-wrap">
		<div class="global-select-content">
			<div
				class="name"
				v-if="needName"
			>
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
					>
						{{ item.name }}
					</option>
				</select>
			</div>
		</div>
		<div class="global-select-content">
			<div
				class="name"
				v-if="needName"
			>
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
				>
					<option
						v-for="item in areaList"
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
	padding-right: 40px;
	background: none;
	/* white-space: nowrap; */
	overflow: hidden;
	text-overflow: ellipsis;
}

.global-select-wrap .global-select.disabled {
	opacity: 0.4;
}

.global-select-wrap .global-select option {
	font-size: 14px;
	color: #000;
}
</style>
