<template>
  <div class="article">
    <!-- 大图 -->
    <!-- <div class="big-image"></div> -->

    <div class="content">
      <!-- 标题 -->
      <div class="header d-flex flex-column align-center">
        <!--         <span></span>
        <span>2022/04/20</span>
        <span>晴</span> -->
      </div>
      <!-- 图文 -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import BlogAPI from "@/network/api/blog";
import moment from "moment";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();

/**
 * 获取博客
 */

const getBlog = async () => {
  // let now = moment().format("YYYY-MM-DD");
  console.log(route.params.id);
  let blog = await BlogAPI.getBlog({ id: route.params.id });
};

onMounted(() => {
  getBlog();
});
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
