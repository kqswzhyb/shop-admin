<template>
  <div class="login-form">
    <div class="form-bg">
      <h1>登录</h1>
      <a-form :wrapper-col="{ span: 12, offset: 6 }">
        <a-form-item>
          <a-input
            v-model:value="modelRef.userName"
            @focus="onFocus"
            @blur="onBlur"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-model:value="modelRef.password"
            @focus="onFocus"
            @blur="onBlur"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 5 }">
          <a-button type="primary" @click="onSubmit"> 登录 </a-button>
          <a-button style="margin-left: 10px" @click="reset"> 重置 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup="props">
import { loginByName } from '/@/api/common';
import router from '/@/router';
import { LoginConfig } from '/@/api/interface';
import { reactive, toRaw, ref } from 'vue';
import { useForm } from '@ant-design-vue/use';
import { message } from 'ant-design-vue';

export const modelRef: LoginConfig = reactive({
  userName: '',
  password: '',
});

export const rulesRef = reactive({
  userName: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
});

export const onSubmit = () => {
  loginByName(modelRef).then((res) => {
    message.success('登录成功');
    localStorage.setItem('token', res.data.data);
    router.push('/home');
  });
};

export const opacity = ref('0');

export const onFocus = () => {
  opacity.value = '5px';
};
export const onBlur = () => {
  opacity.value = '0';
};

// const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
// export const onSubmit = (e) => {
//   e.preventDefault();
//   validate()
//     .then((res) => {
//       console.log(res, toRaw(modelRef));
//     })
//     .catch((err) => {
//       console.log('error', err);
//     });
// };
// export const reset = () => {
//   resetFields();
// };
</script>

<style lang="scss" scoped vars="{ opacity }">
.login-form {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: url('/@/assets/img/eba3a18057eaeaa1c8c93e76b9b794300ee6ccdf.jpg@1920w_826h.webp')
    no-repeat;
  background-size: cover;
  text-align: center;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: inherit;
    filter: blur(var(--opacity));
    transition: all 0.3s linear;
    z-index: 1;
  }
  .form-bg {
    display: flex;
    position: absolute;
    z-index: 3;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.7);
    width: 500px;
    height: 70vh;
    min-height: 400px;
    border-radius: 30px;
  }
  h1 {
    font-size: 28px;
    color: #fff;
  }
}
</style>
