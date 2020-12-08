import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import store from '../store';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
  },
];

let router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, form) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (Object.keys((store as any).state.user.info).length === 1) {
      await store.dispatch('user/getUserInfo');
      store.dispatch('common/getDic');
      router.push({ ...to, replace: true })
    }
    if (to.path === '/login') {
      router.push('/')
    }
  } else {
    if (to.path !== '/login') {
      router.push('/login')
    }
  }
});

export default router;
