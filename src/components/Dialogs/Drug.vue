

<template>
  <el-dialog :append-to-body="true" :before-close="handleClose" :visible.sync="dialogVisible" title="选择药品" width="800px">
    <el-input class="input-with-select" placeholder="请输入药品名字" style="margin-bottom:20px" v-model="keyword">
      <el-button @click="onSearch" icon="el-icon-search" slot="append"></el-button>
    </el-input>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column label="药品编号" prop="Drugs_code" width="100"></el-table-column>
      <el-table-column label="药品名称" prop="Drugs_name" min-width="100"></el-table-column>
      <el-table-column label="药品规格" prop="Spec" width="100"></el-table-column>
      <el-table-column label="药品剂量" prop="Dose" width="100"></el-table-column>
      <el-table-column label="剂量单位" prop="Dose_unit" width="100"></el-table-column>
      <el-table-column label="药品类别" prop="Category" width="100"></el-table-column>
      <el-table-column align="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="select(scope.row)" size="small" type="text">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total="total" @current-change="currentChange" background layout="prev, pager, next"></el-pagination>

    <span class="dialog-footer" slot="footer">
      <el-button @click="dialogVisible = false" size="small">取消</el-button>
      <el-button @click="dialogVisible = false" size="small" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
import { getDrug } from '@/api/index'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: function (val) {
      this.dialogVisible = val
    },
    dialogVisible: function (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    if (this.value) {
      this.dialogVisible = true
    }
  },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      keyword: '',
      pageSize: 10,
      pageIndex: 1,
      total: null,
      loading: false
    }
  },
  created () {
    this.getDrugList()
  },
  methods: {
    handleClose (done) {
      done()
    },
    onSearch () {
      this.pageIndex = 1
      this.getDrugList()
    },
    currentChange (val) {
      this.pageIndex = val
      this.getDrugList()
    },
    getDrugList () {
      this.loading = true
      let params = {
        keyword: this.keyword,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      getDrug(params).then(({ data }) => {
        this.tableData = data.pageList
        this.total = data.totalCount
        this.loading = false
      })
    },
    init () {
      this.dialogVisible = true
    },
    select (row) {
      this.dialogVisible = false
      this.$emit('select', row)
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>