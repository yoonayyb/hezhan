<template>
  <el-collapse v-model="activeNames" v-loading="loadStatus">
    <el-collapse-item title="体温T：" name="3" :disabled="true">
      <div>
        内容：
        <span v-text="data.temperature"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="脉搏P：" name="4" :disabled="true">
      <div>
        内容：
        <span v-text="data.pulse"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="呼吸R：" name="5" :disabled="true">
      <div>
        内容：
        <span v-text="data.respiration"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="血压BP：" name="6" :disabled="true">
      <div>
        内容：
        <span v-text="data.blood_pressure"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="疼痛(分)：" name="7" :disabled="true">
      <div>
        内容：
        <span v-text="data.ache"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="神志：" name="8" :disabled="true">
      <div>
        内容：
        <span v-text="data.consciousness"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="左瞳孔：" name="10" :disabled="true">
      <div>
        内容：
        <span v-text="data.left_pupil"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="右瞳孔：" name="11" :disabled="true">
      <div>
        内容：
        <span v-text="data.right_pupil"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="SP2(%)：" name="12" :disabled="true">
      <div>
        内容：
        <span v-text="data.sp2"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="吸氧流量：" name="13" :disabled="true">
      <div>
        内容：
        <span v-text="data.oxygen_rate"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="吸氧方式名称：" name="14" :disabled="true">
      <div>
        内容：
        <span v-text="data.oxygen_mode"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="吸痰\其他措施：" name="15" :disabled="true">
      <div>
        内容：
        <span v-text="data.measure"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="静脉置管名称：" name="16" :disabled="true">
      <div>
        内容：
        <span v-text="data.venous_name"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="静脉置管护理：" name="17" :disabled="true">
      <div>
        内容：
        <span v-text="data.venous_nursing"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="伤口：" name="18" :disabled="true">
      <div>
        内容：
        <span v-text="data.wound"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="管道名称：" name="19" :disabled="true">
      <div>
        内容：
        <span v-text="data.pipeline_name"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="管道性质：" name="20" :disabled="true">
      <div>
        内容：
        <span v-text="data.pipeline_type"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="管道量(ml)：" name="21" :disabled="true">
      <div>
        内容：
        <span v-text="data.pipeline_flow"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="其他：" name="22" :disabled="true">
      <div>
        内容：
        <span v-text="data.other"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="其他1：" name="23" :disabled="true">
      <div>
        内容：
        <span v-text="data.other_o"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="其他2：" name="24" :disabled="true">
      <div>
        内容：
        <span v-text="data.other_t"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="其他3：" name="25" :disabled="true">
      <div>
        内容：
        <span v-text="data.other_th"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="其他4：" name="26" :disabled="true">
      <div>
        内容：
        <span v-text="data.other_f"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="其他5：" name="27" :disabled="true">
      <div>
        内容：
        <span v-text="data.other_fi"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="其他6：" name="28" :disabled="true">
      <div>
        内容：
        <span v-text="data.other_six"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="病情变化及措施：" name="9" :disabled="true">
      <div>
        内容：
        <span v-text="data.condition"></span>
      </div>
    </el-collapse-item>
    <el-collapse-item title="签名信息" name="29" :disabled="true">
      <div>
        签名：
        <span v-text="data.autogragph"></span>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import mixTempla from '../mixTempla.js';
import { getRecordNursing } from '@/api/modules/medicalRecord.js';
export default {
  mixins: [mixTempla],
  props: ['id'],
  data () {
    return {
      loadStatus: true,
      data: {},
      emrID: '',
      activeName: '',
      activeNames: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29'
      ]
    }
  },
  mounted () {
    this.loadStatus = true
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getRecordNursing(this.emrID)
      this.data = data || {}
      this.loadStatus = false
    }
  }
}
</script>