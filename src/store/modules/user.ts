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

const actions = {
  getUserInfo({ commit, state }) {
    return new Promise(async (resolve) => {
      const result = await getUserInfo();
      commit('getUserInfo', result.data.data);
      const menuList = state.menus.map(v => ({
        path: v.path,
        name: v.name,
        component: () => import(`@/${v.component}`),
        meta: {
          keepAlive: v.keepAlive,
          icon: v.icon
        }
      }))
      mainMenu.children = [...mainMenu.children, ...menuList]
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
