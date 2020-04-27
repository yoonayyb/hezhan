<template>
  <div>
    <el-collapse v-model="activeNames" v-loading="loadStatus">
      <el-collapse-item :disabled="true" title="主诉" name="2">
        <div>
          内容：
          <span v-text="data.c_complaint"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="现病史" name="3">
        <div>
          内容：
          <span v-text="data.pm_his"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="既往史" name="4">
        <div>
          内容：
          <span v-text="data.pi_his"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="系统回顾" name="5">
        <div>
          内容：
          <span v-text="data.sys_review"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="个人史" name="6">
        <div>
          内容：
          <span v-text="data.per_his"></span>
        </div>
      </el-collapse-item>

      <el-collapse-item :disabled="true" title="月经及婚约史" name="7">
        <div>
          内容：
          <span v-text="data.mc_his"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="家族史" name="5">
        <div>
          内容：
          <span v-text="data.fhistory"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="体格检查" name="6">
        <div>
          <span class="user_items">
            体温T ：
            <span v-text="data.temp"></span>
          </span>
          <span class="user_items">
            脉搏P ：
            <span v-text="data.pulse"></span>
          </span>
          <span class="user_items">
            呼吸R ：
            <span v-text="data.resp"></span>
          </span>
          <span class="user_items">
            血压BP ：
            <span v-text="data.bp"></span>
          </span>
          <span class="user_items">
            身高 ：
            <span v-text="data.height"></span>
          </span>
          <span class="user_items">
            体重 ：
            <span v-text="data.weight"></span>
          </span>
        </div>
        <div>
          内容：
          <span v-text="data.ph_ex"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="一般情况" name="7">
        <div>
          内容：
          <span v-text="data.generally"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="皮肤粘膜" name="8">
        <div>
          内容：
          <span v-text="data.mucocutaneous"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="淋巴结" name="9">
        <div>
          内容：
          <span v-text="data.lymphnodes"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="头部及其器官" name="10">
        <div>
          内容：
          <span v-text="data.head"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="颈部" name="11">
        <div>
          内容：
          <span v-text="data.neck"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="胸部" name="12">
        <div>
          内容：
          <span v-text="data.chest"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="胸廓" name="13">
        <div>
          内容：
          <span v-text="data.chorax"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="肺脏" name="14">
        <div>
          内容：
          <span v-text="data.lung"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="心脏" name="15">
        <div>
          内容：
          <span v-text="data.heart"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="周围血管" name="16">
        <div>
          内容：
          <span v-text="data.pulmonary"></span>
        </div>
      </el-collapse-item>

      <el-collapse-item :disabled="true" title="腹部" name="17">
        <div>
          内容：
          <span v-text="data.abdomen"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="肛门、直肠外生殖器" name="18">
        <div>
          内容：
          <span v-text="data.rectal"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="外生殖器" name="19">
        <div>
          内容：
          <span v-text="data.genitalia"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="脊柱四肢" name="20">
        <div>
          内容：
          <span v-text="data.extremities"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="神经系统" name="21">
        <div>
          内容：
          <span v-text="data.neurology"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="中医望闻问切详情" name="22">
        <div>
          内容：
          <span v-text="data.tcm_four"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="专科检查" name="23">
        <div>
          内容：
          <span v-text="data.spec_ex"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="辅助检查" name="24">
        <div>
          内容：
          <span v-text="data.aux_ex"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="血尿常规" name="25">
        <div>
          内容：
          <span v-text="data.hematuria"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="血液生化" name="26">
        <div>
          内容：
          <span v-text="data.biochemical"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="心电图" name="27">
        <div>
          内容：
          <span v-text="data.ecg"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="B超、X光及其他特殊检查结果" name="28">
        <div>
          内容：
          <span v-text="data.inspection"></span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="初步诊断" name="29">
        <div>
          初步诊断编码：
          <span v-text="data.pre_dia_id"></span>
        </div>
        <div>
          内容：
          <span v-text="data.pre_dia"></span>
        </div>
        <div>
          中医初步诊断编码：
          <span v-text="data.tcm_pre_id"></span>
        </div>
        <div>
          中医初步诊断名称：
          <span v-text="data.tcm_pre_name"></span>
        </div>
        <div>
          中医初步证候编码：
          <span v-text="data.tcm_sy_pre_id"></span>
        </div>
        <div>
          中医初步证候名称：
          <span v-text="data.tcm_sy_pre_name"></span>
        </div>
        <div>
          入院时病例分型：
          <span v-text="data.mr_type_a"></span>
        </div>
        <div>
          医生职称：
          <span v-text="data.doc_title"></span>
        </div>
        <div>
          医生名称：
          <span v-text="data.docname"></span>
        </div>
        <div>
          记录时间：
          <span>{{ data.rec_time|formatTime }}</span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="修正诊断" name="30">
        <div>
          修正诊断编码：
          <span v-text="data.cor_dia_id"></span>
        </div>
        <div>
          内容：
          <span v-text="data.cor_dia"></span>
        </div>
        <div>
          中医修正诊断编码：
          <span v-text="data.tcm_cor_id"></span>
        </div>
        <div>
          中医修正诊断名称：
          <span v-text="data.tcm_cor_name"></span>
        </div>
        <div>
          中医修正证候编码：
          <span v-text="data.tcm_sy_cor_id"></span>
        </div>
        <div>
          中医修正证候名称：
          <span v-text="data.tcm_sy_cor_name"></span>
        </div>
        <div>
          修正医生职称：
          <span v-text="data.cor_doc_title"></span>
        </div>
        <div>
          修正医生名称：
          <span v-text="data.cor_doc_name"></span>
        </div>
        <div>
          修正记录时间：
          <span>{{ data.cor_rec_time|formatTime }}</span>
        </div>
      </el-collapse-item>
      <el-collapse-item :disabled="true" title="补充诊断" name="31">
        <div>
          补充诊断编码：
          <span v-text="data.supp_dia_id"></span>
        </div>
        <div>
          内容：
          <span v-text="data.supp_dia"></span>
        </div>
        <div>
          中医补充诊断编码：
          <span v-text="data.tcm_supp_id"></span>
        </div>
        <div>
          中医补充诊断名称：
          <span v-text="data.tcm_supp_name"></span>
        </div>
        <div>
          中医补充证候编码：
          <span v-text="data.tcm_sy_supp_id"></span>
        </div>
        <div>
          中医补充证候名称：
          <span v-text="data.tcm_sy_supp_name"></span>
        </div>
        <div>
          病例分型修正：
          <span v-text="data.mr_type_b"></span>
        </div>
        <div>
          补充医生职称：
          <span v-text="data.supp_doc_title"></span>
        </div>
        <div>
          补充医生名称：
          <span v-text="data.supp_doc_name"></span>
        </div>
        <div>
          补充记录时间：
          <span>{{ data.supp_rec_time|formatTime }}</span>
        </div>
      </el-collapse-item>
      <!-- <el-collapse-item title="内容" name="32">
            <div>
              内容：
              <span v-text="data.content"></span>
            </div>
      </el-collapse-item>-->
      <!-- <el-collapse-item
        title="申请科室"
        name="33"
      >
        <div>
          内容：
          <span v-text="data.apply_dept"></span>
        </div>
      </el-collapse-item>-->
    </el-collapse>
  </div>
</template>
<script>
import mixTempla from '../mixTempla.js'
import { getEmrCourseRecordModel } from '@/api/modules/medicalRecord.js'

export default {
  props: ['id'],
  mixins: [mixTempla],
  data () {
    return {
      emrID: '',
      loadStatus: true,
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
        '29',
        '30',
        '31',
        '32',
        '33'
      ],
      data: {}
    }
  },
  mounted () {
    this.emrID = this.id
    this.getData()
  },
  methods: {
    async getData () {
      const { data } = await getEmrCourseRecordModel(this.emrID)
      this.data = data || {}
      // console.log('acsvs', data)
      this.loadStatus = false
    }
  }
}
</script>
