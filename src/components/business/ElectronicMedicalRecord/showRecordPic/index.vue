<template>
  <el-dialog :title="reportData.report_title"
             :visible.sync="visible"
             width="70%"
             @close="closeDialog"
             :center="true"
             :append-to-body="true">
    <div class="dialog-body">
      <img :src="baseUrl + reportData.path"
           alt="报告.png">
    </div>
    <span slot="footer"
          class="dialog-footer"
          style="text-align: center;">
      <el-button type="primary"
                 v-if="reportType == 0 && isHasDicomImg"
                 @click="checkPacsImage">查看影像</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { getPacsReportItem } from '@/api/index'
const baseUrl = window.SITE_CONFIG['baseUrl']
export default {
  props: {
    reportData: Object,
    reportType: Number
  },
  data () {
    return {
      isLoading: false,
      visible: true,
      baseUrl: baseUrl,
      isHasDicomImg: false
    }
  },
  mounted () {
    if (this.reportType == 0) {
      this.getListItem()
    }
  },
  methods: {
    checkPacsImage () {
      // window.open(`${window.SITE_CONFIG['dicomUrl']}?patientid=${this.reportData.pid}&ReportID=${this.reportData.id}`)
      window.open(`${window.SITE_CONFIG['dicomUrl']}?patientid=${this.reportData.pid}&ReportID=${this.reportData.id}`)
      // window.open(`https://alliancedicompc.healthan.net?patientid=${this.reportData.pid}&ReportID=${this.reportData.id}`)
    },
    // 获取单条报告信息是否存在dicom文件
    getListItem () {
      let params = {
        ID: this.reportData.id
      }
      getPacsReportItem(params).then(({ data }) => {
        console.log(data)
        if (data.dicomTotalCount > 0) {
          this.isHasDicomImg = true
        } else {
          this.isHasDicomImg = false
        }
      })
    },
    closeDialog () {
      this.$emit('close', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-body {
  width: 100%;
  img {
    width: 100%;
    height: auto;
  }
}
</style>