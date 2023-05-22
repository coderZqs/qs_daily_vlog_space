<template>
  <div class="app">
    <!-- <LayoutHeader /> -->
    <RouterView />

    <!-- <DailyNoteDialog></DailyNoteDialog> -->
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from "@/components/Layout/Header.vue";
import { RouterView } from "vue-router";
import commonApi from "./network/api/common";
import DailyNoteDialog from "./components/DailyNoteDialog/index.vue";

// commonApi.getOneWord();
</script>

<style lang="scss">
* {
  margin: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  overflow-x: hidden;
  // min-width: 1024px !important;
}

.app {}

.router-view {
  margin-top: $navbar-height;
  overflow: hidden;
}

.container {
  max-width: auto !important;

  @include render(large) {
    width: auto !important;
    margin: 0 20% !important;
  }

  @include render(medium) {
    width: auto !important;
    margin: 0 18% !important;
  }

  @include render(small) {
    width: auto !important;
    margin: 0 100px !important;
  }

  @include render(mini) {
    width: auto !important;
    margin: 0 50px !important;
  }

  @include render(phone) {
    width: auto !important;
    margin: 12px !important;
  }
}
</style>
