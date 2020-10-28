<template>
  <a-button type="primary" @click="userExport"> 导出 </a-button>
</template>

<script lang="ts" setup="props">
import { printUser } from '/@/api/common';
import { downLoadFile } from '/@/utils/util';
export const userExport = () => {
  printUser().then((res) => {
    downLoadFile(res.data, '用户列表.xlsx');
  });
};
</script>

<style></style>
