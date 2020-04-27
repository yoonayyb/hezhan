<template>
  <transition name="el-message-fade">
    <div @submit.native.prevent role="form">
      <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="isshow"
        :width="width"
        @keyup.enter.native="search()"
        append-to-body
      >
        <el-form style="width:100%" @submit.native.prevent>
          <el-form-item style="width:100%;display:inline-block">
            <el-input :placeholder="placeholder" class="input-with-select" v-model="keyword">
              <el-select placeholder="请选择" slot="prepend" v-if="isPrepend" v-model="prependSelect">
                <el-option label="姓名" value="1"></el-option>
                <el-option label="身份证" value="2"></el-option>
                <el-option label="住院号" value="3"></el-option>
              </el-select>
              <el-button @click="search" icon="el-icon-search" slot="append"></el-button>
            </el-input>
          </el-form-item>
        </el-form>

        <el-table
          :data="list"
          border
          element-loading-spinner="el-icon-loading"
          element-loading-text="拼命加载中"
          style="width: 100%;margin-bottom: 10px"
          v-loading="loading"
          v-show="isSearch"
        >
          <el-table-column
            :key="item.id"
            :label="item.label"
            :prop="item.prop"
            align="center"
            header-align="center"
            v-for="item in column"
          ></el-table-column>

          <el-table-column :fixed="column.length>5?'right':false" align="center" header-align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="select(scope.row)" size="small" type="text">选择</el-button>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="totalCount"
          @current-change="pageChange"
          layout="prev, pager, next"
          small
          v-show="isSearch&&totalCount>1"
        >
        </el-pagination>
      </el-dialog>
    </div>
  </transition>
</template>

<script type="text/babel">
export default {
  data () {
    return {
      width: '35%',
      isshow: true,
      visible: false,
      showClose: false,
      closed: false,
      timer: null,
      dangerouslyUseHTMLString: false,

      title: '',
      placeholder: '',
      list: [],
      column: [],
      loading: false,
      isSearch: false,
      onClose: null,
      onSearch: null,
      onSelect: null,
      onPageChange: null,
      keyword: '',
      pageIndex: 1,
      totalCount: 0,
      pageSize: 20,
      prependSelect: '1',
      isPrepend: false
    }
  },
  computed: {
    totalPage () {
      return this.list.length
    }
  },
  watch: {
    closed (newVal) {
      if (newVal) {
        this.visible = false
        // this.$el.addEventListener('transitionend', this.destroyElement);
      }
    }
  },
  methods: {
    destroyElement () {
      this.$el.removeEventListener('transitionend', this.destroyElement)
      this.$destroy(true)
      // this.$el.parentNode.removeChild(this.$el)
    },
    close () {
      this.isshow = false
      if (typeof this.onClose === 'function') {
        this.onClose(this)
        this.destroyElement()
      }
    },
    search () {
      this.isSearch = true
      if (typeof this.onClose === 'function') {
        this.onSearch(this.keyword)
      }
    },
    select (row) {
      if (typeof this.onClose === 'function') {
        this.onSelect(row)
        this.close()
      }
    },
    pageChange (val) {
      if (typeof this.onPageChange === 'function') {
        this.onPageChange(val)
      }
    }
  },
  mounted () {

  },
  beforeDestroy () {
    console.log('组件销毁')
  }
}
</script>

<style>
.input-with-select .el-input-group__prepend {
  width: 95px !important;
  background-color: #fff !important;
}
</style>
