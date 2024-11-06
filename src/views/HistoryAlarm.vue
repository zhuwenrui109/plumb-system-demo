<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
import GlobalLinkageSelect from "@/components/GlobalLinkageSelect.vue";
import GlobalInput from "@/components/GlobalInput.vue";
import GlobalDatePicker from "@/components/GlobalDatePicker.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";
import { API_ALARM } from "@/api";
import dayjs from "dayjs";
import toastPlguin from "@/utils/toast";

const currentStandArea = ref(0);
const standId = ref("");
const areaId = ref("");
const startDate = ref("");
const endDate = ref("");
const isToolsShow = ref(false);
const checkList = ref([]);
const dataList = reactive([]);
const page = ref(1);
const pageConfig = ref({
	total: 1,
	pageSize: 10
});
const keyword = ref("");
const currentRemarkId = ref("");

onMounted(() => {
	loadData();
});

watch(page, () => {
	checkList.value = [];
});

async function loadData() {
	let start_date = "";
	let end_date = "";
	if (startDate.value) {
		start_date = dayjs(startDate.value).format("YYYY-MM-DD");
	}
	if (startDate.value) {
		end_date = dayjs(endDate.value).format("YYYY-MM-DD");
	}
	const res = await API_ALARM.getList({
		page: page.value,
		station_id: standId.value,
		region_id: areaId.value,
		keyword: keyword.value,
		start_date,
		end_date
	});
	if (!res.data.data.length) {
		toastPlguin("暂无内容...")
		return;
	}
	dataList.splice(0, dataList.length);
	dataList.push(...res.data.data);
	pageConfig.value.total = res.data.total;
	pageConfig.value.pageSize = res.data.per_page;
}

/**
 * 搜索
 */
function search() {
	page.value = 1;
	loadData();
}

/**
 * 清空
 */
async function clearForm() {
	standId.value = "";
	areaId.value = "";
	keyword.value = "";
	startDate.value = "";
	endDate.value = "";
	await nextTick();
	search();
}

/**
 * 导出
 */
async function exportData() {
	// if (checkList.value.length == 0) {
	// 	return;
	// }
	// const res = await API_ALARM.exprotData(checkList.value.join(","), { responseType: "blob" });
	const res = await API_ALARM.exprotData("0", { responseType: "blob" });
	const url = window.URL.createObjectURL(res);
	const link = document.createElement("a");
	const date = new Date();
	link.href = url;
	link.setAttribute("download", "历史报警" + date.getTime());
	link.click();
}

/**
 * 批量删除
 */
async function batchDelete() {
	if (checkList.value.length == 0) {
		return;
	}
	const res = await API_ALARM.batchDelData({
		alarm_id: checkList.value
	});
	console.log("res :>> ", res);
	if (res.code == 200) {
		checkList.value = [];
		loadData();
	}
}

/**
 * 多选
 * @param id 设备ID
 */
function handleSelect(id) {
	if (checkList.value.includes(id)) {
		checkList.value.splice(checkList.value.indexOf(id), 1);
		return;
	}
	checkList.value.push(id);
}

/**
 * 全选
 */
function handleSelectAll() {
	if (checkList.value.length > 0) {
		checkList.value.splice(0, checkList.value.length);
		return;
	}
	checkList.value = dataList.map(item => item.alarm_id);
}

function toggleTools() {
	isToolsShow.value = !isToolsShow.value;
}
</script>

<template>
	<HomeGlobalContent class="history-wrap">
		<GlobalContent class="history-content">
			<SettingTopHandller title="历史报警">
				<template #left>
					<div
						class="history-handle"
						:class="{ active: isToolsShow }"
						@click="toggleTools"
					>
						<div class="btn">
							<span>批量操作</span>
							<img
								src="../assets/images/icon-select-arr.png"
								alt=""
							/>
						</div>
						<Transition name="fade">
							<div
								class="handle-list"
								v-show="isToolsShow"
							>
								<div
									class="handle-item"
									@click="batchDelete"
								>
									<img
										src="../assets/images/icon-delete.png"
										alt=""
									/>
									<span>删除选中</span>
								</div>
								<div
									class="handle-item chance"
									@click="exportData"
								>
									<img
										src="../assets/images/icon-export.png"
										alt=""
									/>
									<span>全部导出</span>
								</div>
								<div class="mask"></div>
							</div>
						</Transition>
					</div>
				</template>
				<template #right>
					<div class="history-right">
						<GlobalLinkageSelect
							v-model:standId="standId"
							v-model:areaId="areaId"
						></GlobalLinkageSelect>
						<GlobalInput
							placeholder="确认人员姓名"
							v-model="keyword"
						></GlobalInput>
						<GlobalDatePicker
							v-model="startDate"
							:name="'选择开始日期'"
						></GlobalDatePicker>
						<GlobalDatePicker
							v-model="endDate"
							:start-date="startDate"
							:name="'选择结束日期'"
						></GlobalDatePicker>
						<SettingButtonBorder @click="search"> 搜索 </SettingButtonBorder>
						<SettingButtonBorder
							type="clear"
							@click="clearForm"
						>
							清空
						</SettingButtonBorder>
					</div>
				</template>
			</SettingTopHandller>
			<div class="main">
				<div class="global-table-wrap">
					<div class="table">
						<div class="tr">
							<div
								class="td checkbox"
								@click="handleSelectAll"
							>
								<img
									src="../assets/images/icon-hook.png"
									alt=""
									v-show="checkList.length > 0"
								/>
							</div>
							<div class="td id">设备ID</div>
							<div class="td">所属场站</div>
							<div class="td">所属工艺区</div>
							<div class="td">报警浓度</div>
							<div class="td">报警级别</div>
							<div class="td date">报警时间</div>
							<div class="td">确认人员</div>
							<div class="td date">确认时间</div>
							<div class="td tips">备注</div>
							<div class="td video">报警视频</div>
						</div>
						<div
							class="tr"
							v-for="item in dataList"
							:key="item.alarm_id"
						>
							<div
								class="td checkbox"
								@click="handleSelect(item.alarm_id)"
							>
								<img
									src="../assets/images/icon-hook.png"
									alt=""
									v-show="checkList.includes(item.alarm_id)"
								/>
							</div>
							<div class="td id">
								<img
									src="../assets/images/icon-camera.png"
									alt=""
									class="camera"
								/>
								<span class="english">{{ item.device_id }}</span>
							</div>
							<div class="td">{{ item.station.name }}</div>
							<div class="td">{{ item.region.name }}</div>
							<div class="td english color">{{ item.density + "pmm.m" }}</div>
							<div class="td color">
								<span class="english">{{ item.level }}</span
								>级
							</div>
							<div class="td english date">{{ item.created_at }}</div>
							<div class="td">{{ item.confirm_user }}</div>
							<div class="td english date">{{ item.confirmed_at }}</div>
							<div
								class="td tips"
								@mouseenter="currentRemarkId = item.alarm_id"
								@mouseleave="currentRemarkId = ''"
							>
								<span>{{ item.remark }}</span>
								<Transition>
									<div
										class="tips-more"
										v-show="item.remark.length > 16 && currentRemarkId == item.alarm_id"
									>
										{{ item.remark }}
									</div>
								</Transition>
							</div>
							<div class="td video">
								<img
									src="../assets/images/icon-video.png"
									alt=""
								/>
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
			</div>
		</GlobalContent>
	</HomeGlobalContent>
