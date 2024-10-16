<!-- 黑底儿白描边框子 -->
<template>
  <div class="black-wrap">
    <slot></slot>
  </div>
</template>

<style scoped>
.black-wrap {
  box-sizing: border-box;
  background: rgba(0, 0, 0, .5);
  border: 2px solid rgba(221, 221, 221, .17);
  box-shadow: inset 0 0 15px 10px rgba(65, 61, 54, .35);
  border-radius: 3px;
}
</style>