<template>
  <div
    :style="{ background: `url(${bg}) no-repeat`, 'background-size': 'cover' }"
    class="login-form"
  >
    <div class="form-bg">
      <h1>登录</h1>
      <a-form :wrapper-col="{ span: 12, offset: 6 }">
        <a-form-item v-bind="validateInfos.userName">
          <a-input
            v-model:value="modelRef.userName"
            @focus="onFocus"
            @blur="onBlur"
            placeholder="请输入用户名"
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.password">
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
    <a-modal v-model:visible="visible" :footer="null" :width="420" title="验证">
      <div class="captcha-view">
        <img :src="captcha.bg" alt="" />
        <RedoOutlined class="refresh-icon" @click="refreshCaptcha" />
        <a-slider :tip-formatter="null" v-model:value="modelRef.x" @afterChange="afterChange" />
        <img
          :src="captcha.puzzle"
          class="puzzle-img"
          :style="{ left: x, top: captcha.y + 'px' }"
          alt=""
        />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup="props">
import { loginByName, getCaptcha } from '@/api/common';
import { LoginConfig } from '@/api/interface';
import { reactive, ref, getCurrentInstance, computed } from 'vue';
export { RedoOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useForm } from '@ant-design-vue/use';

const router = useRouter();
export const bg = require('@/assets/img/eba3a18057eaeaa1c8c93e76b9b794300ee6ccdf.jpg@1920w_826h.webp');
export const modelRef: LoginConfig = reactive({
  userName: '',
  password: '',
  uid: '',
  x: 0,
});

export const x = computed(() => modelRef.x * 3.75 + 'px');
const {
  ctx: { $message },
} = getCurrentInstance();

export const visible = ref(false);

export const captcha = reactive({
  bg: '',
  puzzle: '',
  uid: '',
  y: '',
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
export const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

export const refreshCaptcha = () => {
  getCaptcha().then(res => {
    const data = res.data.data;
    captcha.bg = data.bg;
    captcha.puzzle = data.puzzle;
    captcha.uid = data.uid;
    modelRef.uid = data.uid;
    captcha.y = data.y;
  });
  modelRef.uid = '';
  modelRef.x = '';
};

export const onSubmit = e => {
  e.preventDefault();
  validate().then(() => {
    visible.value = true;
    refreshCaptcha();
  });
};

export const afterChange = () => {
  loginByName(Object.assign({}, modelRef, { x: parseInt(x.value.replace('px', '')) + '' }))
    .then(res => {
      localStorage.setItem('token', res.data.data);
      $message.success('登录成功');
      router.push('/home');
    })
    .catch(err => {
      if (err.data === 1) {
        refreshCaptcha();
      }
    });
};

export const opacity = ref('0');

export const onFocus = () => {
  opacity.value = '5px';
};
export const onBlur = () => {
  opacity.value = '0';
};
</script>

<style lang="less" scoped vars="{ opacity }">
.login-form {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
.captcha-view {
  position: relative;
  text-align: center;
  .refresh-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }
  .puzzle-img {
    position: absolute;
  }
}
</style>
