import { createApp } from 'vue'
import '../src/shared/tokens.css'
import { setupVisitorWidget } from '../src/shared/visitorWidget.ts'
import WorkApp from '../src/work/WorkApp.vue'

setupVisitorWidget({ site: 'work' })
createApp(WorkApp).mount('#app')
