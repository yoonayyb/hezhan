<template>
  <div style="display: inline-block">
    <el-upload
      class="upload-demo"
      multiple
      action="http://111.230.168.149:8086/api/Upload/Index"
      :http-request="submitFile"
      :file-list="files"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :on-change="handleFileChange"
      :show-file-list="false"
      :on-remove="handleRemove">
      <el-button><i class="el-icon-upload"></i>点击上传</el-button>

      <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>

    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="imageUrl" alt="">
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
        files: []
      }
    },
    props: {
      fileList: {
        type: Array,
        default: () => []
      }
    },
    watch: {
      'fileList': function (val) {
        this.files = val
      }
    },
    mounted () {
      if (this.fileList) {
        this.files = this.fileList
      }
    },
    methods: {
      handleSuccess (res, file, filelist) {
        this.$emit('onSuccess', res, file, filelist)
        console.log(res, file, filelist)
      },
      handlePictureCardPreview (file) {
        window.location.href = file.url
        // console.log(file.url.split('/'));
        // this.imageUrl = file.url;
        // this.dialogVisible = true;
      },
      beforeUpload (file) {
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
      handleFileChange (file, fileList) {

      },
      submitFile (content) {
        let formData = new FormData()
        formData.append('FileData', content.file)
        this.$http({
          url: 'api/Upload/Index',
          method: 'post',
          data: formData
        }).then(res => {
          if (res.data && res.data.status === 0) {
            content.onSuccess(res)
            this.$message({
              message: '上传成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.$emit('getPath', res.data.data)
              }
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      handleRemove (file, fileList) {
        this.$emit('remove', file, fileList)
      },
      download () {
        console.log('下载模版')
      }
    }

  }
</script>

