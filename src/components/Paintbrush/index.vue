<template>
    <div class="option" style="z-index:111111111111" >
      <div>
      <el-color-picker style="z-index:1111111" v-model="color"></el-color-picker>
      </div>
      <el-button @click="closeCanvas">退出画笔</el-button>
      <el-button @click="clear">清除画笔</el-button>
      <el-slider v-model="lineWidth"></el-slider>
    </div>
</template>

<script>
export default {
  data () {
    return {
      lineWidth: 5,
      color: '#F91818',
      left: '',
      top: ''
    }
  },
  mounted () {
    this.draw()
  },
  methods: {
    closeCanvas () {
      document.body.removeChild(document.querySelector('#canvas'))
      this.$emit('close')
    },
    clear () {
      var cxt = document.getElementById('canvas').getContext('2d')
      cxt.clearRect(0, 0, window.innerWidth, window.innerHeight)
    },
    draw () {
      let canvasElement = document.createElement('canvas')
      let body = document.querySelector('body')
      body.appendChild(canvasElement)
      canvasElement.id = 'canvas'

      const canvas = document.querySelector('#canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.strokeStyle = this.color // ctx is the canvas   线条颜色
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.lineWidth = this.lineWidth
      // ctx.globalCompositeOperation = 'multiply';

      let isDrawing = false
      let lastX = 0
      let lastY = 0
      // let hue = 0
      let direction = true

      function draw (e) {
        if (!isDrawing) return // stop the fn from running when they are not moused down

        // ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
        ctx.beginPath()

        // start from
        ctx.moveTo(lastX, lastY)

        // go to
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY]

        // hue++
        // if (hue >= 360) {
        //   hue = 0
        // }
        if (ctx.lineWidth >= 100 || ctx.lineWidth <= 1) {
          direction = !direction
        }
      }

      canvas.addEventListener('mousedown', e => {
        isDrawing = true
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.color;
        [lastX, lastY] = [e.offsetX, e.offsetY]
      })

      canvas.addEventListener('mousemove', draw)
      canvas.addEventListener('mouseup', () => {
        isDrawing = false
      })
      canvas.addEventListener('mouseout', () => {
        isDrawing = false
      })
    }
  }
}
</script>

<style lang="scss">
#canvas {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.option {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 13000;
}
</style>
