<template>
  <div id="login">
    <div class="login-box">

      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" style="margin-top:10px;">
        <div style="text-align:center;font-size:25px;margin-top:200px;margin-bottom:40px">登录</div>
        <a-form-model-item has-feedback label="用户名" prop="username">
          <a-input v-model.number="ruleForm.username"></a-input>
        </a-form-model-item>

        <a-form-model-item has-feedback label="密码" prop="pass">
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off"></a-input>
        </a-form-model-item>

        <a-row type="flex" justify="center" style="margin-top:5px;margin-bottom:5px">
          <a-col>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="submitForm('ruleForm')">
                登录
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>

      </a-form-model>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Login',
    data () {
      const checkUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          if (this.ruleForm.username !== '') {
            this.$refs.ruleForm.validateField('username')
          }
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.pass !== '') {
            this.$refs.ruleForm.validateField('pass')
          }
          callback()
        }
      }
      return {
        username: '',
        password: '',
        ruleForm: {
          username: '',
          pass: '',
        },
        rules: {
          username: [{ validator: checkUsername, trigger: 'change' }],
          pass: [{ validator: validatePass, trigger: 'change' }],
        },
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        },
      }
    },
    computed: {
      ...mapState({
        testInfo (state) {
          return state
        },
      }),
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.handleLogin()
          } else {
            console.log('格式错误')
            return false
          }
        })
      },
      handleLogin () {
        console.log('login on......')
        const userName = this.ruleForm.username
        const password = this.ruleForm.pass
        this.$store.dispatch('LoginByUsername', {
          userName, password,
        }).then(res => {
          this.$store.dispatch('setUserInfo', { userName: res.data[0].userName, rolesId: res.data[0].roles })
          this.$router.push({
            path: '/admin',
          }).catch(() => {})
          this.$message.success('登录成功')
        }).catch(() => {
          this.$message.error('登录失败')
          console.log('login fail')
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
#login {
  background-color: #1177b0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .login-box{
    margin: 0 auto;
    background-color: white;
    width: 500px;
    height: 300px;
  }
}
</style>
