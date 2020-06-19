import Vue from 'vue'
import App from './App.vue'
import i18n from './plugins/i18n'

// Import app custom styles
import './assets/sass/app.scss'

Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
