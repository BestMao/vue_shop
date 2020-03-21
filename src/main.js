import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./plugins/element.js";
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios;
//axiso发送拦截，在发送信息的头部添加token信息作为登陆标记
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})
Vue.config.productionTip = false;
new Vue({
    router,
    render: h => h(App)
}).$mount("#app");