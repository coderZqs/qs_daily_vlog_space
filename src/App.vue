<template>
  <div class="app">
    <LayoutHeader />
    <RouterView style="margin-top:64px;overflow:hidden" />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from "@/components/layout/header.vue";
import { RouterView } from "vue-router";
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}


html,
body {
  min-width: 1024px !important;
}

.app {
  overflow: hidden;
}

@mixin render($size) {
  $large: 1920px;
  $medium: 1338px;
  $small: 1180px;
  $mini: 768px;

  @if ($size =="large") {
    @media screen and (min-width: $large) {
      @content;
    }
  }

  @if ($size =="medium") {
    @media screen and (min-width: $medium) and (max-width: $large) {
      @content;
    }
  }

  @if ($size =="small") {
    @media screen and (min-width: $small) and (max-width: $medium) {
      @content;
    }
  }

  @if ($size =="mini") {
    @media screen and (min-width: $mini) and (max-width: $small) {
      @content;
    }
  }

  @if ($size =="phone") {
    @media screen and (max-width: $mini) {
      @content;
    }
  }
}

.container {
  @include render(large) {
    width: auto !important;
    padding: 0 20% !important;
  }

  @include render(medium) {
    width: auto !important;
    padding: 0 18% !important;
  }

  @include render(small) {
    width: auto !important;
    padding: 0 100px !important;
  }

  @include render(mini) {
    width: auto !important;
    padding: 0 50px !important;
  }

  @include render(phone) {
    width: auto !important;
    padding: 12px !important;
  }
}
</style>
