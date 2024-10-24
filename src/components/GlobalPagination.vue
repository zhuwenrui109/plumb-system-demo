<!-- 分页 -->
<script setup></script>

<template>
	<div class="page-wrap">
		<div class="tips">共10页，每页 8条</div>
		<div class="btn chance">上一页</div>
		<div class="btn active">1</div>
		<div class="btn">2</div>
		<div class="btn">3</div>
		<div class="btn">4</div>
		<div class="btn">5</div>
		<div class="btn chance">下一页</div>
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
  color: rgba(255, 255, 255, .4);
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
  border: 2px solid rgba(221, 221, 221, .17);
  border-radius: 2px;
  cursor: pointer;
}

.page-wrap .btn.active {
  background: rgba(213, 112, 49, .4);
}

.page-wrap .btn.chance {
  width: 64px;
}
</style>
