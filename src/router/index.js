import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
  ]
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  if (token || to.path === '/login') {
    next();
  } else {
    localStorage.setItem("preRoute", router.currentRoute.value.fullPath);
    next('/login');
  }
})

export default router
