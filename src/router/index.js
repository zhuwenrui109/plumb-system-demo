import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue';
import HistoryAlarm from '@/views/HistoryAlarm.vue';
import Setting from '@/views/Setting.vue';
import Manage from '@/views/Manage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: "/home"
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: "首页"
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: "登录"
      }
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: HistoryAlarm,
      meta: {
        title: "历史报警"
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
      meta: {
        title: "系统管理"
      },
      children: [
        {
          path: "",
          name: "manage",
          component: Manage,
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  if (token || to.path === '/login') {
    next();
  } else {
    console.log('router.currentRoute.value.fullPath :>> ', router.currentRoute.value.fullPath);
    localStorage.setItem("preRoute", router.currentRoute.value.fullPath);
    next('/login');
  }
})

export default router
