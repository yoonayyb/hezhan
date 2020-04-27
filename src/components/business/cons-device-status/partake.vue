<template>
  <div>
    <div v-if="$device === 'Keda'">
      <div v-if="scope.row.KedaStatus=='6'">已过期</div>
      <div v-else>
        <div v-if="scope.row.Status == '4'">
          <div v-if="scope.row.KedaStatus=='0'">未开始</div>
          <div v-else-if="scope.row.KedaStatus=='3'">未开始</div>
          <div v-else-if="scope.row.KedaStatus=='4'">
            <el-button @click="deviceEnterMeeting(scope.row.Id)" size="mini" type="primary">进入会议</el-button>
          </div>
          <div v-else-if="scope.row.KedaStatus=='5'">已结束</div>
          <div v-else-if="scope.row.KedaStatus=='6'">已过期</div>
          <span v-else>未开始</span>
        </div>
        <span v-else>未开始</span>
      </div>
    </div>

    <div v-if="$device === 'Fosiv'">
      <div v-if="scope.row.FosivStatus=='6'">已过期</div>
      <div v-else>
        <div v-if="scope.row.Status === '4'">
          <div v-if="/^(0|1|2|3){1}$/.test(scope.row.FosivStatus)">未开始</div>
          <div v-else-if="scope.row.FosivStatus=='4'">
            <el-button @click="deviceEnterMeeting(scope.row.Id)" size="mini" type="primary">进入会议</el-button>
          </div>
          <div v-else-if="scope.row.FosivStatus=='5'">已结束</div>
          <div v-else-if="scope.row.FosivStatus=='6'">已过期</div>
          <span v-else>未开始</span>
        </div>
        <span v-else>未开始</span>
      </div>
    </div>
    <el-dialog title="检测到系统没安装客户端请：" :visible.sync="modal1" width="30%">
      <a href="http://webfile.14.tx.demo.healthan.com.cn/fosiv806.exe">客户端下载</a>
    </el-dialog>
  </div>
</template>

<script>
import axiox from 'axios'

