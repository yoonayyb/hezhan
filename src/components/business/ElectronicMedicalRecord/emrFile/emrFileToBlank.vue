<template>
  <div>
    <el-table :data="showTableData" border style="width: 99%;margin-top:10px;min-height: 60vh;">
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
    <el-dialog
      :append-to-body="true"
      :title="RecordTitle"
      :visible.sync="dialogVisible"
      width="60%"
      center
    ><div style="text-align: center">
      <img :src="img_url">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Bus from './bus.js'
export default {
  data () {
    return {
      RecordTitle: '',
      img_url: '',
      patientP_Sn: '',
      dialogVisible: false,
      tableData: [],
      showTableData: [],
      patientID: ''
    }
  },
  components: {
  },
  props: ['datainfo'],
  mounted () {
    if (this.datainfo) {
      // console.log(this.datainfo)
      this.showTableData = this.datainfo
      // this.tableData = this.tableData.concat(this.datainfo)
      // Bus.$emit('getabdata', this.tableData)
    }
    Bus.$on('getTarget', target => {
      console.log(target)
      this.tableData.unshift(target)
      this.showTableData.unshift(target)
      Bus.$emit('getabdata', this.tableData)
    })
  },
  beforeDestroy () {
    Bus.$off('getTarget')
    // Bus.$off('getabdata')
  },
  methods: {
    // handleClose (done) {
    //   this.$confirm('确认关闭？')
    //       .then(_ => {
    //         done()
    //       })
    //       .catch(_ => {})
    // },
    gotoDetail (row) {
      console.log(row)
      // console.log(window.SITE_CONFIG['baseUrl'] + path)
      this.img_url = window.SITE_CONFIG['baseUrl'] + row.path
      this.RecordTitle = row.progress_note_name
      this.dialogVisible = true
    }
  }
}
</script>

