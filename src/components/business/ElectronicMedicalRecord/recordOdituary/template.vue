<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="主诉：" name="1" :disabled="true">
      <div>
        内容：
        <span v-text="data.c_complaint"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="入院情况：" name="2" :disabled="true">
      <div>
        内容：
        <span v-text="data.ad_con"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="入院诊断：" name="3" :disabled="true">
      <div>
        内容：
        <span v-text="data.ad_dia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="诊疗经过：" name="4" :disabled="true">
      <div>
        内容：
        <span v-text="data.trea_pro"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="死亡原因：" name="5" :disabled="true">
      <div>
        内容：
        <span v-text="data.death_cause"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="死亡诊断：" name="6" :disabled="true">
      <div>
        内容：
        <span v-text="data.death_dia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="7" :disabled="true">
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
import { getRecordOdituary } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getRecordOdituary(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>