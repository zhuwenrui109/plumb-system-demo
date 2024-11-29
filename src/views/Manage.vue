<script setup>
import { API_HOME, API_MANAGE } from "@/api";
import GlobalInput from "@/components/GlobalInput.vue";
import GlobalLinkageSelect from "@/components/GlobalLinkageSelect.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";
import GlobalSwitch from "@/components/GlobalSwitch.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import dialogPlguin from "@/utils/dialog";
import toastPlguin from "@/utils/toast";
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const FormPop = defineAsyncComponent(() => import("@/components/FormPop.vue"));

const route = useRoute();
const store = useStore();
const props = defineProps({
	standId: {
		type: [String, Number],
		default: ""
	},
	areaId: {
		type: [String, Number],
		default: ""
	}
});

const loading = ref(false);
const formName = ref("新增设备");
const isPopShow = ref(false);
const page = ref(1);
const dataList = ref([]);
const pageConfig = ref({
	total: 1,
	pageSize: 10
});
const form = ref({
	device_id: "",
	sensor_ip: "",
	sensor_port: "",
	monitor_ip: "",
	monitor_port: "80",
	region_id: "",
	station_id: "",
	threshold_first: "",
	threshold_second: "",
	status: "1"
});

onMounted(() => {
	loadData();
});

watch(
	() => props.standId,
	() => {
		page.value = 1;
	}
);

watch(isPopShow, newVal => {
	if (!newVal) {
		setTimeout(() => {
			form.value = {
				device_id: "",
				sensor_ip: "",
				sensor_port: "",
				monitor_ip: "",
				monitor_port: "80",
				region_id: "",
				station_id: "",
				threshold_first: "",
				threshold_second: "",
				status: "1"
			};
			formName.value = "新增设备";
		}, 300);
	}
});

defineExpose({
	page,
	isPopShow,
	search
});

async function loadData() {
	const res = await API_MANAGE.getList({
		page: page.value,
		station_id: props.standId,
		region_id: props.areaId
	});
	if (!res.data.data.length) {
		toastPlguin("暂无内容...");
		dataList.value = new Array();
		return;
	}
	dataList.value = [...res.data.data];
	pageConfig.value.total = res.data.total;
	pageConfig.value.pageSize = res.data.per_page;
}

async function search() {
	const res = await API_MANAGE.getList({
		page: page.value,
		station_id: props.standId,
		region_id: props.areaId
	});
	if (!res.data.data.length) {
		toastPlguin("暂无内容...");
		return;
	}
	dataList.value = [...res.data.data];
	pageConfig.value.total = res.data.total;
	pageConfig.value.pageSize = res.data.per_page;
}

/**
 * 刷新场站列表
 */
async function refreshStandList() {
	const { data } = await API_HOME.getStandList();
	store.dispatch("handleStandList", data);
}

async function toggleStatus(index) {
	const item = dataList.value[index];
	dataList.value[index].status = item.status == 1 ? 0 : 1;
	const res = await API_MANAGE.editManage({
		device_id: item.device_id,
		status: dataList.value[index].status
	});
	if (res.code != 200) {
		dataList.value[index].status = item.status == 1 ? 0 : 1;
	}
	refreshStandList();
}

async function handleSubmit() {
	for (const key in form.value) {
		if (Object.prototype.hasOwnProperty.call(form.value, key)) {
			const item = form.value[key];
			if (key != "device_id" && key != "status" && item == "") {
				toastPlguin("请填写设备完整信息");
				return;
			}
		}
	}
	if (form.value.threshold_first >= form.value.threshold_second) {
		toastPlguin("一级报警值需要小于二级报警值");
		return;
	}
	if (loading.value) {
		return;
	}
	loading.value = true;
	console.log("发送请求");
	const res = await API_MANAGE.editManage(form.value);
	loading.value = false;
	if (res.code == 200) {
		loadData();
		refreshStandList();
		if (!form.value.device_id) {
			toastPlguin("添加成功");
		} else {
			toastPlguin("修改成功");
		}
		isPopShow.value = false;
	} else if (res.code == 400) {
		toastPlguin(res.msg);
	}
}

async function handleEdit(id) {
	formName.value = "编辑设备";
	const res = await API_MANAGE.getDetail(id);
	console.log("res :>> ", res);
	if (res.code == 200) {
		form.value = { ...res.data };
		isPopShow.value = true;
	}
}

