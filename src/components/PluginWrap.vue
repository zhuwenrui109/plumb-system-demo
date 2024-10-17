<script setup>

</script>

<template>
  <div class="plugin-wrap">
    <div class="plugin-refresh">
      <img src="../assets/images/icon-refresh.png" alt="">
      <span>刷新</span>
    </div>
    <div class="arr-wrap">
      <img src="../assets/images/icon-plugin-arr.png" alt="" class="arr">
      <img src="../assets/images/icon-plugin-arr.png" alt="" class="arr right">
    </div>
    <div class="plugin-content" ref="divPlugin"></div>
    <img src="../assets/images/plugin-bg.png" alt="" class="plugin-bg">
  </div>
</template>

<style scoped>
.plugin-wrap {
  position: relative;
  width: 100%;
}

.plugin-wrap .plugin-bg {
  display: block;
  width: 100%;
}

.plugin-wrap .plugin-refresh {
  position: absolute;
  top: 10px;
  right: 26px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.plugin-wrap .plugin-refresh img {
  display: block;
  width: 24px;
}

.plugin-wrap .plugin-refresh span {
  display: block;
  font-size: 16px;
  line-height: 24px;
}

.plugin-wrap .arr-wrap {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding-left: 70px;
  padding-right: 66px;
}

.plugin-wrap .arr-wrap .arr {
  display: block;
  width: 40px;
}

.plugin-wrap .arr-wrap .arr.right {
  transform: rotate(180deg);
}

.plugin-wrap .plugin-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 904px;
  height: 542px;
  background: rgba(225, 133, 43, .18);
  border: 1px solid #c16205;
}
</style>