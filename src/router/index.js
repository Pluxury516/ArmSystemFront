import {createRouter, createWebHistory} from 'vue-router'
import Error from '@/views/Error.vue'
import Login from "@/views/Login.vue"
import {checkPermissions} from "@/router/checkPermisstion"

const routes = [
    {
        path: '/',
        name: 'Index',
        meta: {requiresAuth: true},
        children: [
            {
                path: '/news',
                name: 'News',
                meta: {requiresAuth: true},
                component: () => import('../views/News.vue')
            },
            {
                path: '/users',
                name: 'Users',
                meta: {requiresAuth: true},
                component: () => import('../views/Users.vue')
            },
            {
                path: '/schools',
                name: 'Schools',
                meta: {requiresAuth: true},
                component: () => import('../views/Schools.vue')
            },
        ],
        component: () => import('../views/IndexView.vue')
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: 'Login',
            onlyNotAuth: true
        },
        component: Login
    },
    {
        path: '/error',
        name: 'ErrorPage',
        meta: {
            title: 'Error'
        },
        component: Error
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Error',
        meta: {
            title: 'Error'
        },
        component: Error
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})
router.beforeEach(async (to, from, next) => {
    await checkPermissions(to, from, next)
})
export default router
