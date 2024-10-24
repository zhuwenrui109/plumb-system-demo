<script setup>
import { onMounted, ref } from "vue";
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
import GlobalLinkageSelect from "@/components/GlobalLinkageSelect.vue";
import GlobalInput from "@/components/GlobalInput.vue";
import GlobalDatePicker from "@/components/GlobalDatePicker.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";

const currentStandArea = ref(0);
const startDate = ref("");
const endDate = ref("");
const isToolsShow = ref(false);
const checkList = ref([]);

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
						<div
							class="handle-list"
							v-show="isToolsShow"
						>
							<div class="handle-item">
								<img
									src="../assets/images/icon-delete.png"
									alt=""
								/>
								<span>删除</span>
							</div>
							<div class="handle-item">
								<img
									src="../assets/images/icon-export.png"
									alt=""
								/>
								<span>导出</span>
							</div>
						</div>
					</div>
				</template>
				<template #right>
					<div class="history-right">
						<GlobalLinkageSelect v-model="currentStandArea"></GlobalLinkageSelect>
						<GlobalInput placeholder="确认人员姓名"></GlobalInput>
						<GlobalDatePicker
							v-model="startDate"
							:name="'选择开始日期'"
						></GlobalDatePicker>
						<GlobalDatePicker
							v-model="endDate"
							:name="'选择结束日期'"
						></GlobalDatePicker>
						<SettingButtonBorder> 搜索 </SettingButtonBorder>
						<SettingButtonBorder type="clear"> 清空 </SettingButtonBorder>
					</div>
				</template>
			</SettingTopHandller>
			<div class="main">
				<div class="global-table-wrap">
					<div class="table">
						<div class="tr" id="hhh">
							<div class="td checkbox">
								<img
									src="../assets/images/icon-hook.png"
									alt=""
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
						<div class="tr">
							<div class="td checkbox">
								<img
									src="../assets/images/icon-hook.png"
									alt=""
								/>
							</div>
							<div class="td id">
								<img
									src="../assets/images/icon-camera.png"
									alt=""
									class="camera"
								/>
								<span class="english">1001</span>
							</div>
							<div class="td english">沈阳分输站</div>
							<div class="td english">过滤区</div>
							<div class="td english color">1000ppm.m</div>
							<div class="td color"><span class="english">1</span>级</div>
							<div class="td english date">2014-10-13 13:00:00</div>
							<div class="td">荣阿花</div>
							<div class="td english date">2014-10-13 13:00:00</div>
							<div class="td tips">
								<span>无</span>
								<Transition>
									<div class="tips-more" v-show="false">管道泄漏导致报警浓度达到极限值，已及时采取维修， 目前已恢复。</div>
								</Transition>
							</div>
							<div class="td video">
								<img
									src="../assets/images/icon-video.png"
									alt=""
								/>
							</div>
						</div>
						<div class="tr">
							<div class="td checkbox">
								<img
									src="../assets/images/icon-hook.png"
									alt=""
								/>
							</div>
							<div class="td id">
								<img
									src="../assets/images/icon-camera.png"
									alt=""
									class="camera"
								/>
								<span class="english">1001</span>
							</div>
							<div class="td english">沈阳分输站</div>
							<div class="td english">过滤区</div>
							<div class="td english color">1000ppm.m</div>
							<div class="td color"><span class="english">1</span>级</div>
							<div class="td english date">2014-10-13 13:00:00</div>
							<div class="td">荣阿花</div>
							<div class="td english date">2014-10-13 13:00:00</div>
							<div class="td tips">
								<span>管道泄漏导致报警浓度达到极限值，已及时采取维修，目前已恢复。</span>
								<Transition>
									<div class="tips-more" v-show="false">管道泄漏导致报警浓度达到极限值，已及时采取维修， 目前已恢复。</div>
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
					<GlobalPagination></GlobalPagination>
				</div>
			</div>
		</GlobalContent>
	</HomeGlobalContent>
</template>

<style scoped>
.history-wrap {
	width: 9.84375rem;
	height: 4.28646rem;
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
}

.history-wrap .history-content .history-handle.active .btn img {
	transform: rotate(180deg);
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
}

.history-wrap .history-content .history-handle .handle-list {
	position: absolute;
	top: calc(100% + 10px);
	left: 0;
	width: 88px;
	box-sizing: border-box;
	background: #222;
	border: 1px solid rgba(108, 108, 108, 0.8);
	box-shadow: 0px 3px 12px 0px #000000;
	border-radius: 4px;
}

.history-wrap .history-content .history-handle .handle-list .handle-item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 6px;
	padding: 15px 0;
	padding-left: 14px;
	border-bottom: 1px solid rgba(108, 108, 108, 0.8);
}

.history-wrap .history-content .history-handle .handle-list .handle-item:last-child {
	border-bottom: none;
}

.history-wrap .history-content .history-handle .handle-list .handle-item img {
	display: block;
	width: 17px;
}

.history-wrap .history-content .history-handle .handle-list .handle-item span {
	display: block;
	font-size: 15px;
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
	height: 665px;
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
	width: calc((100% - 230px - 230px - 330px) / 8);
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 30px;
}

.global-table-wrap .table .tr .td.english {
	font-size: 16px;
}

.global-table-wrap .table .tr .td.checkbox {
	width: 16px;
	height: 16px;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.17);
	border: 1px solid #6c6c6c;
	padding: 0;
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
