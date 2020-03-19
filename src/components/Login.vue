<template>
  <div class="container-wrap">
    <el-form class="login" :rules="rules" label-position="right" ref="loginForm" :model="form">

      <h3 class="title">用户登录系统</h3>

      <el-form-item prop="userName"> 
        <el-input prefix-icon="el-icon-user-solid" v-model="form.username" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="userPassword">
        <el-input type="password" prefix-icon="el-icon-lock" v-model="form.userpass" placeholder="密码"></el-input>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="checked">记住密码</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="loginBtn" @click="onSubmit('loginForm')">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseURL } from "../common/js/ipconfig.js";
export default {
    name:"login",
    data() {
      return {
        form: {
          username: '',
          userpass: '',
        },
        checked: false,
        rules:{
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          userpass: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        },
      }
    },
    created(){
      let isHave=localStorage.getItem("userLoginInfo")
      if(isHave!=null){
        this.form=JSON.parse(isHave)
      }
    },
    methods: {
      onSubmit(form) {
        if(this.checked){
          localStorage.setItem('userLoginInfo',JSON.stringify(this.form));
        }
        this.$refs[form].validate((valid) => {
          if (valid) {
             this.loginFn();
          } else {
            return false;
          }
        });
      },
      async loginFn(){
        
        const data=await this.$axios.post(`${baseURL.ip1}/Login/checkLogin`,this._qs.stringify(this.form) );
        localStorage.setItem('token', data.token);
        this.$router.push({ path: this.redirect || '/' }, onComplete => { }, onAbort => { })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container-wrap{
    height: 100%;
    background:#409EFF;
  }
  .login{
    border-radius: 10px;
    padding:30px 50px 20px 50px;
    background: #fff;
    width:250px;
    position: absolute;
    left:50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .title{
      font-size: 20px;
      color: #333;
      text-align:center;
      margin-bottom: 20px;
    }
    .loginBtn{
      width:100%;
    }
  }
</style>
