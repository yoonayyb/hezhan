export default {
  data () {
    return {
      dataForm: {},
      tableList: [],
      dataListSelections: [],
      isLoading: false,
      roleName: '',
      deptName: '',
      //  分页
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      keyword: '',
      orgid: '',
      orgs: [],
      businessList: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  created () {
    this.getOrgList()
    this.getBusinessList()
    this.getDataList()
  },
  activated () {
    this.getOrgList()
  },
  methods: {
    toEdit (_Id) {
      if (_Id) {
        this.$refs.edit.init(_Id)
      } else {
        this.$refs.edit.init()
      }
    },
        // 批量删除
    handleSelectionChange (val) {
      this.dataListSelections = val
    },
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
            // 搜索
    onSearch () {
      const par = {
        pageIndex: '1',
        pageSize: this.pageSize
      }
      const params = Object.assign(par, this.dataForm)
      console.log(params)
      this.getDataList(params)
    },
        // 获取业务列表
    getBusinessList () {
      this.$http({
        url: `/api/BaseDict/GetBusinesslistByType`,
        methods: 'GET'
      }).then(({ data }) => {
            // console.log(data)
        if (data) {
          let i = JSON.stringify(data)
          this.businessList = JSON.parse(i)
        }
      })
    }
  }
  // mounted () {
  //   this.getDataList()
  // }
}
