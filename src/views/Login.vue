<template>
  <div>
      233232
    <!-- <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="用户名" v-bind="validateInfos.username">
        <a-input v-model:value="modelRef.username" />
      </a-form-item>
      <a-form-item label="密码" v-bind="validateInfos.password">
        <a-input v-model:value="modelRef.password" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit"> 创建 </a-button>
        <a-button style="margin-left: 10px" @click="reset"> 重置 </a-button>
      </a-form-item>
    </a-form> -->
  </div>
</template>

<script lang="ts" setup="props">
import { reactive, toRaw } from 'vue';
import { useForm } from '@ant-design-vue/use';

export const modelRef = reactive({
  username: '',
  password: '',
});

export const labelCol = { span: 4 };
export const wrapperCol = { span: 14 };

export const rulesRef=reactive({
    username: [
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
  })

const { resetFields, validate, validateInfos } = useForm(modelRef,rulesRef);
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

<style></style>
