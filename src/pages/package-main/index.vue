<template>
  <view class="index">
    <AtButton class="btn" type="primary" :on-click="()=>toGame('2048')">2048</AtButton>
  </view>
</template>

<script>
// 按需引入, 更小的应用体积
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui-vue'
import "taro-ui-vue/dist/style/components/button.scss"
import './index.scss' 
export default {
  components: {
    AtButton,
  },
  data () {
    return {
    }
  },
  onShareAppMessage(res){
    return {
      title: '栗子的demo',
      path: 'pages/package-main/index'
    }
  },
  methods: {
    toGame () {
      Taro.navigateTo({
        url: '/pages/package-2048/index'
      })
    },
  },
}
</script>
