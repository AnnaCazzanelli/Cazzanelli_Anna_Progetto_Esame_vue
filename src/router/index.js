import { createRouter, createWebHistory } from "vue-router"

/* Import viste */
import HomeView from "@/views/HomeView.vue"
import AboutView from "@/views/AboutView.vue"
import ProjectsView from "@/views/ProjectsView.vue"
import ProjectsDetailsView from "@/views/ProjectsDetailsView.vue"
import IllustrationsView from "@/views/IllustrationsView.vue"
import IllustrationsDetailsView from "@/views/IllustrationsDetailsView.vue"
import ContactsView from "@/views/ContactsView.vue"

/* Configurazione router */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* Pagina Home */
    {
      path: "/",
      name: "home",
      component: HomeView,
    },

    /* About */
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },

    /* Contatti */
    {
      path: "/contacts",
      name: "contacts",
      component: ContactsView,
    },

    /* Progetti */
    {
      path: "/projects",
      name: "projects",
      component: ProjectsView,
    },
    /* Dettaglio progetto */
    {
      path: "/projects/:id",
      name: "project-details",
      component: ProjectsDetailsView,
    },

    /* Illustrazioni */
    {
      path: "/illustrations",
      name: "illustrations",
      component: IllustrationsView,
    },

    /* Dettaglio illustrazione */
    {
      path: "/illustrations/:id",
      name: "illustration-details",
      component: IllustrationsDetailsView,
    },
  ],
})

export default router
