<template>
  <Overlay>
    <div class="daily-note-dialog">
      <div>现在是{{ date }}</div>
      <div class="title">账单区</div>
      <div class="flex items-center">
        <span>我今天上午吃了价格为</span>
        <input v-model="bill[0].amount" type="text" />的<input
          type="text"
          v-model="bill[0].content"
        />
      </div>
      <div class="flex items-center">
        我今天中午吃了价格为<input
          v-model="bill[1].amount"
          type="text"
        />的<input type="text" v-model="bill[0].content" />
      </div>
      <div class="flex items-center">
        我今天晚餐吃了价格为<input
          v-model="bill[2].amount"
          type="text"
        />的<input type="text" v-model="bill[0].content" />
      </div>
      <div>
        总共花了 <span class="summary-price">{{ billSummary }}</span> 元
      </div>

      <div class="title">任务区</div>
      <div>今天有两个需要完成的任务</div>
    </div>
  </Overlay>
</template>

<script setup lang="ts">
import Overlay from "../Overlay/index.vue";
let props = defineProps<{ visible: boolean }>();
let emits = defineEmits(["update:visible"]);
import useBill from "../../views/article/hooks/useBill";
import { ref } from "vue";
import moment from "moment";
let { bill, addBill, billSummary } = useBill();
let date = moment().format("HH时mm分");
</script>

<style lang="scss" scoped>
.daily-note-dialog {
  * {
    line-height: 35px;
  }

  border-bottom-left-radius: 20px 500px;
  border-bottom-right-radius: 500px 30px;
  border-top-right-radius: 5px 100px;
  box-shadow: 0 0 4px #797c78;

  font-size: 14px;
  padding: 0 10px;
  min-height: 700px;
  width: 500px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(black),
    color-stop(2%, white)
  );

  line-height: 30px;

  -webkit-background-size: 100% 35px;

  input {
    margin: 0 4px !important;
    padding: 0 !important;
    width: 60px;
    height: 35px;
    line-height: 35px;
    background: transparent;
    text-align: center;
    outline: none;
    border-bottom: 1px solid gray;
  }
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.summary-price {
  font-size: 20px;
  color: red;
}
</style>
