import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    name: 'layout',
    component: () => import('../views/layout.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('../views/Home.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/Login.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('/@/components/HelloWorld.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, form, next) => {
  const token = localStorage.getItem('token');
  if (token) {
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
