<template>
  <el-dialog
    v-if="dialogVisible"
    :title="title"
    :visible.sync="dialogVisible"
    append-to-body
    width="700px"
    @close="close"
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
      :data="list"
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
    params: {
      type: Object,
      default: () => { }
    }
  },
  // mounted () {
  //   console.log(this.param)
  // },
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
    }
  },
  data () {
    return {
      flag: 0, // 0为会诊 1为转诊
      dialogVisible: false,
      pageIndex: 1,
      pageSize: 15,
      keyword: '',
      totalCount: 0,
      list: [],
      param: {},
      loading: false
    }
  },
  methods: {
    init (params) {
      this.dialogVisible = true
      // this.getList(params)
    },
    close () {
      this.pageIndex = 1
      this.$emit('close')
    },
    onSearch () {
      this.pageIndex = 1
      if (this.flag == 0) {
        this.getDataListByUnitFlag()
      } else if (this.flag == 1) {
        this.getDataListForByTypeID()
      } else {
        this.getAllDataList()
      }
    },
    // 新增方法，多复制一份兼容旧版本
    getList (params) {
      this.loading = true
      this.$http({
        url: '/api/BaseDept/GetListByUnitFlag',
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
    },
    getDataListByUnitFlag () {
      this.flag = 0
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword,
        ...this.param
      }
      this.loading = true
      this.$http({
        url: '/api/BaseDept/GetListByUnitFlag',
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
    },
    getAllDataList () {
      this.flag = 2
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword,
        ...this.param
      }
      this.loading = true
      this.$http({
        url: '/api/BaseDept/Getlist',
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
    },
    getDataListForByTypeID () {
      this.flag = 1
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword,
        ...this.param
      }
      this.loading = true
      this.$http({
        url: '/api/BaseDept/GetListByTypeID',
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
    },
    select (row) {
      this.$emit('select', row)
      this.dialogVisible = false
    },
    currentChange (val) {
      this.pageIndex = val
      if (this.flag == 0) {
        this.getDataListByUnitFlag()
      } else if (this.flag == 1) {
        this.getDataListForByTypeID()
      } else {
        this.getAllDataList()
      }
    }
  }
}
</script>

<style>
</style>
