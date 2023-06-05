<template>
  <div class="page-login">
    <div class="first-page">
      <StickyContent ref="stickyContent" height="400vh">
        <div class="big-title" data-name="🌀 ChingShun">🌀 ChingShun</div>
        <div class="bg"></div>

        <div class="screen">
          <div class="border-box">
            <div class="box-content flex justify-center items-center">
              <div style="font-size:100px;color:#1345B7;font-weight:bold">🌀 ChingShun</div>
            </div>
          </div>
        </div>
      </StickyContent>

      <StickyContent ref="stickyContent2">
        <div class="rect"></div>
        <div class="rect-left"></div>
        <div class="rect-right"></div>
      </StickyContent>
    </div>

    <!-- <div class="form">
      <div class="form-item">
        <input type="text" placeholder="请输入账号" v-model="formState.mobile" />
      </div>
      <div class="form-item">
        <input type="password" placeholder="请输入密码" v-model="formState.password" />
      </div>
      <div class="form-item">
        <div class="login-btn" @click="loign">进入生命画卷</div>
      </div>
    </div> -->
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
let stickyContent2 = ref();

const formState = reactive<FormState>({
  mobile: "",
  password: ""
});

const loign = async (values: any) => {
  await LOGIN({ mobile: formState.mobile, password: formState.password });
};

onMounted(() => {
  document.body.addEventListener("scroll", e => {
    let { scrollInContainerProportion } = stickyContent.value.init([
      { ele: ".big-title", step: { scale: 0.7 }, start: "0%", end: "10%" },
      { ele: ".big-title", step: { x: -500 }, start: "0%", end: "10%" },
      { ele: ".big-title", step: { y: -380 }, start: "0%", end: "10%" },
      { ele: ".bg", step: { opacity: 1 }, start: "8%", end: "13%" },
      { ele: ".border-box", step: { opacity: 1 }, start: "8%", end: "14%" }
    ]);

    stickyContent2.value.init([
      { ele: ".rect", step: { scale: 2.5 }, start: "10%", end: "30%" },
      { ele: ".rect", step: { opacity: 1 }, start: "10%", end: "30%" },
      { ele: ".rect-left", step: { opacity: 1 }, start: "30%", end: "50%" },
      { ele: ".rect-left", step: { x: 100 }, start: "30%", end: "50%" },
      { ele: ".rect-right", step: { x: -100 }, start: "50%", end: "70%" },
      { ele: ".rect-right", step: { opacity: 1 }, start: "50%", end: "70%" }
    ]);

    let box = document.querySelector(".border-box");
    let rate = ((scrollInContainerProportion - 0.14) / 0.14) * 360;

    if (scrollInContainerProportion >= 0.28) {
      rate = 360;
    }

    if (scrollInContainerProportion <= 0.14) {
      rate = 0;
    }

    box.style.backgroundImage = `conic-gradient(#1345B7 ${rate}deg,transparent ${rate}deg)`;
  });
});
</script>

<style lang="scss" scoped>
.page-login {
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

  .first-page {
    height: 200vh;

    .big-title {
      z-index: 9;
      font-weight: 600;
      text-shadow: 4px 4px 1px #333;
      font-family: Times New Roman, "serif";
      text-align: center;
      font-size: 60px;
      position: relative;

      /*      &::before {
        content: "";
        display: block;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        background-image: linear-gradient(
          -45deg,
          white 0%,
          white 25%,
          transparent 25%,
          transparent 50%,
          white 50%,
          white 75%,
          transparent 75%,
          transparent 100%
        );
        background-size: 6px 6px;

        z-index: 1;
      } */

      &::after {
        width: 100%;
        position: absolute;
        content: attr(data-name);
        top: -4px;
        left: -2px;
        right: 6px;
        bottom: 6px;
        color: #333;
        z-index: 2;
        text-shadow: 3px 3px #fff;
      }
    }

    .bg {
      height: 100vh;
      width: 100vw;
      left: 0;
      top: 0;
      background: black;
      position: absolute;
      opacity: 0;
    }

    .screen {
      position: absolute;
      height: 70vh;
      width: 80vw;

      .border-box {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        height: 100%;
        width: 100%;
        opacity: 0;
      }

      .box-content {
        background: black;
        height: calc(100% - 20px);
        width: calc(100% - 20px);

        .beautiful-text {
          max-width: 400px;
          position: relative;
          margin-top: 30px;
          font-size: 30px;
          color: transparent;
          background: linear-gradient(45deg,
              transparent 0,
              transparent 20%,
              blue 20%,
              blue 40%,
              transparent 40%,
              transparent 60%,
              blue 60%,
              blue 80%,
              transparent 80%,
              transparent 100%);
          background-size: 100%;
          background-position: 70px 0;
          background-clip: text;

          animation: foo 3s linear 1s;
        }
      }
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

@keyframes foo {
  from {
    background-position: 100px 0;
  }

  to {
    background-position: 300px 0;
  }
}
</style>
