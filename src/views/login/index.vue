<template>
  <div class="login-bg">

    <!-- 登录栏 -->
    <div class="login-win">
      <div class="top">
        <div class="header">
          <img alt="logo" class="logo" src="@/assets/logo.png" />
          <span class="title">电影管理平台</span>
        </div>
      </div>
      <div class="login">
        <a-form :form="form" @submit="onSubmit">
          <a-tabs size="large" :tab-bar-style="{textAlign: 'center'}" style="padding: 0 2px;">
            <a-tab-pane key="1" tab="账户密码登录">
              <a-alert v-show="error" type="error" :closable="true" :message="error" show-icon style="margin-bottom: 24px;"></a-alert>
              <a-form-item>
                <a-input
                  v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
                  autocomplete="autocomplete"
                  size="large"
                  placeholder="admin"
                >
                  <a-icon slot="prefix" type="user"></a-icon>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
                  size="large"
                  placeholder="123456"
                  autocomplete="autocomplete"
                  type="password"
                >
                  <a-icon slot="prefix" type="lock"></a-icon>
                </a-input>
              </a-form-item>
            </a-tab-pane>
          </a-tabs>
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" html-type="submit" type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

  </div>
</template>

<script>
  import { loginByUser } from '@/api/api.js'
  import { setAccessToken } from '@/utils/auth'
  export default {
    name: 'Login',
    data () {
      return {
        logging: false,
        error: '',
        form: this.$form.createForm(this),
      }
    },
    methods: {
      onSubmit (e) {
        e.preventDefault()
        this.form.validateFields(err => {
          if (!err) {
            this.logging = true
            const name = this.form.getFieldValue('name')
            const password = this.form.getFieldValue('password')
            loginByUser({
              'account': name,
              'password': password,
            }).then(res => {
              setAccessToken(res.data.token)
              this.$router.push({
                path: '/admin',
              }).catch(() => {})
              console.log(res)
            }).finally(() => {
              this.logging = false
            })
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-bg{
    background-image: url('../../assets/login-bg.svg');
    height: 100vh;
    overflow: hidden;

    .login-win{
      width: 500px;
      margin: 150px auto;
      vertical-align: middle;
      background-color: rgba(255,255,255,0.8);
      border:1px solid rgba(255,255,255,0.8);
      border-radius: 5px;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
      padding: 50px 10px;

      .top {
        text-align: center;
        .header {
          height: 44px;
          line-height: 44px;
          a {
            text-decoration: none;
          }
          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
          }
          .title {
            font-size: 33px;
            color: black;
            font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: black;
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
      .login{
        width: 368px;
        margin: 0 auto;
        @media screen and (max-width: 576px) {
          width: 95%;
        }
        @media screen and (max-width: 320px) {
          .captcha-button{
            font-size: 14px;
          }
        }
        .icon {
          font-size: 24px;
          color: black;
          margin-left: 16px;
          vertical-align: middle;
          cursor: pointer;
          transition: color 0.3s;

          &:hover {
            color: blue;
          }
        }
      }
    }

  }

</style>