</template>

<style scoped>
.history-wrap {
	width: 9.84375rem;
	height: 100%;
	margin: 0 auto;
	padding: 0.0625rem 0;
}

.history-wrap .history-content {
	width: 9.69792rem;
	height: 100%;
	margin: 0 auto;
}

.history-wrap .history-content .history-handle {
	position: relative;
	z-index: 10;
}

.history-wrap .history-content .history-handle .btn {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 10px;
	cursor: pointer;
}

.history-wrap .history-content .history-handle .btn span {
	display: block;
	font-size: 15px;
}

.history-wrap .history-content .history-handle .btn img {
	display: block;
	width: 8px;
	transition: 0.2s all ease-in;
}

.history-wrap .history-content .history-handle.active .btn img {
	transform: rotate(180deg);
}

.history-wrap .history-content .history-handle .handle-list {
	position: absolute;
	top: calc(100% + 10px);
	left: 0;
	/* width: 88px; */
	width: 110px;
	box-sizing: border-box;
	background: #222;
	border: 1px solid rgba(108, 108, 108, 0.8);
	box-shadow: 0px 3px 12px 0px #000000;
	border-radius: 4px;
}

.history-wrap .history-content .history-handle .handle-list .mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
}

.history-wrap .history-content .history-handle .handle-list .handle-item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 6px;
	padding: 15px 0;
	padding-left: 14px;
	border-bottom: 1px solid rgba(108, 108, 108, 0.8);
	cursor: pointer;
}

.history-wrap .history-content .history-handle .handle-list .handle-item.chance {
	border-bottom: none;
}

.history-wrap .history-content .history-handle .handle-list .handle-item img {
	display: block;
	width: 16px;
}

.history-wrap .history-content .history-handle .handle-list .handle-item span {
	display: block;
	font-size: 15px;
	line-height: 16px;
}

.history-wrap .history-content .history-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	column-gap: 10px;
}

.history-wrap .history-content .main {
	width: 1830px;
	margin: 0 auto;
	padding-top: 12px;
}

.global-table-wrap {
	width: 100%;
}

.global-table-wrap .table {
	width: 100%;
	height: 640px;
	margin-bottom: 10px;
}

.global-table-wrap .table .tr {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	height: 40px;
	box-sizing: border-box;
	padding: 0 14px;
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
	width: calc((100% - 230px - 230px - 330px - 16px) / 7);
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 30px;
}

.global-table-wrap .table .tr .td.english {
	font-size: 16px;
}

.global-table-wrap .table .tr .td.checkbox {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.17);
	border: 1px solid #6c6c6c;
	padding: 0;
	cursor: pointer;
}

.global-table-wrap .table .tr .td.checkbox img {
	display: block;
	width: 11px;
}

.global-table-wrap .table .tr .td .camera {
	display: block;
	width: 20px;
	margin-right: 16px;
}

.global-table-wrap .table .tr .td.id {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.global-table-wrap .table .tr .td.date {
	width: 230px;
}

.global-table-wrap .table .tr .td.tips {
	position: relative;
	width: 330px;
}

.global-table-wrap .table .tr .td.tips span {
	display: block;
	width: 100%;
	overflow: hidden;
	text-wrap: nowrap;
	text-overflow: ellipsis;
}

.global-table-wrap .table .tr .td.tips .tips-more {
	position: absolute;
	top: calc(100% + 6px);
	left: 0;
	width: 406px;
	box-sizing: border-box;
	line-height: 1.5;
	padding: 16px;
	background: rgba(42, 42, 42, 0.8);
	border: 1px solid rgba(108, 108, 108, 0.8);
	box-shadow: 0 3px 12px 0 #000;
	border-radius: 3px;
	z-index: 10;
}

.global-table-wrap .table .tr .td.color {
	color: #ecc69d;
}

.global-table-wrap .table .tr .td.video {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 0;
}

.global-table-wrap .table .tr .td.video img {
	display: block;
	width: 21px;
}
</style>
