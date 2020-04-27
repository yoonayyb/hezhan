<template>
  <el-dialog :close-on-click-modal="false" :title="!dataForm.ID ? '新增' : '修改'" :visible.sync="visible">
    <el-form :model="dataForm"  label-width="100px" ref="dataForm" >
      <el-form-item label="版本名称" prop="version_name" style="width:60%;" :rules="{ required: true, message: '请填写版本名称',trigger: 'blur'}"> 
        <el-input v-model="dataForm.version_name"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="version_no" style="width:60%;" :rules="{ required: true, message: '请填写版本号',trigger: 'blur'}"> 
        <el-input v-model="dataForm.version_no"></el-input>
      </el-form-item>
      <el-form-item label="排序编号" prop="sort_id" style="width:60%;" :rules="{ required: true, message: '请填写排序编号'}">
        <el-input v-model="dataForm.sort_id"></el-input>
      </el-form-item>
      <el-form-item label="版本文件" prop="path" style="width:80%;" :rules="{ required: true, message: '请上传版本文件'}">
        <div>
          <el-input v-model="dataForm.path" :readonly="true"></el-input>
        </div>
        <Upload
            :FileTypeInfo="{tableId:$route.query.id?$route.query.id:'0',
          FileType:'手机版本',
          FileTypeId:dataForm.id}"
            @getFileInfo="getFile"
          ></Upload>
      </el-form-item>
      <el-form-item label="备注" prop="explain" style="width:60%;">
        <el-input v-model="dataForm.explain"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status" style="width:60%;">
        <el-select placeholder="请选择是否启用" v-model="dataForm.status" style="width:100%;">
          <el-option :key="index" :label="item.label" :value="item.value" v-for="(item,index) in statusList"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary" :loading="submitButtonLoading" :disabled="submitButtonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Upload from '@/components/upload/index'

export default {
  components: { Treeselect, Upload },
  data () {
    return {
      visible: false,
      dataForm: {
        sort: 99
      },
      types: [],
      chilrenTypes: [],
      submitButtonLoading: false
      // statusList: [{
      //   value: '0',
      //   label: '启用'},
      // {value: '1',
      //   label: '禁用'}]
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
        url: this.$http.adornUrl('/api/MobileClientVersion/GetViewModel/0'),
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
                `/api/MobileClientVersion/GetViewModel/${this.dataForm.ID}`
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
            url: this.$http.adornUrl(`/api/MobileClientVersion/Save`),
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
    },
    getFile (val) {
      this.dataForm.path = val.Path
      // console.log(val)
    }
  }
}
</script>
