<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 警告区域 -->
            <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
            <el-row class="cat_opt" >
                <el-col>
                    <span class="cate_span">选择商品分类</span>
                    <!-- 商品分类 -->
                    <el-cascader  :options="cateList" :props="cateProps" v-model="cateSelectKeys" 
                    @change="handleChange" style="width:300px">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- 分页 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary"
                    :disabled="Isable" @click="addDailogShow">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 拓展标签 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染标签 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" 
                                :key=i closable @close="deleteAttr(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 添加标签 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    style="width:120px"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="操作名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialogShow(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="only">
                    <el-button type="primary"
                    :disabled="Isable"  @click="addDailogShow" >添加参数</el-button>
                    <!-- 静态参数表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 拓展标签 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染标签 -->
                                <el-tag v-for="(item,i) in scope.row.attr_vals" 
                                :key=i closable @close="deleteAttr(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <!-- 添加标签 -->
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    style="width:120px"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

                            </template>
                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="操作名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDialogShow(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 参数添加对话框 -->
        <el-dialog
        :title="activeTitle + '添加'"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">
        <!-- 添加表单 -->
            <el-form :model="addForm" :rules="addRules" ref="addRuleFormRef" 
            label-width="100px"  >
                <el-form-item :label="activeTitle" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑对话框 -->
         <el-dialog
        :title="activeTitle + '修改'"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
        <!-- 添加表单 -->
            <el-form :model="editForm" :rules="editRules" ref="editRuleFormRef" 
            label-width="100px"  >
                <el-form-item :label="activeTitle" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //商品分类列表
            cateList:[],
            //商品分类配置
            cateProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            //商品分类选中
            cateSelectKeys:[],
            //分页头部
            activeName:'many',
            //动态参数
            manyTableData:[],
            //静态参数
            onlyTableData:[],
            //添加弹窗开关
            addDialogVisible:false,
            //添加表单
            addForm:{
                attr_name:''
            },
            //添加表单规则
            addRules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            //修改弹窗开关
            editDialogVisible:false,
            //修改表单
            editForm:{
                attr_name:''
            },
            //修改规则
            editRules:{
                attr_name:[
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
        }
    },
    created() {
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const { data:res } = await this.$http.get('categories');
            if(res.meta.status!==200) return this.$message.error('获取列表数据失败');
            this.cateList=res.data;
        },
        //联动选择器变化
        handleChange(){
            //若不是三级内容则重置
            this.getTableData()
        },
        //分页选择变化
        handleClick(){
            this.getTableData()
        },
        //获取参数数据
        async getTableData () {
            //若不是三级内容则重置
            if (this.cateSelectKeys.length!==3) {
                this.cateSelectKeys=[];
                this.manyTableData=[];
                this.onlyTableData=[]
                return
            }
            const { data:res }=await this.$http.get(`categories/${this.cateId}/attributes`,
            {
                params : {sel : this.activeName}
            });
            if (res.meta.status!==200) return this.$message.error('获取列表失败')
            //将获取表格信息分别赋值
            //为渲染标签做处理
            res.data.forEach(item=> {
                item.attr_vals=item.attr_vals ? item.attr_vals.split(',') : []
                //为了针对每个标签
                item.inputVisible=false,
                item.inputValue=''
            });
            
            if (this.activeName==='many') {
                this.manyTableData=res.data
            } else if(this.activeName==='only') {
                this.onlyTableData=res.data
            }
        },
        //添加弹窗打开
        addDailogShow() {
            this.addDialogVisible=true
        },
        //添加窗口关闭
        addDialogClosed() {
            this.$refs.addRuleFormRef.resetFields()
        },
        //确认添加表单
        addParams(){
            this.$refs.addRuleFormRef.validate(async valid=> {
                if (!valid) return
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,
                {
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })
                if (res.meta.status!==201) return this.$message.error('添加失败')
                this.$message.success('添加成功');
                this.addDialogVisible=false;
                this.handleClick()
            })
        },
        //修改弹窗弹出
        async editDialogShow(id){
            //获取修改信息
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
            {
                attr_sel:this.activeName
            })
            if (res.meta.status!==200) return this.$message.error('获取失败')
            this.editForm=res.data;
            
            this.editDialogVisible=true;
        },
        //修改表单重置
        editDialogClosed(){
            this.$refs.editRuleFormRef.resetFields()
        },
        //确认修改
        editParams(){
            this.$refs.editRuleFormRef.validate(async valid=> {
                if (!valid) return
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
                    {
                        attr_name:this.editForm.attr_name,
                        attr_sel:this.activeName
                    }
                )
                if (res.meta.status!==200) return this.$message.error('修改失败')
                this.handleChange();
                this.editDialogVisible=false;
            })
        },
        //删除
        async deleteParams(id) {
            const Isconfirm= await this.$confirm('此操作将永久删除参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if (Isconfirm==='confirm') {
                const {data:res}= await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                if (res.meta.status!==200) return this.$message.error('删除失败')
                this.handleChange();
            }
        },
        //添加标签输入框弹出
        showInput(row){         
            row.inputVisible=true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
        });
        },
        //推出添加标签输入框时
        handleInputConfirm(row) {
            //判断内容是否有效
            if (row.inputValue.trim().length==0) {
                row.inputValue='';
                row.inputVisible=false
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible=false
            this.attrSave(row)
        },
        //删除标签
        deleteAttr(i,row) {
            row.attr_vals.splice(i,1)
            this.attrSave(row)
        },
        //保存标签
        async attrSave(row) {
            const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
            {
                attr_name:row.attr_name,
                attr_sel:this.activeName,
                attr_vals:row.attr_vals.join(',')
            });    
            if (res.meta.status!==200) return this.$message.error('修改失败')
            this.$message.success('修改成功')
        }
    },
    computed:{
        //判断是否为三级
        Isable () {
            if (this.cateSelectKeys.length!==3) {
                return true
            } 
            return false
        },
        //获取id
        cateId () {
            if (this.cateSelectKeys.length===3) {
                return this.cateSelectKeys[this.cateSelectKeys.length-1]
            }
        },
        //判断时何种状态
        activeTitle(){
            if (this.activeName==='many'){
                return '动态参数'
            } else {
                return '静态参数'
            }
        }
    }
}
</script>
<style lang="less">
.cat_opt {
    margin: 15px 0;
}
.cate_span {
    margin-right: 15px;
}

</style>