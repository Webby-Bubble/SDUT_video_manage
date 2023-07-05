<template>
    <div class="Home">
        <el-container style="height: 100%">
            <el-aside :width="isCollapse ? '64px':'200px'" >
                <el-menu router style="height: 100%;background-color: #2c3e50" default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse">
                    <div style="margin-bottom: 30px">
                        <div class="asideHeader">
                            <div class="iconfont icon-dianying"
                                 style="color: #4dc0cf;font-size: 25px;margin-right: 5px;margin-left: -10px;"></div>
                            <div v-show="!isCollapse" class="titleHz">影视后台管理</div>
                        </div>
                    </div>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="iconfont icon-dianying1"></i>
                            <span class="spanCss" slot="title">影视管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item class="spanCss" index="/videoManage">电影管理</el-menu-item>
                            <el-menu-item class="spanCss" index="/shortVideoManage">微视管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="iconfont icon-pinglun"></i>
                            <span class="spanCss" slot="title">影评管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item class="spanCss" index="/videoTalke">电影评论</el-menu-item>
                           <!-- <el-menu-item class="spanCss" index="1-2">微视评论</el-menu-item>-->
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="iconfont icon-yonghu"></i>
                            <span class="spanCss" slot="title">用户管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item class="spanCss" index="/userManage">手机用户管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="iconfont icon-yonghu"></i>
                            <span class="spanCss" slot="title">审核管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item class="spanCss" index="/report">举报审核</el-menu-item>
                        </el-menu-item-group>
                      <!--  <el-menu-item-group>
                            <el-menu-item class="spanCss" index="/publishVideoExamine">视频发布审核</el-menu-item>
                        </el-menu-item-group>-->
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>
                <main-header   @func="changeIsCollapse"></main-header>
                <router-view style="padding-left: 10px"></router-view>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import mainHeader from '@/components/MainHeader.vue'
    export default {
        components:{
          mainHeader
        },
        data() {
            return {
                isCollapse: false,
                tabs:[]
            };
        },
        methods: {
            changeIsCollapse(data){
                this.isCollapse = data
                console.log(data)
            },


        },

    }
</script>
<style scoped>
    .Home{
        height: 100%;
    }
    /deep/.el-menu{
        background-color: #253849;
    }
    .spanCss{
        color: rgb(191, 203, 217);
    }
    /deep/.el-main{
        padding: 0px;
    }
    .asideHeader{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 25px;
        margin-top: 20px;
    }
    .icon-shipinzhibo{
        font-size: 20px;
        margin-right: 6px;
    }
    .titleHz{
        font-size: 18px;
        color: #e2e2e2;
        font-family: cursive;
    }
    /deep/.el-menu-item-group{
        margin-left: 25px;
    }
    /deep/.el-submenu is-opened{
        background-color: #2c3e50;
    }
    i{
        margin-right: 5px;
    }

</style>
