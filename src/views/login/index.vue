<template>
  <div class="page-login">
    <div class="flex login-container">
      <div class="login-image">
        <img src="../../assets/image/login.jpg" alt="" />
      </div>
      <div class="form flex flex-col justify-center align-center">
        <p class="welcome">欢迎回来</p>
        <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <a-form-item
            name="mobile"
            :rules="[{ required: true, message: 'Please input your mobile!' }]"
          >
            <a-input v-model:value="formState.mobile" />
          </a-form-item>

          <a-form-item
            name="password"
            :rules="[
              { required: true, message: 'Please input your password!' }
            ]"
          >
            <a-input-password v-model:value="formState.password" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" block html-type="submit">登录</a-button>
          </a-form-item>
        </a-form>
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
const onFinish = async (values: any) => {
  await LOGIN({ mobile: formState.mobile, password: formState.password });
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
</script>

<style lang="scss" scoped>
.page-login {
  background: #bacac6;
  width: 100%;
  height: calc(100vh - $navbar-height);
  display: flex;
  justify-content: center;
  align-items: center;

  .bg {
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
    }

    :before {
      content: "";
      width: 100%;
      height: 100%;
      background: inherit;
      position: absolute;
      left: -25px; //giving minus -25px left position
      right: 0;
      top: -25px; //giving minus -25px top position
      bottom: 0;
      box-shadow: inset 0 0 0 200px rgba(255, 255, 255, 0.3);
      filter: blur(10px);
    }
  }
}

.login-container {
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
  display: flex;
  width: 60%;
  height: 500px;
  position: relative;

  img {
    width: 55%;
    object-fit: cover;
  }

  .form {
    padding: 20px;
    box-sizing: border-box;
    margin-left: auto;
    flex-shrink: 0;
    width: 45%;
    background: white;
    height: 100%;
    z-index: 1;

    .welcome {
      font-size: 20px;
    }
  }
}

.login-image {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
