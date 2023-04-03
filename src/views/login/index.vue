<template>
  <div class="page-login">
    <div class="bg"> <img src="../../assets/image/login_bg.jpg" class="bg" alt=""></div>

    <div class="flex login-container">
      <img src="../../assets/image/login_bg.jpg" class="bg" alt="">

      <div class="form flex flex-col justify-center align-center">

        <p class="welcome">欢迎回来</p>
        <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item name="mobile" :rules="[{ required: true, message: 'Please input your mobile!' }]">
            <a-input v-model:value="formState.mobile" />
          </a-form-item>

          <a-form-item name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
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
import { defineComponent, reactive } from 'vue';
import useStore from "@/stores/user";
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';
import { SUCCESS } from '@/network/response-status';
let router = useRouter();
let { LOGIN } = useStore();

interface FormState {
  mobile: string;
  password: string;
}

const formState = reactive<FormState>({
  mobile: '',
  password: '',
});
const onFinish = async (values: any) => {
  await LOGIN({ mobile: formState.mobile, password: formState.password });
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

</script>

<style lang="scss" scoped>
.page-login {
  width: 100%;
  height: 100vh;
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
      content: '';
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
  margin-top: 10px;
  // box-shadow: 0 0 10px #CCC;
  border: 3px solid whitesmoke;
  display: flex;
  width: 60%;
  height: 600px;
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
</style>