function handleDelete(id) {
	dialogPlguin({
		message: "是否确认删除所选内容"
	}).then(
		async () => {
			console.log("确认");
			await API_MANAGE.deleteManage(id);
			loadData();
			refreshStandList();
			toastPlguin("删除成功");
		},
		() => {
			console.log("取消");
		}
	);
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
				<div class="td">一级报警值</div>
				<div class="td">二级报警值</div>
				<div class="td">连接</div>
				<div class="td">状态</div>
				<div class="td handle">操作</div>
			</div>
			<div
				class="tr"
				v-for="(item, index) in dataList"
				:key="item.device_id"
			>
				<div class="td id">
					<img
						src="../assets/images/icon-camera.png"
						alt=""
						class="user"
					/>
					<span class="english">{{ item.device_id }}</span>
				</div>
				<div class="td english">{{ `${item.sensor_ip}:${item.sensor_port}` }}</div>
				<div class="td english">{{ `${item.monitor_ip || "XXX"}:${item.monitor_port || "XXX"}` }}</div>
				<div class="td">{{ item.station && item.station.name }}</div>
				<div class="td">{{ item.station && item.region.name }}</div>
				<div class="td english alarm">{{ item.threshold_first }}</div>
				<div class="td english alarm">{{ item.threshold_second }}</div>
				<div
					class="td connect"
					:class="{ success: item.connection_status == 1 }"
				>
					<span class="dir"></span>
					<img
						src="../assets/images/icon-unconnect.png"
						alt=""
					/>
					<span>{{ item.connection_status == 1 ? "已连接" : "无法连接" }}</span>
				</div>
				<div class="td state">
					<GlobalSwitch
						v-model="item.status"
						@click="toggleStatus(index)"
					></GlobalSwitch>
				</div>
				<div class="td handle">
					<img
						src="../assets/images/icon-edit.png"
						alt=""
						class="handle-icon"
						@click="handleEdit(item.device_id)"
					/>
					<img
						src="../assets/images/icon-delete.png"
						alt=""
						class="handle-icon"
						@click="handleDelete(item.device_id)"
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
		<FormPop
			:name="formName"
			v-model="isPopShow"
		>
			<div class="form-wrap">
				<div class="form-item">
					<div class="name">传感器设备IP</div>
					<GlobalInput
						placeholder="请输入"
						v-model="form.sensor_ip"
					></GlobalInput>
				</div>
				<div class="form-item">
					<div class="name">设备端口</div>
					<GlobalInput
						placeholder="请输入"
						v-model="form.sensor_port"
					></GlobalInput>
				</div>
				<div class="form-item">
					<div class="name">视频设备IP</div>
					<GlobalInput
						placeholder="请输入"
						v-model="form.monitor_ip"
					></GlobalInput>
				</div>
				<div class="form-item">
					<div class="name">设备端口</div>
					<GlobalInput
						placeholder="请输入"
						v-model="form.monitor_port"
					></GlobalInput>
				</div>
				<GlobalLinkageSelect
					class="select-wrap"
					v-model:standId="form.station_id"
					v-model:areaId="form.region_id"
					:need-name="true"
				></GlobalLinkageSelect>
				<div class="form-item chance">
					<div class="name">一级报警阀值</div>
					<GlobalInput
						class="input-chance"
						placeholder="输入阀值"
						v-model="form.threshold_first"
					></GlobalInput>
					<div class="form-tips">超出范围则报警</div>
				</div>
				<div class="form-item chance">
					<div class="name">二级报警值</div>
					<GlobalInput
						class="input-chance"
						placeholder="输入阀值"
						v-model="form.threshold_second"
					></GlobalInput>
					<div class="form-tips">超出范围则报警</div>
				</div>
				<div class="form-item chance switch">
					<div class="name">是否启用该设备:</div>
					<GlobalSwitch
						v-model="form.status"
						@click="form.status = form.status == '1' ? '0' : '1'"
					></GlobalSwitch>
				</div>
				<div class="form-item chance">
					<SettingButtonBorder
						class="btn"
						:class="{ loading: loading }"
						@click="handleSubmit"
					>
						<span>{{ !loading ? "确认提交" : "设备连接检测中" }}</span>
						<Transition name="fade">
							<img
								src="../assets/images/icon-loading.png"
								alt=""
								class="icon-loading"
								v-show="loading"
							/>
						</Transition>
					</SettingButtonBorder>
				</div>
			</div>
		</FormPop>
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
	width: calc((100% - 257px - 257px) / 8);
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 40px;
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
	display: none;
	width: 8px;
	height: 8px;
	background: #15c675;
	border-radius: 50%;
}

.global-table-wrap .table .tr .td.connect.success .dir {
	display: block;
}

.global-table-wrap .table .tr .td.connect img {
	display: block;
	width: 14px;
}

.global-table-wrap .table .tr .td.connect.success img {
	display: none;
}

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

.form-wrap {
	display: flex;
	align-items: center;
	align-content: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
	row-gap: 24px;
	padding: 23px 38px 44px;
}

.form-wrap .form-item {
	position: relative;
}

.form-wrap .form-item.chance {
	width: 100%;
}

.form-wrap .form-item.switch {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.form-wrap .form-item.switch .name {
	margin-bottom: 0;
	margin-right: 14px;
}

.form-wrap .form-item .name {
	font-size: 14px;
	margin-bottom: 8px;
}

.form-wrap .form-item .input-chance {
	width: 100%;
}

.form-wrap .form-item .form-tips {
	position: absolute;
	right: 10px;
	bottom: 8px;
	font-size: 14px;
	color: rgba(255, 255, 255, 0.4);
	pointer-events: none;
}

.form-wrap .form-item .icon-loading {
	position: absolute;
	right: 25px;
	top: 50%;
	transform: translateY(-55%);
	display: block;
	width: 1em;
	height: 1em;
	animation: spin 3s linear infinite;
}

.form-wrap .select-wrap {
	width: 100%;
	justify-content: space-between;
	gap: 0;
}

.form-wrap .btn {
	position: relative;
	width: 208px;
	margin: 0 auto;
	text-align: center;
}

.form-wrap .btn.loading {
	color: #888889;
	border-color: #505050;
	background: linear-gradient(to top, rgba(166, 166, 166, 0.3), rgba(86, 86, 86, 0.3));
}

.form-wrap .btn.loading:hover {
	opacity: 1;
}

@keyframes spin {
	0% {
		transform: translateY(-55%) rotate(0deg);
	}
	100% {
		transform: translateY(-55%) rotate(360deg);
	}
}
</style>
