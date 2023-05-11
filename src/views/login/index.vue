<template>
  <div class="page-login">
    <!--     <div class="form">
      <div class="form-item">
        <input
          type="text"
          placeholder="请输入账号"
          v-model="formState.mobile"
        />
      </div>
      <div class="form-item">
        <input
          type="password"
          placeholder="请输入密码"
          v-model="formState.password"
        />
      </div>
      <div class="form-item">
        <div class="login-btn" @click="loign">进入生命画卷</div>
      </div>
    </div> -->
  </div>
  <div>
    <StickyContent ref="stickyContent1">
      <Clock class="clock" :size="clockSize" :scale="clockScale"></Clock>
    </StickyContent>

    <StickyContent ref="stickyContent">
      <div class="rect"></div>
      <div class="rect-left"></div>
      <div class="rect-right"></div>
    </StickyContent>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import useStore from "@/stores/user";
import { useRouter } from "vue-router";
import Clock from "@/components/Clock/index.vue";
let router = useRouter();
let { LOGIN } = useStore();
import StickyContent from "@/components/StickyContent/index.vue";

interface FormState {
  mobile: string;
  password: string;
}

let stickyContent = ref();
let stickyContent1 = ref();

const clockSize = ref(200);
const clockScale = ref(2);
const formState = reactive<FormState>({
  mobile: "",
  password: ""
});

const loign = async (values: any) => {
  await LOGIN({ mobile: formState.mobile, password: formState.password });
};

onMounted(() => {
  document.body.addEventListener("scroll", e => {
    /*     stickyContent.value.init([
      { ele: ".rect", step: { scale: 2.5 }, start: "10%", end: "30%" },
      { ele: ".rect", step: { opacity: 1 }, start: "10%", end: "30%" },
      { ele: ".rect-left", step: { opacity: 1 }, start: "30%", end: "50%" },
      { ele: ".rect-left", step: { x: 100 }, start: "30%", end: "50%" },
      { ele: ".rect-right", step: { x: -100 }, start: "50%", end: "70%" },
      { ele: ".rect-right", step: { opacity: 1 }, start: "50%", end: "70%" }
    ]); */
    let { scrollInContainerProportion } = stickyContent1.value.init([]);
    if (scrollInContainerProportion > 0 && scrollInContainerProportion < 1) {
      clockScale.value = 1 + 2 * scrollInContainerProportion;
    }
  });
});
</script>

<style lang="scss" scoped>
.page-login {
  width: 100%;
  height: calc(100vh - $navbar-height);
  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    width: 400px;

    .form-item {
      margin: 30px 0;
    }

    input {
      border-radius: 4px;
      width: 300px;
      outline: none;
      background: #e8eff7;
      border: none;
      height: 40px;
      display: block;
      padding: 4px 12px;
      box-sizing: border-box;
    }
  }

  .login-btn {
    height: 40px;
    width: 300px;
    border-radius: 8px;
    background: #455ff0;
    text-align: center;
    line-height: 40px;
    color: white;
    transition: 0.3s all;
    cursor: pointer;

    &:hover {
      box-shadow: -10px 10px 16px gray;
    }
  }
}

.rect {
  position: absolute;
  height: 100px;
  width: 150px;
  background: gray;
  opacity: 0;
}

.rect-left {
  height: 100px;
  width: 100px;
  background: yellow;
  position: absolute;
  opacity: 0;
  left: 300px;
  top: 300px;
}

.rect-right {
  height: 100px;
  width: 100px;
  opacity: 0;
  background: green;
  position: absolute;
  right: 300px;
  top: 300px;
}
</style>
