<script setup>
import { onMounted, ref } from "vue";
import GlobalSwitch from '@/components/GlobalSwitch.vue';
import GlobalPagination from '@/components/GlobalPagination.vue';
import { API_USER } from "@/api";

const props = defineProps({
	username: String
})

const state = ref(0);
const page = ref(1);
const dataList = ref([]);

onMounted(() => {
	loadData();
})

defineExpose({
	loadData
})

async function loadData() {
	const res = await API_USER.getList({
		page: page.value,
		keyword: props.username
	});
	console.log('res :>> ', res);
	dataList.value = res.data.data;
}
</script>

<template>
	<div class="user-wrap">
		<div class="table">
			<div class="tr">
				<div class="td id">序号</div>
				<div class="td">登录账号</div>
				<div class="td">姓名</div>
				<div class="td">角色</div>
				<div class="td date">创建时间</div>
				<div class="td">状态</div>
				<div class="td handle">操作</div>
			</div>
			<div class="tr" v-for="item in dataList">
				<div class="td id">
					<img
						src="../assets/images/icon-user.png"
						alt=""
						class="user"
					/>
					<span class="english">{{ item.id }}</span>
				</div>
				<div class="td english">{{ item.account }}</div>
				<div class="td">{{ item.name }}</div>
				<div class="td">{{ item.role == 1 ? "管理员账号" : "普通账号" }}</div>
				<div class="td english date">{{ item.created_at }}</div>
				<div class="td state">
					<GlobalSwitch v-model="item.status"></GlobalSwitch>
				</div>
				<div class="td handle">
					<img
						src="../assets/images/icon-edit.png"
						alt=""
						class="handle-icon"
					/>
					<img
						src="../assets/images/icon-delete.png"
						alt=""
						class="handle-icon"
					/>
				</div>
			</div>
		</div>
		<GlobalPagination></GlobalPagination>
	</div>
</template>

<style scoped>
.user-wrap {
	width: 100%;
}

.user-wrap .table {
	width: 100%;
	height: 650px;
	margin-bottom: 10px;
}

.user-wrap .table .tr {
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

.user-wrap .table .tr:first-child {
	box-shadow: inset 0 0 25px 0 rgba(74, 35, 19, 1);
	border: 2px solid rgba(221, 221, 221, 0.23);
}

.user-wrap .table .tr .td {
	/* width: calc((100% - 382px) / 7); */
  width: calc(100% / 7);
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 40px;
	text-wrap: nowrap;
}

.user-wrap .table .tr .td.english {
  font-size: 16px;
}

.user-wrap .table .tr .td .user {
	display: block;
	width: 17px;
	margin-right: 10px;
}

.user-wrap .table .tr .td.id {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.user-wrap .table .tr .td.date {
  width: 382px;
  padding-left: 118px;
}

.user-wrap .table .tr .td.handle {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding-left: 0;
}

.user-wrap .table .tr .td .handle-icon {
	display: block;
	width: 17px;
	margin-right: 14px;
	cursor: pointer;
}

.user-wrap .table .tr .td .handle-icon:last-child {
	margin-right: 0;
}
</style>
