<script setup>
import HomeGlobalContent from "@/components/HomeGlobalContent.vue";
import GlobalContent from "@/components/GlobalContent.vue";
import GlobalLinkageSelect from "@/components/GlobalLinkageSelect.vue";
import SettingTopHandller from "@/components/SettingTopHandller.vue";
import { computed, nextTick, ref } from "vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import { useRoute, useRouter } from "vue-router";
import GlobalDatePicker from "@/components/GlobalDatePicker.vue";
import GlobalInput from "@/components/GlobalInput.vue";
import { useStore } from "vuex";
import dialogPlguin from "@/utils/dialog";
import { clearToken } from "@/utils/tool";

const route = useRoute();
const router = useRouter();
const store = useStore();

const routerViewRef = ref(null);
const username = ref("");
const startDate = ref("");
const endDate = ref("");
const currentState = ref("");
const standKeyword = ref("");
const standId = ref("");
const areaId = ref("");
const stateList = ref([
	{
		name: "选择状态",
		value: ""
	},
	{
		name: "已连接",
		value: "1"
	},
	{
		name: "已断开",
		value: "0"
	}
]);
const navList = ref([
	{
		title: "设备管理",
		name: "setting",
		icon: "icon-left-nav-manage.png"
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
	},
	{
		title: "退出登录",
		name: "logout",
		icon: "icon-left-nav-logout.png"
	}
]);

const standList = computed(() => {
	const arr = [
		{
			name: "选择站点",
			station_id: ""
		}
	];

	return [...arr, ...store.state.standList];
});
const currentPath = computed(() => {
	username.value = "";
	startDate.value = "";
	endDate.value = "";
	currentState.value = "";
	standKeyword.value = "";
	standId.value = "";
	areaId.value = "";
	return route.path.slice(route.path.lastIndexOf("/"));
});

function search() {
	routerViewRef.value.page = 1;
	routerViewRef.value.search();
}

async function clearForm() {
	username.value = "";
	startDate.value = "";
	endDate.value = "";
	currentState.value = "";
	standKeyword.value = "";
	standId.value = "";
	areaId.value = "";
	await nextTick();
	search();
}

function changeRouter(name) {
	if (name == "logout") {
		handleLogout();
		return;
	}
	router.push({ name });
}

function handleLogout() {
	WebVideoCtrl.I_DestroyPlugin();
	dialogPlguin({
		message: "是否确认退出登录"
	}).then(
		() => {
			clearToken();
			localStorage.getItem("autoToken") && localStorage.removeItem("autoToken");
			setTimeout(() => {
				router.push({
					name: "login"
				});
			}, 400);
		},
		() => {
			isHome.value && store.state.pluginDom();
		}
	);
}

function showToast() {
	routerViewRef.value.isPopShow = true;
}

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
								v-model:standId="standId"
								v-model:areaId="areaId"
								v-if="currentPath.includes('setting') || currentPath.includes('connect')"
							></GlobalLinkageSelect>
							<!-- <GlobalSelect
								v-model="currentState"
								:list="stateList"
								name="name"
								v-if="currentPath.includes('connect')"
							></GlobalSelect> -->
							<GlobalDatePicker
								v-model="startDate"
								:name="'选择开始日期'"
								v-if="currentPath.includes('connect')"
							></GlobalDatePicker>
							<GlobalDatePicker
								v-model="endDate"
								:name="'选择结束日期'"
								:start-date="startDate"
								v-if="currentPath.includes('connect')"
							></GlobalDatePicker>
							<GlobalInput
								v-model="standKeyword"
								placeholder="输入站点"
								v-if="currentPath.includes('stand')"
							></GlobalInput>
							<GlobalInput
								v-model="username"
								placeholder="登录账号/姓名"
								v-if="currentPath.includes('user')"
							></GlobalInput>
							<SettingButtonBorder
								v-if="!currentPath.includes('system')"
								@click="search"
							>
								搜索
							</SettingButtonBorder>
							<SettingButtonBorder
								v-if="!currentPath.includes('system')"
								type="clear"
								@click="clearForm"
							>
								清空
							</SettingButtonBorder>
							<SettingButtonBorder
								class="setting-btn"
								v-if="currentPath.includes('setting')"
								@click="showToast"
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
								@click="routerViewRef.showStandPop()"
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
								@click="showToast"
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
							@click="changeRouter(item.name)"
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
						<router-view v-slot="{ Component }">
							<component
								ref="routerViewRef"
								:is="Component"
								:username="username"
								:startDate="startDate"
								:endDate="endDate"
								:currentState="currentState"
								:standKeyword="standKeyword"
								:standId="standId"
								:areaId="areaId"
							>
							</component>
						</router-view>
					</div>
				</div>
			</GlobalContent>
		</HomeGlobalContent>
	</div>
</template>

<style scoped>
.setting-wrap {
	width: 1890px;
	height: 100%;
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
	height: 100%;
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
	height: 690px;
	box-sizing: border-box;
	background: rgba(39, 39, 38, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	box-shadow: inset 0 0 30px 15px #212121;
	border-radius: 2px;
	flex-shrink: 0;
}

.setting-wrap .setting-main .left-nav-list .left-nav-item {
	cursor: pointer;
	margin-bottom: 45px;
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
	transition: 0.2s all ease-in;
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
