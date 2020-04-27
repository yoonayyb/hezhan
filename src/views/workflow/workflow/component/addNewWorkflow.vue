<template>
  <el-dialog :visible.sync="dialogFormVisible" title="添加新环节"  @close="close" width="450px">
    <el-form :model="dataForm" ref="dataForm">
      <el-form-item label-width="100px" label="审批环节" prop="Link_id"  :rules="[{ required: true, message: '请选择请选择审批环节'}]">
        <el-select placeholder="请选择审批环节" v-model="dataForm.Link_id" @change="linkChange">
          <el-option :label="item.LINK_NAME" :value="item.ID" v-for="item in links" :key="item.ID"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="dataFormSubmit" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getWorkflowViewModel, getWorkflowLinkDefineList, saveWorkflowLink} from '@/api/index'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dataForm: {},
      links: [],
      linkId: ''
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    async init (id) {
      this.dialogFormVisible = true
      let viewModel = await getWorkflowViewModel(id)
      this.dataForm = viewModel.data
      let links = await getWorkflowLinkDefineList({Flow_type_id: viewModel.data.Flow_type_id})
      this.links = links.data.pageList
    },
    linkChange (val) {
      let label = this.links.find(item => {
        return item.ID === val
      })
      this.dataForm.Link_name = label.LINK_NAME
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let params = {
            Org_id: this.dataForm.Org_id,
            Work_flow_id: this.$route.query.id,
            Link_id: this.dataForm.Link_id,
            Link_name: this.dataForm.Link_name
          }
          saveWorkflowLink(params).then(({data}) => {
            if (data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dialogFormVisible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style>
</style>
