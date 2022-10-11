<template>
  <!-- 刷新用路由 -->
  <div>123123</div>
</template>

<script>
  export default {
    name: 'Refresh',
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // const { name, } = from

        vm.$router.replace({
          ...from,
        })
      })
    },
  }
</script>

