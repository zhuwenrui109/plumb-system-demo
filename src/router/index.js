import { createRouter, createWebHistory } from 'vue-router'
import { clearToken, tokenExpressInTime } from '@/utils/tool';
import homeToastPlguin from '@/utils/homeToast';

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
      component: () => import("@/views/Home.vue"),
      meta: {
        title: "首页",
        needRole: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/Login.vue"),
      meta: {
        title: "登录",
        needRole: false
      }
    },
    {
      path: '/alarm',
      name: 'alarm',
      component: () => import("@/views/HistoryAlarm.vue"),
      meta: {
        title: "历史报警",
        needRole: false
      }
    },
    {
      path: '/realAlarm/:id',
      name: 'realAlarm',
      component: () => import("@/views/RealAlarm.vue"),
      meta: {
        title: "实时报警",
        needRole: false
      }
    },
    {
      path: '/fault',
      name: 'fault',
      component: () => import("@/views/HistoryFault.vue"),
      meta: {
        title: "历史故障",
        needRole: false
      }
    },
    {
      path: '/setting',
      component: () => import("@/views/Setting.vue"),
      children: [
        {
          path: "",
          name: "setting",
          component: () => import("@/views/Manage.vue"),
          meta: {
            title: "设备管理",
            needRole: true
          },
          props: true
        },
        {
          path: "connect",
          name: "connect",
          component: () => import("@/views/Connect.vue"),
          meta: {
            title: "设备连接",
            needRole: true
          },
        },
        {
          path: "stand",
          name: "stand",
          component: () => import("@/views/Stand.vue"),
          meta: {
            title: "场站管理",
            needRole: true
          },
        },
        {
          path: "user",
          name: "user",
          component: () => import("@/views/User.vue"),
          meta: {
            title: "账号管理",
            needRole: true
          },
        },
        {
          path: "system",
          name: "system",
          component: () => import("@/views/System.vue"),
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
  const role = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
  const token = localStorage.getItem('token') || sessionStorage.getItem("token");
  if ((token && !tokenExpressInTime()) || to.path === '/login') {
    if (!to.meta.needRole) {
      next();
    } else {
      if (role == 2) {
        homeToastPlguin("权限不足,请联系管理员");
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
