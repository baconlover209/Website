import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Commissions from '../views/Commissions.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/commissions',
        name: 'Commissions',
        component: Commissions
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
