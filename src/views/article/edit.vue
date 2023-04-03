<template>
  <div class="page-article">
    <div class="container content relative">
      <!--    <a-form :model="data.form" name="basic" autocomplete="off" @finish="onFinish">

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
      </a-form> -->

      <div class="form relative">
        <textarea class="textarea" name="" id="" cols="30" rows="10"></textarea>
        <div class="toolbar">
          <div class="bill">
            <a-tooltip color="white">
              <template #title>
                <div></div>
              </template>
              <img src="@/assets/icon/img/bill.png" alt="">
            </a-tooltip>

          </div>
          <div class="weather">
            <a-tooltip color="white">
              <template #title>
                <div class="weather-group">
                  <img src="@/assets/icon/img/yutian.png" @click="chooseWeather(2)" alt="">
                  <div class="divider"></div>
                  <img src="@/assets/icon/img/qingtian.png" @click="chooseWeather(1)" alt="">
                  <div class="divider"></div>
                  <img src="@/assets/icon/img/yintian.png" alt="" @click="chooseWeather(3)">
                </div>
              </template>
              <img v-if="data.form.weather === 1" src="@/assets/icon/img/yutian.png" alt="">
              <img v-else-if="data.form.weather === 3" src="@/assets/icon/img/yintian.png" alt="">
              <img v-else src="@/assets/icon/img/qingtian.png" alt="">
            </a-tooltip>

          </div>

          <a-button class="ml-2" type="primary">提交</a-button>
        </div>
      </div>

    </div>




    <div class="rain" v-for="item in rainList" :style="{ left: item.left + 'px', top: item.top + 'px' }" :key="item.left">
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import dayjs, { Dayjs } from "dayjs";
import BlogApi from "@/network/api/blog";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import moment from "moment";
import { formItemProps } from "ant-design-vue/lib/form";

interface FormState {

  form: {
    title: string;
    category: number;
    content: string;
    weather: number;
  },
}

type Rain = {
  left?: number;
  top: number;
  timer?: any
}

const rainList = ref<Rain[]>([])

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

const chooseWeather = (weather) => {
  data.form.weather = weather;
}



let generateMain = () => {
  let box = document.querySelector('.page-article');
  let width = box!.clientWidth;
  let height = box!.clientHeight;

  setInterval(() => {
    rainList.value.push({
      left: Math.random() * width,
      top: 0
    })


    rainList.value.forEach((v, key) => {
      v.top += 30;

      if (v.top > height) {
        rainList.value.splice(1, key)
      }
    })
  }, 20)
}

onMounted(() => {
  generateMain();
})

</script>

<style lang="scss" scoped>
.page-article {
  position: relative;
  height: calc(100vh - 64px);
  overflow: hidden;
  background: gray;
}

.weather-group {
  img {
    width: 30px;
    cursor: pointer;
  }

  .divider {
    margin: 2px 0;
    height: 1px;
    width: 100%;
    background: #d5d5d5;
  }
}

.rain {
  position: absolute;
  width: 1px;
  height: 50px;
  z-index: 9;
  background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6));
}

.content {
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}

.toolbar {
  border-radius: 4px;
  right: 50px;
  height: 50px;
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .weather {
    margin: 0 10px;

    img {
      width: 30px;
    }
  }

  .bill {
    margin-right: auto;

    img {
      width: 30px;
    }
  }
}

.form {
  height: 90%;
  margin-top: 3%;
  border-radius: 4px;
  overflow: hidden;

  textarea {
    width: 100%;
    height: 100%;
    outline: none;
    padding: 20px 20px;
    background: rgba(255, 255, 255, 0.3)
  }
}
</style>
