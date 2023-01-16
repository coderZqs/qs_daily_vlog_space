<template>
  <div class="page-index">
    <div class="list">
      <div class="item" v-for="(item, index) in data.notes" :key="index">
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
let data = reactive({
  notes: [
    { title: "哈哈哈哈哈哈哈哈哈" },
    { title: "哈哈哈哈哈哈哈哈哈" },
    { title: "哈哈哈哈哈哈哈哈哈" },
    { title: "哈哈哈哈哈哈哈哈哈" },
  ],
});
</script>

<style>
</style>