<template>
    <transition name="etoak">
        <div class="videoPublisExamine" v-show="show">

        </div>
    </transition>

</template>

<script>
    export default {
        name: "VideoPublisExamine",
        data(){
            /* 定义初始化变量 */
            return{
                show:false,
                publishVideoList:[]
            }
        },
        /* 定义事件函数 */
        methods:{

        },
        /* vue的生命周期函数
           当页面加载完毕就会执行created里面的函数
        */
        created() {

        }
    }
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>
    .etoak-enter-active,.etoak-leave-active{
        transition: all 1.5s;
    }
    .etoak-enter,.etoak-leave-to{
        opacity:0;
        transform: translateX(30px);
    }
    @import url("VideoPublisExamine.css");
</style>