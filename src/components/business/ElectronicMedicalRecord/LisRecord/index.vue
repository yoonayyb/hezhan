<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文字报告"
                   name="textReport">
        <el-table :data="lisList"
                  border
                  style="width: 100%">
          <el-table-column align="left"
                           label="项目"
                           prop="LAB_ITEM_NAME"></el-table-column>
          <el-table-column align="left"
                           label="检查部位名称"
                           prop="SAMPLE_TYPE_NAME"></el-table-column>
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
              <el-button @click="gotoDetail(scope.row.REPORT_ID,scope.row)"
                         size="small"
                         type="text">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="图片报告"
                   name="picReport">
        <el-table :data="showListPicList"
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
      lisList: [],
      listPicList: [],
      showListPicList: [],
      addOrUpdateVisible: false,
      PatiendId: '',
      activeName: 'picReport',
      isShowReportDialog: false,
      reportData: {},
      reportType: 1,
      p_sn: ''
    }
  },
  components: {
    showReportPic
  },
  watch: {
    datainfo (val) {
      // console.log(this.datainfo)
      this.showListPicList = val
      // this.listPicList = this.listPicList.concat(this.datainfo)
      // Bus.$emit('getLisList', this.listPicList)
    }
  },
  created () {
    if (this.datainfo) {
      console.log(this.datainfo)
      this.showListPicList = this.datainfo
      // this.showListPicList = this.listPicList.concat(this.datainfo)
      // Bus.$emit('getLisList', this.listPicList)
    }
    Bus.$on('addLisReport', val => {
      this.listPicList.unshift(val)
      this.showListPicList.unshift(val)
      Bus.$emit('getLisList', this.listPicList)
      // console.log(this.listPicList)
    })
  },
  beforeDestroy () {
    Bus.$off('addLisReport')
  },
  methods: {
    // 获取检验图片报告
    goPicReportDetail (row) {
      this.reportData = row
      this.isShowReportDialog = true
      console.log(row)
    }
  }
}
</script>