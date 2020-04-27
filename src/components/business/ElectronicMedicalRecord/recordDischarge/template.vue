
<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item :disabled="true" title="主诉：" name="1">
      <div>
        内容：
        <span v-text="data.c_complaint"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="入院情况：" name="2">
      <div>
        内容：
        <span v-text="data.ad_con"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="入院诊断：" name="3">
      <div>
        内容：
        <span v-text="data.ad_dia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="诊疗经过：" name="4">
      <div>
        内容：
        <span v-text="data.trea_pro"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="出院情况：" name="5">
      <div>
        内容：
        <span v-text="data.dch_con"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="出院诊断：" name="6">
      <div>
        内容：
        <span v-text="data.dch_dia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="出院医嘱：" name="7">
      <div>
        内容：
        <span v-text="data.dch_ord"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item :disabled="true" title="医生信息" name="8">
      <div>
        职称名称：
        <span v-text="data.jt"></span>
      </div>
      <div>
        医生：
        <span v-text="data.docname"></span>
      </div>
      <!-- <div>
              内容：
              <span v-text="data.content"></span>
      </div>-->
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import mixTempla from '../mixTempla.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      data: {},
      activeName: '',
      emrID: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8'],
      loadStatus: true
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await this.$http({
        url: `/api/RecordDischarge/GetViewModel/`,
        method: 'GET',
        params: {
          emrID: this.emrID
        }
      })
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>


