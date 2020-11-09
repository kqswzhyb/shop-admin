import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    name: 'layout',
    component: () => import('../views/layout/layout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('../views/role/index.vue'),
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/user/index.vue'),
      },
      {
        path: 'dic',
        name: 'Dic',
        component: () => import('../views/dic/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, form, next) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (Object.keys((store as any).state.user.info).length === 1) {
      store.dispatch('user/getUserInfo');
    }
    if (to.path === '/login') {
      next({ path: '/' });
    }
  } else {
    if (to.path !== '/login') {
      next({ path: '/login' });
    }
  }
  next();
});

export default router;
