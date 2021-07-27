import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { User } from './models/User'

Vue.config.productionTip = false

store.dispatch('init');

Vue.filter('dateFormat', function(date: Date){
  return `${date.toLocaleDateString('en-US')}, ${date.toLocaleTimeString('en-US')}`;
})

new Vue({
  router,
  store,
  vuetify,
  mounted: async function() {
    if(store.state.auth.jwt){
      this.$store.state.auth.user = await this.$store.dispatch('profile');
    }
  },
  data: function () {
    return {
      user: null as (User | null)
    };
  },
  render: h => h(App)
}).$mount('#app')
