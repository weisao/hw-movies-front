<template>
  <div>
    <a-layout class="menu">
      <menu-header class="menu-header"></menu-header>
      <a-layout class="menu-body" style="">
        <left-sider style="margin-top:20px"></left-sider>
        <!-- 面包屑 -->
        <a-layout style="padding-left: 24px">
          <break-crumb></break-crumb>
          <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
          >
            <!-- 嵌套路由容器 -->
            <content-container></content-container>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
  import ContentContainer from '@/layout/components/ContentContainer'
  import MenuHeader from '@/layout/header/menu-header'
  import LeftSider from '@/layout/components/LeftSider'
  import BreakCrumb from '@/layout/components/BreakCrumb'
  export default {
    name: '',
    components: {
      ContentContainer,
      MenuHeader,
      LeftSider,
      BreakCrumb,
    },
    data () {
      return {
        collapsed: false,
      }
    },
    mounted () {
    },
    methods: {
    },
  }
</script>

<style lang="scss" scoped>
.menu{
  position: relative;
  .menu-header{
    position: absolute;
    z-index: 999;
    width: 100%;
    top:0;
  }
  .menu-body{
    top: 60px;
    position: absolute;
    width: 100%;
    padding: 0 24px 24px;
    height:calc(100vh - 60px);
  }
}
</style>
