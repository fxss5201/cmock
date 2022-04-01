import { createApp } from 'vue'
import { store, storeKey } from './store'
import router from './router'
import App from './App.vue'
import './plugins/socket'

const app = createApp(App)

app.use(router)
app.use(store, storeKey)
app.mount('#app')
