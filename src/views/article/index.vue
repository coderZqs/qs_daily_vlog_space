<template>
  <div class="container page-article">
    <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item name="date" label="选择日期" :rules="rules.date">
        <a-date-picker v-model:value="formState.date" value-format="YYYY-MM-DD" />
      </a-form-item>

      <a-form-item label="content" name="内容" :rules="rules.content">
        <a-textarea auto-size style="min-height: 100px" v-model:value="formState.content" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import dayjs, { Dayjs } from "dayjs";

interface FormState {
  date: any;
  content: string;
}

export default defineComponent({
  setup() {
    const formState = reactive<FormState>({
      date: ref<Dayjs>(dayjs()),
      content: "",
    });
    const rules = {
      content: [{ required: true, message: "请输入内容" }],
      date: [
        {
          type: "string" as const,
          required: true,
          message: "Please select time!",
        },
      ],
    };

    const onFinish = (values: any) => {
      console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };
    return {
      formState,
      onFinish,
      onFinishFailed,
      rules,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 70%;
}
</style>
