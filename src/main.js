import Vue from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./plugins/element.js";
import "./assets/css/global.css";
import "./assets/fonts/iconfont.css";
//导入树形插件
import TreeTable from 'vue-table-with-tree-grid';
//导入富编辑框
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios;
//axiso发送拦截，在发送信息的头部添加token信息作为登陆标记
axios.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config;
    })
    //过滤器挂载
Vue.filter('dataFormate', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false;
new Vue({
    router,
    render: h => h(App)
}).$mount("#app");