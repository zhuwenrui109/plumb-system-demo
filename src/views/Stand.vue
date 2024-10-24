<script setup>
import GlobalPagination from "@/components/GlobalPagination.vue";
import GlobalSwitch from "@/components/GlobalSwitch.vue";
import { ref } from "vue";

const state = ref("0");
</script>

<template>
	<div class="stand-wrap">
		<div class="table">
			<div class="tr">
				<div class="td id">
          <div class="td-item">
            序号
          </div>
        </div>
				<div class="td stand">
          <div class="td-item">
            场站及工艺区
          </div>
        </div>
				<div class="td state">
          <div class="td-item">
            状态
          </div>
        </div>
				<div class="td sorting">
          <div class="td-item">
            场站排序
          </div>
        </div>
				<div class="td handle">
          <div class="td-item">
            操作
          </div>
        </div>
			</div>
			<div class="tr">
				<div class="td id">
					<div class="td-item">
						<img
							src="../assets/images/icon-address.png"
							alt=""
							class="address"
						/>
						<span class="english">1</span>
					</div>
				</div>
				<div class="td stand">
					<div class="td-item">
						<img
							src="../assets/images/icon-setting-arr.png"
							alt=""
							class="arr"
						/>
						<span>沈阳分输站</span>
					</div>
					<div class="td-list" v-show="true">
						<div class="td-item">
							<div class="num english">1</div>
							<div class="txt english">过滤区</div>
							<div class="btn-list">
								<GlobalSwitch></GlobalSwitch>
								<img
									src="../assets/images/icon-sorting.png"
									alt=""
									class="sorting"
								/>
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
						<div class="td-item">
							<div class="num english">2</div>
							<div class="txt english">过滤区</div>
							<div class="btn-list">
								<GlobalSwitch></GlobalSwitch>
								<img
									src="../assets/images/icon-sorting.png"
									alt=""
									class="sorting"
								/>
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
				</div>
				<div class="td state">
					<div class="td-item">
						<GlobalSwitch v-model="state"></GlobalSwitch>
					</div>
				</div>
				<div class="td sorting">
					<div class="td-item">
						<img
							src="../assets/images/icon-sorting.png"
							alt=""
							class="sorting"
						/>
					</div>
				</div>
				<div class="td handle">
					<div class="td-item">
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
            <div class="add-btn">
              <img src="../assets/images/icon-setting-add.png" alt="" class="add-icon">
              <span>添加工艺区</span>
            </div>
					</div>
				</div>
			</div>
		</div>
		<GlobalPagination></GlobalPagination>
	</div>
</template>

<style scoped>
.stand-wrap {
	width: 100%;
}

.stand-wrap .table {
	width: 100%;
	height: 665px;
	margin-bottom: 10px;
}

.stand-wrap .table .tr {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	box-sizing: border-box;
	background: rgba(39, 39, 39, 0.26);
	border: 2px solid rgba(221, 221, 221, 0.17);
	margin-bottom: 4px;
	border-radius: 2px;
}

.stand-wrap .table .tr:first-child {
	box-shadow: inset 0 0 25px 0 rgba(74, 35, 19, 1);
	border: 2px solid rgba(221, 221, 221, 0.23);
}

.stand-wrap .table .tr .td {
	width: 10%;
	height: 40px;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 40px;
	text-wrap: nowrap;
}

.stand-wrap .table .tr:first-child .td .td-item {
	border: none;
}

.stand-wrap .table .tr:first-child .td.stand .td-item {
	border: none;
}

.stand-wrap .table .tr .td:last-child .td-item {
	border-right: none;
}

.stand-wrap .table .tr .td:first-child .td-item {
  border-right: none;
}

.stand-wrap .table .tr .td.stand {
	display: block;
	width: 950px;
	height: auto;
}

.stand-wrap .table .tr .td.stand .td-item {
  height: 39px;
	padding-left: 28px;
  border-left: 1px solid rgba(188, 188, 188, 0.2);
  border-bottom: none;
}

.stand-wrap .table .tr .td.stand .arr {
	display: block;
	width: 21px;
	margin-right: 10px;
}

.stand-wrap .table .tr .td.state {
	width: 183px;
}

.stand-wrap .table .tr .td.sorting {
	width: 146px;
}

.stand-wrap .table .tr .td.sorting .td-item {
	padding-left: 13px;
}

.stand-wrap .table .tr .td.handle {
	width: 146px;
}

.stand-wrap .table .tr .td.handle .td-item {
	padding-left: 13px;
}

.stand-wrap .table .tr .td.english {
	font-size: 16px;
}

.stand-wrap .table .tr .td .address {
	display: block;
	width: 16px;
	margin-right: 8px;
}

.stand-wrap .table .tr .td .sorting {
	display: block;
	width: 13px;
  cursor: pointer;
}

.stand-wrap .table .tr .td.handle {
	width: 250px;
}

.stand-wrap .table .tr .td.handle .td-item {
	padding-left: 34px;
}

.stand-wrap .table .tr .td .handle-icon {
	display: block;
	width: 17px;
	margin-right: 14px;
	cursor: pointer;
}

.stand-wrap .table .tr .td .handle-icon:last-child {
	margin-right: 0;
}

.stand-wrap .table .tr .td .td-item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 40px;
	box-sizing: border-box;
	border-right: 1px solid rgba(188, 188, 188, 0.2);
	border-bottom: 1px solid rgba(188, 188, 188, 0.2);
	padding-left: 40px;
}

.stand-wrap .table .tr .td .td-list .td-item {
  padding-left: 63px;
  padding-right: 14px;
  border-top: 1px solid rgba(188, 188, 188, 0.2);
  border-left: 1px solid rgba(188, 188, 188, 0.2);
}

.stand-wrap .table .tr .td .td-list .td-item .num {
  font-size: 16px;
  margin-right: 20px;
}

.stand-wrap .table .tr .td .td-list .td-item .txt {
  font-size: 15px;
  margin-right: auto;
}

.stand-wrap .table .tr .td .td-list .td-item .btn-list {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 22px;
}

.stand-wrap .table .tr .td .td-list .td-item .btn-list .handle-icon {
  margin-right: 0;
}

.stand-wrap .table .tr .td .add-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  column-gap: 8px;
  cursor: pointer;
}

.stand-wrap .table .tr .td .add-btn .add-icon {
  display: block;
  width: 20px;
}

.stand-wrap .table .tr .td .add-btn span {
  display: block;
  font-size: 15px;
  color: rgba(255, 255, 255, .4);
}
</style>
