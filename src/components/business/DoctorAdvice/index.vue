<template>
  <div>
    <el-table :data="advice" border style="width: 100%">
      <el-table-column align="center" label="医嘱" prop="ITEM_NAME"></el-table-column>
      <el-table-column align="center" label="规格" prop="DRUG_SPECIFICATION" width="60"></el-table-column>
      <el-table-column align="center" label="用法" prop="ROUTE_NAME"></el-table-column>
      <el-table-column align="center" label="用量" prop="DOSAGE" width="60"></el-table-column>
      <el-table-column align="center" label="用量单位" prop="DOSAGE_UNIT" width="60"></el-table-column>
      <el-table-column align="center" label="频次" prop="EXEC_FREQ_NAME" width="60"></el-table-column>
      <el-table-column align="center" label="类型" prop="ORDER_TYPE_NAME" width="60">
        <template slot-scope="scope">
          <div v-if="scope.row.ORDER_TYPE_NAME == '0'">门诊</div>
          <div v-else-if="scope.row.ORDER_TYPE_NAME == '1'">急诊</div>
          <div v-else-if="scope.row.ORDER_TYPE_NAME == '2'">住院</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="医嘱类型" prop="IS_TEMPORARY" width="60"></el-table-column>
      <el-table-column align="center" label="开嘱时间" prop="START_TIME" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.START_TIME|formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="停嘱时间" prop="STOP_TIME" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.STOP_TIME|formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="MEMO"></el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage1"
        :page-sizes="[20, 30, 50]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="sizes, prev, pager, next,total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getBasePatient } from '@/api/index'
export default {
  data () {
    return {
      advice: [],
      currentPage1: 1,
      pageSize: 20,
      pageIndex: 1,
      total: 0
    }
  },
  props: {
    id: String
  },
  methods: {
    getProcedure () {
      let params = {}
      if (this.$route.params.P_sn) {
        params = {
          pid: this.$route.params.PatiendId,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          keyword: '',
          applyid: this.$route.params.ID,
          visitsn: this.$route.params.P_sn
        }
      } else {
        params = {
          pid: this.$route.params.PatiendId,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          keyword: '',
          applyid: this.$route.params.ID,
          visitsn: ''
        }
      }

      this.$http({
        url: '/api/PatientOrder/GetOrderListForApply',
        method: 'GET',
        params: params
      }).then(({ data }) => {
        if (data) {
          // console.log(data)
          this.total = data.totalCount
          this.advice = data.pageList
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getProcedure()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getProcedure()
    }
  },
  created () {
    this.getProcedure()
  }
}
</script>

