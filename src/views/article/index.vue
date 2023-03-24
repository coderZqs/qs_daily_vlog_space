<template>
  <div class="page-article">
    <a-date-picker v-model:value="data.date" picker="month" />
    <span v-for="item in dayList" :key="item">{{ item }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import BlogApi from "@/network/api/blog";
import moment from "moment";
import { reactive } from "vue";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";

type Data = {
  date: Dayjs;
  articles: [];
};

const data = reactive<Data>({
  date: dayjs(),
  articles: []
});

const dayList = computed(() => data.date.daysInMonth());

const getList = async () => {
  let y = data.date.year();
  let m = data.date.month();

  let result = await BlogApi.getBlog({
    created_at: moment([y, m, 24]).format("x")
  });

  if (SUCCESS(result.code)) {
    data.articles = result.data;
  } else {
    message.error(result.msg);
  }
};

onMounted(() => {
  getList();
});
</script>

<style scoped></style>
