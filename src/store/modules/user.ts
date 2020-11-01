import { getUserInfo } from '/@/api/common';
const state = {
  info: {},
  permission: [],
};

const mutations = {
  getUserInfo: (state: any, data: { info: any; permission: any[] }) => {
    state.info = data.info;
    if (data.permission.length !== 0 && data.permission[0].parentId === '0') {
      state.permission = data.permission[0].children;
    } else {
      state.permission = data.permission;
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
