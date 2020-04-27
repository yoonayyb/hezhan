<template>
  <div style="padding-bottom: 80px">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限编辑</el-breadcrumb-item>
    </el-breadcrumb>

    <h4>角色：{{$route.query.roleName}}</h4>

    <tree-table :data="treeTableData" 
    :eval-args="args" 
    :eval-func="func" 
    @selectAll="handleSelectionChange" 
    @select="select"
    :expand-all="true" :v-loading="treeTableLoading">
      <el-table-column label="权限分配">
        <template slot-scope="scope">
          <el-checkbox
            :key="item.ID"
            :label="item.ID"
            v-for="item in scope.row.RoleAuthority"
            v-model="checkList[scope.row.Id]"
            :checked="item.STATUS==='1'?true:false"
          >{{item.TYPE_NAME}}</el-checkbox>
        </template>
      </el-table-column>
    </tree-table>

    <div class="operation">
      <el-button :loading="saveLoading" @click="submit" type="primary">提交保存</el-button>
      <el-button @click="$router.go(-1)">返回上一页</el-button>
    </div>
  </div>
</template>
<script>
import treeTable from './TreeTable'
import treeToArray from './TreeTable/customEval.js'
import { getMenuTreeByRole, sysRoleMenuSave } from '@//api/index'

export default {
  components: {
    treeTable
  },
  data () {
    return {
      treeTableData: [], // 树形数据
      treeTableLoading: false, // 树形loading
      checkList: {},

      args: [null, null, 'timeLine'],
      func: treeToArray,
      saveLoading: false
    }
  },
  methods: {
    submit (formName) {
      let params = {
        Ids: this.$route.query.id,
        ViewList: []
      }
      for (let key in this.checkList) {
        if (!this.checkList[key] || this.checkList[key].length !== 0) {
          let obj = {
            RoleID: this.$route.query.id,
            DeptID: null,
            MenuID: key,
            AuthorityID: [...this.checkList[key]].join(',')
          }
          params.ViewList.push(obj)
        }
      }
      this.saveLoading = true
      sysRoleMenuSave(params).then(({ data }) => {
        if (data && data.status === 0) {
          this.saveLoading = false
          this.$message({
            message: data.msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.$router.push({ name: 'sysRole' })
            }
          })
        } else {
          this.$message.error(data.msg)
          this.saveLoading = false
        }
      })
    },
    // 获取树形结构
    async getMenuTree () {
      let that = this
      this.treeTableLoading = true
      let menuTree = await getMenuTreeByRole({ roleID: this.$route.query.id })
      this.treeTableLoading = false
      this.treeTableData = menuTree.data

      if (menuTree.data) {
        (function getArray (data) {  // 递归遍历树形
          data.forEach(item => {
            that.$set(that.checkList, item.Id, [])
            if (item.children) {
              getArray(item.children)
            }
          })
        })(menuTree.data)
      }
    },
    handleSelectionChange (val) {
      let that = this
      let selectArray = val
      if (selectArray && selectArray.length > 0) {
        selectArray.forEach(item => {
          if (item.RoleAuthority && item.RoleAuthority.length > 0) {
            that.checkList[item.Id] = []

            item.RoleAuthority.forEach(i => {
              that.checkList[item.Id].push(i.ID)
            })
          }
        })
      } else {
        for (let key in this.checkList) {
          this.checkList[key] = []
        }
      }
    },
    select (rows, row) {
      let that = this
      if (rows && rows.length && rows.indexOf(row) !== -1) {
        rows.forEach(item => {
          if (item.RoleAuthority && item.RoleAuthority.length > 0) {
            that.checkList[item.Id] = []
            item.RoleAuthority.forEach(i => {
              that.checkList[item.Id].push(i.ID)
            })
          }
        })
      } else {
        that.checkList[row.Id] = []
      }
    }
  },
  mounted () {
    this.getMenuTree()
  }
}
</script>

<style scoped>
.operation{
  position: fixed;
  height: 70px;
  background-color: #fff;
  left: 230px;
  bottom:0;
  width: 100%;
  z-index: 100;
  padding-left: 15px;
  padding-top: 20px;

}

</style>


