<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { DatePicker, ConfigProvider } from "ant-design-vue";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent } from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
import GlobalLinkageSelect from "@/components/GlobalLinkageSelect.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import "ant-design-vue/dist/reset.css";
import "dayjs/locale/zh-cn";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs, { Dayjs } from "dayjs";
import GlobalSelect from "@/components/GlobalSelect.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";
import { API_FAULT } from "@/api";
import { useStore } from "vuex";

dayjs.locale("zh-cn");
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LineChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer
]);

const store = useStore();

const selectRef = ref(null);
const dataList = ref([]);
const currentStand = ref({ name: "" });
const currentArea = ref({ name: "" });
const page = ref(1);
const timeScope = ref(1);
const timeGap = ref(5);
const standId = ref("");
const areaId = ref("");
const date = ref("");
const time = ref(dayjs("00:00:00", "HH:mm:ss"));
const locale = ref(zhCN);
const chart = ref(null);
const chartOptions = ref({
	title: {
		text: "",
		top: 0,
		left: 40,
		textStyle: {
			color: "#fff",
			fontSize: 12
		}
	},
	tooltip: {
		show: true,
		trigger: "item",
		formatter: params => {
			const { seriesName, value } = params;
			return `${seriesName}: ${value}PPm.m`;
		}
	},
	grid: {
		show: true,
		top: 30,
		left: 5,
		right: 35,
		bottom: 0,
		containLabel: true,
		backgroundColor: "rgba(45, 45, 45, 0.7)",
		opacity: 0.4,
		borderWidth: 0,
		containLabel: true
	},
	xAxis: {
		type: "category",
		boundaryGap: false,
		snap: true,
		axisLine: {
			show: true,
			lineStyle: {
				color: "#ffd085",
				width: 3
			}
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: ["#ffd085"],
				opacity: 0.3
			}
		},
		axisLabel: {
			margin: 16,
			fontSize: 12,
			color: "#ffffff",
			opacity: 0.95
		},
		axisTick: {
			show: false
		},
		data: []
	},
	yAxis: {
		type: "value",
		axisTick: {
			show: false
		},
		axisLabel: {
			margin: 14,
			fontSize: 12
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: "#ffffff",
				opacity: 0.1
			}
		},
		min: 0
	},
	series: [
		{
			name: "浓度",
			type: "line",
			smooth: true,
			data: [],
			symbol: "circle",
			symbolSize: 10,
			itemStyle: {
				color: "#fff",
				borderWidth: 3,
				borderColor: "#cbb436"
			},
			lineStyle: {
				width: 2,
				color: "#f85827"
			},
			areaStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: "rgb(248, 88, 39)"
					},
					{
						offset: 1,
						color: "rgba(248, 88, 39, 0.4)"
					}
				]),
				opacity: 0.3
			}
		}
	]
});
const currentScopeUnit = ref(1);
const currentGapUnit = ref(2);
const timeUnit = ref([
	{
		name: "时",
		value: 0
	},
	{
		name: "分",
		value: 1
	},
	{
		name: "秒",
		value: 2
	}
]);
let myChart = null;
const pageConfig = ref({
	total: 1,
	pageSize: 4
});

const standList = computed(() => selectRef.value.standList);
const areaList = computed(() => selectRef.value.areaList);

let disable = false;
watch(areaId, (newVal, oldVal) => {
	console.log("oldVal :>> ", oldVal);
	if (!disable) {
		console.log("watch areaId");
		loadChartsData();
		loadData();
		disable = true;
	}
	// currentArea.value = areaList.value.find(item => item.region_id == newVal);
	// console.log('newVal :>> ', newVal);
});

onMounted(() => {
	initDefaultDate();
	echartsInit();
	// loadChartsData();
	// loadData();
});

onUnmounted(() => {
	destoryCharts();
});

async function loadChartsData() {
	await nextTick();
	let range = 0;
	let step = 0;
	if (currentScopeUnit.value == 2) {
		range = timeScope.value;
	} else {
		range = currentScopeUnit.value == 0 ? timeScope.value * 60 * 60 : timeScope.value * 60;
	}
	if (currentGapUnit.value == 2) {
		step = timeGap.value;
	} else {
		step = currentGapUnit.value == 0 ? timeGap.value * 60 * 60 : timeGap.value * 60;
	}
	const res = await API_FAULT.getCharts({
		region_id: areaId.value,
		start_time: `${dayjs(date.value).format("YYYY-MM-DD")} ${dayjs(time.value).format("HH:mm:ss")}`,
		range,
		step
	});
	console.log("res :>> ", res);
	res.data.time.forEach((item, index) => {
		const arr = item.split(" ");
		res.data.time[index] = `${arr[1]}\n${arr[0]}`;
		if (res.data.data[index] == null) {
			res.data.data[index] = 0;
		}
	});
	myChart.setOption({
		title: {
			text: `${dayjs(date.value).format("YYYY-MM-DD")} ${dayjs(time.value).format("HH:mm:ss")}`
		},
		xAxis: {
			data: res.data.time
		},
		series: [
			{
				data: res.data.data
			}
		]
	});
}

