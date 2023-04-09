<template>
  <div class="page-article" :style="{ background: data.form.weather === 1 ? 'gray' : '#F3EEEA' }">
    <div class="container content relative">
      <div class="form relative" :style="{ backgroundImage: `url(${data.form.image})` }">
        <textarea class="textarea" name="" v-model="data.form.content" id="" cols="30" rows="10"></textarea>
        <div class="toolbar">
          <div class="target">
            <a-tooltip color="white">
              <template #title>
                <div class="flex justify-center items-center flex-col" @click="triggerUpload">
                  <a-checkbox-group v-model:value="targetCheckValues" name="checkboxgroup" :options="targets" />
                </div>
              </template>
              <img src="@/assets/icon/img/target.png" alt="">
            </a-tooltip>
          </div>

          <div class="uploader">
            <a-tooltip color="white">
              <template #title>
                <div class="flex justify-center items-center flex-col" @click="triggerUpload">
                  <template v-if="data.form.image">
                    <img :src="data.form.image" alt="">
                  </template>
                  <template v-else>
                    <img src="../../assets/icon/img/upload.png" alt="">
                    <div class="click-me">点我上传</div>
                  </template>
                </div>
              </template>
              <img src="@/assets/icon/img/upload.png" alt="">
            </a-tooltip>
          </div>


          <div class="bill">
            <a-tooltip color="white">
              <template #title>
                <div class="bill-container">
                  <div>
                    <div class="bill-title">早餐</div>
                    <input class="price" v-model="bill.details[0].amount">
                    <span>元</span>
                  </div>
                  <div>
                    <div class="bill-title">午餐</div>
                    <input class="price" v-model="bill.details[1].amount">
                    <span>元</span>
                  </div>
                  <div>
                    <div class="bill-title">晚餐</div>
                    <input class="price" v-model="bill.details[2].amount">
                    <span>元</span>
                  </div>
                  <div>
                    <div class="bill-title">总计</div>
                    <div class="price">{{ billSummary }}</div>
                    <span>元</span>
                  </div>

                  <div class="remark">
                    <textarea placeholder="备注一下吧" v-model="data.form.remark" name="" autosize id="" cols="30"
                      rows="3"></textarea>
                  </div>
                </div>
              </template>
              <img src="@/assets/icon/img/bill.png" alt="">
            </a-tooltip>

          </div>
          <div class="weather">
            <a-tooltip color="white">
              <template #title>
                <div class="weather-group">
                  <img src="@/assets/icon/img/yutian.png" @click="chooseWeather(1)" alt="">
                  <div class="divider"></div>
                  <img src="@/assets/icon/img/qingtian.png" @click="chooseWeather(2)" alt="">
                  <div class="divider"></div>
                  <img src="@/assets/icon/img/yintian.png" alt="" @click="chooseWeather(3)">
                </div>
              </template>
              <img v-if="data.form.weather === 1" src="@/assets/icon/img/yutian.png" alt="">
              <img v-else-if="data.form.weather === 3" src="@/assets/icon/img/yintian.png" alt="">
              <img v-else src="@/assets/icon/img/qingtian.png" alt="">
            </a-tooltip>

          </div>

          <a-button class="ml-2" type="primary" @click="beforeSubmit">提交</a-button>
        </div>
      </div>
    </div>

    <input ref="uploader" @change="uploadFile" type="file" id="file" style="opacity:0;position: absolute;top:-1000%">
    <div class="rain" v-for="item in rainList" :style="{ left: item.left + 'px', top: item.top + 'px' }" :key="item.left">
    </div>

    <a-modal v-model:visible="data.visibleSubmitModal" title="想一个有个性的标题！" @ok="submit">
      <p><a-input v-model:value="data.form.title"></a-input></p>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import dayjs, { Dayjs } from "dayjs";
import BlogApi from "@/network/api/blog";
import commonApi from "@/network/api/common"
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import moment from "moment";
import { formItemProps } from "ant-design-vue/lib/form";
import useBill from "./hooks/useBill"
import useTarget from "./hooks/useTarget"
import router from "@/router";
let timer;
let { addBill, bill, billSummary } = useBill();

interface FormState {
  form: {
    title: string;
    category: number;
    content: string;
    weather: number;
    image: string
    remark: string;
  },

  visibleSubmitModal: boolean
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
    weather: 1,
    image: "",
    remark: ""
  },

  visibleSubmitModal: false,
});

const uploader = ref(null)

const rules = {
  content: [{ required: true, message: "请输入内容" }],
  title: [{ required: true, message: "请输入标题" }],
  weather: [{ required: true, message: "请选择天气" }],
};

/**
 * 添加
 */

const submit = async () => {
  await addBill();
  let result = await BlogApi.addBlog({
    title: data.form.title,
    category: data.form.category,
    content: data.form.content,
    image: data.form.image,
    weather: data.form.weather,
    created_at: new Date().getTime()
  });

  if (SUCCESS(result.code)) {
    message.success(result.msg);
    router.back();
  } else {
    message.error("请勿重复记录")
  }
};

/**
 * 选择天气
 * @param weather 
 */

const chooseWeather = (weather) => {
  data.form.weather = weather;
  clearInterval(timer)
  if (data.form.weather === 1) {
    generateMain();
  }
}

const beforeSubmit = () => {
  data.visibleSubmitModal = true;
}

/**
 * 打开上传弹窗
 */

let triggerUpload = () => {
  let ev = document.createEvent("MouseEvents")
  ev.initEvent("click", true, true)
  uploader.value!.dispatchEvent(ev)
}

/**
 * 上传图片
 */

let uploadFile = async (e) => {
  let file = e.target.files[0];
  let formData = new FormData();
  formData.append('file', file);

  let { code, data: { image } } = await commonApi.uploadFile(formData)
  if (SUCCESS(code)) {
    data.form.image = image;
  }
}


/**
 * 生成雨滴
 */
let generateMain = () => {
  let box = document.querySelector('.page-article');
  let width = box!.clientWidth;
  let height = box!.clientHeight;

  timer = setInterval(() => {
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
  transition: 1s background;
  position: relative;
  height: calc(100vh - 64px);
  overflow: hidden;
  // background: gray;
  background: #F3EEEA;
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

  .uploader {
    cursor: pointer;
    margin: 0 10px;

    img {
      width: 30px;
    }
  }

  .target {
    cursor: pointer;
    margin: 0 10px;

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
  background-position: center;
  background-size: cover;

  textarea {
    width: 100%;
    height: 100%;
    outline: none;
    padding: 20px 20px;
    background: rgba(255, 255, 255, 0.3)
  }
}

.bill-container {
  font-size: 12px;
  padding: 8px;
  color: black;
  // height: 100px;

  >div {
    border-bottom: 1px solid #f5f5f5;
    padding: 8px 4px;
    display: flex;
    align-items: center;

    .price {
      text-align: center;
      margin: 0 4px;
      border: none;
      outline: none;

      flex: 1;
    }
  }
}

.click-me {
  color: black;
  font-size: 13px;
}
</style>
