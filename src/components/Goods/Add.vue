<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 消息提示 -->
            <el-alert
                title="添加商品信息"
                type="info" center
                show-icon :closable="false">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activenum - 0" finish-status="success" align-center>
                <el-step title="基本信息">基本信息</el-step>
                <el-step title="商品参数">商品参数</el-step>
                <el-step title=商品属性>商品属性</el-step>
                <el-step title=商品图片>商品图片</el-step>
                <el-step title=商品内容>商品内容</el-step>
                <el-step title=完成>完成</el-step>
            </el-steps>
            <!-- 侧边导航 -->
            <el-form :model="addForm" :rules="addFormRules" 
            ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs tab-position="left"  v-model="activenum" 
                :before-leave="beforeTabsLeave" @tab-click="tabChange">
                    <el-tab-pane label="基本信息" name=0 >基本信息
                        <!-- 基本信息表格 -->
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <!-- 联动框 -->
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="cateList"
                            @change="handleChange"
                            :props="cateProps" style="width:300px;height:200px" ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name=1>
                        <el-form-item :label="item.attr_name" v-for="item in paramsList" :key=item.attr_id>
                            <!-- 循环复选框 -->
                              <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cd" v-for="(cd,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name=2>
                        <!-- 输入框循环 -->
                        <el-form-item :label="item.attr_name" v-for="item in attrList" :key=item.attr_id>
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name=3>
                        <!-- 上传图片 -->
                        <el-upload
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="uploadHeader"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name=4>
                        <!-- 内容输入框 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加按钮 -->
                        <el-button type="primary" class="addBtn" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片展开窗口 -->
        <el-dialog
            title="图片详情"
            :visible.sync="previewDialogVisible"
            width="50%">
            <img :src="previewURL" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>
<script>
//引入克隆
import _ from 'lodash'
export default {
    data() {
        return {
            activenum:0,
            //表单绑定数据
            addForm:{
                goods_cat:[],
                goods_name:'',
                goods_price:0,
                goods_number:0,
                goods_weight:0,
                pics:[],
                goods_introduce:'',
                attrs:[]
            },
            //表单验证规则
            addFormRules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_number:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_weight:[
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_cat:[
                    { required: true, message: '请输入商品分类', trigger: 'blur' }
                ],
            },
            //分类商品列表
            cateList:[],
            //联动配置
            cateProps: {
                expandTrigger: 'hover',
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            //参数列表
            paramsList:[],
            //静态列表
            attrList:[],
            //上传路径
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            //图片上传头
            uploadHeader:{
                Authorization:window.sessionStorage.getItem('token')
            },
            //图片对话框
            previewDialogVisible:false,
            //图片展示路径
            previewURL:''
        }
    },
    created() {
        this.getCateList()
    },
    methods:{
        //获取商品分类
        async getCateList() {
            const {data:res}=await this.$http.get('categories');
            if (res.meta.status!==200) return this.$message.error('商品列表获取失败')
            this.cateList=res.data
            
        },
        //联动变动
        handleChange() {
            if (this.addForm.goods_cat.length!==3) {
                this.addForm.goods_cat=[]
                return
            }
        },
        //tab转换前发生
        beforeTabsLeave(activeName,oldActiveName) {
            console.log(activeName,oldActiveName);
            if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error('商品信息未填写')
                    return false
            }
        },
        //tab转换后触发
        async tabChange() {
            //获取动态参数列表
            if (this.activenum==1) {
                const {data:res} = await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {
                params: { sel: 'many' }
                }
                )
                if (res.meta.status!==200) return this.$message.error('获取失败')
                this.paramsList=res.data;
                //参数列表处理
                this.paramsList.forEach(item=>{
                item.attr_vals=item.attr_vals.trim().length===0 ? [] : item.attr_vals.split(',')
                }) 
            } //获取静态参数
            else if(this.activenum==2) {
                const {data:res} = await this.$http.get(
                `categories/${this.cateId}/attributes`,
                {
                params: { sel: 'only' }
                }
                )
                if (res.meta.status!==200) return this.$message.error('获取失败')
                this.attrList=res.data;
                console.log(this.attrList);                
            }
        },
        //图片展开事件
        handlePreview(file) {
            this.previewURL=file.response.data.url;          
            this.previewDialogVisible=true;
        },
        //图片移除出发
        handleRemove(file) {       
            const i = this.addForm.pics.findIndex(item =>               
            item.pic===file.response.data.tmp_path)
            this.addForm.pics.splice(i,1)
            console.log(this.addForm.pics);
            
        },
        //上传成功后
        handleSuccess(response) {
            this.addForm.pics.push(
                {pic:response.data.tmp_path}
            )   
        },
        //添加商品
        add() {
            //添加商品预验证
            this.$refs.addFormRef.validate(async valid=> {
                if (!valid) {
                    return this.$message.error('请把内容补充完整')
                }
                //表单预处理
                //属性表单
                this.paramsList.forEach(item=> {
                    const info={attr_id:item.attr_id,attr_value:item.attr_vals.join(',')};           
                    this.addForm.attrs.push(info)
                })
                //参数表单
                this.attrList.forEach(item=> {
                    const info={attr_id:item.attr_id,attr_value:item.attr_vals};
                    this.addForm.attrs.push(info)
                })
                const form=_.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(',')
                //发送添加请求
                const {data:res}= await this.$http.post('goods',form)
                console.log(res);
                
                if(res.meta.status!==201) return this.$message.error('添加失败')
                this.$message.success('添加商品成功！')
                this.$router.push('/goods')
            })
            
        }
    },
    computed:{
        cateId() {
            if (this.addForm.goods_cat.length==3) {
                console.log(this.addForm.goods_cat[2]);             
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>
<style lang="less">
.el-steps {
    margin:20px 0;
}
.el-checkbox {
    margin: 0 15px 10px 15px !important;
}
.previewImg {
    width: 100%;
}
.ql-editor {
    min-height: 300px;
}
.addBtn {
    margin-top: 15px !important;
}
</style>