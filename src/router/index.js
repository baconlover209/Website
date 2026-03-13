import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Commissions from '../views/Commissions.vue'
import Gallery from '../views/Gallery.vue'
import Projects from '../views/Projects.vue'
import Queue from '../views/Queue.vue'

import TOS from '../views/TOS.vue'
import CommissionRequest from '../views/CommissionRequest.vue'

export const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/commissions',
        name: 'Commissions',
        component: Commissions
    },
    {
        path: '/commissions/request',
        name: 'CommissionRequest',
        component: CommissionRequest
    },
    {
        path: '/tos',
        name: 'TOS',
        component: TOS
    },
    {
        path: '/gallery',
        name: 'Gallery',
        component: Gallery
    },
    {
        path: '/projects',
        name: 'Projects',
        component: Projects
    },
    {
        path: '/queue',
        name: 'Queue',
        component: Queue
    },
]

const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
})

export default router
