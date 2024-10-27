<script setup>
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import GlobalLinkageSelect from "@/components/GlobalLinkageSelect.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
import { computed, ref } from "vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import { useRoute, useRouter } from "vue-router";
import GlobalSelect from "@/components/GlobalSelect.vue";
import GlobalDatePicker from "@/components/GlobalDatePicker.vue";
import GlobalInput from "@/components/GlobalInput.vue";

const route = useRoute();
const router = useRouter();

const username = ref("");
const startDate = ref("");
const endDate = ref("");
const currentState = ref(0);
const currentStand = ref(0);
const currentStandArea = ref({});
const stateList = ref([
	{
		title: "选择状态",
		disabled: true,
		value: 0
	},
	{
		title: "已连接",
		value: 1
	},
	{
		title: "已断开",
		value: 2
	}
]);
const standList = ref([
	{
		value: 0,
		title: "沈阳分输站"
	},
	{
		value: 1,
		title: "大连分输站"
	}
]);
const navList = ref([
	{
		title: "设备管理",
		name: "setting",
		icon: "icon-left-nav-manage.png"
	},
	{
		title: "设备连接",
		name: "connect",
		icon: "icon-left-nav-connect.png"
	},
	{
		title: "场站管理",
		name: "stand",
		icon: "icon-left-nav-stand.png"
	},
	{
		title: "账号管理",
		name: "user",
		icon: "icon-left-nav-user.png"
	},
	{
		title: "系统设置",
		name: "system",
		icon: "icon-left-nav-system.png"
	}
]);

const currentPath = computed(() => route.path.slice(route.path.lastIndexOf("/")));

function getImgUrl(title) {
	return new URL(`../assets/images/${title}`, import.meta.url).href;
}
</script>

<template>
	<div class="setting-wrap">
		<HomeGlobalContent class="setting-content">
			<GlobalContent class="setting-border">
				<SettingTopHandller :title="route.meta.title">
					<template #right>
						<div class="setting-right">
							<GlobalLinkageSelect
								v-model="currentStandArea"
								v-if="currentPath.includes('setting') || currentPath.includes('connect')"
							></GlobalLinkageSelect>
							<GlobalSelect
								v-model="currentState"
								:list="stateList"
								v-if="currentPath.includes('connect')"
							></GlobalSelect>
							<GlobalDatePicker
								v-model="startDate"
								:name="'选择开始日期'"
								v-if="currentPath.includes('connect')"
							></GlobalDatePicker>
							<GlobalDatePicker
								v-model="endDate"
								:name="'选择结束日期'"
								v-if="currentPath.includes('connect')"
							></GlobalDatePicker>
							<GlobalSelect
								:list="standList"
								v-model="currentStand"
								v-if="currentPath.includes('stand')"
							></GlobalSelect>
							<GlobalInput
								v-model="username"
								placeholder="登录账号/姓名"
								v-if="currentPath.includes('user')"
							></GlobalInput>
							<SettingButtonBorder v-if="!currentPath.includes('system')"> 搜索 </SettingButtonBorder>
							<SettingButtonBorder v-if="!currentPath.includes('system')" type="clear"> 清空 </SettingButtonBorder>
							<SettingButtonBorder
								class="setting-btn"
								v-if="currentPath.includes('setting')"
							>
								<div class="add-btn">
									<img
										src="../assets/images/icon-add.png"
										alt=""
										class="icon"
									/>
									<span>添加设备</span>
								</div>
							</SettingButtonBorder>
							<SettingButtonBorder
								class="setting-btn"
								v-if="currentPath.includes('stand')"
							>
								<div class="add-btn">
									<img
										src="../assets/images/icon-add.png"
										alt=""
										class="icon"
									/>
									<span>添加场站</span>
								</div>
							</SettingButtonBorder>
							<SettingButtonBorder
								class="setting-btn"
								v-if="currentPath.includes('user')"
							>
								<div class="add-btn">
									<img
										src="../assets/images/icon-add.png"
										alt=""
										class="icon"
									/>
									<span>添加账号</span>
								</div>
							</SettingButtonBorder>
						</div>
					</template>
				</SettingTopHandller>
				<div class="setting-main">
					<div class="left-nav-list">
						<div
							class="left-nav-item"
							v-for="(item, index) in navList"
							:key="index"
							@mousedown="router.push({ name: item.name })"
						>
							<div
								class="left-nav"
								:class="{ active: currentPath.includes(item.name) }"
							>
								<div>
									<img
										:src="getImgUrl(item.icon)"
										alt=""
									/>
								</div>
							</div>
							<div class="left-nav-title">
								{{ item.title }}
							</div>
						</div>
					</div>
					<div class="right">
						<router-view></router-view>
					</div>
				</div>
			</GlobalContent>
		</HomeGlobalContent>
	</div>
</template>

<style>
.setting-wrap {
	width: 1890px;
	height: 823px;
	margin: 0 auto;
	box-sizing: border-box;
}

.setting-wrap .setting-content {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin: 0;
	padding: 12px 0;
}

.setting-wrap .setting-content .setting-border {
	width: 1862px;
	height: 792px;
}

.setting-wrap .setting-content .setting-border .setting-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	column-gap: 8px;
}

.setting-wrap .setting-content .setting-border .setting-right .setting-btn .add-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 12px;
}

.setting-wrap .setting-content .setting-border .setting-right .setting-btn .add-btn img {
	display: block;
	width: 12px;
}

.setting-wrap .setting-content .setting-border .setting-right .setting-btn .add-btn span {
	display: block;
	font-size: 15px;
}

.setting-wrap .setting-main {
	display: flex;
	justify-content: flex-start;
	padding: 13px 16px 0;
	column-gap: 10px;
}

.setting-wrap .setting-main .left-nav-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 124px;
	height: 715px;
	box-sizing: border-box;
	background: rgba(39, 39, 38, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	box-shadow: inset 0 0 30px 15px #212121;
	border-radius: 2px;
	flex-shrink: 0;
}

.setting-wrap .setting-main .left-nav-list .left-nav-item {
	cursor: pointer;
	margin-bottom: 52px;
}

.setting-wrap .setting-main .left-nav-list .left-nav-item:last-child {
	margin-bottom: 0;
}

.setting-wrap .setting-main .left-nav-list .left-nav-item .left-nav {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 58px;
	height: 58px;
	margin: 0 auto 13px;
	box-sizing: border-box;
	border-radius: 50%;
	border: 1px solid rgba(255, 255, 255, 0.22);
	box-shadow: inset 0 0 9px 3px rgba(255, 255, 255, 0.09);
}

.setting-wrap .setting-main .left-nav-list .left-nav-item .left-nav div {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 38px;
	height: 38px;
	box-sizing: border-box;
	border-radius: 50%;
	border: 1px solid rgba(255, 255, 255, 0.4);
	box-shadow: inset 0 0 9px 3px rgba(255, 255, 255, 0.32);
}

.setting-wrap .setting-main .left-nav-list .left-nav-item .left-nav.active div {
	box-shadow: inset 0 0 9px 3px rgba(228, 132, 55, 0.78);
	border-color: rgba(255, 185, 57, 0.6);
	transition: .2s all ease-in;
}

.setting-wrap .setting-main .left-nav-list .left-nav-item .left-nav div img {
	display: block;
	width: 18px;
}

.setting-wrap .setting-main .left-nav-list .left-nav-item .left-nav-title {
	font-size: 16px;
	text-align: center;
}

.setting-wrap .setting-main .right {
	flex: 1;
}
</style>
