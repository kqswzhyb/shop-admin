import { getUserInfo } from '/@/api/common';
const state = {
  info: {
    nickName: '',
  },
  permission: [],
  menus: [],
};

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
  async getUserInfo({ commit }) {
    let result = await getUserInfo();
    commit('getUserInfo', result.data.data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
