<template>
  <view class="index">
    <AtNoticebar marquee>
      0824版2048
    </AtNoticebar>
    <view class="header">
      <AtButton
        class="btn"
        type="primary"
        :on-click="init"
      >
        开始新的游戏
      </AtButton>
    </view>
    <view v-if="isGameOver" class="game-over">
      游戏结束
    </view>
    <view class="content" 
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd">
      <view class="item" v-for="(item,index) in numbers" :key="index">
        <view :class="item?'number':'numberZero'"
          :style="{backgroundImage: `url(https://cdn.jsdelivr.net/gh/chestnut824/pic/weapp/${item}.jpg)`}">
          {{item}}
        </view>
      </view>
    </view>
    <AtToast :is-opened="show" :text="msg" :on-close="handleClose"></AtToast>

  </view>
</template>

<script>
// 按需引入, 更小的应用体积
import { AtButton, AtToast, AtNoticebar } from 'taro-ui-vue'
import "taro-ui-vue/dist/style/components/button.scss"
import "taro-ui-vue/dist/style/components/toast.scss"
import "taro-ui-vue/dist/style/components/noticebar.scss"
import './index.scss' 
export default {
    components: {
    AtButton,
    AtToast,
    AtNoticebar
  },
  data () {
    return {
      msg: 'Hello world!',
      show: false,
      startX:null,
      startY:null,
      endX:null,
      endY:null,
      direction: '',
      threshold: 30,
      numbers: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      isGameOver: false,
      tempArrs: []
    }
  },
  created(){
    this.init()
  },
  methods: {
    init () {
      this.isGameOver = false
      this.numbers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      this.fillEmptyCell()
      this.fillEmptyCell()
    },
    handleClose () {
      this.show = false
    },
    handleTouchStart(e) {
      this.startX = e.touches[0].pageX
      this.startY = e.touches[0].pageY
    },
    handleTouchEnd() {
      let deltaX = this.endX - this.startX
      let deltaY = this.endY - this.startY
      
      if(Math.abs(deltaY)>Math.abs(deltaX) && deltaY>this.threshold) { //下
        this.direction = 'down'
      } else if(Math.abs(deltaY)>Math.abs(deltaX) && deltaY<-this.threshold) { //上
        this.direction = 'up'
      } else if(Math.abs(deltaY)<Math.abs(deltaX) && deltaX>this.threshold) { // 右
        this.direction = 'right'
      } else if(Math.abs(deltaY)<Math.abs(deltaX) && deltaX<-this.threshold) { // 左
        this.direction = 'left'
      }
      this.update()
    },
    handleTouchMove(e) {
      this.endX = e.touches[0].pageX
      this.endY = e.touches[0].pageY
    },
    fillEmptyCell() {
      const emptyIndex = []
      this.numbers.forEach((element, index) => {
        if(!element) {
          emptyIndex.push(index)
        }
      });
      let randomIndex = emptyIndex[Math.floor(Math.random()*emptyIndex.length)]
      this.numbers[randomIndex] = Math.random()>0.8?4:2
    },
    transformArr() {
      let arr = [...this.numbers]
      this.tempArrs = []
      switch(this.direction) {
        case 'up':
        case 'down':
          for(let i=0; i<4; i++) {
            let temp = []
            for( let j=0;j<4;j++) {
              temp.push(arr[4*j+i])
            }
            this.tempArrs.push(temp)
          }
          break
        case 'left':
        case 'right':
          for(let i=0; i<4; i++) {
            this.tempArrs.push(arr.slice(i*4,(i+1)*4))
          }
          break
        default:
          break
      }
    },
    removeZeros() {
      for(let i=0;i<4;i++){
        let nonZeros = this.tempArrs[i].filter(item=>item!=0)
        let zeros = new Array(4-nonZeros.length).fill(0)
        if(this.direction==='left'||this.direction==='up'){
          this.tempArrs[i] = nonZeros.concat(zeros)
        } else if(this.direction==='down'||this.direction==='right'){
          this.tempArrs[i] = zeros.concat(nonZeros)
        }
      }
      console.log(this.tempArrs)
    },
    addNumbers() {
      for(let i=0;i<4;i++){
        let arr =this.tempArrs[i]
        if(this.direction==='left'||this.direction==='up'){
          let j = 1
          while(j<4) {
            if(arr[j]===arr[j-1] && arr[j]<2048) {
              let sum = [2*arr[j]]
              let remainFront = arr.slice(0,j-1)
              let remainBack = arr.slice(j+1,4)
              this.tempArrs[i] = remainFront.concat(sum.concat(remainBack))
              this.tempArrs[i].push(0)
              break
            }
            j++
          }
          
        } else if(this.direction==='down'||this.direction==='right'){
          let j = 3
          while(j>0){
            if(arr[j-1]===arr[j] && arr[j]) {
              let sum = [2*arr[j]]
              let remainFront = arr.slice(0,j-1)
              let remainBack = arr.slice(j+1,4)
              this.tempArrs[i] = remainFront.concat(sum.concat(remainBack))
              this.tempArrs[i].unshift(0)
              break
            }
            j--
          }
          
        }
      }
    },
    recoverArr() {
      this.numbers = []
      switch(this.direction) {
        case 'up':
        case 'down':
          for(let i=0; i<16; i++) {
            this.numbers.push(this.tempArrs[i%4][Math.floor(i/4)])
          }
          break
        case 'left':
        case 'right':
          for(let i=0; i<4; i++) {
            this.numbers = this.numbers.concat(this.tempArrs[i])
          }
          break
        default:
          break
      }
    },
    update() {
      console.log(this.direction)
      this.transformArr()
      this.removeZeros()
      this.addNumbers()
      this.recoverArr()
      this.fillEmptyCell()
      this.fillEmptyCell()
    },

  },
}
</script>
