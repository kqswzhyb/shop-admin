<template>
  <a-layout class="layout-view">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">电商后台管理系统</div>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="1">
          <user-outlined />
          <span>nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span>nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span>nav 3</span>
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
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup="props,context">
import { ref, getCurrentInstance } from 'vue';
import { logout } from '/@/api/common';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';

const { ctx } = getCurrentInstance();
const store = useStore();

const router = ctx.$router;

export const info = ref(store.state.module0.info);

export const handleMenuClick = ({ key }) => {
  if (key === 'logout') {
    logout().then(() => {
      message.success('退出成功');
      localStorage.removeItem('token');
      router.push('/login');
    });
  }
};
export const collapsed = ref(false);
</script>
<style lang="scss" scoped>
.layout-view {
  height: 100vh;
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: #1890ff;
    }
  }
  .logo {
    height: 32px;
    line-height: 32px;
    font-size: 24px;
    margin: 16px;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }
}
.header-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 20px;
}
</style>
