<template>
  <div>
    <a-layout-header class="header">
      <div class="title-box">
        <img alt="logo" class="logo" src="@/assets/logo.png" />
        <span class="title">电影管理平台</span>
      </div>
    </a-layout-header>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      hasModule: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {

      }
    },
    methods: {
      onClick (e) {
        console.log(e)
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep{
    .ant-layout-header{
      padding: 0 25px;
    }
  }
.header{
  background: #001C36;
  overflow: hidden;

  .title-box{
    width: 300px;
    height: 55px;
    margin: 5px;
    display:flex;
    align-items: center;

    .logo{
      width: 30px;
      height: 30px;
    }

    .title{
      margin-left: 10px;
      color: #fefefe;
      font-size: 20px;
    }
  }
}

</style>
