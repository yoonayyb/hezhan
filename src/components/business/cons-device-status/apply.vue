<template>
  <div>
    <div v-if="$device === 'Keda'">
      <div v-if="scope.row.KedaStatus=='6'">已过期</div>
      <div v-else>
        <div v-if="scope.row.Status == '4'">
          <div v-if="scope.row.KedaStatus=='0'">未开始</div>
          <div v-else-if="scope.row.KedaStatus=='3'">
            <el-button @click="deviceStartMeeting(scope.row.Id)" size="mini" type="primary">开始会议</el-button>
          </div>
          <div v-else-if="scope.row.KedaStatus=='4'">
            <el-button @click="deviceEnterMeeting(scope.row.Id)" size="mini" type="primary">进入会诊</el-button>
            <el-button
              
              @click="deviceEndMeeting(scope.row.Id)"
              type="success"
              size="mini"
            >结束会诊</el-button>
          </div>
          <div v-else-if="scope.row.KedaStatus=='5'">已结束</div>
          <div v-else-if="scope.row.KedaStatus=='6'">已过期</div>
          <div v-else>未开始</div>
        </div>
        <div v-else>未开始</div>
      </div>
    </div>
    <div v-if="$device === 'Fosiv'">
      <div v-if="scope.row.FosivStatus=='6'">已过期</div>
      <div v-else>
        <div v-if="scope.row.Status == '4'">
          <div v-if="/^(0|1|2){1}$/.test(scope.row.FosivStatus)">未开始</div>
          <div v-else-if="scope.row.FosivStatus=='3'">
            <el-button @click="deviceStartMeeting(scope.row.Id,0)" size="mini" type="primary">开始会诊</el-button>
          </div>
          <div v-else-if="scope.row.FosivStatus=='4'">
            <el-button @click="deviceEnterMeeting(scope.row.Id,1)" size="mini" type="primary">进入会诊</el-button>
            <el-button
              
              @click="deviceEndMeeting(scope.row.Id)"
              type="success"
              size="mini"
            >结束会诊</el-button>
          </div>
          <div v-else-if="scope.row.FosivStatus=='5'">已结束</div>
          <div v-else-if="scope.row.FosivStatus=='6'">已过期</div>
        </div>
        <div v-else>未开始</div>
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
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  created () {
    this.$device = localStorage.deviceStatus
    // console.log(this.$device)
  },
  data () {
    return {
      res: {data: {data: ''}},
      modal1: false,
      // 是否开启结束会诊的标识
      endFlag: 0
    }
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
    //             location.reload()
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
    //           duration: 1200,
    //           onClose: () => {
    //             location.reload()
    //             // this.getDataList()
    //           }
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
    //             this.getDataList()
    //           }
    //         })
    //       } else {
    //         this.$message.error(res.data.msg)
    //       }
    //     })
    //   })
    // },
    // FosivEnterMeeting (id) {
    //   this.$confirm('确认进入会议？').then(_ => {
    //     if (this.$emit('getLoadStatus', 1)) {
    //       this.$emit('getLoadStatus', 1)
    //     }
    //     this.$http({
    //       url: '/api/GroupCons/FosivEnterMeeting?applyId=' + id,
    //       method: 'post'
    //     }).then(res => {
    //       if (this.$emit('getLoadStatus', 2)) {
    //         this.$emit('getLoadStatus', 2)
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
    //             this.getDataList()
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

    // 统一的设备接口
    deviceStartMeeting (id) {
      this.$confirm('确认开始？').then(_ => {
        if (this.$emit('getLoadStatus', 1)) {
          this.$emit('getLoadStatus', 1)
        }
        this.$http({
          url: '/api/GroupCons/StartMeeting?applyId=' + id,
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
              if (
                res.data.data &&
                res.data.data.indexOf('ConfExplorer://') > -1
              ) {
                let obj = JSON.stringify(res)
                this.res = JSON.parse(obj)
                this.endFlag = 1
                this.beforeEnterMeeting(res)
                // location.href = res.data.data
              } else {
                this.endFlag = 0
                this.$message.success(res.data.msg)
              }
              // this.getDataList()
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
            //     }
            //   })
            // } else {
            //   this.$message.error(res.data.msg)
            // }
            // if (res.data.status === 0 && res.data.data) {
            //   location.href = res.data.data
            // } else {
            //   this.$message.error(res.data.msg)
            // }
            if (res.data.status === 0) {
              if (
                res.data.data &&
                res.data.data.indexOf('ConfExplorer://') > -1
              ) {
                let obj = JSON.stringify(res)
                this.res = JSON.parse(obj)
                this.beforeEnterMeeting(res)
                this.endFlag = 1
                // location.href = res.data.data

                // this.getDataList()
              } else {
                this.endFlag = 0
                // this.getDataList()
                this.$message.success(res.data.msg)
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(err => {
            if (this.$emit('getLoadStatus', 3)) {
              this.$emit('getLoadStatus', 3)
            }
            this.$Message.error('网络不稳定，请稍后重试')
          })
      })
    },
    deviceEndMeeting (id) {
      this.$confirm('确认退出？').then(_ => {
        if (this.$emit('getLoadStatus', 2)) {
          this.$emit('getLoadStatus', 2)
        }
        this.$http({
          url: '/api/GroupCons/EndMeeting?applyId=' + id,
          method: 'post'
        })
          .then(res => {
            if (this.$emit('getLoadStatus', 3)) {
              this.$emit('getLoadStatus', 3)
            }
            if (res.data && res.data.status === 0) {
              this.$message({
                message: res.data.msg,
                type: 'success',
                duration: 1200,
                onClose: () => {
                  // this.getDataList()
                }
              })
            } else {
              this.$message.error(res.data.msg)
            }
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
