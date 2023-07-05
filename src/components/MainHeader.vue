<template>
    <div class="mainHeader" >
        <div class="headerTop">
            <div>
                <el-button type="text"
                           style="color:#76797c;font-size: 23px; margin-left: 5px;margin-top: 0px;"
                 class="iconfont icon-zhedie" @click="changeIsCollapse()"></el-button>
            </div>
            <div class="headerRight">
                <div v-for="(item,index) in itemList" class="lock" @mouseover="lockChange(index)" @mouseout="styleIndex = false" :style="styleIndex === index ?lockStyle:''">
                    <el-button  @click="toLock(item)" type="text" :class="item.icon" style="font-weight: 600;color:rgb(106 109 119)">{{item.itemTitle}}</el-button>
                </div>

                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                        <el-avatar :size="40" style="margin-right: 20px;margin-top: 5px" >
                          <img :src="user.userPic"/>
                        </el-avatar>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-plus">个人信息</el-dropdown-item>
                        <el-dropdown-item @click.native="logout()" icon="el-icon-circle-plus">退出系统</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>

        <div class="tabs">
            <el-tabs @tab-click="toPath" v-model="path" type="card" editable @edit="handleTabsEdit">
                <el-tab-pane

                        :key="item.name"
                        v-for="(item, index) in tabs"
                        :label="item.title"
                        :name="item.path" >

                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MainHeader",

        data(){
            return{
                isCollapse: false,
                path:'/home',
                tabs:[],
                lockStyle:'background-color: #d8d8d899;box-shadow: 0px 0px 9px #cbd6e0;',
                styleIndex:false,
                user:{},
                itemList:[
                    {'icon':'iconfont icon-lock-full','itemTitle':'锁屏'},
                    {'icon':'iconfont icon-yonghu','itemTitle':'个人信息'}
                ]

            }
        },
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push('/')
            },
            lockChange(val){
                this.styleIndex = val

            },
            toLock(item){
                if(item.itemTitle === '锁屏'){
                    this.$router.push('/lockSystem')
                    sessionStorage.clear()
                }else if(item.itemTitle === '个人信息'){
                    this.$notify({
                        title: '警告',
                        message: '还没有可跳转的页面',
                        type: 'warning'
                    });
                }

            },
            changeIsCollapse(){
                this.isCollapse = !this.isCollapse
                this.$emit('func',this.isCollapse)

            },
            toPath(){
                console.log(this.tabs)
                this.$router.push(this.path)
            },
            handleTabsEdit(targetName, action) {
                if (action === 'remove') {
                    let tabs = this.tabs;
                    let activeName = this.path;
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.path === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.path;
                                }
                            }
                        });
                    }
                    this.path = activeName;
                    this.tabs = tabs.filter(tab => tab.path !== targetName);
                }
            }
        },
        watch: {
            $route: {
                handler: function (val, oldVal) {
                    if(this.tabs.some(item=>item.path === val.path)){
                        this.path = val.path
                        return true
                    }else {
                        this.tabs.push({path:val.path,title:val.meta.title})
                        this.path = this.tabs[this.tabs.length -1].path
                    }
                },
                // 深度观察监听
                deep: true
            }
        },
        created() {
            this.tabs.push({path:'/home',title:'首页'})
            let user =  JSON.parse(sessionStorage.getItem('user'))
            if(user != null){
                this.user = user
            }
        }
    }
</script>

<style scoped>
    @import url(MainHeader.css);
</style>