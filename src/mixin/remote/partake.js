import {
  getDeptList,
  getOrgListBase
} from '@/api/index'
// 会诊的公共类
import ApprovalStatus from '@/components/business/cons-approval-status'
import ApprovalPopover from '@/components/business/ApprovalPopover'
import SearchStatus from '@/components/business/SearchStatus'
import ConsDevicePartakeStatus from '@/components/business/cons-device-status/partake.vue'
import Approval from '@/views/remote-consultation/baseRemote/approval.vue'

export default {
  created() {
    this.$device = localStorage.deviceStatus
    this.getOrgSelectList()
  },
  data() {
    return {
      loadingStatus: false,
      meettingStatus: '',
      dataList: [],
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      approvalVisble: false,
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
      },
      // 选择下拉
      orgList: [],
      deptList: []
    }
  },
  components: {
    Approval,
    ConsDevicePartakeStatus,
    ApprovalStatus,
    ApprovalPopover,
    SearchStatus
  },
  activated() {
    this.getDataList()
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: '/api/ConsApply/getMyAttendConsPacs',
        method: 'GET',
        params: this.searchCriteria
      }).then(({
        data
      }) => {
        if (data) {
          this.dataList = data.pageList
          this.totalPage = data.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
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
    orgSelectChange(orgId) {
      // 选择机构清空科室
      // 选择机构清空科室
      this.deptList = []
      this.searchCriteria.deptName = ''
      this.searchCriteria.pageIndex = 1

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
    deptSelectChange() {
      this.searchCriteria.pageIndex = 1
      this.getDataList()
    },
    statusSelectChange() {
      this.searchCriteria.pageIndex = 1
      this.getDataList()
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
    changeLoadStatus(data) {
      if (data == 1) {
        // console.log(data)
        this.loadingStatus = true
        this.meettingStatus = '操作中。。。。'
      } else if (data == 2) {
        this.loadingStatus = true
        this.meettingStatus = '操作中。。。。'
      } else {
        this.loadingStatus = false
      }
    }
  }
}
