<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="!dataForm.ID ? '新增' : '修改'"
    :visible.sync="visible"
    @close="close"
    width="700px"
  >
    <el-table :data="orgTableData" @selection-change="handleOrgSelectChange" border ref="orgTable">
      <el-table-column label="医院" prop="ORG_NAME"></el-table-column>
      <el-table-column align="center" header-align="center" label="医院类型" prop="institutionType"></el-table-column>
      <el-table-column align="center" header-align="center" label="医院等级" prop="orgType"></el-table-column>
      <el-table-column type="selection" width="45"></el-table-column>
    </el-table>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveSysdataauthorize, getSysdataauthorizeList } from '@/api/index'

export default {
  data () {
    return {
      visible: false,
      dataForm: {},

      types: [],
      orgList: [],
      Orgids: [],
      orgTableData: []
    }
  },
  created () {},
  methods: {
    init (id) {
      if (id) {
        this.dataForm.ID = ''
        this.dataForm.Userid = id
        let params = {
          pageIndex: 1,
          pageSize: 9999,
          userId: id
        }
        getSysdataauthorizeList(params).then(({ data }) => {
          if (data) {
            this.orgTableData = data.pageList
            console.log(data)
            this.visible = true
            this.$nextTick(_ => {
              this.orgTableData.forEach(item => {
                if (item.Checked === 1) {
                  this.$refs.orgTable.toggleRowSelection(item, true)
                }
              })
            })
          }
        })
      }
    },
    handleOrgSelectChange (val) {
      let arr = []
      let obj = {}
      val.forEach(item => {
        arr.push({ Userid: this.dataForm.Userid, ID: '', Orgid: item.ID })
      })
      obj['viewModel'] = arr
      obj['userId'] = this.dataForm.Userid
      this.dataForm.Orgid = obj
    },
    close () {
      this.$emit('close')
    },
    // 表单提交
    dataFormSubmit () {
      saveSysdataauthorize(this.dataForm.Orgid).then(({ data }) => {
        if (data && data.status === 0) {
          this.$message.success('保存成功')
          this.visible = false
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
