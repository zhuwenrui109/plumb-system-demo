<script setup>
import { computed, onMounted, ref, watch } from "vue";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";
import GlobalInput from "@/components/GlobalInput.vue";
import { API_HOME } from "@/api";
import toastPlguin from "@/utils/toast";
import { useStore } from "vuex";
import FormPop from "@/components/FormPop.vue";
import { useRoute } from "vue-router";
import VideoPop from "@/components/VideoPop.vue";

const route = useRoute();
const deviceId = route.params.id;
console.log("deviceId :>> ", deviceId);

const store = useStore();

const isVideoShow = ref(false);
const currentVideoUrl = ref("");
const isPopShow = ref(false);
const checkList = ref([]);
const dataList = ref([]);
const page = ref(1);
const pageConfig = ref({
	total: 1,
	pageSize: 10
});
const form = ref({
	type: 0,
	confirm_user: "",
	remark: ""
});

watch(isPopShow, newVal => {
	if (!newVal) {
		setTimeout(() => {
			form.value = {
				type: 0,
				confirm_user: "",
				remark: ""
			};
		}, 300);
	}
});

watch(page, () => {
	checkList.value = [];
});

loadData();

async function loadData() {
	const { data } = await API_HOME.getRealAlarm({
		device_id: deviceId,
		page: page.value
	});
	if (!data.data.length) {
		toastPlguin("暂无内容...");
		dataList.value = [];
		return;
	}
	console.log("data :>> ", data);
	dataList.value = [...data.data];
	pageConfig.value.total = data.total;
	pageConfig.value.pageSize = data.per_page;
}

function showForm(type) {
	if (!checkList.value.length && !type) {
		toastPlguin("请选择报警信息");
		return;
	}
	form.value.confirm_user = store.state.user.name;
	form.value.type = type;
	isPopShow.value = true;
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
	checkList.value = dataList.value.map(item => item.alarm_id);
}

async function submitCheckList() {
	const { confirm_user, remark, type } = form.value;
	if (!confirm_user && !remark) {
		toastPlguin("请检查确认人和备注");
		return;
	}
	if (type) {
		submitAlarmByDevice();
		return;
	}
	submitAlarmByAlarm();
}

function refreshData() {
	page.value = 1;
	checkList.value = [];
	loadData();
}

async function submitAlarmByDevice() {
	const { confirm_user, remark } = form.value;
	try {
		const { code } = await API_HOME.submitCheckAlarm({
			devices_ids: [deviceId],
			confirm_user,
			remark,
			last_alarm_id: dataList.value[0].alarm_id
		});
		if (code == 200) {
			checkList.value.splice(0, checkList.value.length);
			loadData();
			isPopShow.value = false;
			toastPlguin("确认报警成功");
		} else {
			toastPlguin("提交失败");
		}
	} catch (err) {
		toastPlguin("提交失败");
	}
}

async function submitAlarmByAlarm() {
	const { confirm_user, remark } = form.value;
	try {
		const { code } = await API_HOME.checkRealAlarm({
			alarm_ids: checkList.value,
			confirm_user,
			remark
		});
		if (code == 200) {
			checkList.value.splice(0, checkList.value.length);
			loadData();
			isPopShow.value = false;
			toastPlguin("确认报警成功");
		} else {
			toastPlguin("提交失败");
		}
	} catch (err) {
		console.log("err :>> ", err);
		toastPlguin("提交失败");
	}
}

async function checkVideo(id) {
	const { code, data, msg} = await API_HOME.checkRealAlarmVideo({
		alarm_id: id
	});
	if (code == 400) {
		toastPlguin(msg);
		return;
	}
	currentVideoUrl.value = data.video;
	isVideoShow.value = true;
}
</script>

<template>
	<HomeGlobalContent class="history-wrap">
		<GlobalContent class="history-content">
			<SettingTopHandller title="实时报警">
				<template #left>
					<div class="refresh-btn" @click="refreshData">
						<img
							src="../assets/images/icon-refresh.png"
							alt=""
						/>
						<span>刷新</span>
					</div>
				</template>
				<template #right>
					<div class="history-right">
						<SettingButtonBorder @click="showForm(0)"> 确认选中报警 </SettingButtonBorder>
						<SettingButtonBorder
							type="clear"
							@click="showForm(1)"
						>
							确认所有报警
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
							<div class="td date">报警时间</div>
							<div class="td">报警级别</div>
							<div class="td">报警浓度</div>
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
							<div class="td english date">{{ item.created_at }}</div>
							<div class="td color">
								<span class="english">{{ item.level }}</span
								>级
							</div>
							<div class="td english color">{{ item.density + "pmm.m" }}</div>
							<div class="td video" @click="checkVideo(item.alarm_id)">
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
		<FormPop
			v-model="isPopShow"
			name="确认报警"
		>
			<div class="form-wrap">
				<div class="form-item">
					<div class="name">确认人</div>
					<GlobalInput
						class="form-input"
						placeholder="请输入"
						v-model="form.confirm_user"
					></GlobalInput>
				</div>
				<div class="form-item">
					<div class="name">备注</div>
					<div class="txt-area-box">
						<textarea
							placeholder="请输入"
							rows="5"
							v-model="form.remark"
						></textarea>
					</div>
				</div>
				<div class="form-item btn">
					<SettingButtonBorder
						class="btn"
						@click="submitCheckList"
					>
						确认提交
					</SettingButtonBorder>
				</div>
			</div>
		</FormPop>
		<VideoPop v-model="isVideoShow" :video-url="currentVideoUrl"></VideoPop>
	</HomeGlobalContent>
</template>

<style scoped>
.history-wrap {
	width: 1890px;
	height: 100%;
	margin: 0 auto;
	padding: 13px 0;
}

.history-wrap .history-content {
	width: 1860px;
	height: 100%;
	margin: 0 auto;
}

.history-wrap .history-content .refresh-btn {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	align-self: flex-end;
	column-gap: 10px;
	cursor: pointer;
}

.history-wrap .history-content .refresh-btn img {
	display: block;
	width: 20px;
}

.history-wrap .history-content .refresh-btn span {
	font-size: 15px;
}

.history-wrap .history-content .history-handle {
	position: relative;
	z-index: 10;
}

.history-wrap .history-content .history-handle .btn {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	align-self: flex-end;
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
	top: 100%;
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
	padding: 15px 14px;
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
	font-size: 12px;
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
	padding: 12px 0;
}

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
	width: calc(100% / 7);
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 30px;
	text-wrap: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
	cursor: pointer;
}

.form-wrap {
	width: 100%;
	box-sizing: border-box;
	padding: 24px 21px 35px;
}

.form-wrap .form-item {
	width: 100%;
	margin-bottom: 16px;
}

.form-wrap .form-item:last-child {
	margin-bottom: 0;
}

.form-wrap .form-item .name {
	font-size: 14px;
	margin-bottom: 8px;
}

.form-wrap .form-item .form-input {
	width: 100%;
}

.form-wrap .form-item .txt-area-box {
	height: 115px;
	box-sizing: border-box;
	padding: 10px 22px;
	background: rgba(39, 39, 39, 0.36);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
	flex: 1;
}

.form-wrap .form-item .txt-area-box textarea {
	font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
	display: block;
	width: 100%;
	height: 100%;
	font-size: 14px;
	border: none;
	outline: none;
	resize: none;
	background: none;
	color: #fff;
}

.form-wrap .form-item .btn {
	width: 208px;
	margin: 0 auto;
}
</style>
