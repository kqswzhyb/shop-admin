import { createStore } from 'vuex';

import module from 'globby!/@/store/modules/*.ts';

export default createStore({
  modules: module,
});
