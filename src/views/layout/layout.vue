<template>
  <a-layout class="layout-view">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="menu-layout">
      <div class="logo">电商后台管理系统</div>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" @click="goPage">
        <template v-for="item in menus">
          <a-sub-menu :key="item.menuId" v-if="item.children">
            <template #title>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="v in item.children">
              <a-sub-menu :key="v.menuId" v-if="v.children">
                <template #title>
                  <span>{{ v.name }}</span>
                </template>
                <a-menu-item :key="v.menuId">
                  <span>{{ v.name }}</span>
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item :key="v.menuId" v-else>
                <span>{{ v.name }}</span>
              </a-menu-item>
            </template>
          </a-sub-menu>
          <a-menu-item :key="item.menuId" v-else>
            <span>{{ item.name }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header-view">
        <MenuUnfoldOutlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <MenuFoldOutlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <a-dropdown>
          <a class="ant-dropdown-link"> {{ info.nickName }} </a>
          <template v-slot:overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="password"> 修改密码 </a-menu-item>
              <a-menu-item key="logout"> 退出登录 </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content class="content-view">
        <router-view />
      </a-layout-content>
    </a-layout>
    <a-modal v-model:visible="visible" title="修改密码" @ok="e => submitPasswordForm(e)">
      <a-form :label-col="{ span: 4 }">
        <a-form-item label="老密码" name="oldPassword" v-bind="validateInfos.oldPassword">
          <a-input
            type="password"
            v-model:value.trim="passwordForm.oldPassword"
            placeholder="请输入"
            allowClear
          />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword" v-bind="validateInfos.newPassword">
          <a-input
            type="password"
            v-model:value.trim="passwordForm.newPassword"
            placeholder="请输入"
            allowClear
          />
        </a-form-item>
        <a-form-item label="确认密码" name="confirmPassword" v-bind="validateInfos.confirmPassword">
          <a-input
            type="password"
            v-model:value.trim="passwordForm.confirmPassword"
            placeholder="请输入"
            allowClear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script lang="ts" setup="props,context">
import { ref, reactive, watch, watchEffect } from 'vue';
import { logout, updatePassword } from '@/api/common';
import { message } from 'ant-design-vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { commonFunc } from '@/utils/util';
import { useForm } from '@ant-design-vue/use';

const store = useStore();

const router = useRouter();
const route = useRoute();

ref: info = {};
ref: menus = [];
ref: visible = false;

let selectedKeys = reactive([]);

watchEffect(() => {
  info = store.getters['user/info'];
  menus = store.getters['user/menus'];
  if (menus.length !== 0) {
    const data = menus.find(v => route.path.includes(v.path));
    if (data) {
      selectedKeys = [data.menuId];
    } else {
      selectedKeys = [];
    }
  }
});

ref: collapsed = false;
ref: menuWidth = '200px';

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: '',
  userId: '',
  oldPassword: '',
});
const validatePass = async (rule, value) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else {
    if (value !== '') {
      return Promise.resolve();
    }
    return Promise.resolve();
  }
};
const validatePass2 = async (rule, value, callback) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else if (value !== passwordForm.newPassword) {
    return Promise.reject('密码不一致');
  } else {
    return Promise.resolve();
  }
};
const rulesRef = reactive({
  newPassword: [
    {
      validator: validatePass,
      required: true,
    },
  ],
  oldPassword: [
    {
      required: true,
      message: '请输入老密码',
    },
  ],
  confirmPassword: [
    {
      validator: validatePass2,
      required: true,
    },
  ],
});

watch(
  ()=>collapsed,
  val => {
    menuWidth = val ? '80px' : '200px';
  },
  {
    immediate: true,
  },
);

const { resetFields, validate, validateInfos } = useForm(passwordForm, rulesRef);

const handleMenuClick = ({ key }) => {
  if (key === 'logout') {
    logout().then(() => {
      message.success('退出成功');
      localStorage.removeItem('token');
      router.push('/login');
    });
  }
  if (key === 'password') {
    resetFields();
    passwordForm.userId = store.state.user.info.userId;
    visible = true;
  }
};
let path = '';
const handleMenuList = (data, key) => {
  data.find(v => {
    if (v.menuId === key) {
      path = v.path;
      return true;
    }
    if (v.children) {
      handleMenuList(v.children, key);
    }
  });
};
const goPage = val => {
  handleMenuList(menus, val.key);
  router.push(path);
};
const submitPasswordForm = e => {
  e.preventDefault();
  validate().then(() => {
    commonFunc(updatePassword, passwordForm, () => {
      visible = false;
    });
  });
};
</script>
<style lang="less" scoped>
.layout-view {
  min-height: 100vh;
  .trigger {
    font-size: 18px;
    line-height: 64px;
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
  .ant-menu-inline-collapsed:deep(> .ant-menu-submenu > .ant-menu-submenu-title) {
    padding: 0 12px !important;
  }
  .ant-menu-inline-collapsed:deep(> .ant-menu-item) {
    padding: 0 12px !important;
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
  left: v-bind(menuWidth);
  width: calc(100vw - v-bind(menuWidth));
  transition: all 0.2s;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 20px;
}
.content-view {
  margin: 88px 16px 30px calc(24px + v-bind(menuWidth));
  padding: 24px;
  background: #fff;
  min-height: 280px;
}
.ant-menu-item:deep {
  margin-bottom: 0 !important;
  margin-top: 0;
}
</style>
