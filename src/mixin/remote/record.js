// 会诊的公共类
import ApprovalStatus from '@/components/business/cons-approval-status'
import ApprovalPopover from '@/components/business/ApprovalPopover'
import Approval from '@/views/remote-consultation/baseRemote/approval.vue'
import consultationReport from '@/views/remote-consultation/baseRemote/consultationReport.vue'
import SearchStatus from '@/components/business/SearchStatus'
import {
  getDeptList,
  getOrgListBase
} from '@/api/index'
import Summarys from '@/views/remote-consultation/remoteApply/summary'
import SummaryAll from '@/views/remote-consultation/remoteApply/summaryAll'
export default {
  components: {
    ApprovalStatus,
    ApprovalPopover,
    SearchStatus,
    Approval,
    consultationReport,
    Summarys,
    SummaryAll
  },
  data() {
    return {
      summaryVisible: false,
      summaryAllVisible: false,
      approvalVisble: false,
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
  created() {
    this.$device = localStorage.deviceStatus
    this.getOrgSelectList()
    this.getDataList()
  },
  methods: {
    // 获取医院
    async getOrgSelectList() {
      const {
        data
      } = await getOrgListBase()
      if (data && data.status === 0) {
        this.orgList = data.pageList
      } else {
        this.orgList = []
      }
    },
    // 获取科室
    async getDeptSelectList(orgId) {
      let params = {
        pageIndex: 1,
        pageSize: 999,
        keyword: '',
        orgid: orgId
      }
      const {
        data
      } = await getDeptList(params)
      if (data && data.status === 0) {
        this.deptList = data.pageList
      } else {
        this.deptList = []
      }
    },
    orgSelectChange(orgId) {
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
    deptChange(deptName) {
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    statusSelectChange() {
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle(val) {
      this.searchCriteria.pageSize = val
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.searchCriteria.pageIndex = val
      this.getDataList()
    },
    goApproval(row) {
      this.approvalVisible = true
      this.$nextTick(() => {
        this.$refs.approval.init(row)
      })
    },
    // 会诊报告
    consultationReport(consultationid) {
      this.ReportVisible = true
      this.$nextTick(() => {
        this.$refs.report.init(consultationid)
      })
    },
    onSearch() {
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    toApproval(row) {
      this.approvalVisble = true
      this.$nextTick(() => {
        this.$refs.approvalRef.init(row)
      })
    },
    toSummary(row) {
      this.summaryVisible = true
      this.$nextTick(() => {
        this.$refs.summaryRef.init(row)
      })
    },
    toSummaryAll(row) {
      this.summaryAllVisible = true
      this.$nextTick(() => {
        this.$refs.summaryAllRef.init(row)
      })
    }
  }
}
