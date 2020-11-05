<template>
  <div>
    <a-form layout="inline" ref="search" :model="form" @submit="searchList" @submit.native.prevent>
      <a-form-item name="nickName">
        <a-input v-model:value.trim="form.nickName" placeholder="昵称" />
      </a-form-item>
      <a-form-item name="phone">
        <a-input v-model:value.trim="form.phone" placeholder="手机号码" />
      </a-form-item>
      <a-form-item>
        <a-button class="mr10" type="primary" html-type="submit"> 搜索 </a-button>
        <a-button @click="resetForm"> 清空 </a-button>
      </a-form-item>
    </a-form>
    <a-table
      class="mt20"
      :columns="columns"
      :data-source="data"
      bordered
      :loading="loading"
      :pagination="pagination"
      :rowKey="(record) => record.userId"
    >
      <template #index="{ index }">
        <span>{{ page.pageSize * (page.current - 1) + index + 1 }}</span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, getCurrentInstance, onBeforeMount, ref, toRefs } from 'vue';
import { Page } from '/@/api/interface';
export { user as columns } from '/@/table/user/user';
import { getUserList } from '/@/api/user';
export let form = reactive({
  nickName: '',
  phone: '',
});
export let page: Page = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
});
export let pagination = reactive({
  defaultPageSize: 10,
  showTotal: (total) => `共 ${total} 条数据`,
  showSizeChanger: true,
  pageSizeOptions: ['5', '10', '15', '20'],
  onShowSizeChange: (current, pageSize) => {
    page.current = 1;
    page.pageSize = pageSize;
    getList();
  },
  onChange: (current, pageSize) => {
    page.current = current;
    page.pageSize = pageSize;
    getList();
  },
  ...toRefs(page),
});
const current = getCurrentInstance();

export let data = ref([]);

export let loading = ref(false);

onBeforeMount(() => {
  getList();
});

export const searchList = () => {
  page.current = 1;
  getList();
};
export const resetForm = () => {
  form.nickName = '';
  form.phone = '';
  searchList();
};

export const getList = () => {
  loading.value = true;
  getUserList(Object.assign({}, { current: page.current, size: page.pageSize }, form))
    .then((res) => {
      const result = res.data.data;
      data.value = result.records;
      page.total = result.total;
      page.pageSize = result.size - 0;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style></style>
