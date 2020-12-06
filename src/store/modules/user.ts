import { getUserInfo } from '../../api/common';
import router, { routes } from '../../router/index'

const mainMenu = {
  path: '/',
  redirect: '/home',
  name: 'layout',
  component: () => import('@/views/layout/layout.vue'),
  children: [
    {
      path: 'home',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    }
  ],
}

const state = {
  info: {
    nickName: '',
  },
  permission: [],
  menus: []
};

const getters = {
  info: state => state.info,
  permission: state => state.permission,
  menus: state => state.menus
}

const mutations = {
  getUserInfo: (state, data) => {
    state.info = data.info;
    state.permission = data.permission;
    if (data.menus.length !== 0 && data.menus[0].parentId === '0') {
      state.menus = data.menus[0].children;
    } else {
      state.menus = data.menus;
    }
  },
};

const handleMenuList = (data) => {
  data.forEach(v => {
    if (v.type === '0') {
      globalThis.menuList.push({
        path: v.path,
        name: v.name,
        component: () => import(/* webpackChunkName: "[request]" */`@/${v.component}`),
        meta: {
          keepAlive: v.keepAlive,
          icon: v.icon
        }
      })
    }
    if (v.children) {
      handleMenuList(v.children)
    }
  })
}

const actions = {
  getUserInfo({ commit, state }) {
    return new Promise(async (resolve) => {
      const result = await getUserInfo();
      commit('getUserInfo', result.data.data);
      globalThis.menuList = []
      handleMenuList(state.menus)
      mainMenu.children = [...mainMenu.children, ...globalThis.menuList]
      router.addRoute(mainMenu)
      resolve(routes.concat(mainMenu))
    })
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
