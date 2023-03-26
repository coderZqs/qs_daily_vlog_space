<template>
  <div class="module-introduce"></div>
</template>


<script lang="ts" setup>
import renderer from "./hooks/emoji";
import { onMounted, } from "vue";

onMounted(() => {
  renderer(document.querySelector('.module-introduce'));
})
</script>

<style lang="scss" scoped>
.module-introduce {
  width: 100%;
  overflow: hidden;
}
</style>
