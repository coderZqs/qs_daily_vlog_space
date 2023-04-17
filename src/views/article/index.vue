<template>
  <div class="page-article" ref="container">
    <div class="container">
      <div class="navigation-bar">
        <div class="big-sign">
          <span>THE DAILY</span>
        </div>
      </div>
      <div>
        <div class="article-list mt-5 sm:mt-1">
          <div class="article-container">
            <div ref="articleItem" class="flex article-item" v-for="item in data.articles" :key="item.id"
              @click="enterDetail(item)">
              <!-- <div class="image-box">
              <img :src="item.image" alt="">
            </div> -->
              <div class="p-4 relative">
                <div class="created-at">{{ item.created_at.day }}</div>
                <div class="title">{{ item.title }}</div>
                <div class="content">{{ item.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="toolbar">

        <div class="dater flex flex-col items-center justify-center" v-if="data.currentItem.created_at">
          <p style="margin-top:-20px;"><span style="font-size:50px">{{ data.currentItem.created_at.month }}</span> . <span
              class="mx-1">{{
                data.currentItem.created_at.year }}</span></p>
        </div>

        <div>
          <img style="margin-left:3px" src="@/assets/icon/img/add.png" @click="enterAdd" alt="">
        </div>
        <!--  <div @click="showTarget" ref="targetControlContainer">
        <div ref="targetControl" class="target-container">
          <img src="@/assets/icon/img/target.png" alt="">
          <div class="container" v-if="isOpenTargetDialog">

            <div class="target-card"></div>
          </div>
        </div>
      </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import BlogApi from "@/network/api/blog";
import moment from "moment";
import { reactive, ref } from "vue";
import { SUCCESS } from "@/network/response-status";
import { message } from "ant-design-vue";
import dayjs, { Dayjs } from "dayjs";
import { CalculatorOutlined } from "@ant-design/icons-vue"
import router from "@/router";
 
import _ from "lodash"

type Article = {
  category: string;
  content: string;
  created_at: string;
  id: number;
  sort_id: number;
  title: string;
  updatedAt: string;
  user_id: number
  image: string;
}

type Data = {
  date: Dayjs;
  articles: Article[];
  currentItem: Article
};

const container = ref()
const articleItem = ref();
const targetControl = ref();

const data = reactive<Data>({
  date: dayjs(),
  articles: [],
  currentItem: {},
});

const sourcePoi = ref({ left: 0, top: 0 });
const isOpenTargetDialog = ref(false)

const dayList = computed(() => data.date.daysInMonth());

/**
 * 获取数据
 */

const getList = async () => {
  let y = data.date.year();
  let m = data.date.month();

  let result = await BlogApi.getBlog({
    // created_at: moment([y, m, 24]).format("x")
  });

  if (SUCCESS(result.code)) {
    data.articles = result.data.map((v) => {
      return {
        ...v,
        created_at: {
          year: new Date(v.created_at).getFullYear(),
          month: new Date(v.created_at).getMonth() + 1,
          day: new Date(v.created_at).getDate()
        },
      }
    });

    data.currentItem = _.cloneDeep(data.articles[0])
  } else {
    message.error(result.msg);
  }
};

/**
 * 查看详情
 */

const enterDetail = (item) => {
  router.push("/article/" + item.id)
}

/**
 * 添加
 */

const enterAdd = () => {
  router.push("/article/edit")
}

/**
 * 监听滚动事件
 */

const listenPageScroll = () => {
  articleItem.value.forEach((e, key) => {
    let { top, height } = e.getBoundingClientRect();
    let center = document.body.clientHeight / 2;

    if (top < center && (top + height) > center) {
      data.currentItem = _.cloneDeep(data.articles[key]);
    }
  })
}


const showTarget = () => {

  if (!isOpenTargetDialog.value) {
    targetControl.value.style.position = "absolute";
    let { top, left, } = targetControl.value.getBoundingClientRect();

    targetControl.value.style.height = window.innerHeight + 'px'
    targetControl.value.style.width = window.innerWidth + 'px'
    targetControl.value.style.left = - left + 'px';
    targetControl.value.style.top = - top + 64 + 'px';
    targetControl.value.style.backgroundColor = "#F3F9F1"
    // targetControl.value.style.padding = `24px ${window.innerWidth * 0.2 + 'px'}`
    isOpenTargetDialog.value = true;
  } else {
    targetControl.value.style.position = "relative"
    targetControl.value.style.width = "100%"
    targetControl.value.style.height = "100%"
    isOpenTargetDialog.value = false;
    targetControl.value.style.left = 0 + 'px'
    targetControl.value.style.top = 0 + 'px'
    targetControl.value.style.backgroundColor = ""
    // targetControl.value.style.padding = `0px 0px`
  }
}

onMounted(() => {
  getList();
  window.addEventListener('scroll', listenPageScroll)
});
</script>

<style lang="scss" scoped>
.page-article {
  // padding: 0 20%;
  background: #F3F9F1;
  margin: 0 auto;
  z-index: 1;
  padding-top: 64px;
  box-sizing: border-box;
  overflow: scroll;

  @include render(phone) {
    padding-top: 0 !important;
  }
}

.setting-bar {
  /*   overflow: hidden; */
  width: 300px;
  margin-left: auto;
}

.background-image {
  overflow: hidden;
}

.day-item {
  margin: 2px;
  width: 32px;
  height: 32px;
  border: 1px solid #CCC;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navigation-bar {
  width: 100%;
  height: 200px;
  background: url(../../assets/image/login_bg.jpg);
  background-attachment: fixed;
  background-size: 100% auto;
  text-align: center;
  line-height: 200px;
  color: white;

  @include render(phone) {
    height: 120px;
    line-height: 120px;
  }
}


.big-sign {
  font-size: 40px;
  font-weight: 600;
  text-align: center;
}

.ml-auto {
  margin-left: auto !important;
  margin-right: calc((100% - 750px)/2) !important;
}

.mr-auto {
  margin-right: auto !important;
  margin-left: calc((100% - 750px)/2) !important;
}

.article-container {

  .article-item {
    background: white;
    margin: 12px 0;
    transition: 0.1s all;

    cursor: pointer;

    .image-box {
      flex-shrink: 0;
      border: 6px solid black;
      height: 230px;
      width: 230px;
      overflow: hidden;
      display: flex;
      align-items: center;
      position: relative;

      img {
        padding: 10px;
        width: auto;
        position: absolute;
      }
    }

    .created-at {
      height: 60px;
      width: 60px;
      text-align: center;
      line-height: 60px;
      border-radius: 50%;
      font-size: 30px;
      font-weight: 700;
      position: absolute;
      opacity: 0.7;
      z-index: 0;
      right: 30px;
      top: 0px;
    }

    .title {
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      padding-bottom: 4px;
      border-bottom: 2px solid #CCC;
    }

    .content {
      font-size: 13px;
    }
  }
}

.loading {
  width: 250px;
  height: 50px;
  background: red;
}


.toolbar {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  // width: 100px;
  padding: 20px;
  position: fixed;
  right: 100px;
  bottom: 100px;
  display: flex;
  flex-direction: column;



  @include render(phone) {
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
  }

  div {
    position: relative;
    width: 100%;
    height: 40px;

    &:first-child {
      margin-bottom: 6px;

      img {
        height: 35px;
        width: 35px;
      }
    }

    &:last-child {
      img {
        height: 48px;
        width: 48px;
      }
    }
  }

  img {
    cursor: pointer;
    height: 30px;
    width: 30px;
  }
}

.dater {

  @include render(phone) {
    top: calc(100vh - 100px)
  }
}

.target-container {
  transition: 0.5s all;
  left: 0;
  top: 0;



  .target-card {
    height: 300px;
    width: 300px;
    background: red;
  }
}
</style>

