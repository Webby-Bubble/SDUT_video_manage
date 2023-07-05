import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '@/assets/css/et.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:9999'
Vue.prototype.path = 'http://localhost:9999'
Vue.prototype.$http = axios
/*二维码*/
import QRCode from "qrcode"
Vue.prototype.QR = QRCode
Vue.use(QRCode)

/*粒子特效*/
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
Vue.config.productionTip = false

/*router.beforeEach((to,from,next)=>{
  if(to.fullPath != '/'){
    if(JSON.parse(sessionStorage.getItem('user')) != null){
      return next()
    }else {
      return next('/')
    }
  }else {
    return next()
  }
})*/

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
