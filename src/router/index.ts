import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import FormView from '@/views/FormView.vue'
import ResultsView from '@/views/ResultsView.vue'
import { useInspectionStore } from '@/stores/useInspectionStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/form',
      name: 'form',
      component: FormView,
      beforeEnter: () => {
        // Guard: impede acesso direto ao formulário sem softwareName
        const store = useInspectionStore()
        if (!store.softwareName) {
          return { name: 'home' }
        }
      },
    },
    {
      path: '/results',
      name: 'results',
      component: ResultsView,
      beforeEnter: () => {
        // Guard: impede acesso direto aos resultados sem dados
        const store = useInspectionStore()
        if (!store.result) {
          return { name: 'home' }
        }
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
