<script setup>
import toastPlguin from "@/utils/toast";
import { computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const tabList = reactive([
	{
		name: "实时监测",
		routerName: "home"
	},
	{
		name: "历史报警",
		routerName: "alarm"
	},
	{
		name: "历史数据",
		routerName: "fault"
	},
	{
		name: "系统管理",
		routerName: "setting"
	}
]);

const currentRouter = computed(() => {
	return router.currentRoute.value.fullPath;
});

const userRole = computed(() => {
	return store.state.user.role;
});

function goList(name) {
	router.push({ name });
}
</script>

<template>
	<!-- tab切换 -->
	<div class="tab-wrap">
		<div class="tab-content">
			<div
				class="tab-item"
				:class="{ active: currentRouter.includes(item.routerName), disabled: item.routerName == 'setting' && userRole == 2 }"
				v-for="(item, index) in tabList"
				:key="index"
				@click="goList(item.routerName)"
			>
				{{ item.name }}
			</div>
		</div>
		<img
			src="../assets/images/tab-bg.png"
			class="bg"
		/>
	</div>
</template>

<style scoped>
.tab-wrap {
	position: relative;
	width: 712px;
	height: 40px;
	margin: 16px auto 0;
}

.tab-wrap .tab-content {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 0 88px;
	overflow: hidden;
}

.tab-wrap .tab-content .tab-item {
	position: relative;
	font-size: 14px;
	color: #fff;
	opacity: 0.5;
	cursor: pointer;
	transition: 0.2s all linear;
}

.tab-wrap .tab-content .tab-item.disabled {
	cursor: none;
	opacity: .2;
}

.tab-wrap .tab-content .tab-item.disabled:hover {
	opacity: .2;
}

.tab-wrap .tab-content .tab-item:hover {
	opacity: 1;
}

.tab-wrap .tab-content .tab-item::after {
	position: absolute;
	content: "";
	left: 50%;
	bottom: -11px;
	transform: translateX(-50%);
	width: 110px;
	height: 24px;
	background: url("../assets/images/tab-active.png") no-repeat;
	background-size: 100% 100%;
	opacity: 0;
	transition: 0.2s all linear;
}

.tab-wrap .tab-content .tab-item.active::after {
	opacity: 1;
}

.tab-wrap .tab-content .tab-item.active {
	font-weight: bold;
	opacity: 1;
}

.tab-wrap .bg {
	display: block;
	width: 100%;
}

@media screen and (max-height: 920px) {

	.tab-wrap {
		width: auto;
		height: 35px;
		margin-top: 12px;
	}

	.tab-wrap .bg {
		width: auto;
		height: 100%;
	}
	
}
</style>
