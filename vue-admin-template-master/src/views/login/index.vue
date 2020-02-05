<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">商保医疗票据核验理算平台</h3>
        <p class="tip_txt">你好！</p>
        <p class="tip_txt little_font">欢迎登录平台</p>
      </div>

      <el-form-item prop="username">
        <!-- <span class="svg-container">
          <svg-icon icon-class="user" />
        </span> -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="你的用户名/邮箱账号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <!-- <span class="svg-container">
          <svg-icon icon-class="password" />
        </span> -->
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span> -->
      </el-form-item>

      <el-button :loading="loading" class="loginBtn" @click.native.prevent="handleLogin">登 录</el-button>

      <div class="tips">
        <p><a href="#">忘记密码？</a></p>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入你的用户名/邮箱账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入6位密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
$input_color:#B1B1B1;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    // height: 47px;
    width: 85%;

    input {
      background: #F7F4FB;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 34px;
      padding-left:30px;
      color: $input_color;
      height: 68px;
      caret-color: $cursor;
      font-size:20px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    width: 480px;
    border: none;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__error {
    left:30px;
  }
  .loginBtn {
    border:none;
    width:220px;
    height:60px;
    font-size:24px;
    margin-top:20px;
    background:#2CA17C;
    color:#fff;
    border-radius:30px;
    box-shadow:0px 17px 21px 0px rgba(44,165,127,0.2);
  }
}
</style>

<style lang="scss" scoped>
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;
$dark_green:#27745B;

.login-container {
  min-height: 100%;
  width: 100%;
  background: $bg url("../../assets/login/bg.png") no-repeat right bottom;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 880px;
    max-width: 100%;
    padding: 160px 35px 30px 119px;
    // margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    margin-top:50px;
    font-size: 20px;
    color: #2CA47E;
    margin-bottom: 10px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 60px;
      color: $dark_green;
      // margin: 0px auto 40px auto;
      text-align: left;
      font-weight: bold;
    }
    .tip_txt {
      font-size:30px;
      color:#0E121A;
    }
    .little_font {
      margin-bottom:50px;
      font-size: 26px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
