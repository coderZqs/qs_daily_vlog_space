<template>
  <div class="container page-article">
    <a-form :model="data.form" name="basic" autocomplete="off" @finish="onFinish">

      <a-form-item name="title" label="填写标题" :rules="rules.title">
        <a-input v-model:value="data.form.title"></a-input>
      </a-form-item>

      <a-form-item name="weather" label="选择天气" :rules="rules.weather">
        <a-radio-group v-model:value="data.form.weather">
          <a-radio :value="1">晴</a-radio>
          <a-radio :value="2">雨</a-radio>
          <a-radio :value="3">阴</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="内容" name="content" :rules="rules.content">
        <a-textarea auto-size style="min-height: 100px" v-model:value="data.form.content" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">提交</a-button>
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

  form: {
    title: string;
    category: number;
    content: string;
    weather: number;
  },
}

const data = reactive<FormState>({

  form: {
    title: "",
    category: 1,
    content: "",
    weather: 1
  },
});

const rules = {
  content: [{ required: true, message: "请输入内容" }],
  title: [{ required: true, message: "请输入标题" }],
  weather: [{ required: true, message: "请选择天气" }],
};

const onFinish = async () => {
  let result = await BlogApi.addBlog({
    title: data.form.title,
    category: data.form.category,
    content: data.form.content,
    weather: data.form.weather,
    created_at: new Date().getTime()
  });

  if (SUCCESS(result.code)) {
    message.success(result.msg);
  } else {
    message.error("请勿重复记录")
  }
};

</script>

<style lang="scss" scoped></style>
