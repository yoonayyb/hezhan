<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="简要病情：" name="1" :disabled="true">
      <div>
        内容：
        <span v-text="data.abs_con"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="术前诊断：" name="2" :disabled="true">
      <div>
        内容：
        <span v-text="data.preop_dia"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="手术指征：" name="3" :disabled="true">
      <div>
        内容：
        <span v-text="data.op_indi"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="拟施手术名称和方式：" name="4" :disabled="true">
      <div>
        内容：
        <span v-text="data.op_nm"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="拟施麻醉方式：" name="5" :disabled="true">
      <div>
        内容：
        <span v-text="data.ane_type"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="注意事项：" name="6" :disabled="true">
      <div>
        内容：
        <span v-text="data.mat_att"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="手术者术前查看患者相关情况：" name="7" :disabled="true">
      <div>
        内容：
        <span v-text="data.preop_p_con"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="8" :disabled="true">
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
import { getRecodePs } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getRecodePs(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>