<template>
  <el-dialog
    title="上传图片"
    :visible.sync="visible"
    :append-to-body="true"
    width="800px"
  >
    <Cropper @get-file="getFile" />

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取消</el-button>
      <div class="clear"></div>
    </span>
  </el-dialog>
</template>

<script>
import Cropper from '@/components/cropper/index'
import { updateImgPath } from '@/api/modules/login.js'
export default {
  components: { Cropper },
  data () {
    return {
      visible: false,
      dataForm: {},
      imageUrl: ''
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    getFile (val) {
      this.save(val).then(() => {
        this.visible = false
        this.$emit('get-file', val)
      })
    },
    async save (img) {
      console.log(img)
      const { data } = await updateImgPath({ ImgPath: img.Path })
      if (data && data.status === 0) {
        this.$message({
          message: data.msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$store.dispatch('getUserInfo')
          }
        })
      } else {
        this.$message.error(data.msg)
      }
      console.log(data)
    }
  },
  computed: {
    userInfo: {
      get () { return this.$store.state.user.userInfo }
    }
  }
}
</script>
<style>
</style>

