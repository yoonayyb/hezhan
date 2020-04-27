<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body width="700px" @close="close">
    <el-input placeholder="请输入关键字" v-model="keyword">
      <el-button @click="onSearch()" icon="el-icon-search" slot="append"></el-button>
    </el-input>
    <el-table :data="data" border style="width: 100%;margin-top:20px">
      <el-table-column
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        header-align="center"
        v-for="(item,index) in column"
      ></el-table-column>
      <el-table-column align="center" header-align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click.native="select(scope.row)" size="small" type="text">选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="clearfix" style="margin-top:15px">
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
    request: {
      type: Function
    },
    params: Object,
    value: {
      type: Boolean,
      default: false
    },
    column: {
      type: Array,
      default: () => []
    },
    isRequest: {
      type: Boolean,
      default: true
    },
    title: String
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
    isRequest: function (val) {
      if (val) {
        this.getDataList()
      }
    },
    params: function (val) {
      if (this.isRequest) {
        this.getDataList()
      }
    }
  },
  created () {
    if (this.isRequest) {
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
      list: []
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
    getDataList () {
      if (this.request) {
        let params = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          keyword: this.keyword,
          ...this.params
        }
        this.request(params).then(res => {
          this.list = res.data.pageList
          this.totalCount = res.data.totalCount
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
