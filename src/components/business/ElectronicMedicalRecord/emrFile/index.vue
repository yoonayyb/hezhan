<template>
  <div>
    <el-table :data="tableData.pageList" border style="width: 99%;margin-top:10px;minheight: 60vh;">
      <el-table-column align="left" label="报告名称" prop="pn_type"></el-table-column>
      <el-table-column align="left" label="报告标题" prop="progress_note_name"></el-table-column>
      <el-table-column align="left" label="报告日期">
        <template slot-scope="scope">
          <p>{{scope.row.r_time|formatTime}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="gotoDetail(scope.row)" size="small" type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage1"
      :page-size="20"
      layout="total, prev, pager, next"
      :total="tableData.totalCount"
    ></el-pagination>
    <el-dialog
      v-if="dialogVisible"
      :append-to-body="true"
      :title="RecordTitle"
      :visible.sync="dialogVisible"
      width="60%"
      center
    >
      <div style="text-align: center">
        <img :src="img_url" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getEmrFile, getEmrFileByApplyId } from '@/utils/api'
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
      applyID: ''
    }
  },
  props: ['p_sn', 'patient_Id'],
  mounted () {
    // console.log(this.p_sn)
    this.patientP_Sn = this.p_sn
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
      this.getFileListByapplyID()
    } else {
      this.getFileList()
    }
    // console.log(123)
  },
  methods: {
    getFileList () {
      getEmrFile({ patientID: this.patientID, visitSn: this.patientP_Sn }).then(
        res => {
          // console.log(res)
          this.tableData = res.data.pageList
          // Bus.$emit('getabdata', this.tableData)
        }
      )
    },
    gotoDetail (row) {
      console.log(row)
      // console.log(window.SITE_CONFIG['baseUrl'] + path)
      this.img_url = window.SITE_CONFIG['baseUrl'] + row.path
      this.RecordTitle = row.progress_note_name
      this.dialogVisible = true
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

