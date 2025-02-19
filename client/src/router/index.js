import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import { useLoginAuthStore } from '../stores/loginAuthStore';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView,
        },
   
        {
            path: '/login',
            name: 'login',
            component: () => import('../components/LogIn.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/home',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: true },
        },
        {
            path: '/user_profile',
            name: 'user_profile',
            component: () => import('../components/UserProfile.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../components/AboutView.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/user/:id',
            name: 'user',
            component: () => import('../components/UserId.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../components/RegistrationPage.vue'),
            meta: { requiresAuth: false },
        },
        {
            path: '/setting',
            name: 'settings',
            component: () => import('../components/SettingPage.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/puppies',
            name: 'puppies',
            component: () => import('../components/PuppiesView.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/search',
            name: 'search',
            component: () => import('../components/HomeSearchWindow.vue'),
        },
        {
            path: '/create_events',
            name: 'create_events',
            component: () => import('../components/CreateEvents.vue'),
        }
    ]
});

// Add a global navigation guard
router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    const loginAuthStore = useLoginAuthStore();
    const isAuthenticated = loginAuthStore.isAuthenticated; 
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: 'login' });
    } else {
      next(); // Allow navigation
    }
  });
  



export default router