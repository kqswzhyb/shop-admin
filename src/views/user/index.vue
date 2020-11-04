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
    <a-table class="mt20" :columns="columns" :data-source="data" bordered>
      <template v-slot:name="{ text }">
        <a>{{ text }}</a>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { reactive, getCurrentInstance } from 'vue';
import { Page } from '/@/api/interface';
import { getUserList } from '/@/api/user';
export let form = reactive({
  nickName: '',
  phone: '',
});
export let page: Page = reactive({
  total: 0,
  current: 1,
  size: 10,
});
const current = getCurrentInstance();

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
  getUserList(Object.assign({}, page, form));
};
export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    customRender: ({ text, index }) => {
      if (index < 4) {
        return '<a href="javascript:;">{text}</a>';
      }
      return {
        children: '<a href="javascript:;">{text}</a>',
        props: {
          colSpan: 5,
        },
      };
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
    customRender: ({ text, index }) => {
      if (index < 4) {
        return '<a href="javascript:;">{text}</a>';
      }
      return {
        children: '<a href="javascript:;">{text}</a>',
        props: {
          colSpan: 5,
        },
      };
    },
  },
  {
    title: 'Home phone',
    colSpan: 2,
    dataIndex: 'tel',
    customRender: ({ text, index }) => {
      const obj = {
        children: text,
        props: {},
      };
      if (index === 2) {
        obj.props.rowSpan = 2;
      }
      // These two are merged into above cell
      if (index === 3) {
        obj.props.rowSpan = 0;
      }
      if (index === 4) {
        obj.props.colSpan = 0;
      }
      return obj;
    },
  },
  {
    title: 'Phone',
    colSpan: 0,
    dataIndex: 'phone',
    customRender: ({ text, index }) => {
      if (index < 4) {
        return '<a href="javascript:;">{text}</a>';
      }
      return {
        children: '<a href="javascript:;">{text}</a>',
        props: {
          colSpan: 5,
        },
      };
    },
  },
  {
    title: 'Address',
    dataIndex: 'address',
    customRender: ({ text, index }) => {
      if (index < 4) {
        return '<a href="javascript:;">{text}</a>';
      }
      return {
        children: '<a href="javascript:;">{text}</a>',
        props: {
          colSpan: 5,
        },
      };
    },
  },
];

export const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    tel: '0571-22098909',
    phone: 18889898989,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    tel: '0571-22098333',
    phone: 18889898888,
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '5',
    name: 'Jake White',
    age: 18,
    tel: '0575-22098909',
    phone: 18900010002,
    address: 'Dublin No. 2 Lake Park',
  },
];
</script>

<style></style>
