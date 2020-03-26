<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>数据列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="main" style="width: 1000px;height:600px;"></div>
        </el-card>
    </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
    data() {
        return {
                options: {
                    title: {
                    text: '用户来源'
                    },
                    tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                        backgroundColor: '#E9EEF3'
                        }
                    }
                    },
                    grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                    },
                    xAxis: [
                    {
                        boundaryGap: false
                    }
                    ],
                    yAxis: [
                    {
                        type: 'value'
                    }
                    ]
            }
        }
    },
    async mounted() {
        var myChart = echarts.init(document.getElementById('main'));
        //获取数据
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status!==200) return this.$message.error('数据获取失败')
        //合并数据
        const result=_.merge(res.data,this.options)
        console.log(result);
        myChart.setOption(result);
    }
}

</script>
<style lang="less" scoped>

</style>