async function loadData() {
	await nextTick();
	console.log("areaId.value :>> ", areaId.value);
	currentStand.value = standList.value.find(item => item.station_id == standId.value);
	currentArea.value = areaList.value.find(item => item.region_id == areaId.value);
	let range = 0;
	let step = 0;
	if (currentScopeUnit.value == 2) {
		range = timeScope.value;
	} else {
		range = currentScopeUnit.value == 0 ? timeScope.value * 60 * 60 : timeScope.value * 60;
	}
	if (currentGapUnit.value == 2) {
		step = timeGap.value;
	} else {
		step = currentGapUnit.value == 0 ? timeGap.value * 60 * 60 : timeGap.value * 60;
	}
	const { data } = await API_FAULT.getList({
		region_id: areaId.value,
		start_time: `${dayjs(date.value).format("YYYY-MM-DD")} ${dayjs(time.value).format("HH:mm:ss")}`,
		range,
		step
	});
	console.log("data :>> ", data);
	pageConfig.value.total = data.length;
	dataList.value.splice(0, dataList.value.length);
	let j = 0,
		o = j;
	// 分页
	while (j < data.length) {
		j += 4;
		dataList.value.push([...data.slice(o, j)]);
		o = j;
	}
	// dataList.value = [...res.data];
}

function initDefaultDate() {
	let d = new Date();
	let year = d.getFullYear().toString();
	let month = d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString();
	let day = d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString();
	date.value = dayjs(year + "-" + month + "-" + day);
	// date.value = dayjs("2024-11-05");
}

function echartsInit() {
	myChart = echarts.init(chart.value);
	myChart.setOption(chartOptions.value);
}

function destoryCharts() {
	if (!myChart) {
		return;
	}
	myChart.dispose();
	myChart = null;
}
</script>

<template>
	<HomeGlobalContent class="fault-wrap">
		<GlobalContent class="fault-content">
			<SettingTopHandller
				:title="`${currentStand.name || ''}-${currentArea.name || ''}-历史数据`"
				class="fault-top"
			>
				<template #left>
					<div class="fault-left">
						<GlobalLinkageSelect
							ref="selectRef"
							:width="128"
							:disable-info="false"
							v-model:standId="standId"
							v-model:areaId="areaId"
							class="select"
						></GlobalLinkageSelect>
						<div class="date-list">
							<div class="date-item">
								<div class="name">起始时间:</div>
								<config-provider :locale="locale">
									<DatePicker
										v-model:value="date"
										class="global-date"
										:allow-clear="false"
									>
										<template #suffixIcon></template>
									</DatePicker>
									<DatePicker
										v-model:value="time"
										picker="time"
										class="global-date"
										:allow-clear="false"
									>
										<template #suffixIcon></template>
									</DatePicker>
								</config-provider>
							</div>
							<div class="date-item">
								<div class="name">时间范围:</div>
								<div class="input-list">
									<div class="input-item">
										<input
											type="number"
											maxlength="2"
											v-model="timeScope"
										/>
										<div class="arr-list">
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
												@click="timeScope++"
											/>
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
												class="down"
												@click="timeScope--"
											/>
										</div>
									</div>
									<GlobalSelect
										class="timeUnit"
										v-model="currentScopeUnit"
										:list="timeUnit"
										id="value"
										name="name"
									></GlobalSelect>
								</div>
							</div>
							<div class="date-item">
								<div class="name">时间间隔:</div>
								<div class="input-list">
									<div class="input-item">
										<input
											type="number"
											maxlength="2"
											v-model="timeGap"
										/>
										<div class="arr-list">
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
												@click="timeGap++"
											/>
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
												class="down"
												@click="timeGap--"
											/>
										</div>
									</div>
									<GlobalSelect
										class="timeUnit"
										:list="timeUnit"
										v-model="currentGapUnit"
										id="value"
										name="name"
									></GlobalSelect>
								</div>
							</div>
						</div>
						<SettingButtonBorder
							@click="
								() => {
									loadChartsData();
									loadData();
								}
							"
						>
							查看
						</SettingButtonBorder>
					</div>
				</template>
			</SettingTopHandller>
			<GlobalContent class="chart-wrap">
				<div
					class="chart"
					ref="chart"
				></div>
			</GlobalContent>
			<GlobalContent class="table-list">
				<div class="table">
					<div class="tr">
						<div class="td date">时间</div>
						<div class="td info">设备信息</div>
						<div class="td">浓度</div>
						<div class="td">光强</div>
						<div class="td">水平角度</div>
						<div class="td">垂直角度</div>
					</div>
					<div
						class="tr"
						v-for="item in dataList[page - 1]"
						:key="item.id"
					>
						<div class="td date english">{{ item.created_at }}</div>
						<div class="td info">{{ item.station.name }}-{{ item.region.name }}</div>
						<div class="td english color">{{ item.gas }}PPm.m</div>
						<div class="td english">{{ item.light }}</div>
						<div class="td english">{{ item.horizontal }}</div>
						<div class="td english">{{ item.vertical }}</div>
					</div>
				</div>
			</GlobalContent>
			<GlobalPagination
				v-model="page"
				:total="pageConfig.total"
				:page-size="pageConfig.pageSize"
			></GlobalPagination>
		</GlobalContent>
	</HomeGlobalContent>
