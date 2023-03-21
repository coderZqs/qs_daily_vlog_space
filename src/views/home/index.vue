<template>
  <div class="module-introduce"></div>
</template>

<script lang="ts" setup>
import "./hooks/emoji.ts";
import * as THREE from "three";
import THREEAPI from "@/threejs/index";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

let router = useRouter();
</script>

<style lang="scss" scoped>
.module-introduce {
  animation: hidden 5s;
}
</style>
