<template>
  <div class="container page-article">
    <a-form
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item name="date" label="选择日期" :rules="rules.date">
        <a-date-picker
          v-model:value="formState.date"
          value-format="YYYY-MM-DD"
        />
      </a-form-item>

      <a-form-item label="content" name="内容" :rules="rules.content">
        <a-textarea
          auto-size
          style="min-height: 100px"
          v-model:value="formState.content"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import dayjs, { Dayjs } from "dayjs";
import BlogApi from "@/network/api/blog";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import moment from "moment";

interface FormState {
  date: any;
  content: string;
}

const formState = reactive<FormState>({
  date: ref<Dayjs>(dayjs()),
  content: ""
});

const rules = {
  content: [{ required: true, message: "请输入内容" }],
  date: [
    {
      type: "string" as const,
      required: true,
      message: "Please select time!"
    }
  ]
};

const onFinish = async () => {};

onMounted(async () => {
  let data = await BlogApi.addBlog({
    title: "dasdasd",
    category: 1,
    content: "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
    created_at: new Date().getTime()
  });

  if (SUCCESS(data.code)) {
    message.success(data.msg);
  }
});
</script>

<style lang="scss" scoped></style>
