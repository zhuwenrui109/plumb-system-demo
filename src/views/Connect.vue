<script setup>
import GlobalPagination from "@/components/GlobalPagination.vue";

</script>

<template>
	<div class="global-table-wrap">
		<div class="table">
			<div class="tr">
				<div class="td id">设备ID</div>
				<div class="td">传感器设备地址</div>
				<div class="td">视频设备地址</div>
				<div class="td">所属场站</div>
				<div class="td">所属工艺区</div>
				<div class="td connect">连接</div>
				<div class="td date">时间</div>
			</div>
			<div class="tr">
				<div class="td id">
					<img
						src="../assets/images/icon-camera.png"
						alt=""
						class="user"
					/>
					<span class="english">1001</span>
				</div>
				<div class="td english">192.168.10.100 : 8090</div>
				<div class="td english">192.168.10.100 : 8090</div>
				<div class="td">沈阳分输站</div>
				<div class="td">过滤区</div>
				<div class="td connect success">
					<span class="dir"></span>
					<img
						src="../assets/images/icon-unconnect.png"
						alt=""
						style="display: none"
					/>
					<span>已连接</span>
				</div>
				<div class="td date english">
					2024/09/25 10:00:15
				</div>
			</div>
		</div>
		<GlobalPagination></GlobalPagination>
	</div>
</template>

<style scoped>
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
	width: 148px;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 1;
	padding-left: 40px;
	text-wrap: nowrap;
}

.global-table-wrap .table .tr .td.english {
	font-size: 16px;
}

.global-table-wrap .table .tr .td:nth-child(2) {
	width: 257px;
}

.global-table-wrap .table .tr .td:nth-child(3) {
	width: 257px;
}

.global-table-wrap .table .tr .td .user {
	display: block;
	width: 20px;
	margin-right: 16px;
}

.global-table-wrap .table .tr .td.id {
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.global-table-wrap .table .tr .td.connect {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 250px;
	padding-left: 100px;
	column-gap: 10px;
}

.global-table-wrap .table .tr .td.connect.success {
	color: #15c675;
}

.global-table-wrap .table .tr .td.connect.fail {
	color: #f85827;
}

.global-table-wrap .table .tr .td.connect span {
	display: block;
}

.global-table-wrap .table .tr .td.connect .dir {
	width: 8px;
	height: 8px;
	background: #15c675;
	border-radius: 50%;
}

.global-table-wrap .table .tr .td.connect img {
	display: block;
	width: 14px;
}

.global-table-wrap .table .tr .th.handle,
.global-table-wrap .table .tr .td.handle {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 0;
}

.global-table-wrap .table .tr .td .handle-icon {
	display: block;
	width: 17px;
	margin-right: 14px;
	cursor: pointer;
}

.global-table-wrap .table .tr .td .handle-icon:last-child {
	margin-right: 0;
}

.global-table-wrap .table .tr .td.alarm {
	color: #ecc69d;
}

.global-table-wrap .table .tr .td.date {
	padding-left: 85px;
}
</style>
