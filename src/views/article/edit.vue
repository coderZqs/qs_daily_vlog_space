<template>
  <div
    class="page-article"
    :style="{ background: state.form.weather === 1 ? 'gray' : '#F3EEEA' }"
  >
    <div class="container content relative">
      <div
        class="form relative"
        :style="{ backgroundImage: `url(${serverAddress + state.form.image})` }"
      >
        <textarea
          class="textarea"
          name=""
          v-model="state.form.content"
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <div class="toolbar">
          <div class="uploader">
            <a-tooltip color="white">
              <template #title>
                <div
                  class="flex justify-center items-center flex-col"
                  @click="triggerUpload"
                >
                  <template v-if="state.form.image">
                    <img :src="serverAddress + state.form.image" alt="" />
                  </template>
                  <template v-else>
                    <div
                      style="width: 200px; height: 250px"
                      class="flex flex-col justify-center items-center"
                    >
                      <img
                        src="../../assets/icon/img/upload.png"
                        style="width: 100px"
                        alt=""
                      />
                      <div class="click-me mt-5" style="font-size: 18px">
                        上传背景图
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <img src="@/assets/icon/img/upload.png" alt="" />
            </a-tooltip>
          </div>

          <div class="bill">
            <a-tooltip color="white">
              <template #title>
                <div class="bill-container">
                  <div>
                    <div class="bill-title">早餐</div>
                    <input class="price" v-model="bill[0].amount" />
                    <span>元</span>
                  </div>
                  <div>
                    <div class="bill-title">午餐</div>
                    <input class="price" v-model="bill[1].amount" />
                    <span>元</span>
                  </div>
                  <div>
                    <div class="bill-title">晚餐</div>
                    <input class="price" v-model="bill[2].amount" />
                    <span>元</span>
                  </div>
                  <div>
                    <div class="bill-title">总计</div>
                    <div class="price">{{ billSummary }}</div>
                    <span>元</span>
                  </div>

                  <div class="remark">
                    <textarea
                      placeholder="备注一下吧"
                      v-model="state.form.remark"
                      name=""
                      autosize
                      id=""
                      cols="30"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </template>
              <img src="@/assets/icon/img/bill.png" alt="" />
            </a-tooltip>
          </div>
          <div class="weather">
            <a-tooltip color="white">
              <template #title>
                <div class="weather-group">
                  <img
                    src="@/assets/icon/img/yutian.png"
                    @click="chooseWeather(1)"
                    alt=""
                  />
                  <div class="divider"></div>
                  <img
                    src="@/assets/icon/img/qingtian.png"
                    @click="chooseWeather(2)"
                    alt=""
                  />
                  <div class="divider"></div>
                  <img
                    src="@/assets/icon/img/yintian.png"
                    alt=""
                    @click="chooseWeather(3)"
                  />
                </div>
              </template>
              <img
                v-if="state.form.weather === 1"
                src="@/assets/icon/img/yutian.png"
                alt=""
              />
              <img
                v-else-if="state.form.weather === 3"
                src="@/assets/icon/img/yintian.png"
                alt=""
              />
              <img v-else src="@/assets/icon/img/qingtian.png" alt="" />
            </a-tooltip>
          </div>

          <a-popover placement="topRight">
            <template #content>
              <p>
                <a-input
                  style="width: 300px"
                  v-model:value="state.form.title"
                ></a-input>
              </p>
            </template>
            <template #title>
              <span style="font-size: 14px">总结标题</span>
            </template>
            <a-button class="ml-2" type="primary" @click="beforeSubmit"
              >提交</a-button
            >
          </a-popover>
        </div>
      </div>
    </div>

    <input
      ref="uploader"
      @change="uploadFile"
      type="file"
      id="file"
      style="opacity: 0; position: absolute; top: -1000%"
    />
    <div
      class="rain"
      v-for="item in rainList"
      :style="{ left: item.left + 'px', top: item.top + 'px' }"
      :key="item.left"
    ></div>
    <!-- 
    <a-modal v-model:visible="state.visibleSubmitModal" title="" @ok="submit">
      <p><a-input v-model:value="state.form.title"></a-input></p>
    </a-modal> -->
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import BlogApi from "@/network/api/blog";
import commonApi from "@/network/api/common";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import moment from "moment";
import useBill from "./hooks/useBill";
import { serverAddress } from "../../network/index";
import { useRoute, useRouter } from "vue-router";
let route = useRoute();
let router = useRouter();

