<template>
  <div class="page-article container">

    <div class="big-sign">
      <span>THE DAILY</span>
    </div>
    <div class="navigation-bar">我的日记旅程</div>

    <!--   <div style="background: #ececec; padding: 16px">
      <a-card title="日期" :bordered="false" style="width: 300px">
        <template #extra>
          <a-date-picker v-model:value="data.date" picker="month" />
        </template>

        <div class="flex flex-wrap">
          <div class="day-item" v-for="item in dayList" :key="item">
            <span>{{ item }}</span>
          </div>
        </div>
      </a-card>
    </div> -->

    <div>
      <!-- <p>在{{ data.date.year() }}. {{ data.date.month() }}的你，记录了{{ data.articles.length }}篇文章</p> -->
      <div class="article-list mt-5" style="position:relative">
        <div :style="{
          flexFlow: index % 2 == 0 ? 'row-reverse' : '',
        }" v-for="index in Math.ceil(data.articles.length / 3)" class="flex justify-between article-container">
          <div class="article-item"
            :class="[index === Math.ceil(data.articles.length / 3) && key === data.articles.slice(3 * (index - 1), 3 * index).length ? index % 2 === 0 ? 'ml-auto' : 'mr-auto' : '']"
            v-for="(item, key) in data.articles.slice(3 * (index - 1), 3 * index)" @click="enterDetail(item)">
            <!--             <div class="line" v-if="key < 2"
              :style="{ width: `calc((100% - 750px)/2 + 25px)`, left: `calc((250px + (100% - 750px)/2) * ${key} + 230px)`, top: `calc(352px * ${index - 1} + 140px)` }">
            </div>

            <div class="shu-line" v-else></div> -->
            <div class="image-box">
              <img :src="item.image" alt="">
            </div>
            <div class="created-at truncate">{{ item.created_at }}</div>
            <div class="title truncate">{{ item.title }}</div>
            <div class="content truncate">{{ item.content }}</div>
          </div>
        </div>
        <!-- <div class="loading">loading...</div> -->
      </div>
    </div>

    <div class="toolbar">
      <i class="iconfont icon-icon--tianjia" @click="enterAdd"></i>
      <i class="iconfont icon-shijian"></i>
      <i class="iconfont icon-huidaodingbu"></i>
    </div>
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
import { CalculatorOutlined } from "@ant-design/icons-vue"
import router from "@/router";
import { Item } from "ant-design-vue/lib/menu";

type Data = {
  date: Dayjs;
  articles: {
    category: string;
    content: string;
    createdAt: string;
    created_at: string;
    id: number;
    sort_id: number;
    title: string;
    updatedAt: string;
    user_id: number
    image: string;
  }[];
};

const data = reactive<Data>({
  date: dayjs(),
  articles: []
});

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
    data.articles = result.data;
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

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.page-article {
  margin: 0 auto;
  z-index: 1;
  padding-top: 64px;
  box-sizing: border-box;
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
  height: 100px;
  background: black;
  text-align: center;
  line-height: 100px;
  color: white;
  margin-top: 20px;
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
    width: 250px;
    margin: 30px 0;
    transition: 0.1s all;

    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }

    .image-box {
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
      font-size: 13px;
    }

    .title {
      font-size: 14px;
      font-weight: 500;
    }

    .content {
      font-size: 13px;
    }


    .line {
      position: absolute;
      width: 30%;
      height: 4px;
      background: black;
      left: 230px;
      top: 100px;
    }

    &:last-child {
      .line {
        display: none;
      }
    }

    .shu-line {
      position: absolute;
      width: 4px;
      height: 200px;
      background: red;
    }
  }


}

.loading {
  width: 250px;
  height: 50px;
  background: red;
}


.toolbar {
  // width: 100px;
  padding: 20px;
  background: white;
  box-shadow: 0 0 2px #CCC;
  position: fixed;
  right: 100px;
  bottom: 100px;
  display: flex;
  flex-direction: column;

  i {
    cursor: pointer;
    color: #1890ff;
    fill: currentColor;
    font-size: 30px;
  }
}
</style>

