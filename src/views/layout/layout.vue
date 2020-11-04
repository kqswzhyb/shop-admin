<template>
  <a-layout class="layout-view">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="menu-layout">
      <div class="logo">电商后台管理系统</div>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" @click="goPage">
        <a-menu-item v-for="item in menus" :key="item.menuId">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header-view">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <a-dropdown>
          <a class="ant-dropdown-link"> {{ info.nickName }} </a>
          <template v-slot:overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="logout"> 退出 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content class="content-view">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup="props,context">
import { ref, reactive, watch } from 'vue';
import { logout } from '/@/api/common';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const store = useStore();

const router = useRouter();
const route = useRoute();

export const info = ref(store.state.module0.info);
export const menus = ref(store.state.module0.menus);

export let selectedKeys = reactive([]);

watch(
  route,
  (val) => {
    const data = menus.value.find((v) => val.path.includes(v.path));
    if (data) {
      selectedKeys = [data.menuId];
    } else {
      selectedKeys = [];
    }
  },
  {
    immediate: true,
  },
);
export const collapsed = ref(false);
export const menuWidth = ref('200px');

watch(
  collapsed,
  (val) => {
    menuWidth.value = val ? '80px' : '200px';
  },
  {
    immediate: true,
  },
);

export const handleMenuClick = ({ key }) => {
  if (key === 'logout') {
    logout().then(() => {
      message.success('退出成功');
      localStorage.removeItem('token');
      router.push('/login');
    });
  }
};
export const goPage = (val) => {
  const data = menus.value.find((v) => v.menuId === val.key);
  router.push(data.path);
};
</script>
<style lang="less" scoped vars="{menuWidth}">
.layout-view {
  min-height: 100vh;
  .trigger {
    font-size: 18px;
    line-height: 64px;
    // padding: 0 24px;
    // cursor: pointer;
    // transition: color 0.3s;
    // &:hover {
    //   color: #1890ff;
    // }
  }
  .logo {
    height: 32px;
    line-height: 32px;
    font-size: 24px;
    margin: 16px;
    color: @white;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }
}
.menu-layout {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  height: 100vh;
}
.header-view {
  position: fixed;
  top: 0;
  left: var(--menuWidth);
  width: calc(100vw - var(--menuWidth));
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 20px;
}
.content-view {
  margin: 88px 16px 30px calc(24px + var(--menuWidth));
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
.ant-menu-item::v-deep {
  margin-bottom: 0 !important;
  margin-top: 0;
  background-color: #2d3350;
}
</style>
