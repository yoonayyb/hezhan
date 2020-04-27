
<style lang="scss" scoped>
.home-card {
  border: 1px solid #ebeef5;
  margin-bottom: 20px;
  background-color: #fff;

  .home-card-head {
    font-size: 18px;
    font-weight: 600;
    // border-bottom: 1px solid #ebeef5;
    // padding: 18px 20px;
    padding-left: 20px;
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 4px;
      height: 18px;
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translateY(-50%);
      background-color: #1196db;
    }
  }

  .home-card-item {
    padding: 20px;
    float: left;
    width: 16.6667%;
    border-right: 1px solid #ebeef5;
    cursor: pointer;
    &:last-child {
      border-right: none;
    }
    &:hover {
      .context {
        color: #1196db;
      }
    }
  }
}
.card-header {
  font-size: 18px;
  font-weight: 600;
  padding-left: 20px;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 4px;
    height: 18px;
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
    background-color: #1196db;
  }
}
</style>

<template>
  <div style="width:100%;height:800px;background:white;">
    <div style="margin:50px auto;width:100px" >暂无数据</div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { ChartPie, ChartBar } from '@/components/base/charts'
import Example from './example.vue'

export default {
  components: {
    ChartPie,
    ChartBar,
    Example
  },
  created () {
    if (window.SITE_CONFIG['orgflag']) {
      this.flag = window.SITE_CONFIG['orgflag']
    }
    // this.getData()
    // this.getRmind()
  },
  data () {
    return {
      msgAccount: '',
      flag: '',
      dataRecord: {},
      activeName: 'first',
      inforCardData: [
        {
          title: '新增用户',
          icon: 'md-person-add',
          count: 803,
          color: '#2d8cf0'
        },
        { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
        {
          title: '新增问答',
          icon: 'md-help-circle',
          count: 142,
          color: '#ff9900'
        },
        { title: '分享统计', icon: 'md-share', count: 657, color: '#ed3f14' }
      ],
      pieData: [
        { value: 335, name: '产科门诊' },
        { value: 310, name: '优生遗传门诊' },
        { value: 234, name: '内科' },
        { value: 135, name: '儿童保健科' },
        { value: 1548, name: '新生儿科' }
      ],
      barData: {
        // Mon: 13253,
        // Tue: 34235,
        // Wed: 26321,
        // Thu: 12340,
        // Fri: 24643,
        // Sat: 1322,
        // Sun: 1324
      },
      barDataI: {},
      barDataII: {},
      barDataIII: {},
      dataTable: [
        {
          rage: '产科门诊',
          money: '10'
        },
        {
          rage: '优生遗传门诊',
          money: '20'
        },
        {
          rage: '内科',
          money: '12'
        },
        {
          rage: '产一科',
          money: '23'
        },
        {
          rage: '产二科',
          money: '8'
        },
        {
          rage: '妇一科',
          money: '8'
        },
        {
          rage: '儿童保健科',
          money: '89'
        },
        {
          rage: '新生儿科',
          money: '20'
        }
      ],
      TeferralByMetotalCount: 0,
      ConsultationlByMetotalCount: 0,
      TeferralApprovalCount: 0,
      ConsultationlApprovaltotalCount: 0
    }
  },
  methods: {
    // 获取消息列表
    getRmind () {
      this.$http({
        method: 'get',
        url: '/api/Remind/GetRemind',
        params: { isRead: 0 }
      }).then(({ data }) => {
        this.msgAccount = data.totalCount
        if (data.totalCount !== 0) {
          this.open2()
        }
      })
    },
    open2 () {
      this.$notify({
        title: '提示',
        message: `您有[ ${this.msgAccount} ]条未处理的消息,请点击右上角消息进行处理`,
        duration: 10000,
        offset: 40,
        type: 'warning'
      })
    },
    userInfo () {
      return this.$store.state.user.userInfo
    },
    // 获取数据
    getData () {
      this.$http({
        url: this.$http.adornUrl('/api/Home/HomePageStatistics'),
        method: 'GET'
      }).then(({ data }) => {
        if (data) {
          this.dataRecord = data.data
          this.TeferralApprovalCount = data.data.TeferralApprovalCount
          this.ConsultationlApprovaltotalCount =
            data.data.ConsultationlApprovaltotalCount
          this.ConsultationlByMetotalCount =
            data.data.ConsultationlByMetotalCount
          this.TeferralByMetotalCount = data.data.TeferralByMetotalCount

          this.getConsStatisticsData()
          this.getTransferStatisticsData()
          this.getRemoteBModeStatisticsData()
          this.getRemotePacsStatisticsData()
        }
      })
    },
    // 获取首页卡片下会诊图表数据
    getConsStatisticsData () {
      // console.log(this.userInfo())
      this.$http({
        url: this.$http.adornUrl('/api/Home/GetConsStatisticsData'),
        method: 'GET',
        params: { orgId: this.userInfo().OrgID, categoryID: 'AC01' }
      }).then(({ data }) => {
        if (data) {
          // console.log(data)
          this.barData = data.data
          // console.log(typeof this.barData)
        }
      })
    },
    // 获取首页卡片下转诊图表数据
    getTransferStatisticsData () {
      // console.log(this.userInfo())
      this.$http({
        url: this.$http.adornUrl('/api/Home/GetTransferStatisticsData'),
        method: 'GET',
        params: { orgId: this.userInfo().OrgID }
      }).then(({ data }) => {
        if (data) {
          // console.log(data)
          this.barDataI = data.data
          console.log(this.barDataI)
        }
      })
    },
    // 获取首页卡片下远程B超图表数据
    getRemoteBModeStatisticsData () {
      // console.log(this.userInfo())
      this.$http({
        url: this.$http.adornUrl('/api/Home/GetConsStatisticsData'),
        method: 'GET',
        params: {
          orgId: this.userInfo().OrgID,
          categoryID: '3b9cf808-6698-457b-8b14-fa8b9f9fe1a3'
        }
      }).then(({ data }) => {
        if (data) {
          // console.log(data)
          this.barDataII = data.data
          // console.log(typeof this.barData)
        }
      })
    },
    // 获取首页卡片下远程影像图表数据
    getRemotePacsStatisticsData () {
      // console.log(this.userInfo())
      this.$http({
        url: this.$http.adornUrl('/api/Home/GetConsStatisticsData'),
        method: 'GET',
        params: {
          orgId: this.userInfo().OrgID,
          categoryID: '895b929a-eedc-4769-ad13-bd37b5b954c6'
        }
      }).then(({ data }) => {
        if (data) {
          // console.log(data)
          this.barDataIII = data.data
          // console.log(typeof this.barData)
        }
      })
    },
    gotoApprovalForTeferral () {
      this.$router.push({
        name: 'myTransferApproval'
      })
    },

    gotoConsultationWaitApproval () {
      this.$router.push({
        name: 'myRemotApproval'
      })
    },
    gotoTeferralByMe () {
      this.$router.push({
        name: 'myTransferApply'
      })
    },
    gotoGroupConsultationlByMe () {
      this.$router.push({
        name: 'myRemoteApply'
      })
    },
    gotoGroupConsultationlByPartake () {
      this.$router.push({
        name: 'myRomotePartake'
      })
    },
    gotoremotePacsApply () {
      this.$router.push({
        name: 'remotePacsApplyNew'
      })
    },
    gotoremotPacsApproval () {
      this.$router.push({
        name: 'remotPacsApproval'
      })
    },
    gotoremotePacsPartake () {
      this.$router.push({
        name: 'remotePacsWaitPathology'
      })
    },
    gotoremoteBmodeApply () {
      this.$router.push({
        name: 'remoteBmodeApply'
      })
    },
    gotoremoteBmodeApproval () {
      this.$router.push({
        name: 'remoteBmodeApproval'
      })
    },
    gotoremoteBmodePartake () {
      this.$router.push({
        name: 'remoteBmodePartake'
      })
    },
    // 画图
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let chartSale = echarts.init(document.getElementById('chartSale'))
      // 绘制图表
      chartSale.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '1%',
          right: '5%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '病人数量',
            type: 'bar',
            barWidth: '30%',
            data: [10, 5, 20, 3, 3, 3, 2, 7, 9, 2, 10, 15]
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
.mod-home {
  line-height: 1.5;
  h4 {
    margin: 0;
    padding: 0;
  }
  .box-card {
    min-height: 300px;
  }
}
.title {
  font-size: 14px;
  font-weight: 400;
}
.context {
  font-size: 30px !important;
  font-weight: 500;
  padding-top: 10px;
}
.card {
  color: #333;
  height: 120px;
}

.card2 {
  // background-color: #fa8c16 !important;
  height: 120px;
  cursor: pointer;
}
.card3 {
  // background-color: #eb2f96 !important;
  height: 120px;
  cursor: pointer;
}
.card4 {
  // background-color: #1890ff !important;
  height: 120px;
  cursor: pointer;
}
.margin-btm-20 {
  margin-bottom: 20px;
}
</style>
