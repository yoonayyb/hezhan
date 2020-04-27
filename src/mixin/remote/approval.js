import { getDeptList, getOrgListBase } from '@/api/index'
// 会诊的公共类
import ApprovalStatus from '@/components/business/cons-approval-status'
import ApprovalPopover from '@/components/business/ApprovalPopover'
import SearchStatus from '@/components/business/SearchStatus'

export default {
  components: {
    ApprovalStatus,
    ApprovalPopover,
    SearchStatus
  },
  data () {
    return {
      dataList: [],
      loading: false,
      dataListSelections: [],
      approvalVisible: false,
      ReportVisible: false,

      orgList: [],
      deptList: [],
      totalPage: 0,
      // 搜索条件
      searchCriteria: {
        orgName: '',
        deptName: '',
        status: '',
        patientName: '',
        pageIndex: 1,
        pageSize: 20,
        doctorName: '',
        keyword: '',
        approvalStatus: ''
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  created () {
    this.getOrgSelectList()
    this.getDataList()
  },
  methods: {
    // 获取医院
    async getOrgSelectList () {
      const { data } = await getOrgListBase()
      if (data && data.status === 0) {
        this.orgList = data.pageList
      } else {
        this.orgList = []
      }
    },
    orgSelectChange (orgId) {
      // 选择机构清空科室
      // 选择机构清空科室
      this.deptList = []
      this.searchCriteria.pageIndex = 1
      this.searchCriteria.deptName = ''

      if (!orgId || orgId === '') {
        this.searchCriteria.orgName = ''
        this.getDataList()
        return
      }

      const orgItem = this.orgList.find(item => {
        return item.ID === orgId
      })
      this.searchCriteria.orgName = orgItem.ORG_NAME
      this.getDeptSelectList(orgId)
      this.getDataList()
    },
    deptSelectChange () {
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    // 获取科室
    async getDeptSelectList (orgId) {
      let params = {
        pageIndex: 1,
        pageSize: 999,
        keyword: '',
        orgid: orgId
      }
      const { data } = await getDeptList(params)
      if (data && data.status === 0) {
        this.deptList = data.pageList
      } else {
        this.deptList = []
      }
    },
    // 每页数
    sizeChangeHandle (val) {
      this.searchCriteria.pageSize = val
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.searchCriteria.pageIndex = val
      this.getDataList()
    },
    onSearch () {
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    approval (id) {
      this.approvalVisible = true
      this.$nextTick(() => {
        this.$refs.approval.init(id)
      })
    }
  }
}
