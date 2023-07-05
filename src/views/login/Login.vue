<template>
    <div class="login-wrap">
        <div class="ms-title">影视后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"  @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="密码"  @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" >登录</el-button>
                </div>
            </el-form>
        </div>
        <!--二维码-->
        <!--<canvas id="canvas"></canvas>-->
    </div>
</template>



<script>

export default {
   name: "login",

   data(){
       return {
           ruleForm:{
               username: "",
               password: ""
           },
           rules: {
               username: [
                   {required: true, message: '用户名不能为空', trigger: 'blur'}
               ],
               password: [
                   {required: true, message: '用户密码不能为空', trigger: 'blur'}
               ],
           }
       }
   },
   methods:{
       useqrcode(){
           let canvas= document.getElementById("canvas");
           // 调用函数去生成二维码，参数依次为：二维码的容器、要生成的内容、回调函数
           this.QR.toCanvas(canvas,"http://192.168.3.48:8080",function(error){
               if(error){
                   console.error(error);
               }else{
                   console.log("success!");
               }
           })
        },
       submitForm(formName){
           this.$refs[formName].validate((valid) => {
               if (valid) {
                  this.$http.get('/rst-user/user/login',{params:{
                          userName:this.ruleForm.username,
                          password:this.ruleForm.password
                      }}).then(res=>{
                        if(res.data.code === 200){
                            window.sessionStorage.setItem('user',JSON.stringify(res.data.data))
                            this.$router.push('/home')
                        }
                  })
               } else {
                   this.$message.error('登陆失败')
                   return false;
               }
           });
       }

   },
   created() {
   },
    mounted(){
        this.useqrcode()
   }
}
</script>

<style scoped>
    @import url("Login.css");
</style>