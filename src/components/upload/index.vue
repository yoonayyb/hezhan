<template>
  <div style="display: inline-block">
    <el-upload
      :before-upload="beforeUpload"
      :http-request="submitFile"
      :on-change="handleFileChange"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :show-file-list="false"
      :multiple="true"
      action="http://111.230.168.149:8086/api/Upload/Index"
    >
      <el-button
        size="mini"
        slot="trigger"
      >
        点击上传
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
      <slot name="load"></slot>
    </el-upload>
    <el-progress
      v-if="progressStatus"
      :text-inside="true"
      :stroke-width="26"
      :percentage="loadPercentage"
    ></el-progress>

    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img
        :src="imageUrl"
        alt
        width="100%"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 文件上传
      imageUrl: '',
      dialogVisible: false,
      isUploadFile: false,
      loadPercentage: 0,
      progressStatus: false
    }
  },
  props: {
    FileTypeInfo: Object,
    formatFile: Array
  },
  mounted () {
    if (this.fileList) {
      this.files = this.fileList
    }
  },
  methods: {
    handleSuccess (res, file) {
      // this.files = [{name: file.name, url: file.url}]
    },
    handlePictureCardPreview (file) {
      window.location.href = file.url
      // console.log(file.url.split('/'));
      // this.imageUrl = file.url;
      // this.dialogVisible = true;
    },
    beforeUpload (file) {
      // console.log(file)
      if (this.formatFile) {
        let obj = JSON.stringify(this.formatFile)
        let regArr = JSON.parse(obj)
        // 不区分大小写，转大写加入数组
        this.formatFile.forEach(item => {
          regArr.push(item.toUpperCase())
        })
        for (let i = 0; i < regArr.length; i++) {
          regArr[i] = `.${regArr[i]}`
        }
        const reg = new RegExp(`\\S+(${regArr.join('|')})$`)
        if (!reg.test(file.name)) {
          this.$message.error('传入文件类型不正确')
          regArr.length = 0
          return false
        } else {
          regArr.length = 0
        }
      }

      // const isJPG = file.type === 'image/jpeg'
      // const isPNG = file.type === 'image/png'
      // const isPDF = file.type === 'application/pdf'
      // const isLt2M = file.size / 1024 / 1024 < 2;   //限制文件大小

      // if (isJPG || isPNG || isPDF) {
      //
      // } else {
      //   this.$message.error('上传文件只能是 JPG/PNG/PDF 格式!');
      // }

      return true
    },
    handleFileChange (file, fileList) { },
    submitFile (content) {
      let that = this
      that.progressStatus = true
      let formData = new FormData()
      formData.append('FileData', content.file)
      formData.append('FileType', this.FileTypeInfo.FileType)
      formData.append('tableId', this.FileTypeInfo.tableId)
      formData.append('FileTypeId', this.FileTypeInfo.FileTypeId)
      console.log(this.FileTypeInfo)
      this.$http({
        url: '/api/Upload/UploadFile',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (progressEvent) {
          // 对原生进度事件的处理
          if (progressEvent.total !== 0) {
            let i = (progressEvent.loaded / progressEvent.total) * 100
            i = Math.round(i)
            if (progressEvent.loaded === progressEvent.total) {
              setTimeout(() => {
                that.progressStatus = false
                that.loadPercentage = 0
              }, 1500)
            }
            that.addPercent(i)
          }
        }
      }).then(res => {
        if (res.data && res.data.status === 0) {
          content.onSuccess(res.msg)
          this.$emit('getFileInfo', res.data.data)
          // this.$message({
          //   message: '上传成功',
          //   type: 'success',
          //   duration: 1000,
          //   onClose: () => {

          //   }
          // })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleRemove (file, fileList) {
      this.$emit('remove', file, fileList)
    },
    addPercent (percentage) {
      this.loadPercentage = percentage
    }
  }
}
</script>

