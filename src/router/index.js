import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue';
import HistoryAlarm from '@/views/HistoryAlarm.vue';
import Setting from '@/views/Setting.vue';
import Manage from '@/views/Manage.vue';
import Connect from '@/views/Connect.vue';
import Stand from '@/views/Stand.vue';
import User from '@/views/User.vue';
import System from '@/views/System.vue';
import HistoryFault from '@/views/HistoryFault.vue';
import { clearToken, tokenExpressInTime } from '@/utils/tool';

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
      path: '/fault',
      name: 'fault',
      component: HistoryFault,
      meta: {
        title: "历史故障"
      }
    },
    {
      path: '/setting',
      component: Setting,
      children: [
        {
          path: "",
          name: "setting",
          component: Manage,
          meta: {
            title: "设备管理"
          },
          props: true
        },
        {
          path: "connect",
          name: "connect",
          component: Connect,
          meta: {
            title: "设备连接"
          },
        },
        {
          path: "stand",
          name: "stand",
          component: Stand,
          meta: {
            title: "场站管理"
          },
        },
        {
          path: "user",
          name: "user",
          component: User,
          meta: {
            title: "账号管理"
          },
        },
        {
          path: "system",
          name: "system",
          component: System,
          meta: {
            title: "系统设置"
          },
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if ((localStorage.getItem('token') && !tokenExpressInTime()) || to.path === '/login') {
    next();
  } else {
    localStorage.setItem("preRoute", to.fullPath);
    clearToken();
    next('/login');
  }
})

export default router
