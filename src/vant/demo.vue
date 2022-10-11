<template>
  <div style="padding:10px">
    <!-- 轮播栏 -->
    <div style="border:1px solid #000;width:100%;height:200px;margin-bottom:10px">
      轮播图
    </div>
    <!-- 导航栏 -->
    <div style="border:1px solid #000;width:100%;height:100px;margin-bottom:10px">
      导航栏
    </div>
    <!-- 瀑布流区域 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadData"
    >
      <van-cell v-for="(v,k) in actualData" :key="k" style="padding:0px">
        <div style="display:flex">
          <div :style="leftStyle">
            {{ v[0].rowIndex }}
            <div>
              <img style="width:100%;" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </div>
            <div>
              项的描述
            </div>
          </div>
          <div :style="rightStyle">
            {{ v[1].rowIndex }}
            <div>
              <img style="width:100%;" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </div>
            <div>
              项的描述
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>

  export default {
    name: '',
    components: {

    },
    data () {
      const itemRowGutter = 6 // 项的横向间距
      const itemColGutter = 6 // 项的纵向间距
      return {
        itemRowGutter,
        itemColGutter,
        rawData: [], // 原始数据数组
        loading: false, // 加载状态
        finished: false, // 是否全部加载完毕
        current: 0, // 当前页
        pageSize: 10, // 每次请求获取的数量
      }
    },
    computed: {
      // 实际使用数据
      actualData () {
        const actualArr = []
        // 每行数组
        let rowArr = []
        for (let i = 0; i < this.rawData.length; i++) {
          rowArr.push(this.rawData[i])
          if (rowArr.length === 2) {
            // 加入处理后的数组
            actualArr.push(rowArr)
            // 清空
            rowArr = []
          }
        }
        return actualArr
      },
      // 计算每个item宽度
      itemWidth () {
        return document.documentElement.clientWidth
      },
      // 左项
      leftStyle () {
        return {
          width: (this.itemWidth / 2 - this.itemRowGutter) + 'px',
          height: '300px',
          'margin-left': (this.itemRowGutter / 2) + 'px',
          'margin-right': (this.itemRowGutter / 2) + 'px',
          'margin-top': (this.itemColGutter / 2) + 'px',
          'margin-bottom': (this.itemColGutter / 2) + 'px',
          'border': '1px solid #000',
        }
      },
      // 右项
      rightStyle () {
        return {
          width: (this.itemWidth / 2 - this.itemRowGutter) + 'px',
          height: '300px',
          'margin-left': (this.itemRowGutter / 2) + 'px',
          'margin-right': (this.itemRowGutter / 2) + 'px',
          'margin-top': (this.itemColGutter / 2) + 'px',
          'margin-bottom': (this.itemColGutter / 2) + 'px',
          'border': '1px solid #000',
        }
      },
    },
    mounted () {
      const test = [
        '350181199711241930',
        '3501811997112419',
        '12345.121312',
        '123.123.123',
        'asdasd',
        '123()123.123',
      ]
      test.forEach(n => {
        console.log(this._.toNumber(n))
      })
    },
    methods: {
      // 加载数据
      loadData () {
        // 每次请求下一页（current + 1）数据
        const { current, pageSize } = this
        this.getTestData({
          current,
          pageSize,
        }).then(res => {
          // 解构获取 数据 和 数据总条数
          const { records, total } = res
          // 数据序号处理
          const data = records.map((n, i) => {
            n.rowIndex = (current - 1) * pageSize + i + 1
            return n
          })
          // 加入新刷新数据
          this.rawData.push(...data)
          // 加载状态结束
          this.loading = false
          this.current = this.current + 1
          // 数据全部加载完成
          if (this.rawData.length >= total) {
            this.finished = true
          }
        })
      },
      // 测试api
      getTestData ({ current, pageSize }) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // 构造数据
            const total = 105 // 总数
            const allData = [] // 数据
            for (let i = 0; i < total; i++) {
              allData.push({
                name: `yhw${i + 1}`,
              })
            }
            const records = allData.slice((current - 1) * pageSize, current * pageSize)
            resolve({ records, total })
          }, 500)
        })
      },
    },
  }
</script>

<style>
</style>
