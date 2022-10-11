<template>
  <!--路由视图容器-->
  <!-- <div style="position: relative">
    <keep-alive :include="include" :exclude="exclude">
      <router-view :include="include" :exclude="exclude">
      </router-view>
    </keep-alive>
  </div> -->
  <div>
    <router-view :include="include" :exclude="exclude" style="min-height:500px">
    </router-view>
  </div>
</template>

<script>
  export default {
    name: 'ContentContainer',
    props: {
      include: {
        type: [String, Array],
        default: () => [],
      },
      exclude: {
        type: [String, Array],
        default: () => [],
      },
    },
  }
</script>
