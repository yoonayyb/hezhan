<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="!dataForm.ID ? '新增' : '修改'"
    :visible.sync="visible"
    @close="close"
  >
    <el-form :model="dataForm" :rules="dataRule" label-width="160px" ref="dataForm">
      <el-form-item
        label="所属医院名称"
        prop="Org_name"
        :rules="[{ required: true, message: '请选择所属医院医院名称'}]"
      >
        <el-input
          :readonly="true"
          placeholder="请选择医院"
          style="width:60%;"
          v-model="dataForm.Org_name"
        >
          <el-button @click="orgDialogVisible = true" slot="append" type="text" style="width: 50px">选择</el-button>
        </el-input>
      </el-form-item>

      <el-form-item
        label="工作流程类型"
        prop="Flow_type"
        :rules="[{ required: true, message: '请选择工作流程类型'}]"
      >
        <el-select
          @change="typeChange"
          placeholder="请选择"
          style="width:60%;"
          v-model="dataForm.Flow_type_id"
        >
          <el-option :key="item.ID" :label="item.NAME" :value="item.ID" v-for="item in types"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="审批环节"  :rules="[{ required: true, message: '请选择审批环节'}]">
        <el-select
          multiple
          placeholder="请选择"
          style="width:60%;"
          v-model="linkList"
          @change="linksChange"
          value-key="t_id"
        >
          <el-option :key="item.ID" :label="item.LINK_NAME" :value="item.ID" v-for="item in links"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-steps align-center style="margin:40px 0 15px 0">
      <el-step :title="item" v-for="item in linksName" :key="item"></el-step>
    </el-steps>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary">确定</el-button>
    </span>
    <org-dialog
      :column="[{label:'医院名称',prop:'ORG_NAME'},{label:'医院类型',prop:'INSTITUTION_TYPE'},{label:'医院等级',prop:'ORG_TYPE'}]"
      @select="orgChoose"
      title="选择医院"
      v-model="orgDialogVisible"
    />
  </el-dialog>
</template>

<script>
import OrgDialog from '@/components/Dialogs/orgs'
import { getOrgList } from '@/utils/api.js'

import {
  saveWorkflow,
  saveWorkflowAddNew,
  getWorkflowViewModel,
  getWorkflowLinkList,
  getBaseDict,
  getWorkflowLinkDefineList
} from '@/api/index.js'

export default {
  data () {
    return {
      orgDialogVisible: false,
      visible: false,
      dataForm: {},
      dataRule: {
        /* roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ] */
      },
      types: [],
      linkList: [],
      links: [],
      linksName: []
    }
  },
  components: { OrgDialog },
  mounted () {
    this.getTypes()
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },

  methods: {
    close () {
      this.$emit('close')
    },
    init (id) {
      if (id) {
        getWorkflowViewModel(id)
          .then(({ data }) => {
            this.dataForm = data
            this.dataForm.Org_name = this.userInfo.OrgName
            this.dataForm.Org_id = this.userInfo.OrgID
            this.visible = true
          })
          .then(() => {
            getWorkflowLinkList(id).then(res => {
              // this.linkList = res.data.pageList
              // list.forEach(item => {
              //   this.linkList.push(item.ID)
              // })
              this.linkList = res.data.pageList
              console.log('审批流程', res)
            })
          })
      } else {
        getWorkflowViewModel(0).then(({ data }) => {
          this.dataForm = data
          this.dataForm.Org_name = this.userInfo.OrgName
          this.dataForm.Org_id = this.userInfo.OrgID
          this.visible = true
        })
      }
    },
    linksChange (val) {
      // 重选工作流程类型把流程类型重置
      // this.linkList=[]
      this.linksName = []
      val.forEach(element => {
        let label = this.links.find(item => {
          return item.ID === element
        })
        this.linksName.push(label.LINK_NAME)
      })
    },
    getTypes () {
      getBaseDict('7d6a9d05-0f14-40fb-b66c-74026fd72dd7').then(({ data }) => {
        this.types = data.pageList
      })
    },
    orgChoose (row) {
      // console.log(row)
      this.dataForm.Org_name = row.ORG_NAME
      this.dataForm.Org_id = row.ID
      // const column = [{ prop: 'ORG_NAME', label: '医院名字' }]
      // let params = {
      //   pageSize: 15,
      //   pageIndex: 1,
      //   keyword: ''
      // }
      // let listView = this.$selectModel({
      //   list: [],
      //   title: '选择医院  ',
      //   placeholder: '请输入搜索医院的名字',
      //   column: column,
      //   onSearch: async val => {
      //     listView.loading = true
      //     params.keyword = val
      //     let res = await getOrgList(params)
      //     listView.list = res.data.pageList
      //     listView.totalCount = res.data.totalCount
      //     listView.loading = false
      //   },
      //   onSelect: row => {
      //     this.dataForm.Org_name = row.ORG_NAME
      //     this.dataForm.Org_id = row.ID
      //   },
      //   onPageChange: async val => {
      //     params.pageIndex = val
      //     let res = await getOrgList(params)
      //     listView.list = res.data.pageList
      //     listView.totalCount = res.data.totalCount
      //   }
      // })
    },
    typeChange (val) {
      this.linkList = []
      this.linksName = []
      getWorkflowLinkDefineList({ Flow_type_id: val }).then(({ data }) => {
        this.links = data.pageList
      })
      let label = this.types.find(item => {
        return val === item.ID
      })
      this.dataForm.Flow_type = label.NAME
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (this.dataForm.ID) {
            saveWorkflow(this.linkList.join(','), this.dataForm).then(
              ({ data }) => {
                if (data && data.status === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              }
            )
          } else {
            saveWorkflowAddNew(this.linkList.join(','), this.dataForm).then(
              ({ data }) => {
                if (data && data.status === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500,
                    onClose: () => {
                      this.visible = false
                      this.$emit('refreshDataList')
                    }
                  })
                } else {
                  this.$message.error(data.msg)
                }
              }
            )
          }
        }
      })
    }
  }
}
</script>
