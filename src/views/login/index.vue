<template>
  <div class="page-login">
    <div class="flex login-container">
      <img src="../../assets/image/login_bg.jpg" class="bg" alt="">

      <div class="form flex flex-col justify-center align-center">

        <p class="welcome">欢迎回来</p>
        <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
            <a-input v-model:value="formState.username" />
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
let router = useRouter();
let { LOGIN } = useStore();

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = async (values: any) => {
  await LOGIN({ mobile: 15387716407, password: "zqszzz" });
  message.success('登录成功')
  router.push("/article/1");
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
