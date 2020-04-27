<template>
  <div class="cropper-wrapper">
    <div class="img-box fl">
      <img :id="imgId" alt="" class="cropper-image">
    </div>
    <div class="right-con fl">
      <div :id="previewId" class="preview-box" v-if="preview"></div>
      <div class="el-button-box center">
        <slot>
          <el-upload :before-upload="beforeUpload" action="image/upload">
            <el-button style="width: 150px;margin-top:5px" type="primary">上传图片</el-button>
          </el-upload>
        </slot>
        <div class="center" v-show="insideSrc">
          <el-button @click="rotate" type="primary" size="small">旋转</el-button>
          <el-button @click="shrink" type="primary" size="small">缩小</el-button>
          <el-button @click="magnify" type="primary" size="small">放大</el-button>
          <!-- <el-button @click="scale('X')" type="primary">
            <Icon :size="18" custom="iconfont icon-shuipingfanzhuan"/>
          </el-button>
          <el-button @click="scale('Y')" type="primary">
            <Icon :size="18" custom="iconfont icon-chuizhifanzhuan"/>
          </el-button>-->

          <div style="text-align:center;margin:2px 0">
            <el-button @click="move(0, -moveStep)" type="primary" size="small">向下</el-button>
          </div>
          <div class="center">
            <el-button @click="move(-moveStep, 0)" type="primary" size="small">向左</el-button>
            <el-button @click="move(0, moveStep)" type="primary" size="small">向上</el-button>
            <el-button @click="move(moveStep, 0)" type="primary" size="small">向左</el-button>
            <div class="clear"></div>
          </div>
          <div class="center">
            <el-button @click="crop" style="width: 150px;margin-top: 10px;" type="primary">{{ cropButtonText}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "./index.scss";
import "cropperjs/dist/cropper.min.css";
export default {
  name: "Cropper",
  props: {
    src: {
      type: String,
      default: ""
    },
    preview: {
      type: Boolean,
      default: true
    },
    moveStep: {
      type: Number,
      default: 4
    },
    cropButtonText: {
      type: String,
      default: "确认提交"
    }
  },
  data() {
    return {
      cropper: null,
      insideSrc: "1",
      visible: false
    };
  },
  computed: {
    imgId() {
      return `cropper${this._uid}`;
    },
    previewId() {
      return `cropper_preview${this._uid}`;
    }
  },
  watch: {
    src(src) {
      this.replace(src);
    },
    insideSrc(src) {
      this.replace(src);
    }
  },
  methods: {
    init() {
      this.visible = true;
    },
    beforeUpload(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        this.insideSrc = event.srcElement.result;
      };
      return false;
    },
    replace(src) {
      this.cropper.replace(src);
      this.insideSrc = src;
    },
    rotate() {
      this.cropper.rotate(90);
    },
    shrink() {
      this.cropper.zoom(-0.1);
    },
    magnify() {
      this.cropper.zoom(0.1);
    },
    scale(d) {
      this.cropper[`scale${d}`](-this.cropper.getData()[`scale${d}`]);
    },
    move(...argu) {
      this.cropper.move(...argu);
    },
    crop() {
      this.cropper.getCroppedCanvas().toBlob(blob => {
        console.log(blob);
        let formData = new FormData();
        formData.append(
          "FileData",
          new window.File([blob], new Date().getTime() + ".png")
        );
        // formData.append('FileType', this.FileType)
        // formData.append('tableId', this.tableId)
        // formData.append('FileTypeId', this.FileTypeId)
        this.$http({
          url: "/api/Upload/UploadFile",
          method: "post",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(res => {
          if (res.data && res.data.status === 0) {
            const data = res.data.data;
            this.$emit("get-file", data);
          } else {
            this.$message.error(res.data.msg);
          }
        });
        this.$emit("on-crop", blob);
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      let dom = document.getElementById(this.imgId);
      this.cropper = new Cropper(dom, {
        preview: `#${this.previewId}`,
        checkCrossOrigin: true
      });
    });
  }
};
</script>
