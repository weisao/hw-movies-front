<template>
  <div>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item v-for="item in breaks" :key="item.name" style="cursor: pointer;">
        <span @click="onClick(item)">{{ item.meta.title }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {

      }
    },
    computed: {
      breaks () {
        return this.$route.matched
      },
    },
    methods: {
      onClick (e) {
        e.name !== this.$route.name
          ? this.$router.push({
            name: e.name,
          }).catch(() => {}) : ''
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>
