<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区 -->
        <el-card class="box-card">
            <!-- 搜索功能区 -->
            <el-row :gutter="20">
                <el-col :span="8">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addFormVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 列表展示区 -->
            <el-table :data="userList" style="width: 100%">
                <el-table-column prop="username" label="姓名" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDailogShow(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="open(scope.row.id)"></el-button>
                            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                            </el-tooltip>                       
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenem" :page-sizes="[1, 3, 5, 8]" :page-size="query.oagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户框 -->
        <el-dialog title="提示" :visible.sync="addFormVisible" width="50%" @close="addFormResize" >
            <el-form :model="addForm" :rules="addFormRules"  label-width="70px" ref="addFormRef">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="passoword">
                    <el-input v-model="addForm.passoword"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%" >
            <el-form :model="editUserInfo" :rules="editFormRules"  label-width="70px" ref="editFormRef" @close="editReset">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editUserInfo.username" disable></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editUserInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click=editUser>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
            var checkEmail = (rule, value, cb) => {
                const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    cb();
                }
                cb(new Error('请输入合法的邮箱'))
            }
            var checkMobile = (rule, value, cb) => {
                const regMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)) {
                    cb();
                }
                cb(new Error('请输入合法的手机号'))
            }  
        return {
            userList:[
            ],
            //获取列表参数
            queryInfo:{
                query:'',
                pagenem:1,
                pagesize:2
            },
            total:'',
            //添加用户对话框
            addFormVisible:false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加信息规则
            addFormRules:{
                username:[
                   { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                passoword:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email:[
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required: true, message: '请输入手机', trigger: 'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ]
            },
            //修改用户对话框
            editDialogVisible:false,
            //修改信息
            editUserInfo:{},
            // 修改信息规则
            editFormRules:{
                email:[
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {required: true, message: '请输入手机', trigger: 'blur'},
                    {validator:checkEmail,trigger:'blur'}
                ]
            },
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        //获取用户列表
        async getUserList() {
            const {data:res}=await this.$http.get('users',{
        params: this.queryInfo
        })
            if (res.meta.status!==200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList=res.data
        },
        //页数总也同步
        handleSizeChange(newSize) {
            this.queryInfo.pagesize=newSize;
            this.getUserList()
        },
        //页数同步
        handleCurrentChange(newPage) {
            this.queryInfo.pagenem=newPage
            this.getUserList()
        },
        //状态修改
        async userStatusChange(user){
            const {data:res}=await this.$http.put(
                `user/${user.id}/status/${user.mg_state}`
                );
            if (res.meta.status!=200) return this.$message.error('修改失败')
            this.$message.success('修改成功')
        },
        //重置用户提交表
        addFormReset() {
            this.$refs.addFormRef.resetFields()
        },
        //添加用户
        addUser() {
            //预验证
            this.$refs.addFormRef.validate(async valid=>{
                if (!vaild) return;
                const {data:res}= await this.$http.post('users',this.addForm)
                if (res.status!==201) {
                    this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                //清除用户提交表
                this.addFormResize()
                //重置列表
                this.getUserList()
            })
        },
        //修改用户框弹出
        async editDailogShow(id){
            //查询用户
            const {data:res}=await this.$http.get('users/' + id)
            if (res.status!==200) return this.$message.error('信息获取失败')
            this.editUserInfo=res.data;
            this.editDialogVisible=true;
        },
        //重置提交信息
        editReset(){
            this.$refs.editFormRef.resetfields()
        },
        //提交修改信息
        editUser(){
            //预验证
            this.$refs.editFormRef.validate(async vaild=>{
                if (!valid) return
                const {data:res}= await this.$http.put('users/' + this.editUserInfo.id,{
                    email:this.editUserInfo.email,
                    mobile:this.editUserInfo.mobile
                })
                if (res.status!==200) return this.$message.error('修改失败')
                this.$message.success('修改成功')
                //关闭对话框重置和刷新列表
                this.editDialogVisible=false
                this.editReset()
                this.getUserList();
            })
        },
        // 确认删除
        open(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            const {data:res}=await this.$http.delete('users/' + id)
            if (res.status!==200) return this.$message.error('删除失败')
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        //跟新列表
        this.getUserList()
      }
    }
}
</script>
<style lang="less" scoped>

</style>