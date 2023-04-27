<template>
  <div class="page-login">
    <div class="canvas"></div>
    <div class="form">
      <div class="form-item">
        <input
          type="text"
          placeholder="请输入账号"
          v-model="formState.mobile"
        />
      </div>
      <div class="form-item">
        <input
          type="text"
          placeholder="请输入密码"
          v-model="formState.password"
        />
      </div>
      <div class="form-item">
        <div class="login-btn" @click="loign">进入生命画卷</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import useStore from "@/stores/user";
import { useRouter } from "vue-router";
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
  // background: linear-gradient(360deg, #eed6d6 0%, white 130%);
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
</style>
