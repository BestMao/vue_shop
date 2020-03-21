<template>
<el-container>
    <!-- 头部 -->
  <el-header>
      <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理</span>
      </div>
      <el-button @click="out">退出</el-button>
  </el-header>
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="Iscollapse ? '64px' : '210px'">
        <div class="toggle_button" @click="toggle">|||</div>
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" 
            unique-opened :collapse=Iscollapse :collapse-transition=false router :default-active="activePath">
                <!-- 导航栏 -->
                <!-- 一级导航 -->
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>用户管理</span>
                    </template>
                    <!-- 二级菜单 -->
                        <el-menu-item index="/users" @click="getsaveNavState('/users')">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>用户列表</span>
                            </template>
                        </el-menu-item>
                </el-submenu>
                 <el-submenu index="2">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>权限管理</span>
                    </template>
                    <!-- 二级菜单 -->
                        <el-menu-item index="2-1">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>角色列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="2-2">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>权限列表</span>
                            </template>
                        </el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>商品管理</span>
                    </template>
                    <!-- 二级菜单 -->
                        <el-menu-item index="3-1">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>商品列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="3-2">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>分类参数</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="3-3">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>商品分类</span>
                            </template>
                        </el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>订单管理</span>
                    </template>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>数据统计</span>
                    </template>
                </el-submenu>
                <!-- 导航循环
                <el-submenu :index="item.id + ''"  v-for="item in menulist" :key="item.id">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{item.authName}}</span>
                    </template>
                        <el-menu-item :index="/' + item.path" v-for="subItem in item.children" :key=subItem.id>
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                </el-submenu> -->
        </el-menu>
    </el-aside>
    <!-- 主体 -->
    <el-main>
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>>
<script>
export default {
    data(){
        return {
            meunList:[],
            Iscollapse:false,
            activePath:''
        }
    },
    created(){
        this.getMenuList()
        this.getsaveNavState()
    },
    methods:{
        out:function(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        getMenuList:async function(){
            const {data:res}=await this.$http.get('meuns');
            if (res.status!==200) return this.$message.error(res.meta.msg)
            this.meunList=res.data
        },
        toggle(){
            this.Iscollapse=!this.Iscollapse;
        },
        getsaveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath=activePath
        }
    }
}
</script>>
<style lang="less" scoped>
.el-container{
    height: 100%;
}
// 头部
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    > div {
        display: flex;
        align-items: center;
        span {
            color: #fff;
            font-size: 20px;
            margin-left: 15px;
        }
    }
}
// 侧边栏
.el-aside {
      background-color: #333744;
      .el-menu {
          border-right: none;
      }
}
.toggle_button {
    background-color: #4a5064;
    line-height: 40px;
    font-size: 15px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
}
// 主体
.el-main {
      background-color: #eaedf1;
}
</style>