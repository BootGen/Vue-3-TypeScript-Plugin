import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

store.dispatch('init').then(() => {
    const app = createApp(App).use(store).use(router)
    app.config.globalProperties.$filters = {
        dateFormat(date: Date) {
            return `${date.toLocaleDateString('en-US')}, ${date.toLocaleTimeString('en-US')}`;
        }
    }
    app.mount('#app')
})
