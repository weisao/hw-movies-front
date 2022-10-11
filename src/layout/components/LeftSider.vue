<template>
  <div>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        mode="inline"
        :default-selected-keys="[selected]"
        :default-open-keys="openKey"
        :style="{ height: '100%', borderRight: 0 }"
      >
        <a-sub-menu v-for="item in routes.children" :key="item.name">
          <span slot="title">
            <!-- <a-icon type="user"></a-icon> -->
            {{ item.meta.title }}
          </span>
          <a-menu-item v-for="menuItem in item.children" :key="menuItem.name" @click="onClick">
            {{ menuItem.meta.title }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      moduleName: {
        type: String,
        default: 'Admin',
      },
    },
    data () {
      return {

      }
    },
    computed: {
      routes () {
        return this.$store.getters.addRoutes.find((n, i) => {
          return n.name === this.moduleName
        })
      },
      openKey () {
        return this.routes.children.map((n, i) => {
          return n.name
        })
      },
      selected () {
        return this.$route.name
      },
    },
    // mounted () {
    //   console.log(this.selected)
    // },
    methods: {
      onClick (e) {
        e.key !== this.selected
          ? this.$router.push({
            name: e.key,
          }) : ''
      },
    },
  }
</script>

<style lang="scss" scoped>
</style>
