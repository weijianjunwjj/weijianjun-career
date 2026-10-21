import { createApp } from 'vue'
import App from './App.vue'
import { setupMonitoring } from './monitoring'
import './style.css'

const app = createApp(App)
setupMonitoring(app)
app.mount('#app')
