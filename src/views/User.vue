<script setup>
import { defineAsyncComponent, onMounted, ref, watch } from "vue";
import GlobalSwitch from "@/components/GlobalSwitch.vue";
import GlobalPagination from "@/components/GlobalPagination.vue";
import { API_USER } from "@/api";
import GlobalInput from "@/components/GlobalInput.vue";
import GlobalSelect from "@/components/GlobalSelect.vue";
import SettingButtonBorder from "@/components/SettingButtonBorder.vue";
import toastPlguin from "@/utils/toast";
import dialogPlguin from "@/utils/dialog";

const FormPop = defineAsyncComponent(() => import("@/components/FormPop.vue"));

const props = defineProps({
	username: String
});

const dataList = ref([]);
const roleList = ref([
	{
		name: "请选择",
		value: ""
	},
	{
		name: "管理员",
		value: "1"
	},
	{
		name: "操作工",
		value: "2"
	}
]);
const isPopShow = ref(false);
const page = ref(1);
const pageConfig = ref({
	total: 1,
	pageSize: 8
});
const formName = ref("新增账号");
const form = ref({
	id: "",
	account: "",
	password: "",
	checkpassword: "",
	name: "",
	role: "",
	status: "1"
});

onMounted(() => {
	loadData();
});

defineExpose({
	isPopShow,
	search
});

watch(isPopShow, newVal => {
	if (!newVal) {
		setTimeout(() => {
			form.value = {
				id: "",
				account: "",
				password: "",
				checkpassword: "",
				name: "",
				role: "",
				status: "1"
			};
			formName.value = "新增账号";
		}, 300);
	}
});

async function loadData() {
	const res = await API_USER.getList({
		page: page.value,
		keyword: props.username
	});
	if (!res.data.data.length) {
		toastPlguin("暂无内容...");
		dataList.value = new Array();
		return;
	}
	dataList.value = res.data.data;
	pageConfig.value.total = res.data.total;
	pageConfig.value.pageSize = res.data.per_page;
}

async function search() {
	const res = await API_USER.getList({
		page: page.value,
		keyword: props.username
	});
	if (!res.data.data.length) {
		toastPlguin("暂无内容...");
		return;
	}
	dataList.value = res.data.data;
	pageConfig.value.total = res.data.total;
	pageConfig.value.pageSize = res.data.per_page;
}

async function handleEdit(id) {
	formName.value = "编辑账号";
	const res = await API_USER.getDetail(id);
	console.log("res :>> ", res);
	form.value = { ...res.data };
	isPopShow.value = true;
}

function handleDelete(id) {
	dialogPlguin({
		message: "是否确认删除所选内容"
	}).then(async () => {
		const res = await API_USER.deleteUser(id);
		if (res.code == 200) {
			loadData();
			toastPlguin("删除成功");
		} else {
			toastPlguin("删除失败");
		}
	});
}

async function toggleStatus(index) {
	const { id } = dataList.value[index];
	dataList.value[index].status = dataList.value[index].status == "1" ? "0" : "1";
	const res = await API_USER.addUser({
		id,
		status: dataList.value[index].status
	});
	console.log("res :>> ", res);
	if (res.code != 200) {
		dataList.value[index].status = dataList.value[index].status == "1" ? "0" : "1";
	}
}

async function handleSubmit() {
	const data = { ...form.value };
	const text = data.id ? "修改" : "添加";
	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			const item = data[key];
			if (key != "id" && item === "") {
				toastPlguin("请填写账号完整信息");
				return;
			}
		}
	}
	if (form.value.password != form.value.checkpassword) {
		toastPlguin("两次密码不一致");
		return;
	}
	delete data.checkpassword;
	if (!data.password) {
		delete data.password;
	}
	const res = await API_USER.addUser(data);
	console.log("res :>> ", res);
	if (res.code == 200) {
		isPopShow.value = false;
		toastPlguin(text + "成功");
		loadData();
	} else {
		toastPlguin(res.msg);
	}
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
			<div
				class="tr"
				v-for="(item, index) in dataList"
				:key="item.id"
			>
				<div class="td id">
					<img
						src="../assets/images/icon-user.png"
						alt=""
						class="user"
					/>
					<span class="english">{{ pageConfig.pageSize * (page - 1) + index + 1 }}</span>
				</div>
				<div class="td english">{{ item.account }}</div>
				<div class="td">{{ item.name }}</div>
				<div class="td">{{ item.role == 1 ? "管理员" : "操作工" }}</div>
				<div class="td english date">{{ item.created_at }}</div>
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
						@click="handleEdit(item.id)"
					/>
					<img
						src="../assets/images/icon-delete.png"
						alt=""
						class="handle-icon"
						@click="handleDelete(item.id)"
					/>
				</div>
			</div>
		</div>
		<GlobalPagination
			v-model="page"
			:page-size="pageConfig.pageSize"
			:total="pageConfig.total"
			@change-page="loadData"
		></GlobalPagination>
		<FormPop
			:name="formName"
			v-model="isPopShow"
		>
			<div class="form-wrap">
				<div class="form-item">
					<div class="name">登录账号</div>
					<GlobalInput
						class="input-wrap"
						v-model="form.account"
						placeholder="请输入"
					></GlobalInput>
				</div>
				<div class="form-item">
					<div class="name">姓名</div>
					<GlobalInput
						class="input-wrap"
						v-model="form.name"
						placeholder="请输入"
					></GlobalInput>
				</div>
				<div class="form-item">
					<div class="name">密码</div>
					<GlobalInput
						class="input-wrap"
						v-model="form.password"
						placeholder="请输入"
						mode="password"
					></GlobalInput>
				</div>
				<div class="form-item">
					<div class="name">确认密码</div>
					<GlobalInput
						class="input-wrap"
						v-model="form.checkpassword"
						placeholder="请输入"
						mode="password"
					></GlobalInput>
				</div>
				<div class="form-item chance">
					<div class="name">角色</div>
					<GlobalSelect
						v-model="form.role"
						:list="roleList"
						id="value"
						name="name"
					></GlobalSelect>
				</div>
				<div class="form-item chance switch">
					<div class="name">是否启用该角色:</div>
					<GlobalSwitch
						v-model="form.status"
						@click="form.status = form.status == '1' ? '0' : '1'"
					></GlobalSwitch>
				</div>
				<div class="form-item chance">
					<SettingButtonBorder
						class="btn"
						@click="handleSubmit"
					>
						确认提交
					</SettingButtonBorder>
				</div>
			</div>
		</FormPop>
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
	overflow: hidden;
	text-overflow: ellipsis;
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

.form-wrap {
	display: flex;
	align-items: center;
	align-content: flex-start;
	justify-content: space-between;
	flex-wrap: wrap;
	row-gap: 24px;
	padding: 23px 38px 44px;
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

.form-wrap .select-wrap {
	width: 100%;
	justify-content: space-between;
	gap: 0;
}

.form-wrap .btn {
	width: 208px;
	margin: 0 auto;
	text-align: center;
}
</style>
