import { createApp } from 'vue'
import App from './App.vue'
import { setupMonitoring } from './monitoring'
import { setupVisitorWidget } from './shared/visitorWidget.ts'
import './style.css'

setupVisitorWidget({ site: 'main' })

const app = createApp(App)
setupMonitoring(app)
app.mount('#app')
