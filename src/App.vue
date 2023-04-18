<template>
  <div class="app">
    <LayoutHeader />
    <RouterView style="margin-top: 64px; overflow: hidden" />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from "@/components/layout/header.vue";
import { RouterView } from "vue-router";
</script>

<style lang="scss">
* {
  margin: 0;
  margin: 0;
}

html,
body {
  // min-width: 1024px !important;
}

.app {
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
