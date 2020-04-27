<template>
  <el-form
    :model="dataForm"
    :rules="rules"
    class="demo-ruleForm"
    label-width="100px"
    ref="dataForm"
  >
    <el-form-item
      label="旧密码"
      prop="oldPwd"
    >
      <el-input
        type="password"
        v-model="dataForm.oldPwd"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="新密码"
      prop="newPwd"
      status-icon
    >
      <el-input
        type="password"
        v-model="dataForm.newPwd"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="确认新密码"
      prop="checkPass"
    >
      <el-input
        type="password"
        v-model="dataForm.checkPass"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        @click="submitForm"
        type="primary"
      >提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { loginUpdatePwd } from '@/api/index'
import { hex_md5 } from '@/utils/md5'
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        oldPwd: '',
        newPwd: '',
        checkPwd: ''
      },
      rules: {
        oldPwd: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'change' }],
        checkPass: [
          { required: true, validator: validatePass, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          let params = {
            oldpwd: hex_md5(this.dataForm.oldPwd),
            newPwd: hex_md5(this.dataForm.newPwd)
          }
          loginUpdatePwd(params).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                showClose: true,
                message: data.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.$alert('请重新登陆账号！', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.replace({ name: 'login' })
                      location.reload()
                    }
                  })
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
    }
  }
}
</script>

<style scoped>
.demo-ruleForm {
  width: 460px;
}
</style>