export default {
  props: {
    scope: Object
  },
  data () {
    return {
      modal1: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  created () {
    this.$device = localStorage.deviceStatus
    // console.log(this.$device)
  },
  methods: {
    // kedaStartMeeting (id) {
    //   this.$confirm('确认开始会诊？').then(_ => {
    //     if (this.$emit('getLoadStatus', 1)) {
    //       this.$emit('getLoadStatus', 1)
    //     }
    //     this.$http({
    //       url: '/api/GroupCons/KedaStartMeeting?applyId=' + id,
    //       method: 'post'
    //     }).then(res => {
    //       if (this.$emit('getLoadStatus', 3)) {
    //         this.$emit('getLoadStatus', 3)
    //       }
    //       if (res.data && res.data.status === 0) {
    //         this.$message({
    //           message: res.data.msg,
    //           type: 'success',
    //           duration: 1200,
    //           onClose: () => {
    //             // this.getDataList()
    //           }
    //         })
    //       } else {
    //         this.$message.error(res.data.msg)
    //       }
    //     })
    //   })
    // },
    // kedaInsertUser (id) {
    //   this.$confirm('确认进入会议？').then(_ => {
    //     if (this.$emit('getLoadStatus', 1)) {
    //       this.$emit('getLoadStatus', 1)
    //     }
    //     this.$http({
    //       url: '/api/GroupCons/KedaInsertUser?applyId=' + id,
    //       method: 'post'
    //     }).then(res => {
    //       if (this.$emit('getLoadStatus', 3)) {
    //         this.$emit('getLoadStatus', 3)
    //       }
    //       if (res.data && res.data.status === 0) {
    //         this.$message({
    //           message: res.data.msg,
    //           type: 'success',
    //           duration: 1200
    //         })
    //       } else {
    //         this.$message.error(res.data.msg)
    //       }
    //     })
    //   })
    // },
    // kedaEndMeeting (id) {
    //   this.$confirm('确认结束会议？').then(_ => {
    //     if (this.$emit('getLoadStatus', 2)) {
    //       this.$emit('getLoadStatus', 2)
    //     }
    //     this.$http({
    //       url: '/api/GroupCons/KedaEndMeeting?applyId=' + id,
    //       method: 'post'
    //     }).then(res => {
    //       if (this.$emit('getLoadStatus', 3)) {
    //         this.$emit('getLoadStatus', 3)
    //       }
    //       if (res.data.status !== 0) {
    //         this.$message.error(res.data.msg)
    //         return
    //       }
    //       location.reload()
    //     })
    //   })
    // },
    // fosivStartMeeting (id) {
    //   this.$confirm('确认开始会诊？').then(_ => {
    //     if (this.$emit('getLoadStatus', 1)) {
    //       this.$emit('getLoadStatus', 1)
    //     }
    //     this.$http({
    //       url: '/api/GroupCons/FosivStartMeeting?applyId=' + id,
    //       method: 'post'
    //     }).then(res => {
    //       if (this.$emit('getLoadStatus', 3)) {
    //         this.$emit('getLoadStatus', 3)
    //       }
    //       if (res.data && res.data.status === 0) {
    //         this.$message({
    //           message: res.data.msg,
    //           type: 'success',
    //           duration: 1200,
    //           onClose: () => {
    //             // this.getDataList()
    //           }
    //         })
    //       } else {
    //         this.$message.error(res.data.msg)
    //       }
    //     })
    //   })
    // },
    // fosivEnterMeeting (id) {
    //   this.$confirm('确认进入会议？').then(_ => {
    //     if (this.$emit('getLoadStatus', 1)) {
    //       this.$emit('getLoadStatus', 1)
    //     }
    //     this.$http({
    //       url: '/api/GroupCons/FosivEnterMeeting?applyId=' + id,
    //       method: 'post'
    //     }).then(res => {
    //       if (this.$emit('getLoadStatus', 3)) {
    //         this.$emit('getLoadStatus', 3)
    //       }
    //       if (res.data && res.data.status !== 0) {
    //         this.$message.error(res.data.msg)
    //       }
    //     })
    //   })
    // },
    // FosivEndMeeting (id) {
    //   this.$confirm('确认退出会议？').then(_ => {
    //     if (this.$emit('getLoadStatus', 2)) {
    //       this.$emit('getLoadStatus', 2)
    //     }
    //     this.$http({
    //       url: '/api/GroupCons/FosivEndMeeting?applyId=' + id,
    //       method: 'post'
    //     }).then(res => {
    //       if (this.$emit('getLoadStatus', 3)) {
    //         this.$emit('getLoadStatus', 3)
    //       }
    //       if (res.data && res.data.status === 0) {
    //         this.$message({
    //           message: res.data.msg,
    //           type: 'success',
    //           duration: 1200,
    //           onClose: () => {
    //             // this.getDataList()
    //           }
    //         })
    //       } else {
    //         this.$message.error(res.data.msg)
    //       }
    //     })
    //   })
    // },
    // 检测是否有软终端
    beforeEnterMeeting (res) {
      let that = this
      axiox
        .get(
          'http://127.0.0.1:6700/api/confterminalcheck?{"VerifyCode":"code_conf_6897125"}'
        )
        .then(function (data) {
          location.href = res.data.data
        })
        .catch(function (error) {
          that.modal1 = true
        })
    },
    deviceEnterMeeting (id) {
      this.$confirm('确认进入？').then(_ => {
        if (this.$emit('getLoadStatus', 1)) {
          this.$emit('getLoadStatus', 1)
        }
        this.$http({
          url: '/api/GroupCons/EnterMeeting?applyId=' + id,
          method: 'post'
        })
          .then(res => {
            if (this.$emit('getLoadStatus', 3)) {
              this.$emit('getLoadStatus', 3)
            }
            // if (res.data && res.data.status === 0) {
            //   this.$message({
            //     message: res.data.msg,
            //     type: 'success',
            //     duration: 1200,
            //     onClose: () => {
            //       location.reload()
            //       // this.getDataList()
            //     }
            //   })
            // } else {
            //   this.$message.error(res.data.msg)
            // }
            if (res.data.status === 0) {
              if (res.data.data && res.data.data.indexOf('ConfExplorer://') > -1) {
                this.beforeEnterMeeting(res)
                // location.href = res.data.data

                // this.getDataList()
              } else {
                // this.getDataList()
                this.$message.success(res.data.msg)
              }
            } else {
              this.$message.error(res.data.msg)
            }
            // if (res.data.status === 0 && res.data.data) {
            //   location.href = res.data.data
            //   this.getDataList()
            // } else {
            //   this.$message.error(res.data.msg)
            // }
          })
          .catch(err => {
            if (this.$emit('getLoadStatus', 3)) {
              this.$emit('getLoadStatus', 3)
            }
            this.$Message.error('网络不稳定，请稍后重试')
          })
      })
    }
  }
}
</script>

<style>
</style>
