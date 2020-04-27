import { getPatientProgress, getPatientProgressFromBus, getPatientProgressFromDetail } from '@/api/modules/medicalRecord.js'
import Bus from './emrFile/bus.js'
export default {
  props: ['items', 'applyID'],
  watch: {
    items () {
      if (this.$route.params.ID !== '0' &&
    typeof this.$route.params.ID !== 'undefined') {
        this.getDataListFromDetail()
      } else {
        if (this.applyID) {
          this.getDataListFromBuss()
        } else {
          this.getDataList()
        }
      }
    }
  },
  created () {
    this.loadStatus = true
    if (this.$route.params.ID !== '0' &&
    typeof this.$route.params.ID !== 'undefined') {
      this.getDataListFromDetail()
    } else {
      if (this.applyID) {
        this.getDataListFromBuss()
      } else {
        this.getDataList()
      }
    }
    // console.log(this.applyID)
  },
  methods: {
    handleClick (tab) {
      // console.log(tab)
    },
    handleCheckedCitiesChange (item) {
      // console.log(this.checkList)
      this.RecordDict[item.pn_type_id] = this.checkList
      // console.log(this.RecordDict)
      Bus.$emit('getHandleReocrdList', this.RecordDict)
    },
    async getDataList () {
      const params = {
        PatientID: this.items.pid,
        visitsn: this.items.p_sn,
        typeID: this.items.pn_type_id
      }
      this.loadStatus = true
      const { data } = await getPatientProgress(params)
      if (data) {
        for (var i in data.pageList) {
          data.pageList[i].isRelation = ''
        }
        this.$nextTick(function () {
          this.list = data.pageList
          this.showStatus = true
          this.loadStatus = false
        })
      } else {
        this.loadStatus = false
      }
    },
    async getDataListFromBuss () {
      this.showStatus = false
      const params = {
        PatientID: this.items.pid,
        visitsn: this.items.p_sn,
        typeID: this.items.pn_type_id,
        applyID: this.applyID
      }
      this.loadStatus = true
      const { data } = await getPatientProgressFromBus(params)
      if (data) {
        this.list = data.pageList
        this.showStatus = true
        this.loadStatus = false
        // console.log(this.list)
      } else {
        this.loadStatus = false
      }
    },
    async getDataListFromDetail () {
      this.showStatus = false
      const params = {
        PatientID: this.items.pid,
        typeID: this.items.pn_type_id,
        applyID: this.applyID
      }
      this.loadStatus = true
      const { data } = await getPatientProgressFromDetail(params)
      if (data) {
        for (var i in data.pageList) {
          data.pageList[i].isRelation = ''
        }
        this.$nextTick(function () {
          this.list = data.pageList
          this.showStatus = true
          this.loadStatus = false
        })
        // console.log(this.list)
      } else {
        this.loadStatus = false
      }
    }
  }
}
