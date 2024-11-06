<script setup>
import { API_STAND, API_HOME } from "@/api";
import FormPop from "@/components/FormPop.vue";
import GlobalInput from "@/components/GlobalInput.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";
import GlobalSwitch from "@/components/GlobalSwitch.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import dialogPlguin from "@/utils/dialog";
import toastPlguin from "@/utils/toast";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const props = defineProps({
	standKeyword: String
});

const popConfig = ref({
	type: "",
	name: "",
	title: "",
	placeholder: ""
});
const form = ref({
	name: "",
	region_id: "",
	station_id: ""
});
const currentStandId = ref("");
const isPopShow = ref(false);
const dataList = ref([]);
const page = ref(1);
const pageConfig = ref({
	total: 1,
	pageSize: 8
});

onMounted(() => {
	loadData();
});

defineExpose({
	page,
	isPopShow,
	loadData,
	showStandPop
});

watch(isPopShow, newVal => {
	if (!newVal) {
		form.value = {
			name: "",
			region_id: "",
			station_id: ""
		};
	}
});

async function loadData() {
	currentStandId.value = "";
	const res = await API_STAND.getList({
		page: page.value,
		keyword: props.standKeyword
	});
	if (!res.data.data.length) {
		toastPlguin("暂无内容...")
		return;
	}
	dataList.value = res.data.data;
	pageConfig.value.total = res.data.total;
	pageConfig.value.pageSize = res.data.pageSize;
}

async function refreshStand() {
	const { data } = await API_HOME.getStandList();
	store.dispatch("handleStandList", data);
}

async function handleSort(type, id) {
	const res = type == 0 ? await API_STAND.standSort(id) : await API_STAND.areaSort(id);
	console.log('res :>> ', res);
	loadData();
	refreshStand();
}

async function toggleStandStatus(stationIndex) {
	dataList.value[stationIndex].status = dataList.value[stationIndex].status == "1" ? "0" : "1";
	dataList.value[stationIndex].station_id;
	const station_id = dataList.value[stationIndex].station_id;
	const res = await API_STAND.editStand({
		station_id,
		status: dataList.value[stationIndex].status
	});
	if (res.code != 200) {
		dataList.value[stationIndex].status = dataList.value[stationIndex].status == "1" ? "0" : "1";
		toastPlguin("修改失败");
	}
	refreshStand();
}

function showStandPop() {
	popConfig.value.type = "stand";
	popConfig.value.name = "新增场站";
	popConfig.value.title = "场站名称";
	popConfig.value.placeholder = "请输入场站名称";
	isPopShow.value = true;
}

function showAreaPop(id) {
	form.value.station_id = id;
	popConfig.value.type = "region";
	popConfig.value.name = "新增工艺区";
	popConfig.value.title = "工艺区名称";
	popConfig.value.placeholder = "请输入工艺区名称";
	isPopShow.value = true;
}

async function handleSubmit() {
	if (popConfig.value.type == "stand") {
		await API_STAND.editStand(form.value);
	} else {
		await API_STAND.editRegion(form.value);
	}
	isPopShow.value = false;
	loadData();
	refreshStand();
	toastPlguin("修改成功");
}

async function toggleRegionStatus(stationIndex, regionIndex) {
	dataList.value[stationIndex].regions[regionIndex].status = dataList.value[stationIndex].regions[regionIndex].status == "1" ? "0" : "1";
	const station_id = dataList.value[stationIndex].station_id;
	const region_id = dataList.value[stationIndex].regions[regionIndex].region_id;
	const res = await API_STAND.editRegion({
		region_id,
		station_id,
		status: dataList.value[stationIndex].regions[regionIndex].status
	});
	console.log("res :>> ", res);
	if (res.code != 200) {
		dataList.value[stationIndex].regions[regionIndex].status = dataList.value[stationIndex].regions[regionIndex].status == "1" ? "0" : "1";
		toastPlguin("修改失败");
	}
	refreshStand();
}

function toggleArea(item) {
	if (item.regions.length == 0) {
		return;
	}
	currentStandId.value = currentStandId.value == item.station_id ? "" : item.station_id;
}

async function handleEdit(id, regionId = "") {
	let res = null;
	if (regionId) {
		popConfig.value.type = "region";
		popConfig.value.name = "新增工艺区";
		popConfig.value.title = "工艺区名称";
		popConfig.value.placeholder = "请输入工艺区名称";
		res = await API_STAND.getRegionDetail(regionId);
	} else {
		popConfig.value.type = "stand";
		popConfig.value.name = "新增场站";
		popConfig.value.title = "场站名称";
		popConfig.value.placeholder = "请输入场站名称";
		res = await API_STAND.getStandDetail(id);
	}
	form.value = { ...res.data };
	isPopShow.value = true;
}

