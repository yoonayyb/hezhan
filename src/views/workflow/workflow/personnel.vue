<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="visible" @close="close" title="选择人员">
    <div class="clearfix">
      <el-tree
        :data="treeData"
        :default-checked-keys="defultCheckeds"
        :props="{label:'text'}"
        node-key="Id"
        show-checkbox
        ref="tree"
        style="width:50%;float:left;"
         @check-change="handleCheckChange">
      ></el-tree>

      <el-table
        :data="roleTableData"
        @selection-change="deptSelectionChange"
        border
        height="500"
        ref="roleTabelRef"
        style="width:50%;float:left"
      >
        <el-table-column label="角色" prop="NAME"></el-table-column>
        <el-table-column type="selection" width="45"></el-table-column>
      </el-table>
    </div>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="submit" type="primary">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  saveWorkflowLinkUser,
  workflowLinkGetUserTreeModel,
  workflowLinkGetRoleList
  } from '@/api/index.js'

export default {
  data () {
    return {
      visible: false,
      treeData: [],
      roleTableData: [],
      treeTableLoading: false,
      roles: [],
      info: {},
      defultCheckeds: []
    }
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
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    init (item) {
      if (item) {
        this.info = item
        this.visible = true
        workflowLinkGetUserTreeModel(item.linkId).then(res => {
          if (res.data) {
            const that = this
            this.treeData = res.data;
            (function userRecursion (list) {
              list.forEach(item => {
                if (item.Checked === 1) {
                  that.defultCheckeds.push(item.Id)
                }
                if (
                  item.children instanceof Array &&
                  item.children.length > 0
                ) {
                  userRecursion(item.children)
                }
              })
            })(this.treeData)
          }
        })

        workflowLinkGetRoleList(item.linkId).then(res => {
          if (res.data) {
            this.roleTableData = res.data
            this.roleTableData.forEach(item => {
              if (item.Checked === 1) {
                this.$nextTick(_ => {
                  this.$refs.roleTabelRef.toggleRowSelection(item)
                })
              }
            })
          }
        })
      }
    },
    deptSelectionChange (val) {
      this.roles = val
    },
    submit () {
      let arr = []
      const checksArr = this.$refs.tree.getCheckedKeys();
      (function userRecursion (list) {
        list.forEach(item => {
          if (item.ObjectType === 'user' && checksArr.includes(item.Id)) {
            arr.push({ Object_name: item.text, Object_id: item.Id })
          }
          if (item.children instanceof Array && item.children.length > 0) {
            userRecursion(item.children)
          }
        })
      })(this.treeData)

      let roleArr = []
      this.roles.forEach(item => {
        roleArr.push({ Object_name: item.NAME, Object_id: item.ID })
      })
      // OBJECT_TYPE=1是人员2是部门3是角色
      let mansParams = {
        Org_id: this.userInfo.OrgName,
        Work_flow_id: this.info.flowId,
        Workflow_link_id: this.info.linkId,
        Object_id: this.info.orgId,
        Object_name: '',
        Object_type: '1',
        O_Object: arr
      }
      let roleParams = {
        Org_id: this.info.orgId,
        Work_flow_id: this.info.flowId,
        Workflow_link_id: this.info.linkId,
        Object_id: '',
        Object_name: '',
        Object_type: '3',
        O_Object: roleArr
      }
      saveWorkflowLinkUser(mansParams)
        .then(({ data }) => {})
        .then(() => {
          saveWorkflowLinkUser(roleParams).then(({ data }) => {
            if (data.status === 0) {
              this.$message.success(data.msg)
              this.visible = false
            } else {
              this.$message.err(data.msg)
            }
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.saveBtn {
  margin: 10px 0 20px 0;
}
</style>
