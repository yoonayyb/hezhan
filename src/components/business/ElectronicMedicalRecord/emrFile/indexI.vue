<template>
  <div>
    <el-table :data="tableData"
              border
              v-loading="loading"
              style="width: 99%;margin-top:10px;minheight: 60vh;">
      <el-table-column align="left"
                       label="标题"
                       prop="mrName"></el-table-column>
      <el-table-column align="left"
                       label="医生姓名"
                       prop="creatorName"></el-table-column>
      <el-table-column align="left"
                       label="日期">
        <template slot-scope="scope">
          <p>{{scope.row.createDateTime | formatTimeII}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       header-align="center"
                       label="操作"
                       width="120">
        <template slot-scope="scope">
          <el-button @click="dontgotoDetail(scope.row)"
                     v-if="scope.row.isPath=='0'"
                     size="small"
                     type="text">查看</el-button>
          <el-button v-else
                     @click="gotoDetail(scope.row)"
                     size="small"
                     type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page.sync="currentPage1"
                   :page-size="20"
                   v-if="tableData!=[]"
                   layout="total, prev, pager, next"
                   :total="tableData.totalCount"></el-pagination> -->
    <el-dialog :append-to-body="true"
               :title="RecordTitle"
               top="5vh"
               :visible.sync="dialogVisible"
               width="60%"
               center>
      <div style="text-align: center;height:600px">
        <embed width="100%"
               height="100%"
               :src="pdf" />
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getEmrFile, getEmrFileByApplyId, getEmrFileDeteil } from '@/utils/api'
export default {
  data () {
    return {
      currentPage1: 1,
      RecordTitle: '',
      img_url: '',
      patientP_Sn: '',
      dialogVisible: false,
      tableData: [],
      patientID: '',
      applyID: '',
      pdf: '',
      loading: true
    }
  },
  props: ['p_sn', 'patient_Id'],
  mounted () {
    console.log(this.$route.params.P_sn)// 次数
    if (!this.$route.params.P_sn) {
      this.patientP_Sn = ''
    } else {
      this.patientP_Sn = this.$route.params.P_sn
    }

    if (typeof this.$route.params.PatiendId === 'undefined') {
      this.patientID = this.patient_Id
    } else {
      this.patientID = this.$route.params.PatiendId
    }
    if (
      this.$route.params.ID !== '0' &&
      typeof this.$route.params.ID !== 'undefined'
    ) {
      this.applyID = this.$route.params.ID
      this.getEmrFileDeteil()
    } else {
      this.getEmrFileDeteil()
    }
    // console.log(123)
  },
  methods: {
    getEmrFileDeteil () {
      getEmrFileDeteil({ pid: this.patientID, visitsn: this.patientP_Sn }).then(

        res => {
          this.loading = false
          console.log(res)
          this.tableData = res.data.pageList
          // Bus.$emit('getabdata', this.tableData)
        }
      ).catch(res => {
        this.loading = false
      })
    },
    gotoDetail (row) {
      console.log(row)
      // console.log(window.SITE_CONFIG['baseUrl'] + path)
      this.pdf = window.SITE_CONFIG['baseUrl'] + row.pdfPath
      this.RecordTitle = '详情'
      console.log(this.pdf)
      this.$nextTick(res => {
        this.dialogVisible = true
      })
    },
    dontgotoDetail (row) {
      this.$message({
        message: '暂时没有查看内容',
        type: 'warning'
      })
    },
    getFileListByapplyID () {
      getEmrFileByApplyId({
        patientID: this.patientID,
        applyID: this.applyID
      }).then(res => {
        // console.log(res)
        this.tableData = res.data
        // Bus.$emit('getabdata', this.tableData)
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      getEmrFileByApplyId({
        patientID: this.patientID,
        applyID: this.applyID,
        pageIndex: val
      }).then(res => {
        // console.log(res)
        this.tableData = res.data
        // Bus.$emit('getabdata', this.tableData)
      })
    }
  }
}
</script>

