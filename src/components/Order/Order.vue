<template>
    <div>
        
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索区 -->
            <el-row>
                <el-col>
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="search" clearable @clear="searchContent">
                    <el-button slot="append" icon="el-icon-search" @click="searchContent"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 图表区 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" width="400"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100"></el-table-column>
                <el-table-column label="是否付款" width="100">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.order_pay==1">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="100"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dataFormate}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scpoe">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="boxShow()"></el-button>
                        <el-button type="success" size="mini" icon="el-icon-location" @click="timeDialogShou()"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 编辑对话框 -->
        <el-dialog
        title="位置编辑"
        :visible.sync="boxDialogVisible"
        width="50%"
        @close="resetForm">
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityList"
                    v-model="addressForm.address1"
                    :props="{ expandTrigger: 'hover' }"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="boxDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="boxDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 物流进度对话框 -->
        <el-dialog
            title="物流进度"
            :visible.sync="timeDialogVisible"
            width="50%">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in timeList" :key="index" :timestamp="activity.time">
                    {{activity.context}}
                    </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">
                <el-button @click="timeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="timeDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import cityList from './citydata.js'
export default {
    data(){
        return {
            //订单列表
            orderList:[],
            //订单请求参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            //总页数
            total:0,
            //编辑对话框开关
            boxDialogVisible:false,
            //编辑表单
            addressForm:{
                address1:[],
                address2:''
            },
            //编辑表单验证
            addressFormRules:{
                address1:[
                    { required: true, message: '请输入省市区/县', trigger: 'blur' }
                ],
                address2:[
                    { required: true, message: '详细地址', trigger: 'blur' }
                ]
            },
            //城市列表
            cityList,
            //物流进度条开关
            timeDialogVisible:false,
            //物流信息
            timeList:[
                {
                "time": "2018-05-10 09:39:00",
                "ftime": "2018-05-10 09:39:00",
                "context": "已签收,感谢使用顺丰,期待再次为您服务",
                "location": ""
                },
                {
                "time": "2018-05-10 08:23:00",
                "ftime": "2018-05-10 08:23:00",
                "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                "location": ""
                },
                {
                "time": "2018-05-10 07:32:00",
                "ftime": "2018-05-10 07:32:00",
                "context": "快件到达 [北京海淀育新小区营业点]",
                "location": ""
                },
                {
                "time": "2018-05-10 02:03:00",
                "ftime": "2018-05-10 02:03:00",
                "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                "location": ""
                },
                {
                "time": "2018-05-09 23:05:00",
                "ftime": "2018-05-09 23:05:00",
                "context": "快件到达 [北京顺义集散中心]",
                "location": ""
                },
                {
                "time": "2018-05-09 21:21:00",
                "ftime": "2018-05-09 21:21:00",
                "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                "location": ""
                },
                {
                "time": "2018-05-09 13:07:00",
                "ftime": "2018-05-09 13:07:00",
                "context": "顺丰速运 已收取快件",
                "location": ""
                },
                {
                "time": "2018-05-09 12:25:03",
                "ftime": "2018-05-09 12:25:03",
                "context": "卖家发货",
                "location": ""
                },
                {
                "time": "2018-05-09 12:22:24",
                "ftime": "2018-05-09 12:22:24",
                "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                "location": ""
                },
                {
                "time": "2018-05-08 21:36:04",
                "ftime": "2018-05-08 21:36:04",
                "context": "商品已经下单",
                "location": ""
                }
            ]
        }
    },
    created() {
        this.getOrderList()
    },
    methods:{
        //获取订单列表数据
        async getOrderList() {
            const {data:res}=await this.$http.get('orders',{params:this.queryInfo})
            if (res.meta.status!==200) return this.$message.error('获取列表失败')    
            this.orderList=res.data.goods;
            this.total=res.data.total;
        },
        //分页页总数变化
        handleSizeChange(newPageSize) {
            this.queryInfo.pagesize=newPageSize;
            this.getOrderList();
        },
        //分页页数变化
        handleCurrentChange(newPageNum) {
            this.queryInfo.pagenum=newPageNum;
            this.getOrderList();
        },
        //搜索内容
        searchContent() {
            console.log(this.queryInfo.query);
            this.getOrderList()
        },
        //编辑对话框弹出
        boxShow() {
            this.boxDialogVisible=true;
        },
        //重置位置编辑表单
        resetForm() {
            this.$refs.addressFormRef.resetFields()
        },
        //获取物流信息
        async getTimeList() {
            const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

            if (res.meta.status !== 200) {
                return this.$message.error('获取物流进度失败！')
            }

            this.progressInfo = res.data

            this.progressVisible = true
        },
        //物流时间对话框弹出
        timeDialogShou() {
            
            this.timeDialogVisible=true
        }
    }
}
</script>
<style lang="less">
.search {
    width: 300px !important;
}
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
</style>