let timer;
let { addBill, bill, billSummary, getBillByDay } = useBill();

interface FormState {
  form: {
    title: string;
    category: number;
    content: string;
    weather: number;
    image: string;
    remark: string;
    created_at: string;
  };

  visibleSubmitModal: boolean;
}

type Rain = {
  left?: number;
  top: number;
  timer?: any;
};

const rainList = ref<Rain[]>([]);
const state = reactive<FormState>({
  form: {
    title: "",
    category: 1,
    content: "",
    weather: 2,
    image: "",
    remark: "",
    created_at: ""
  },

  visibleSubmitModal: false
});

const uploader = ref(null);

const rules = {
  content: [{ required: true, message: "请输入内容" }],
  title: [{ required: true, message: "请输入标题" }],
  weather: [{ required: true, message: "请选择天气" }]
};

/**
 * 添加
 */

const submit = async () => {
  await addBill();
  let result = await BlogApi.addBlog({
    title: state.form.title,
    category: state.form.category,
    content: state.form.content,
    image: state.form.image,
    weather: state.form.weather,
    created_at: new Date().getTime()
  });

  if (SUCCESS(result.code)) {
    message.success(result.msg);
    router.back();
  } else {
    message.error("请勿重复记录");
  }
};

/**
 * 选择天气
 * @param weather
 */

const chooseWeather = weather => {
  state.form.weather = weather;
  clearInterval(timer);
  if (state.form.weather === 1) {
    generateMain();
  }
};

const beforeSubmit = () => {
  if (!state.form.title) {
    submit();
  }
};

/**
 * 打开上传弹窗
 */

let triggerUpload = () => {
  let ev = document.createEvent("MouseEvents");
  ev.initEvent("click", true, true);
  uploader.value!.dispatchEvent(ev);
};

/**
 * 上传图片
 */

let uploadFile = async e => {
  let file = e.target.files[0];
  let formData = new FormData();
  formData.append("file", file);

  let {
    code,
    data: { image }
  } = await commonApi.uploadFile(formData);
  if (SUCCESS(code)) {
    state.form.image = image;
  }
};

/**
 * 生成雨滴
 */
let generateMain = () => {
  let box = document.querySelector(".page-article");
  let width = box!.clientWidth;
  let height = box!.clientHeight;

  timer = setInterval(() => {
    rainList.value.push({
      left: Math.random() * width,
      top: 0
    });

    rainList.value.forEach((v, key) => {
      v.top += 30;
      if (v.top > height) {
        rainList.value.splice(1, key);
      }
    });
  }, 20);
};

/**
 * 获得详情
 */

let getBlog = async () => {
  let { code, data } = await BlogApi.detailBlog(route.query.id);
  if (SUCCESS(code)) {
    for (let key in state.form) {
      for (let subkey in data) {
        if (key === subkey) {
          state.form[key] = data[key];
        }
      }
    }

    getBillByDay({ created_at: state.form.created_at });
  }
};

onMounted(() => {
  generateMain();

  let isEdit = route.query.type === "edit";

  if (isEdit) {
    getBlog();
  }
});
</script>

<style lang="scss" scoped>
.page-article {
  transition: 1s background;
  position: relative;
  height: calc(100vh - $navbar-height);
  overflow: hidden;
  // background: gray;
  background: #f3eeea;
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
  background: linear-gradient(
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.6)
  );
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
    background: rgba(255, 255, 255, 0.3);
  }
}

.bill-container {
  font-size: 12px;
  padding: 8px;
  color: black;
  // height: 100px;

  > div {
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
