import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component:  () => import( '/@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( '/@/views/Login.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import( '/@/components/HelloWorld.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
