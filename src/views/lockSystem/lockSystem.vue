<template>
    <div class="lockSystem">
        <vue-particles
                color="#dedede"
                :particleOpacity="0.7"
                :particlesNumber="80"
                shapeType="circle"
                :particleSize="4"
                linesColor="#dedede"
                :linesWidth="1"
                :lineLinked="true"
                :lineOpacity="0.4"
                :linesDistance="150"
                :moveSpeed="1"
                :hoverEffect="true"
                hoverMode="grab"
                :clickEffect="true"
                clickMode="push"
        >
        </vue-particles>
        <lock></lock>
        <div class="InputClass">
            <div style="position: relative">
                <el-avatar :size="65"  class="avatar" >
                    <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
                <el-input placeholder="请输入系统密码" type="password" v-model="password" class="input-with-select">
                    <el-button @click="toSystem()" slot="append" icon="el-icon-s-promotion"></el-button>
                </el-input>
            </div>
            <div style="margin-top: 20px;color: #daf6ff;text-align: center;margin-left: -25px">
                <div style="margin-bottom: 20px">用户暂时离开</div>
                <div >屏幕锁定，请重新输入密码</div>
            </div>

        </div>

    </div>
</template>

<script>
    import lock from '@/components/TimeComponent.vue'
    export default {
        name: "lockSystem",
        components:{
            lock
        },
        data(){
          return{
              password:''

          }
        },
        methods:{
            toSystem(){
                if(this.password === 'etoak'){
                    this.$router.push('/home')
                }else {
                    this.$notify.error({
                        title: '失败',
                        message: '密码错误，请重新输入'
                    });
                }
            }
        },
        created() {

        }
    }
</script>

<style scoped>
    @import url(lockSystem.css);
</style>