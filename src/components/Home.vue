<template>
    <div>
        <el-button @click="out">退出</el-button>
    </div>
</template>>
<script>
export default {
    methods:{
        out:function(){
            window.sessionStorage.clear();
            this.$router.push('/login')
        }
    }
}
</script>>
<style lang="less" scoped>

</style>>