import { createStore } from 'vuex';
import createLogger from '../utils/logger';

const modulesFiles = require.context('./modules', true, /\.ts$/);

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

export default createStore({
  modules,
  strict: false,
  plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
});
