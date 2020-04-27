<template>
  <el-dialog
    title="个人信息"
    :visible.sync="visible"
    :append-to-body="true"
  >
    <el-form
      :model="dataForm"
      label-width="120px"
      ref="dataForm"
    >
      <el-form-item label="姓名">
        <span>{{ userInfo.Name }}</span>
      </el-form-item>

      <el-form-item label="账号">
        <span>{{ userInfo.UserName }}</span>
      </el-form-item>

      <el-form-item label="所在医院">
        <span>{{ userInfo.OrgName }}</span>
      </el-form-item>

      <!-- <el-form-item label="所在科室">
        <span>{{ userInfo.DeptName }}</span>
      </el-form-item> -->

      <el-form-item label="角色名称">
        <span>{{ userInfo.RoleName }}</span>
      </el-form-item>
    </el-form>

    <div class="user-avatar">
      <i
        class="el-icon-plus avatar-uploader-icon"
        v-if="!isAvatar"
      ></i>

      <img
        :src="$url+userInfo.imgPath"
        class="avatar-uploader-icon"
        alt=""
        v-if="isAvatar"
      >
      <div>
        <el-button
          @click="showAvatar"
          size="mini"
          type="primary"
          plain
          style='margin-top:10px;width:100%'
        > {{isAvatar?'修改头像':'上传头像'}}</el-button>
      </div>

      <Avatar ref="avatar" />
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Avatar from './avatar.vue'
import { mapState } from 'vuex'

export default {
  components: { Avatar },
  data () {
    return {
      visible: false,
      dataForm: {},
      imageUrl: '',
      avatarImg: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    }),
    isAvatar () {
      return this.userInfo.imgPath && this.userInfo.imgPath !== ''
    }
  },
  methods: {
    init () {
      this.visible = true
    },
    showAvatar () {
      this.$refs.avatar.init()
    }
  }
}
</script>
<style scoped>
.user-avatar {
  position: absolute;
  right: 50px;
  top: 50px;
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
