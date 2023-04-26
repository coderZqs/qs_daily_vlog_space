<template>
  <div class="page-login">
    <div class="canvas"></div>
    <div class="form">
      <div class="form-item">
        <input type="text" placeholder="账号" v-model="formState.mobile" />
      </div>
      <div class="form-item">
        <input type="text" placeholder="密码" v-model="formState.password" />
      </div>
      <div class="form-item">
        <div class="login-btn" @click="loign">进入生命画卷</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, reactive } from "vue";
import useStore from "@/stores/user";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { SUCCESS } from "@/network/response-status";
let router = useRouter();
let { LOGIN } = useStore();

interface FormState {
  mobile: string;
  password: string;
}

const formState = reactive<FormState>({
  mobile: "",
  password: ""
});

const loign = async (values: any) => {
  await LOGIN({ mobile: formState.mobile, password: formState.password });
};
</script>

<style lang="scss" scoped>
.page-login {
  background: linear-gradient(360deg, #eed6d6 0%, white 130%);
  width: 100%;
  height: calc(100vh - $navbar-height);
  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    width: 500px;

    input {
      width: 400px;
      outline: none;
      background: transparent;
      border: none;
      border-bottom: 1px solid white;
      height: 50px;
      display: block;
    }
  }
}
</style>
