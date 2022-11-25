<template>
  <div class="image-effect">
    <img src="@/assets/image/plane.png" alt="" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.image-effect {
  height: 40px;
  width: 100px;
  background: #58718b;
  mask-image: url("@/assets/image/plane.png");

  &:hover {
    filter: brightness(110%);
  }
}
</style>
