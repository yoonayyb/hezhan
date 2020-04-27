<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item :disabled="true" title="内容：" name="1">
      <div>
        内容：
        <span v-text="data.content"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="医生信息" name="2">
      <div>
        职称名称：
        <span v-text="data.jt"></span>
      </div>
      <div>
        医生：
        <span v-text="data.docname"></span>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import mixTempla from '../mixTempla.js'
import { getEmrDailydModel } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      activeName: '',
      emrID: '',
      activeNames: ['1', '2'],
      data: {}
    }
  },
  mounted () {
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      // const { data } = await this.$http({
      //   url: `/api/RecordSuccession/GetViewModel/${this.id}`,
      //   method: 'GET'
      // })
      const { data } = await getEmrDailydModel(this.emrID)
      // console.log('acsvs', data)
      this.data = data || {}
      this.loadStatus = false
      // console.log(data)
      // this.$emit('listenToChild', data.pn_name)
    }
  }
}
</script>
