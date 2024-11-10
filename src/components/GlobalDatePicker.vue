<script setup>
import { ref } from "vue";
import { DatePicker, ConfigProvider } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "dayjs/locale/zh-cn";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs, { Dayjs } from "dayjs";
dayjs.locale("zh-cn");

const props = defineProps({
	name: String,
	startDate: {
		type: Dayjs,
		default: ""
	}
});

const date = defineModel();
const locale = ref(zhCN);

function clearDate() {
	date.value = "";
}

function disabledDate(current) {
	return props.startDate && dayjs(props.startDate, 'YYYY-MM-DD') > current;
}
</script>

<template>
	<div class="global-date-wrap">
		<img src="../assets/images/icon-date.png" alt="" class="icon">
		<config-provider :locale="locale">
			<DatePicker
				v-model:value="date"
				:placeholder="name"
				:disabled-date="disabledDate"
				:allow-clear="false"
				class="global-date"
				inputReadOnly
			></DatePicker>
		</config-provider>
		<Transition name="fade">
			<img src="../assets/images/icon-clear.png" alt="" class="clear" @click="clearDate" v-show="date" />
		</Transition>
	</div>
</template>

<style scoped>
.global-date-wrap {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 164px;
	height: 36px;
	box-sizing: border-box;
	padding: 0;
	padding-left: 10px;
	padding-right: 10px;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
}

.global-date-wrap .ant-picker {
	padding: 0;
	background: none;
	border: none;
}

.global-date-wrap .icon {
	display: block;
	width: 16px;
	margin-right: 8px;
}

.global-date-wrap .clear {
	position: absolute;
	top: 50%;
	right: 10px;
	transform: translateY(-50%);
	display: block;
	width: 16px;
	opacity: .5;
	transition: .3s all linear;
	cursor: pointer;
}

.global-date-wrap .clear:hover {
	opacity: 1;
}
</style>

<style>
/* .ant-picker .ant-picker-input > input {
	font-size: 15px;
	color: #fff;
	border: 0;
	border-radius: 0;
}

.ant-picker .ant-picker-input > input::placeholder {
	color: rgba(255, 255, 255, 0.4);
} */
</style>
