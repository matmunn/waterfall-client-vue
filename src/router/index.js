import { SET_NEXT_ROUTE } from '@/store/mutations'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Auth from 'Auth'

import HomeRoute from './routeComponents/HomeRoute'
import AdminRoute from './routeComponents/AdminRoute'

import WeeklyOverviewRoute from './routeComponents/WeeklyOverviewRoute'

import AdminTaskListRoute from './routeComponents/admin/TaskListRoute'
import AdminTaskListMineRoute from './routeComponents/admin/TaskListMineRoute'
import AdminTaskAddRoute from './routeComponents/admin/TaskAddRoute'
import AdminTaskEditRoute from './routeComponents/admin/TaskEditRoute'

import AdminUserListRoute from './routeComponents/admin/UserListRoute'
import AdminUserAddRoute from './routeComponents/admin/UserAddRoute'
import AdminUserEditRoute from './routeComponents/admin/UserEditRoute'

import AdminCategoryListRoute from './routeComponents/admin/CategoryListRoute'
import AdminCategoryAddRoute from './routeComponents/admin/CategoryAddRoute'
import AdminCategoryEditRoute from './routeComponents/admin/CategoryEditRoute'

import AdminClientListRoute from './routeComponents/admin/ClientListRoute'
import AdminClientAddRoute from './routeComponents/admin/ClientAddRoute'
import AdminClientEditRoute from './routeComponents/admin/ClientEditRoute'

import RouteNotFoundRoute from './routeComponents/RouteNotFoundRoute'
import LoginComponent from './routeComponents/LoginComponent'
import LogoutComponent from './routeComponents/LogoutComponent'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomeRoute,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/overview',
    component: WeeklyOverviewRoute,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    component: AdminRoute,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'tasks',
        component: AdminTaskListRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tasks/mine',
        component: AdminTaskListMineRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tasks/add',
        component: AdminTaskAddRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tasks/:id/edit',
        component: AdminTaskEditRoute,
        meta: {
          requiresAuth: true
        }
      },

      {
        path: 'users',
        component: AdminUserListRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'users/add',
        component: AdminUserAddRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'users/:id/edit',
        component: AdminUserEditRoute,
        meta: {
          requiresAuth: true
        }
      },

      {
        path: 'categories',
        component: AdminCategoryListRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'categories/add',
        component: AdminCategoryAddRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'categories/:id/edit',
        component: AdminCategoryEditRoute,
        meta: {
          requiresAuth: true
        }
      },

      {
        path: 'clients',
        component: AdminClientListRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'clients/add',
        component: AdminClientAddRoute,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'clients/:id/edit',
        component: AdminClientEditRoute,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: LoginComponent,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/logout',
    component: LogoutComponent,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '*',
    component: RouteNotFoundRoute,
    meta: {
      requiresAuth: false
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  Auth.expireInvalidLogins()
  next()
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !Auth.isLoggedIn()) {
    router.app.$store.commit(SET_NEXT_ROUTE, to)
    next('/login')
  } else {
    next()
  }
})

export default router
