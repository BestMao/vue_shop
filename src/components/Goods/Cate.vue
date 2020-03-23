<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="addDialogShow">添加商品</el-button>
            </el-col>
        </el-row>
            <!-- 商品树 -->
            <tree-table class="treeTable"  :data="goodsList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
                <!-- 是否校验 -->
                <template slot="Isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false"
                    style="color:green"></i>
                    <i class="el-icon-error" v-else
                    style="color:red"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level==0">等级一</el-tag>
                    <el-tag type="success"
                    v-else-if="scope.row.cat_level==1" >等级二</el-tag>
                    <el-tag type="warning" v-else>等级三</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" size="mini"
                    icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini"
                    icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页列表 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 7, 9]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <!-- 添加分类对话框 -->
            <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="50%" @close="addCateDialogClosed">
                <!-- 添加用户表单 -->
                <el-form :model="addForm" :rules="addRules" ref="addFormRef"
                label-width="100px" >
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级名称" >
                        <!-- 接连选择器 -->
                        <el-cascader
                        v-model="parentsId" :options="parentsGoodsList" 
                        expand-trigger="hover" 
                        :props="cascaderProps" 
                        @change="handleChange" 
                        clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
    </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            //商品列表
            goodsList:[],
            //获取列表参数
            queryInfo:{
                type: 3,
                pagenum:1,
                pagesize:3
            },
            //总页数
            total:0,
            //商品树自定义
            columns: [
                {
                label: '分类名称',
                prop: 'cat_name'
                },
                {
                label:'是否有效',
                type:'template',
                template:'Isok'
                },
                {
                label:'排序',
                type:'template',
                template:'order'               
                },
                {
                label:'操作',
                type:'template',
                template:'opt'                    
                }
            ],
            //添加分类对话框开关
            addDialogVisible:false,
            //添加分类表单
            addForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0

            },
            //添加分类规则
            addRules:{
                name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            //父级商品列表
            parentsGoodsList:[],
            //联动选择配置
            cascaderProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            //联动选择绑定数据
            parentsId:[]
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        //获取商品列表
        async getGoodsList(){
            const { data:res }=await this.$http.get('categories',{
                params:this.queryInfo
            })
            if (res.meta.status!==200) return this.$message.error('获取列表失败')
            //获取的值赋值
            this.goodsList=res.data.result;
            this.total = res.data.total;
        },
        //分页尺寸变化
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize=newPageSize;
            this.getGoodsList()
        },
        //页面跳转
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum=newPage;
            this.getGoodsList()
        },
        //弹出添加按钮对话框
        addDialogShow(){
            this.getParentsGoodsList()
            this.addDialogVisible=true
        },
        //获取父级商品列表
        async getParentsGoodsList(){
            const {data:res}=await this.$http.get('categories',{
                params: { type: 2 }
            });
            if (res.meta.status!=200) return this.$message.error('获取列表失败')
            this.parentsGoodsList=res.data   
            console.log(this.parentsGoodsList);
            
        },
        //接连选择器发生变化时
        handleChange(){
             console.log(this.parentsId)
            // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
            // 反之，就说明没有选中任何父级分类
            if (this.parentsId.length > 0) {
                // 父级分类的Id
                this.addForm.cat_pid = this.parentsId[
                this.parentsId.length - 1
                ]
                // 为当前分类的等级赋值
                this.addForm.cat_level = this.parentsId.length
                return
            } else {
                // 父级分类的Id
                this.addForm.cat_pid = 0
                // 为当前分类的等级赋值
                this.addForm.cat_level = 0
            }
        },
        //提交表达
        addCate(){
                this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(
                'categories',
                this.addForm
                )
                if (res.meta.status !== 201) {
                return this.$message.error('添加分类失败！')
                }
                this.$message.success('添加分类成功！')
                this.getGoodsList()
                this.addDialogVisible = false
            })       
        },
        //关闭时重置表单
        addCateDialogClosed(){
            this.$refs.addFormRef.resetFields()
            this.parentsId = []
            this.addForm.cat_level = 0
            this.addForm.cat_pid = 0
        }
    }
}
</script>
<style lang="less">
.treeTable {
    margin-top: 20px;
}
.el-cascader {
  width: 100%;
}
</style>