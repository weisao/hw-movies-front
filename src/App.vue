<template>
  <a-config-provider :locale="locale">
    <!-- <router-link to="/login"></router-link> -->
    <router-view></router-view>
  </a-config-provider>
</template>
<script>
  import zhCN from 'ant-design-vue/es/locale/zh_CN'
  export default {
    data () {
      return {
        locale: zhCN,
      }
    },
  }
</script>
<style lang="scss">
</style>
