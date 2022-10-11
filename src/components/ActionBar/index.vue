<template>
  <div class="bar_box">
    <a-row type="flex" :gutter="[16, 16]" :justify="option.align">
      <a-col v-for="(item, index) in option.list" :key="index">
        <a-button :type="item.type" @click="actionEven(item.emit)">{{ item.title }}</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      option: {
        type: Object,
        default: () => {},
      },
    },
    setup (props, context) {
      const actionEven = emit => {
        context.emit(emit, {})
      }
      return {
        actionEven,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .bar_box {
    margin-top: 5px;
    margin-bottom: 5px;
  }
</style>