</template>

<style scoped>
.fault-wrap {
	width: 1890px;
	height: 100%;
	margin: 0 auto;
	padding: 13px 0;
}

.fault-wrap .fault-content {
	width: 1860px;
	height: 100%;
	box-sizing: border-box;
	padding-bottom: 12px;
	margin: 0 auto;
}

.fault-wrap .fault-content .fault-top {
	margin-bottom: 12px;
}

.fault-wrap .fault-content .fault-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.fault-wrap .fault-content .fault-left .select {
	margin-right: 36px;
}

.fault-wrap .fault-content .fault-left .date-list {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 16px;
	margin-right: 18px;
}

.fault-wrap .fault-content .fault-left .date-list .date-item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.fault-wrap .fault-content .fault-left .date-list .date-item .name {
	font-size: 15px;
	line-height: 36px;
	margin-right: 16px;
}

.fault-wrap .fault-content .fault-left .date-list .date-item .input-list {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 3px;
}

.fault-wrap .fault-content .fault-left .date-list .date-item .input-list .input-item {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 8px;
	width: 60px;
	height: 36px;
	box-sizing: border-box;
	padding: 0 12px;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
}

.fault-wrap .fault-content .fault-left .date-list .date-item .input-list .input-item input {
	display: block;
	width: 100%;
	font-size: 15px;
	background: none;
	border: none;
	outline: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
}

input[type="number"] {
	-moz-appearance: textfield;
}
.fault-wrap .fault-content .fault-left .date-list .date-item .input-list .input-item .arr-list img {
	display: block;
	width: 6px;
	margin-bottom: 5px;
	cursor: pointer;
}

.fault-wrap .fault-content .fault-left .date-list .date-item .input-list .input-item .arr-list img.down {
	transform: rotate(180deg);
	margin-bottom: 0;
}

.fault-wrap .fault-content .fault-left .date-list .date-item .input-list .timeUnit {
	width: 60px;
	padding: 0 13px;
}

.fault-wrap .fault-content .fault-left .ant-picker {
	width: 116px;
	height: 36px;
	box-sizing: border-box;
	padding: 0 9px;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
	margin-right: 3px;
}

.fault-wrap .fault-content .fault-left .ant-picker:last-child {
	margin-right: 0;
}

.fault-wrap .fault-content .fault-left .icon {
	display: block;
	width: 16px;
}

.fault-wrap .fault-content .chart-wrap {
	width: 1828px;
	height: 380px;
	margin: 0 auto;
	padding: 19px 19px 13px;
	margin-bottom: 8px;
}

.fault-wrap .fault-content .chart-wrap .chart {
	width: 100%;
	height: 100%;
}

.fault-wrap .fault-content .table-list {
	width: 1828px;
	height: 260px;
	margin: 0 auto;
	padding: 10px 56px 10px;
	margin-bottom: 12px;
}

.table-list .table {
	width: 100%;
	height: 100%;
}

.table-list .table .tr {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 42px;
	box-sizing: border-box;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	margin-bottom: 5px;
	border-radius: 2px;
}

.table-list .table .tr:first-child {
	box-shadow: inset 0 0 25px 0 rgba(74, 35, 19, 1);
	border: 2px solid rgba(221, 221, 221, 0.23);
}

.table-list .table .tr:last-child {
	margin-bottom: 0;
}

.table-list .table .tr .td {
	width: calc((100% - 206px - 309px) / 4);
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 23px;
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.table-list .table .tr .td.date {
	width: 206px;
}

.table-list .table .tr .td.info {
	width: 309px;
}

.table-list .table .tr .td.english {
	font-size: 16px;
}

.table-list .table .tr .td.english.color {
	color: #ecc69d;
}
</style>

<style>
.ant-picker .ant-picker-input > input {
	font-size: 15px;
	color: #fff;
	border: 0;
	border-radius: 0;
}
.ant-picker-focused {
	box-shadow: none;
	border-inline-end-width: none;
}

.ant-picker .ant-picker-input > input::placeholder {
	color: rgba(255, 255, 255, 0.4);
}
</style>
