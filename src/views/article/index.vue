<template>
  <div class="article">
    <!-- 大图 -->
    <div class="big-image"></div>

    <div class="content">
      <!-- 标题 -->
      <div class="header d-flex flex-column align-center">
        <span>记录那些平淡中带刺的日子</span>
        <span>2022/04/20</span>
        <span>晴</span>
      </div>
      <!-- 图文 -->
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.big-image {
  height: 500px;
  background: url("@/assets/image/article/big-image.jpg");
  background-size: 100% auto;
  background-attachment: fixed;
  background-position: center;
}

.content {
  margin-top: -100px;

  .header {
    text-align: center;
    font-size: 20px;
    height: 2000px;
    color: white;
  }
}
</style>