async function handleDelete(id, regionId = "") {
	dialogPlguin({
		message: "是否确认删除所选内容"
	}).then(
		async () => {
			let res = null;
			if (regionId) {
				res = await API_STAND.deleteRegionDetail(regionId);
			} else {
				res = await API_STAND.deleteStandDetail(id);
			}
			if (res.code == 200) {
				loadData();
				refreshStand();
				toastPlguin("删除成功");
			}
		},
		() => {}
	);
}
</script>

<template>
	<div class="stand-wrap">
		<div class="table">
			<div class="tr">
				<div class="td id">
					<div class="td-item">序号</div>
				</div>
				<div class="td stand">
					<div class="td-item">场站及工艺区</div>
				</div>
				<div class="td state">
					<div class="td-item">状态</div>
				</div>
				<div class="td sorting">
					<div class="td-item">场站排序</div>
				</div>
				<div class="td handle">
					<div class="td-item">操作</div>
				</div>
			</div>
			<div
				class="tr"
				v-for="(item, stationIndex) in dataList"
				:key="item.station_id"
				:class="{ active: item.station_id == currentStandId }"
			>
				<div class="td id">
					<div class="td-item">
						<img
							src="../assets/images/icon-address.png"
							alt=""
							class="address"
						/>
						<span class="english">{{ stationIndex + 1 }}</span>
					</div>
				</div>
				<div class="td stand">
					<div
						class="td-item"
						@click="toggleArea(item)"
					>
						<div class="arr">
							<img
								src="../assets/images/icon-setting-arr.png"
								alt=""
								v-show="item.regions.length > 0"
							/>
						</div>
						<span>{{ item.name }}</span>
					</div>
					<div
						class="td-list"
						v-show="currentStandId && currentStandId == item.station_id"
					>
						<div
							class="td-item"
							v-for="(region, regionIndex) in item.regions"
						>
							<div class="num english">{{ regionIndex + 1 }}</div>
							<div class="txt english">{{ region.name }}</div>
							<div class="btn-list">
								<GlobalSwitch
									v-model="region.status"
									@click="toggleRegionStatus(stationIndex, regionIndex)"
								></GlobalSwitch>
								<img
									src="../assets/images/icon-sorting.png"
									alt=""
									class="sorting"
									@click="handleSort(1, region.region_id)"
								/>
								<img
									src="../assets/images/icon-edit.png"
									alt=""
									class="handle-icon"
									@click="handleEdit(item.station_id, region.region_id)"
								/>
								<img
									src="../assets/images/icon-delete.png"
									alt=""
									class="handle-icon"
									@click="handleDelete(item.station_id, region.region_id)"
								/>
							</div>
						</div>
					</div>
				</div>
				<div class="td state">
					<div class="td-item">
						<GlobalSwitch
							v-model="item.status"
							@click="toggleStandStatus(stationIndex)"
						></GlobalSwitch>
					</div>
				</div>
				<div class="td sorting">
					<div class="td-item">
						<img
							src="../assets/images/icon-sorting.png"
							alt=""
							class="sorting"
							@click="handleSort(0, item.station_id)"
						/>
					</div>
				</div>
				<div class="td handle">
					<div class="td-item">
						<img
							src="../assets/images/icon-edit.png"
							alt=""
							class="handle-icon"
							@click="handleEdit(item.station_id)"
						/>
						<img
							src="../assets/images/icon-delete.png"
							alt=""
							class="handle-icon"
							@click="handleDelete(item.station_id)"
						/>
						<div
							class="add-btn"
							@click="showAreaPop(item.station_id)"
						>
							<img
								src="../assets/images/icon-setting-add.png"
								alt=""
								class="add-icon"
							/>
							<span>添加工艺区</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<GlobalPagination
			v-model="page"
			:total="pageConfig.total"
			:page-size="pageConfig.pageSize"
			@change-page="loadData"
		></GlobalPagination>
		<FormPop
			v-model="isPopShow"
			:name="popConfig.name"
		>
			<div class="form-wrap">
				<div class="name">
					{{ popConfig.title }}
				</div>
				<GlobalInput
					class="input-wrap"
					v-model="form.name"
					:placeholder="popConfig.placeholder"
				></GlobalInput>
				<SettingButtonBorder
					class="btn"
					@click="handleSubmit"
				>
					确认提交
				</SettingButtonBorder>
			</div>
		</FormPop>
	</div>
</template>

<style scoped>
.stand-wrap {
	width: 100%;
}

