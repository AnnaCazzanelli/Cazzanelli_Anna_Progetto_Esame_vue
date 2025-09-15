import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectsDetailsView from '@/views/ProjectsDetailsView.vue'
import IllustrationsView from '../views/IllustrationsView.vue'
import IllustrationsDetailsView from '@/views/IllustrationsDetailsView.vue' 
import ContactsView from '../views/ContactsView.vue'
 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/projects/:id',
      name: 'project-details',
      component: ProjectsDetailsView
    },
    {
      path: '/illustrations',
      name: 'illustrations',
      component: IllustrationsView
    },
    {
      path: '/illustrations/:id',
      name: 'illustration-details',
      component: IllustrationsDetailsView
    }
  ],
})

export default router
