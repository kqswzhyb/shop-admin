import { getAllDic } from '../../api/common';
const state = {
  dic: {
  },
};

const getters = {
  dic: state => state.dic,
}

const mutations = {
  getDic: (state, data) => {
    state.dic = data;
  },
};

const actions = {
  async getDic({ commit }) {
    const result = await getAllDic();
    commit('getDic', result.data.data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
