import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
const app = createApp(App).use(store).use(router)

app.config.globalProperties.$filters = {
    dateFormat(date: Date) {
        return `${date.toLocaleDateString('en-US')}, ${date.toLocaleTimeString('en-US')}`;
    }
}

store.dispatch('init').then(() => app.mount('#app'))