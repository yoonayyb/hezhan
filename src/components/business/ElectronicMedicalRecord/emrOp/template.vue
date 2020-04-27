<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="内容：" name="1" :disabled="true">
      <div>
        内容：
        <span v-text="data.content"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="医生信息" name="2" :disabled="true">
      <div>
        职称名称：
        <span v-text="data.jt"></span>
      </div>
      <div>
        术者\操作者名称：
        <span v-text="data.docname"></span>
      </div>
      <div>
        记录者名称：
        <span v-text="data.re_docname"></span>
      </div>
      <!-- <div>
              内容：
              <span v-text="item.content"></span>
      </div>-->
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import mixTempla from '../mixTempla.js';
import { getEmrOp } from '@/api/modules/medicalRecord.js';
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      activeName: '',
      emrID: '',
      activeNames: ['1', '2']
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getEmrOp(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>