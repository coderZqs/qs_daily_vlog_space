<template>
  <div class="navbar">
    <CustomHeader></CustomHeader>
  </div>

  <RouterView />
</template>

<script setup lang="ts">
import CustomHeader from "@/components/layout/header.vue";
import { RouterView } from "vue-router";
</script>

<style scoped>
.navbar {
  margin-top: 64px;
}
</style>
