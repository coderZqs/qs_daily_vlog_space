<template>
  <div class="article">
    <!-- 大图 -->
    <div class="big-image" :style="{ backgroundImage: `url(${data.blogInfo.image})` }"></div>

    <div class="content">
      <!-- 标题 -->
      <div class="header d-flex flex-column align-center">
        <span>{{ data.blogInfo.title }}</span>
        <p>
          <span>{{ data.blogInfo.created_at }}</span>
          <span>晴</span>
        </p>
      </div>

      <div class="content container">{{ data.blogInfo.content }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BlogAPI from "@/network/api/blog";
import { SUCCESS } from "@/network/response-status";
import moment from "moment";
import { onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
let route = useRoute();

type Blog = {
  category?: string;
  content?: string;
  createdAt?: string;
  created_at?: string;
  id?: number;
  sort_id?: number;
  title?: string;
  updatedAt?: string;
  user_id?: number
  image?: string;
}

type Data = {
  blogInfo: Blog
}

const data = reactive<Data>({
  blogInfo: {}
})

/**
 * 获取博客
 */

const getBlog = async () => {
  0  // let now = moment().format("YYYY-MM-DD");
  let { data: blog, code } = await BlogAPI.getBlog({ id: route.params.id });
  if (SUCCESS(code)) {
    data.blogInfo = blog[0];
  }
};

onMounted(() => {
  getBlog();
});
</script>

<style lang="scss" scoped>
.big-image {
  height: 300px;
  background-size: 100% auto;
  background-attachment: fixed;
  background-position: center;
}

.content {
  line-height: 30px;
  padding: 20px;
  margin: 0 auto;
  margin-top: -100px;

  .header {
    text-align: center;
    font-size: 20px;
    height: 200px;
    color: white;
  }
}
</style>
