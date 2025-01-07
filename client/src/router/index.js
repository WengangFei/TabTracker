import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: '/login',
            component: () => import('../components/LogIn.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: HomeView,
            beforeEnter: (to, from, next) => {
                const isAuthenticated = true;
                if (isAuthenticated) {
                    next();
                } else {
                    next('/login');
                }
            }
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting       
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../components/AboutView.vue')
        },
        {
            path: '/user/:id',
            name: 'user',
            // route level code-splitting       
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../components/UserId.vue')
        },
        {
            path: '/register',
            name: 'register',
            // route level code-splitting       
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../components/RegistrationPage.vue')
        }
    ]
})
export default router