<script setup>
import { ref } from "vue";
import { DatePicker, ConfigProvider } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "dayjs/locale/zh-cn";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
dayjs.locale("zh-cn");

const props = defineProps({
	name: String
});

const date = defineModel();
const locale = ref(zhCN);
</script>

<template>
	<div class="global-date-wrap">
		<config-provider :locale="locale">
			<DatePicker
				v-model:value="date"
				format="YYYY.MM.DD"
				:placeholder="name"
				class="global-date"
			>
				<template #suffixIcon>
					<img
						src="../assets/images/icon-date.png"
						alt=""
						class="icon"
					/>
				</template>
			</DatePicker>
		</config-provider>
	</div>
</template>

<style scoped>
.global-date-wrap .ant-picker {
	width: 164px;
	height: 36px;
	box-sizing: border-box;
	padding: 0;
	padding-left: 20px;
	padding-right: 10px;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
}

.global-date-wrap .icon {
	display: block;
	width: 16px;
}
</style>

<style>
.ant-picker .ant-picker-input > input {
	font-size: 15px;
	color: #fff;
  border: 0;
  border-radius: 0;
}

.ant-picker .ant-picker-input > input::placeholder {
	color: rgba(255, 255, 255, 0.4);
}
</style>
