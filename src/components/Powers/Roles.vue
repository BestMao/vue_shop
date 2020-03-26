<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 添加按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 列表 -->
            <el-table :data="rolesList" border stripe>

                <el-table-column type="expand">
                    <!-- 展开数据 -->
                    <template slot-scope="scope">
                        <!-- 第一级循环 -->
                    <el-row v-for="(item1,l1) in scope.row.children" :key="item1.id" :class="[l1===0 ? 'boder_top' : '','boder_bottem','conter']">
                        <el-col :span="5">
                            <el-tag  type="success"  closable @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <!-- 第二级循环 -->
                            <el-row v-for="(item2,l2) in item1.children" :key="item2.id" :class="[l2===0 ? '' : 'boder_top','conter']">
                                <el-col :span="6">
                                    <el-tag  type="warning"  closable @close="removeById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <!-- 第三级循环 -->
                                    <el-tag v-for="item3 in item2.children" closable @close="removeById(scope.row,item3.id)"
                                     :key="item3.id" type="danger" >{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                        <!-- <pre>
                            {{scope.row}}
                        </pre> -->
                    </template>


                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="setRightsDialogShow(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%" @close="setRightDialogClosed">
            <!-- 权限树 -->
            <el-tree :data="rightsList" :props="defaultProps" node-key="id" :default-checked-keys="rightKeys"
            show-checkbox default-expand-all ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetRights">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            rolesList:[],
            setRightsDialogVisible:false,
            //展开树用户信息
            rightsList:[],
            //展开树的节点配置
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            //用户已有的节点
            rightKeys:[],
            //展开树用户id
            roleId:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        //获取角色权限列表
        async getRolesList(){
            const {data:res}=await this.$http.get('roles');
            if(res.meta.status!==200) return this.$message.error('获取角色权限列表失败');
            this.rolesList=res.data;
            console.log(this.rolesList);
            
        },
        //删除角色权利
        async removeById(role,id) {
            const Iscomfirm=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err);            
            if (Iscomfirm==="confirm") {
                const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${id}`)
                if(res.meta.status!==200) return this.$message.error('操作失败')
                //将role数据更新，避免用重新获取数据方法导致表格重新渲染，函数了对对对象操作可印象外部
                role.children=res.data;
            }
        },
        //获取用户权限数组
        getRightKeys(role,arr){
            if (!role.children) {
                return arr.push(role.id);
            }
            role.children.forEach(item=> {
                this.getRightKeys(item,arr)
            });
        },
        //展开权限树
        async setRightsDialogShow(role){
            this.roleId=role.id;
            const {data:res}=await this.$http.get('rights/tree')
            if (res.meta.status!==200) return this.$message.error('获取权限列表失败')
            this.rightsList=res.data;      
            this.getRightKeys(role,this.rightKeys)
            console.log(this.rightKeys);
            this.setRightsDialogVisible=true
        },
        //关闭权限对话框
        setRightDialogClosed(){
            this.rightKeys=[]           
        },
        //确认分配权限
        async resetRights(){
            //获取所有节点
            const keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()    
            ];
            const str=keys.join(',')
            const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,
            {rids:str})
            if (res.meta.status!==200) return this.$message.error('跟新失败')
            this.getRolesList()
            this.setRightsDialogVisible=false
        }
    }
}
</script>
<style lang="less">
.el-tag {
    margin: 15px;
}
.boder_top {
    border-top: 1px solid #ccc;
}
.boder_bottem {
    border-bottom: 1px solid #ccc;
}
//居中格式
.conter {
    display: flex;
    align-items: center;
}
</style>