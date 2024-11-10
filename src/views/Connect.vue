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

<style scoped>
.global-table-wrap {
	width: 100%;
}

.global-table-wrap .table {
	width: 100%;
	height: 650px;
	margin-bottom: 10px;
}

.global-table-wrap .table .tr {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 40px;
	box-sizing: border-box;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	margin-bottom: 4px;
	border-radius: 2px;
}

.global-table-wrap .table .tr:first-child {
	box-shadow: inset 0 0 25px 0 rgba(74, 35, 19, 1);
	border: 2px solid rgba(221, 221, 221, 0.23);
}

.global-table-wrap .table .tr .td {
	width: 148px;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 40px;
	text-wrap: nowrap;
}

.global-table-wrap .table .tr .td.english {
	font-size: 16px;
}

.global-table-wrap .table .tr .td:nth-child(2) {
	width: 257px;
}

.global-table-wrap .table .tr .td:nth-child(3) {
	width: 257px;
}

.global-table-wrap .table .tr .td .user {
	display: block;
	width: 20px;
	margin-right: 16px;
}

.global-table-wrap .table .tr .td.id {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.global-table-wrap .table .tr .td.connect {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 250px;
	padding-left: 100px;
	column-gap: 10px;
	color: #f85827;
}

.global-table-wrap .table .tr .td.connect.success {
	color: #15c675;
}

.global-table-wrap .table .tr .td.connect span {
	display: block;
}

.global-table-wrap .table .tr .td.connect .dir {
	width: 8px;
	height: 8px;
	background: #f85827;
	border-radius: 50%;
}

.global-table-wrap .table .tr .td.connect.success .dir {
	background: #15c675;
}

.global-table-wrap .table .tr .td.connect img {
	display: block;
	width: 14px;
}

.global-table-wrap .table .tr .th.handle,
.global-table-wrap .table .tr .td.handle {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 0;
}

.global-table-wrap .table .tr .td .handle-icon {
	display: block;
	width: 17px;
	margin-right: 14px;
	cursor: pointer;
}

.global-table-wrap .table .tr .td .handle-icon:last-child {
	margin-right: 0;
}

.global-table-wrap .table .tr .td.alarm {
	color: #ecc69d;
}

.global-table-wrap .table .tr .td.date {
	padding-left: 85px;
}
</style>
