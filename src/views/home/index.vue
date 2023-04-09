<template>
  <div class="module-introduce" ref="canvas"></div>
</template>


<script lang="ts" setup>
import Emoji from "./hooks/emoji";
import { onMounted, ref, onUnmounted } from "vue";

let canvas = ref()

onMounted(() => {
  Emoji.run(canvas.value);
})

onUnmounted(() => {
  Emoji.clear()
})


window.addEventListener('visibilityChange', () => {
  if (document.hidden) {
    Emoji.stop();
  } else {
    Emoji.start();
  }
})
</script>

<style lang="scss" scoped>
.module-introduce {
  width: 100%;
  overflow: hidden;
}
</style>
