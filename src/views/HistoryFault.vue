<script setup>
import { onMounted, ref } from "vue";
import { DatePicker, ConfigProvider } from "ant-design-vue";
import * as echarts from "echarts";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
import GlobalLinkageSelect from "@/components/GlobalLinkageSelect.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import "ant-design-vue/dist/reset.css";
import "dayjs/locale/zh-cn";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import GlobalSelect from "@/components/GlobalSelect.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";

dayjs.locale("zh-cn");

const currentStandArea = ref();
const date = ref();
const time = ref();
const gap = ref();
const locale = ref(zhCN);
const chart = ref(null);
const currentTimeUnit = ref(0);
const chartOptions = ref({
	title: {
		text: "2020-12-20 13:00:00",
		top: 0,
		left: 40,
		textStyle: {
			color: "#fff",
			fontSize: 12
		}
	},
	tooltip: {
		show: false
	},
	grid: {
		show: true,
		top: 30,
		left: 0,
		right: 0,
		bottom: 0,
		containLabel: true,
		backgroundColor: "rgba(45, 45, 45, 0.7)",
		opacity: 0.4,
		borderWidth: 0
	},
	xAxis: {
		type: "category",
		boundaryGap: false,
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
		data: ["衬衫\n衬衫衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
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
			name: "销量",
			type: "line",
			smooth: true,
			data: [5, 20, 36, 10, 10, 20],
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
				color: echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
const timeUnit = ref([
	{
		title: "时",
		value: 0
	},
	{
		title: "分钟",
		value: 1
	}
]);

onMounted(() => {
	echartsInit();
});

function echartsInit() {
	const myChart = echarts.init(chart.value);
	myChart.setOption(chartOptions.value);
}
</script>

<template>
	<HomeGlobalContent class="fault-wrap">
		<GlobalContent class="fault-content">
			<SettingTopHandller
				title="沈阳分输站-过滤区-历史数据"
				class="fault-top"
			>
				<template #left>
					<div class="fault-left">
						<GlobalLinkageSelect
							:width="128"
							v-model="currentStandArea"
							class="select"
						></GlobalLinkageSelect>
						<div class="date-list">
							<div class="date-item">
								<div class="name">起始时间:</div>
								<config-provider :locale="locale">
									<DatePicker
										v-model:value="date"
										placeholder="起始时间"
										class="global-date"
										:inputReadOnly="true"
									>
										<template #suffixIcon></template>
									</DatePicker>
									<DatePicker
										v-model:value="time"
										placeholder="起始时间"
										picker="time"
										class="global-date"
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
										/>
										<div class="arr-list">
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
											/>
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
												class="down"
											/>
										</div>
									</div>
									<GlobalSelect
										class="timeUnit"
										:list="timeUnit"
										v-model="currentTimeUnit"
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
										/>
										<div class="arr-list">
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
											/>
											<img
												src="../assets/images/icon-fault-arr.png"
												alt=""
												class="down"
											/>
										</div>
									</div>
									<GlobalSelect
										class="timeUnit"
										:list="timeUnit"
										v-model="currentTimeUnit"
									></GlobalSelect>
								</div>
							</div>
						</div>
						<SettingButtonBorder> 查看 </SettingButtonBorder>
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
					<div class="tr">
						<div class="td date english">2021-12-12 13:00:00</div>
						<div class="td info">沈阳分输站-过滤区</div>
						<div class="td english color">1OOOPPm.m</div>
						<div class="td english">5400</div>
						<div class="td english">360</div>
						<div class="td english">360</div>
					</div>
					<div class="tr">
						<div class="td date english">2021-12-12 13:00:00</div>
						<div class="td info">沈阳分输站-过滤区</div>
						<div class="td english color">1OOOPPm.m</div>
						<div class="td english">5400</div>
						<div class="td english">360</div>
						<div class="td english">360</div>
					</div>
					<div class="tr">
						<div class="td date english">2021-12-12 13:00:00</div>
						<div class="td info">沈阳分输站-过滤区</div>
						<div class="td english color">1OOOPPm.m</div>
						<div class="td english">5400</div>
						<div class="td english">360</div>
						<div class="td english">360</div>
					</div>
					<div class="tr">
						<div class="td date english">2021-12-12 13:00:00</div>
						<div class="td info">沈阳分输站-过滤区</div>
						<div class="td english color">1OOOPPm.m</div>
						<div class="td english">5400</div>
						<div class="td english">360</div>
						<div class="td english">360</div>
					</div>
				</div>
			</GlobalContent>
			<GlobalPagination></GlobalPagination>
		</GlobalContent>
	</HomeGlobalContent>
</template>

<style scoped>
.fault-wrap {
	width: 9.84375rem;
	height: 4.28646rem;
	margin: 0 auto;
	padding: 0.0625rem 0;
}

.fault-wrap .fault-content {
	width: 9.69792rem;
	height: 100%;
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
	color: rgba(255, 255, 255, 0.4);
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
	height: 276px;
	margin: 0 auto;
	padding: 10px 56px 22px;
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
