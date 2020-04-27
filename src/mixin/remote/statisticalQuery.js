export default {
  data () {
    return {
      total: 0,
      dataParams: {
        // pageIndex: 1,
        // pageSize: 20,
        patient_name: '',
        apply_org_id: '',
        apply_dept_id: '',
        status: ''
      }
    }
  },
  methods: {
    orgChange (id) {
      // this.dataParams.pageIndex = 1
      this.dataParams.deptId = ''
      this.dataParams.apply_org_id = id
      this.getDataList()
    },
    deptChange (id) {
      // this.dataParams.pageIndex = 1
      this.dataParams.apply_dept_id = id
      this.getDataList()
    },
    onSearch (val) {
      this.dataParams.patient_name = val
      // this.dataParams.pageIndex = 1
      this.getDataList()
    },
    statusChange (status) {
      this.dataParams.status = status
      // this.dataParams.pageIndex = 1
      this.getDataList()
    },
    changeDate (val) {
      if (val) {
        let obj = JSON.stringify(val)
        let jval = JSON.parse(obj)
        for (let i = 0; i < jval.length; i++) {
          var date = new Date(jval[i])
          jval[i] = date.getTime()
        }
        this.dataParams.startCreateDate = jval[0]
        this.dataParams.endCreateDate = jval[1]
      } else {
        this.dataParams.startCreateDate = ''
        this.dataParams.endCreateDate = ''
      }
      this.getDataList()
    }
  }
}
