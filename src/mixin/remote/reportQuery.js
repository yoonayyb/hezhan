export default {

  data() {
    return {
      total: 0,
      dataParams: {
        // pageIndex: 1,
        // pageSize: 20,
        // patient_name: '',
        orgId: '',
        deptId: '',
        status: '',
        pageIndex: 1,
        pageSize: 20,
        startTime: '',
        endTime: '',
        keywords: ''
      },
      currentPage1: 1
    }
  },
  methods: {
    // orgChange (id) {
    //   // this.dataParams.pageIndex = 1
    //   this.dataParams.deptId = ''
    //   this.dataParams.apply_org_id = id
    //   this.getDataList()
    // },
    deptChange(id, type) {
      this.dataParams.pageIndex = 1
      this.currentPage1 = 1
      if (type) {
        this.dataParams.docId = ''
      }
      console.log(type)
      this.dataParams.deptId = id
      this.getDataList()
    },
    onSearch(val) {
      this.dataParams.keywords = val
      this.dataParams.pageIndex = 1
      this.currentPage1 = 1
      this.getDataList()
    },
    statusChange(status) {
      this.dataParams.status = status
      this.dataParams.pageIndex = 1
      this.currentPage1 = 1
      this.getDataList()
    },
    keywordsChange(val) {
      console.log(val)
      this.dataParams.docId = val
      this.dataParams.pageIndex = 1
      this.currentPage1 = 1
      this.getDataList()
    },
    clearDocId(val) {
      this.dataParams.docId = ''
      console.log(123456)
    },
    changeDate(val) {
      if (val) {
        // let obj = JSON.stringify(val)
        // let jval = JSON.parse(obj)
        // for (let i = 0; i < jval.length; i++) {
        //   var date = new Date(jval[i])
        //   jval[i] = date.getTime()
        // }
        this.dataParams.startTime = val[0]
        this.dataParams.endTime = val[1]
      } else {
        this.dataParams.startTime = ''
        this.dataParams.endTime = ''
      }
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.dataParams.pageIndex = val
      this.getDataList()
    },
    toDetail(row, flag, fromFlag, tag) {
      // fromFalg : 0 门诊 1 会诊 3 影像
      this.aa = 100
      if (row.doctorId) {
        this.dataParams.docId = row.doctorId
      }
      if (row.applyDeptId) {
        this.dataParams.deptId = row.applyDeptId
      }
      this.$router.push({
        name: 'reportDetail',
        query: {
          fromFlag: fromFlag,
          startTime: this.dataParams.startTime,
          endTime: this.dataParams.endTime,
          keywords: this.dataParams.keywords,
          deptId: this.dataParams.deptId,
          flag: flag,
          docId: this.dataParams.docId,
          status: this.dataParams.status,
          tag: tag
        }
      })
    }
  }
}
