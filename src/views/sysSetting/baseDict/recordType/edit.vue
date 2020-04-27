<template>
  <el-dialog :close-on-click-modal="false" :title="!dataForm.ID ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm"  label-width="100px" ref="dataForm" >
      <el-form-item label="名称" prop="pn_type" style="width:60%;" :rules="{ required: true, message: '请填写名称',trigger: 'blur'}"> 
        <el-input v-model="dataForm.pn_type"></el-input>
      </el-form-item>

      <el-form-item label="排序编号" prop="sort" style="width:60%;" :rules="{ required: true, message: '请填写排序编号'}">
        <el-input v-model="dataForm.sort"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status" style="width:60%;">
        <el-select placeholder="请选择是否启用" v-model="dataForm.status" style="width:100%;">
          <el-option :key="index" :label="item.label" :value="item.value" v-for="(item,index) in statusList"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary" :loading="submitButtonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  data () {
    return {
      visible: false,
      dataForm: {
        sort: 99
      },
      types: [],
      chilrenTypes: [],
      submitButtonLoading: false,
      statusList: [{
        value: '0',
        label: '启用'},
      {value: '1',
        label: '禁用'}]
    }
  },
  created () {
    // this.getChilrenTypes()
  },

  methods: {
    userInfo () {
      return this.$store.state.user.userInfo
    },
    init (id) {
      this.dataForm.ID = id || 0
      this.$http({
        url: this.$http.adornUrl('/api/Progress/GetViewModel/0'),
        method: 'get',
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          this.dataForm = data
          this.dataForm.status = '0'
        })
        .then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        })
        .then(() => {
          if (id) {
            this.dataForm.ID = id
            this.$http({
              url: this.$http.adornUrl(
                `/api/Progress/GetViewModel/${this.dataForm.ID}`
              ),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.dataForm = data
            })
          }
        })
      // this.getTypes()
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true
          this.$http({
            url: this.$http.adornUrl(`/api/Progress/Save`),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({ data }) => {
            if (data && data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.submitButtonLoading = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
              this.submitButtonLoading = false
            }
          }).catch(() => {
            this.submitButtonLoading = false
          })
        }
      })
    }
  }
}
</script>
