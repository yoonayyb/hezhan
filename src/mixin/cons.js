// 会诊的公共类
import ApprovalStatus from '@/components/business/cons-approval-status'
import ApprovalPopover from '@/components/business/ApprovalPopover'
import SearchStatus from '@/components/business/SearchStatus'
import { getDeptList, getOrgListBase } from '@/api/index'

export default {
  components: {
    ApprovalStatus,
    ApprovalPopover,
    SearchStatus
  },
  data () {
    return {
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
    }
  }
}
