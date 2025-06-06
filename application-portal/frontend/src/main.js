import './assets/main.css'
import 'primeicons/primeicons.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createApp, h, provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import apolloClient from './apolloClient.js'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast)

app.mount('#app')
