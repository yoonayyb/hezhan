<template>
  <el-dialog :close-on-click-modal="false" :title="!dataForm.ID ? '新增' : '修改'" :visible.sync="visible" @close="$emit('close')">
    <el-form :model="dataForm"  label-width="165px" ref="dataForm">
      <el-form-item label="工作流程类型" prop="Flow_type" :rules="[{ required: true, message: '请选择工作流程类型'}]">
        <el-select placeholder="请选择" v-model="dataForm.Flow_type_id" style="width:60%;"  @change="typeChange">
          <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in types"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="环节名称" prop="Link_name" :rules="[{ required: true, message: '请填写环节名称'}]">
        <el-input v-model="dataForm.Link_name" style="width:60%;"></el-input>
      </el-form-item>

      <el-form-item label="环节排序" prop="Link_order">
        <el-input-number label="排序" v-model="dataForm.Link_order"></el-input-number>
      </el-form-item>

      <el-form-item label="状态" prop="Status" style="width:60%;">
        <el-radio-group v-model="dataForm.Status">
          <el-radio label="0">关闭</el-radio>
          <el-radio label="1">开启</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary" :loading="submitButtonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getWorkflowLinkDefineViewModel,
  saveWorkflowLinkDefine,
  getBaseDict
} from '@/api/index.js'

export default {
  data () {
    return {
      visible: false,
      dataForm: {},
      types: [],
      submitButtonLoading: false
    }
  },
  mounted () {
    this.getTypes()
  },

  methods: {
    init (id) {
      if (id) {
        getWorkflowLinkDefineViewModel(id).then(({ data }) => {
          this.dataForm = data
          this.visible = true
          this.$nextTick(_ => {
            this.$refs.dataForm.resetFields()
          })
        })
      } else {
        getWorkflowLinkDefineViewModel(0).then(({ data }) => {
          this.dataForm = data
          this.dataForm.Status = '1'
          this.visible = true
          this.$nextTick(_ => {
            this.$refs.dataForm.resetFields()
          })
        })
      }
    },
    getTypes () {
      getBaseDict('7d6a9d05-0f14-40fb-b66c-74026fd72dd7').then(({ data }) => {
        this.types = data.pageList
      })
    },
    typeChange (val) {
      let label = this.types.find(item => {
        return val === item.ID
      })
      this.dataForm.Flow_type = label.NAME
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true
          saveWorkflowLinkDefine(this.dataForm).then(({ data }) => {
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
          })
        }
      })
    }
  }
}
</script>
