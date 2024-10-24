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

// router.beforeEach((to, from) => {
// 而不是去检查每条路由记录
// to.matched.some(record => record.meta.requiresAuth)
//   if (to.meta.requiresAuth && !auth.isLoggedIn()) {
// 此路由需要授权，请检查是否已登录
// 如果没有，则重定向到登录页面
//     return {
//       path: '/login',
// 保存我们所在的位置，以便以后再来
//       query: { redirect: to.fullPath },
//     }
//   }
// })

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
