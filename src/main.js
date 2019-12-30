import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText} from '@fortawesome/vue-fontawesome';
import axios from 'axios'
import { Service } from '@/plugins/Service'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false;
Vue.prototype.$axios = Service;

Vue.use(ElementUI);
Vue.use(VueAxios, axios)
library.add(fas, far, fab)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text',FontAwesomeLayersText)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
