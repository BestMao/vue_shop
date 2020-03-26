<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索区 -->
            <el-row :gutter="15">
                <el-col :span=8>
                      <el-input placeholder="请输入内容" v-model="queryInfo.query" 
                      clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search"
                        @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span=4>
                    <el-button type="primary" @click="addGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="goodList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name" :width="500"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price" :width="80"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" :width="80"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dataFormate}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit" ></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteGoods(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //商品获取信息
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            //商品列表
            goodList:[],
            //商品总数
            total:0
        }
    },
    created() {
        this.getGoodsList()
    },
    methods:{
        //获取商品表单
        async getGoodsList() {
            const {data:res}= await this.$http.get('goods',{
                params:this.queryInfo
            })
            console.log(res);
            
            if (res.meta.status!==200) return this.$message.error('列表获取失败')      
            this.goodList=res.data.goods;
            this.total=res.data.total; 
        },
        //每页总条数变化
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize=newPageSize;
            this.getGoodsList()
        },
        //翻页
        handleCurrentChange(newpage) {
            this.queryInfo.pagenum=newpage;
            this.getGoodsList()
        },
        //删除商品
        async deleteGoods(row) {
            const Isconfirm=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)
            if (Isconfirm==='confirm') {
                const {data:res}=await this.$http.delete(`goods/${row.goods_id}`)
                if (res.meta.status!==200) return this.message.error('删除失败')
                this.$message.success('删除成功')
                this.getGoodsList()
            }
        },
        //调整添加页面
        addGoods() {
            this.$router.push('/goods/add')
        }
    }
}
</script>
<style lang="less">

</style>