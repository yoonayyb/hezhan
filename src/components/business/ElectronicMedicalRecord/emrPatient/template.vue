
<template>
  <el-collapse
    v-model="activeNames"
    @change="handleChange"
  >
    <el-collapse-item
      title="内容："
      name="3"
    >
      <div>
        内容：
        <span v-text="data.content"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item
      title="医生信息"
      name="4"
    >
      <div>
        主治/(副)主任医生职称名称：
        <span v-text="data.jt"></span>
      </div>
      <div>
        主治/(副)主任医生：
        <span v-text="data.sup_docname"></span>
      </div>
      <div>
        经治医生职称名称：
        <span v-text="data.ttending_jt"></span>
      </div>
      <div>
        经治医生：
        <span v-text="data.attending_docname"></span>
      </div>
    </el-collapse-item>
  </el-collapse>

</template>

<script>
import mixTempla from '../mixTempla.js'
import { getEmrWarddModel } from '@/api/modules/medicalRecord.js'
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      data: {},
      emrID: '',
      activeName: '',
      activeNames: ['1', '2', '3', '4', '5', '6', '7']
    }
  },
  mounted () {
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getEmrWarddModel(this.emrID)
      this.data = data || {}
    }
  }
}
</script>


