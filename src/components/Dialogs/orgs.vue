<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    @close="close"
    append-to-body
    width="700px"
  >
    <el-input
      placeholder="请输入关键字"
      v-model="keyword"
    >
      <el-button
        @click="onSearch()"
        icon="el-icon-search"
        slot="append"
      ></el-button>
    </el-input>
    <el-table
      :data="data"
      border
      style="width: 100%;margin-top:20px"
      v-loading="loading"
    >
      <el-table-column
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        header-align="center"
        v-for="(item,index) in column"
      ></el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            @click.native="select(scope.row)"
            size="small"
            type="text"
          >选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div
      class="clearfix"
      style="margin-top:15px"
    >
      <el-pagination
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="totalCount"
        @current-change="currentChange"
        background
        class="fr"
        layout="prev, pager, next"
      ></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import { getOrgListNoOwm } from '@/api/modules/baseOrg.js'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    column: {
      type: Array,
      default: () => []
    },
    title: String,
    owm: false
  },
  computed: {
    data () {
      return this.list
    }
  },
  watch: {
    value: function (val) {
      this.dialogVisible = val
    },
    dialogVisible: function (val) {
      this.$emit('input', val)
    },
    owm (val) {
      if (this.isOwm === val) {
        return false
      } else {
        this.isOwm = val
        this.getDataList()
      }
    }
  },
  mounted () {
    if (this.owm) {
      this.isOwm = this.owm
      this.getDataList()
    } else {
      this.getDataList()
    }
  },
  data () {
    return {
      dialogVisible: false,
      pageIndex: 1,
      pageSize: 15,
      keyword: '',
      totalCount: 0,
      list: [],
      params: {},
      loading: false,
      isOwm: false
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    onSearch () {
      this.pageIndex = 1
      this.getDataList()
    },
    async getDataList (param = {}) {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword,
        ...param
      }
      this.loading = true
      if (this.isOwm) {
        const { data } = await getOrgListNoOwm(params)
        if (data && data.status === 0) {
          this.list = data.pageList
          this.totalCount = data.totalCount
        }
        this.loading = false
      } else {
        this.$http({
          url: this.$http.adornUrl('/api/BaseOrg/GetAllianceListBase'),
          method: 'GET',
          params: params
        }).then(res => {
          const { data } = res
          if (data && data.status === 0) {
            this.list = res.data.pageList
            this.totalCount = res.data.totalCount
          }
          this.loading = false
        })
      }
    },
    select (row) {
      this.$emit('select', row)
      this.dialogVisible = false
    },
    currentChange (val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style>
</style>
