import Vue from 'vue';
import App from './App.vue';
import i18n from './plugins/i18n';
import store from './store';
import './plugins/vee-validate';

// Import app custom styles
import './assets/sass/app.scss';

Vue.config.productionTip = false;

new Vue({
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
