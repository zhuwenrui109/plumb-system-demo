<!-- 分页 -->
<script setup>
import { computed } from "vue";

const props = defineProps({
	pageSize: {
		type: [String, Number],
		default: 10
	},
	total: {
		type: [String, Number],
		default: 1
	},
});
const emit = defineEmits(["change-page"])
const currentPage = defineModel();
const pageTotal = computed(() => Math.ceil(props.total / props.pageSize))

const list = computed(() => {
	const result = [];
	// 总页码小于等于5；大于5
	if (pageTotal.value <= 5) {
		// 总页码小于等于5的情况
		for (let i = 1; i <= pageTotal.value; i++) {
			result.push(i);
		}
	} else {
		// 总页码大于5
		if (currentPage.value <= 2) {
			// 左侧临界值
			for (let i = 1; i <= 5; i++) {
				result.push(i);
			}
		} else if (currentPage.value >= pageTotal.value - 1) {
			// 右侧临界值
			for (let i = pageTotal.value - 4; i <= pageTotal.value; i++) {
				result.push(i);
			}
		} else {
			// 中间的状态
			for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
				result.push(i);
			}
		}
	}
	return result;
});

const changePage = type => {
	if (type === false) {
		// 上一页
		// 页面是第一页时，禁止点击操作
		if (currentPage.value === 1) return;
		if (currentPage.value > 1) {
			currentPage.value -= 1;
		}
	} else if (type === true) {
		// 下一页
		// 页面是最后页时，禁止点击操作
		if (currentPage.value === pageTotal.value) return;
		if (currentPage.value < pageTotal.value) {
			currentPage.value += 1;
		}
	} else {
		// 点击页码
		currentPage.value = type;
	}
	emit('change-page');
};
</script>

<template>
	<div class="page-wrap">
		<div class="tips">共{{ pageTotal }}页，每页{{ pageSize }}条</div>
		<div class="btn chance" @click="changePage(false)">上一页</div>
		<div class="btn" :class="{ active: currentPage == item }" v-for="item in list" :key="item" @click="changePage(item)">{{ item }}</div>
		<div class="btn chance" @click="changePage(true)">下一页</div>
	</div>
</template>

<style scoped>
.page-wrap {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 12px;
	width: 100%;
}

.page-wrap .tips {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.4);
	align-self: center;
}

.page-wrap .btn {
	width: 32px;
	height: 32px;
	font-size: 15px;
	line-height: 28px;
	text-align: center;
	box-sizing: border-box;
	background: rgba(38, 38, 38, 1);
	border: 2px solid rgba(221, 221, 221, 0.17);
	border-radius: 2px;
	cursor: pointer;
}

.page-wrap .btn.active {
	background: rgba(213, 112, 49, 0.4);
}

.page-wrap .btn.chance {
	width: 64px;
}
</style>
