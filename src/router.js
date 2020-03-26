import Vue from "vue";
import VueRouter from "vue-router";

//import Login from "./components/Login.vue";
const Login = () =>
    import ( /* webpackChunkName: "Login_Home_Welcome" */ './components/Login.vue')
    //import Home from './components/Home.vue';
const Home = () =>
    import ( /* webpackChunkName: "Login_Home_Welcome" */ './components/Home.vue')
    //import Welcome from './components/Welcome.vue';
const Welcome = () =>
    import ( /* webpackChunkName: "Login_Home_Welcome" */ './components/Welcome.vue')

//import Users from './components/User/User.vue';
const Users = () =>
    import ( /* webpackChunkName: "User_Right_Roles" */ './components/User/User.vue')
    //import Rights from './components/Powers/Rights.vue';
const Rights = () =>
    import ( /* webpackChunkName: "User_Right_Roles" */ './components/Powers/Rights.vue')
    //import Roles from './components/Powers/Roles.vue';
const Roles = () =>
    import ( /* webpackChunkName: "User_Right_Roles" */ './components/Powers/Roles.vue')


//import Cate from './components/Goods/Cate.vue';
const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ './components/Goods/Cate.vue')
    //import Params from './components/Goods/Params.vue';
const Params = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ './components/Goods/Params.vue')
    //import List from './components/Goods/List.vue'
const List = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ './components/Goods/List.vue')
    //import Add from './components/Goods/Add.vue'
const Add = () =>
    import ( /* webpackChunkName: "Cate_Params_List_Add" */ './components/Goods/Add.vue')

//import Order from './components/Order/Order.vue'
const Order = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/Order/Order.vue')
    //import Report from './components/Report/Report.vue'
const Report = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/Report/Report.vue')

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: "/", redirect: "/login" },
        { path: "/login", component: Login },
        {
            path: "/home",
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cate },
                { path: '/params', component: Params },
                { path: '/goods', component: List },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report }
            ]
        }
    ]
});
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转
    if (to.path === '/login') return next()
        // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router