import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router';
import store from './store';
import App from './App.vue';

const app = createApp(App);

(app.config as any).productionTip = false;
app.config.warnHandler = () => { };
app.use(Antd);
app.use(router);
app.use(store);
app.mount('#app');
