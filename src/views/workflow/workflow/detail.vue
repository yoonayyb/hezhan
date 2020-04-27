
<template>
  <div>
    <div style>
      <h4>[{{this.$route.query.orgName}}]-[{{this.$route.query.flowType}}]</h4>
    </div>
    <el-button @click="addNew" class="add" size="mini" type="primary">新增环节</el-button>

    <el-row style="display:flex">
      <el-col :key="item.ID" :span="Math.round(24/(stepList.length))" style="margin-bottom:30px" v-for="(item,index) in stepList">
        <div class="step-grid-content bg-purple">
          <icon-svg class="step-icon" name="man"></icon-svg>
          <div class="step-title">{{item.LINK_NAME}}</div>
          <div class="option">
            <el-button @click="openSetting(item.ID)" size="mini" type="text">设置</el-button>
            <el-button
              @click="addPersonnel({linkId:item.ID,flowId:item.WORK_FLOW_ID,orgId:item.ORG_ID})"
              size="mini"
              type="text"
            >人员</el-button>
            <el-button @click="deleteWorkflow(item.ID)" size="mini" type="text">删除</el-button>
            <el-button @click="flowMoveUpStep(item.ID)" size="mini" type="text">前移</el-button>
            <el-button @click="flowMoveDownStep(item.ID)" size="mini" type="text">后移</el-button>
          </div>
          <icon-svg class="arrow-icon" name="xiangrou" v-if="index!==(stepList.length-1)"></icon-svg>
        </div>
      </el-col>
    </el-row>

    <Setting ref="setting" v-if="settingVisible" @close="settingVisible=false"></Setting>
    <add-new @close="addNewClose" @refreshDataList="refresh" ref="addNew" v-if="addNewVisible"></add-new>
    <Personnel @close="personnelVisible=false" ref="personnel" v-if="personnelVisible"></Personnel>
  </div>
</template>

<script>
import {
  getWorkflowLinkList,
  workflowLinkFlowMoveUpStep,
  workflowLinkFlowMoveDownStep
} from '@/api/index.js'
import Setting from './component/setting.vue' // 设置
import AddNew from './component/addNewWorkflow.vue' // 增加新环节
import Personnel from './personnel.vue'
export default {
  data () {
    return {
      stepList: [],
      settingVisible: false,
      addNewVisible: false,
      personnelVisible: false
    }
  },
  components: { Setting, AddNew, Personnel },
  methods: {
    // 打开设置
    openSetting (id) {
      this.settingVisible = true
      this.$nextTick(() => {
        this.$refs.setting.init(id)
      })
    },
    // 打开新增环节
    addNew () {
      this.addNewVisible = true
      this.$nextTick(() => {
        this.$refs.addNew.init(this.$route.query.id)
      })
    },
    addNewClose () {
      this.addNewVisible = false
    },
    addPersonnel (item) {
      this.personnelVisible = true
      this.$nextTick(() => {
        this.$refs.personnel.init(item)
      })
    },
    deleteWorkflow (id) {
      this.$confirm(`确定删除此环节吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: '/api/Workflow_Link/Delete?ids=' + id,
          method: 'post'
        }).then(({ data }) => {
          if (data && data.status === 0) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.refresh()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 刷新页面
    refresh () {
      getWorkflowLinkList(this.$route.query.id).then(({ data }) => {
        this.stepList = data.pageList
      })
    },
    // 前移
    flowMoveUpStep (id) {
      let params = {
        work_flow_id: this.$route.query.id,
        ids: id
      }
      workflowLinkFlowMoveUpStep(params).then(res => {
        if (res.data.status === 0) {
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refresh()
            }
          })
        } else {
          this.message.error(res.data.msg)
        }
      })
    },
    // 后移
    flowMoveDownStep (id) {
      let params = {
        work_flow_id: this.$route.query.id,
        ids: id
      }
      workflowLinkFlowMoveDownStep(params).then(res => {
        if (res.data.status === 0) {
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.refresh()
            }
          })
        } else {
          this.message.error(res.data.msg)
        }
      })
    }
  },
  mounted () {
    getWorkflowLinkList(this.$route.query.id).then(({ data }) => {
      this.stepList = data.pageList
    })
  }
}
</script>

<style lang="scss" scope>
.step-grid-content {
  position: relative;
  padding: 0 10px;
  .step-icon {
    display: block;
    font-size: 30px;
    width: 50px;
    height: 50px;
    margin-left: 5px;
    margin-bottom: 5px;
  }
  .step-title {
    font-weight: 500;
    font-size: 15px;
    padding: 0 5px;
  }
  .arrow-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 50px;
  }
}

.option {
  width: 50%;
  margin-top: 5px;
  .el-button--mini {
    padding: 0;
    padding-right: 2px;
    margin-top: 2px;
  }
  .el-button + .el-button {
    margin-left: 0px;
  }
}
.add {
  margin-bottom: 30px;
}
</style>
