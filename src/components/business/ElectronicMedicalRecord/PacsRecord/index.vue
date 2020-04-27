<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文字报告"
                   name="textReport">
        <el-table :data="pacsList"
                  border
                  style="width: 100%">
          <el-table-column align="left"
                           label="检查项目名称"
                           prop="EXAM_ITEM_NAME"></el-table-column>
          <el-table-column align="left"
                           label="检查部位名称"
                           prop="EXAM_PART_NAME"></el-table-column>
          <el-table-column align="left"
                           label="申请科室"
                           prop="APPLY_DEPT"></el-table-column>
          <el-table-column align="left"
                           label="申请医生"
                           prop="APPLY_DOC_ID"></el-table-column>
          <el-table-column align="left"
                           label="申请时间"
                           prop="APPLY_DATE">
            <template slot-scope="scope">
              <span>{{scope.row.APPLY_DATE|formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center"
                           header-align="center"
                           label="操作"
                           width="120">
            <template slot-scope="scope">
              <el-button @click="goPacsDetail(scope.row.REPORT_ID,scope.row)"
                         size="small"
                         type="text">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="图像报告"
                   name="picReport">
        <el-table :data="showPacsPicReportList"
                  border
                  style="width: 100%">
          <el-table-column align="left"
                           label="报告名称"
                           prop="report_title"></el-table-column>
          <el-table-column align="left"
                           label="报告日期"
                           >
                           <template slot-scope="scope">
                             <p>{{scope.row.r_time|formatTime}}</p>
                           </template></el-table-column>
          <el-table-column align="center"
                           header-align="center"
                           label="操作"
                           width="120">
            <template slot-scope="scope">
              <el-button @click="goPicReportDetail(scope.row)"
                         size="small"
                         type="text">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <showReportPic v-if="isShowReportDialog"
                   :reportData="reportData"
                   :reportType="reportType"
                   @close="isShowReportDialog = false"></showReportPic>
  </div>
</template>
<script>
import Bus from '@/components/business/ElectronicMedicalRecord/emrFile/bus.js'
import showReportPic from '@/components/business/ElectronicMedicalRecord/showRecordPic/index.vue'
export default {
  props: ['datainfo'],
  data () {
    return {
      pacsList: [],
      pacsPicReportList: [], // pacs图像报告
      showPacsPicReportList: [],
      reportData: {},
      pacsDetailVisble: false,
      activeName: 'picReport',
      isShowReportDialog: false,
      reportType: 0
    }
  },
  components: {
    showReportPic
  },
  watch: {
    datainfo (val) {
      this.showPacsPicReportList = val
      // this.pacsPicReportList = this.pacsPicReportList.concat(this.datainfo)
      // Bus.$emit('getPacsList', this.pacsPicReportList)
    }
  },
  created () {
    if (this.datainfo) {
      this.showPacsPicReportList = this.datainfo
      // this.pacsPicReportList = this.pacsPicReportList.concat(this.datainfo)
      // Bus.$emit('getPacsList', this.pacsPicReportList)
    }
    Bus.$on('addPacsReport', val => {
      this.pacsPicReportList.unshift(val)
      this.showPacsPicReportList.unshift(val)
      Bus.$emit('getPacsList', this.pacsPicReportList)
      console.log(this.pacsPicReportList)
    })
  },
  beforeDestroy () {
    Bus.$off('addPacsReport')
  },
  methods: {
    // 获取检查图片报告
    goPicReportDetail (row) {
      this.reportData = row
      this.isShowReportDialog = true
      console.log(row)
    }
  }
}
</script>