.stand-wrap .table {
	width: 100%;
	height: 650px;
	margin-bottom: 10px;
}

.stand-wrap .table .tr {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	box-sizing: border-box;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	margin-bottom: 4px;
	border-radius: 2px;
}

.stand-wrap .table .tr:first-child {
	box-shadow: inset 0 0 25px 0 rgba(74, 35, 19, 1);
	border: 2px solid rgba(221, 221, 221, 0.23);
}

.stand-wrap .table .tr .td {
	width: 10%;
	height: 40px;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 40px;
	text-wrap: nowrap;
}

.stand-wrap .table .tr:first-child .td .td-item {
	border: none;
}

.stand-wrap .table .tr:first-child .td.stand .td-item {
	border: none;
}

.stand-wrap .table .tr .td:last-child .td-item {
	border-right: none;
}

.stand-wrap .table .tr .td:first-child .td-item {
	border-right: none;
}

.stand-wrap .table .tr .td.stand {
	display: block;
	width: 950px;
	height: auto;
}

.stand-wrap .table .tr .td.stand .td-item {
	height: 39px;
	padding-left: 28px;
	border-left: 1px solid rgba(188, 188, 188, 0.2);
	cursor: pointer;
}

.stand-wrap .table .tr.active .td.stand .td-item {
	border-bottom: none;
}

.stand-wrap .table .tr .td.stand .arr {
	display: block;
	width: 21px;
	transform: rotate(-180deg);
	margin-right: 10px;
}

.stand-wrap .table .tr .td.stand .arr img {
	display: block;
	width: 100%;
}

.stand-wrap .table .tr.active .td.stand .arr {
	transition: 0.3s all linear;
	transform: none;
}

.stand-wrap .table .tr .td.state {
	width: 183px;
}

.stand-wrap .table .tr .td.sorting {
	width: 146px;
}

.stand-wrap .table .tr .td.sorting .td-item {
	padding-left: 13px;
}

.stand-wrap .table .tr .td.handle {
	width: 146px;
}

.stand-wrap .table .tr .td.handle .td-item {
	padding-left: 13px;
}

.stand-wrap .table .tr .td.english {
	font-size: 16px;
}

.stand-wrap .table .tr .td .address {
	display: block;
	width: 16px;
	margin-right: 8px;
}

.stand-wrap .table .tr .td .sorting {
	display: block;
	width: 13px;
	cursor: pointer;
}

.stand-wrap .table .tr .td.handle {
	width: 250px;
}

.stand-wrap .table .tr .td.handle .td-item {
	padding-left: 34px;
}

.stand-wrap .table .tr .td .handle-icon {
	display: block;
	width: 17px;
	margin-right: 14px;
	cursor: pointer;
}

.stand-wrap .table .tr .td .handle-icon:last-child {
	margin-right: 0;
}

.stand-wrap .table .tr .td .td-item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 40px;
	box-sizing: border-box;
	border-right: 1px solid rgba(188, 188, 188, 0.2);
	padding-left: 40px;
}

.stand-wrap .table .tr.active .td .td-item {
	border-bottom: 1px solid rgba(188, 188, 188, 0.2);
}

.stand-wrap .table .tr .td .td-list .td-item {
	padding-left: 63px;
	padding-right: 14px;
	border-top: 1px solid rgba(188, 188, 188, 0.2);
	border-left: 1px solid rgba(188, 188, 188, 0.2);
}

.stand-wrap .table .tr .td .td-list .td-item .num {
	font-size: 16px;
	margin-right: 20px;
}

.stand-wrap .table .tr .td .td-list .td-item .txt {
	font-size: 15px;
	margin-right: auto;
}

.stand-wrap .table .tr .td .td-list .td-item .btn-list {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	column-gap: 22px;
}

.stand-wrap .table .tr .td .td-list .td-item .btn-list .handle-icon {
	margin-right: 0;
}

.stand-wrap .table .tr .td .add-btn {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 8px;
	cursor: pointer;
}

.stand-wrap .table .tr .td .add-btn .add-icon {
	display: block;
	width: 20px;
}

.stand-wrap .table .tr .td .add-btn span {
	display: block;
	font-size: 15px;
	color: rgba(255, 255, 255, 0.4);
}

.form-wrap {
	padding: 24px 40px 35px;
}

.form-wrap .name {
	font-size: 14px;
	margin-bottom: 8px;
}

.form-wrap .input-wrap {
	width: 100%;
	margin-bottom: 44px;
}

.form-wrap .btn {
	width: 208px;
	margin: 0 auto;
	text-align: center;
}
</style>
