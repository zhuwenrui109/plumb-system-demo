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
import toastPlguin from '@/utils/toast';
import Test from '@/views/Test.vue';

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
        title: "首页",
        needRole: false
      }
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: {
        title: "测试",
        needRole: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: "登录",
        needRole: false
      }
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: HistoryAlarm,
      meta: {
        title: "历史报警",
        needRole: false
      }
    },
    {
      path: '/fault',
      name: 'fault',
      component: HistoryFault,
      meta: {
        title: "历史故障",
        needRole: false
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
            title: "设备管理",
            needRole: true
          },
          props: true
        },
        {
          path: "connect",
          name: "connect",
          component: Connect,
          meta: {
            title: "设备连接",
            needRole: true
          },
        },
        {
          path: "stand",
          name: "stand",
          component: Stand,
          meta: {
            title: "场站管理",
            needRole: true
          },
        },
        {
          path: "user",
          name: "user",
          component: User,
          meta: {
            title: "账号管理",
            needRole: true
          },
        },
        {
          path: "system",
          name: "system",
          component: System,
          meta: {
            title: "系统设置",
            needRole: true
          },
        }
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem("userRole");
  if ((localStorage.getItem('token') && !tokenExpressInTime()) || to.path === '/login') {
    if (!to.meta.needRole) {
      next();
    } else {
      if (role == 2) {
        toastPlguin("权限不足,请联系管理员");
        console.log('form :>> ', from);
        next(from.path);
      } else {
        next();
      }
    }
  } else {
    localStorage.setItem("preRoute", to.fullPath);
    clearToken();
    next('/login');
  }
})

export default router
