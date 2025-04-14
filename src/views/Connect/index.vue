<script setup>
import { API_CONNECT } from "@/api";
import GlobalPagination from "@/components/GlobalPagination.vue";
import toastPlguin from "@/utils/toast";
import dayjs, { Dayjs } from "dayjs";
import { onMounted, ref } from "vue";

const props = defineProps({
	standId: [String, Number],
	areaId: [String, Number],
	currentState: [String, Number],
	startDate: {
		type: Dayjs,
		default: ""
	},
	endDate: {
		type: Dayjs,
		default: ""
	}
});

const page = ref(1);
const dataList = ref([]);
const pageConfig = ref({
	total: 1,
	pageSize: 10
});

onMounted(() => {
	loadData();
});

defineExpose({
	page,
	loadData
});

async function loadData() {
	let start_date = "";
	let end_date = "";
	if (props.startDate) {
		start_date = dayjs(props.startDate).format("YYYY-MM-DD");
	}
	if (props.endDate) {
		end_date = dayjs(props.endDate).format("YYYY-MM-DD");
	}
	const res = await API_CONNECT.getList({
		page: page.value,
		station_id: props.standId,
		region_id: props.areaId,
		start_date,
		end_date
	});
	console.log("res :>> ", res);
	if (!res.data.data.length) {
		toastPlguin("暂无内容...");
		dataList.value = new Array();
		return;
	}
	dataList.value = [...res.data.data];
	pageConfig.value.total = res.data.total;
	pageConfig.value.pageSize = res.data.per_page;
}
</script>

<template>
	<div class="global-table-wrap">
		<div class="table">
			<div class="tr">
				<div class="td id">设备ID</div>
				<div class="td">传感器设备地址</div>
				<div class="td">视频设备地址</div>
				<div class="td">所属场站</div>
				<div class="td">所属工艺区</div>
				<div class="td connect">连接</div>
				<div class="td date">时间</div>
			</div>
			<div
				class="tr"
				v-for="item in dataList"
			>
				<div class="td id">
					<img
						src="../assets/images/icon-camera.png"
						alt=""
						class="user"
					/>
					<span class="english">{{ item.device_id }}</span>
				</div>
				<div class="td english">{{ item.device.sensor_ip }}</div>
				<div class="td english">{{ item.device.monitor_ip }}</div>
				<div class="td">{{ item.station.name }}</div>
				<div class="td">{{ item.region.name }}</div>
				<div
					class="td connect"
					:class="{ success: item.type == 1 }"
				>
					<span
						class="dir"
						v-if="item.type == 1"
					></span>
					<img
						src="../assets/images/icon-unconnect.png"
						alt=""
						v-else
					/>
					<span>{{ item.type == 1 ? "连接中" : "断开中" }}</span>
				</div>
				<div class="td date english">
					{{ item.created_at }}
				</div>
			</div>
		</div>
		<GlobalPagination
			v-model="page"
			:total="pageConfig.total"
			:page-size="pageConfig.pageSize"
			@change-page="loadData"
		></GlobalPagination>
	</div>
</template>

<style scoped src="./index.css"></style>
