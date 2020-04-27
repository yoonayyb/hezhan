<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    @select="select"
    @select-all="selectAll"
    @selection-change="handleSelectionChange"
    border
    element-loading-text="拼命加载中"
    ref="multipleTable"
    v-bind="$attrs"
    v-loading="formatData.length<=0"
    onTableSelect="onTableSelect"
  >
    <el-table-column label="导航名称" v-if="columns.length===0" width="300">
      <template slot-scope="scope">
        <span :key="space" class="ms-tree-space" v-for="space in scope.row._level"/>
        <span @click="toggleExpanded(scope.$index)" class="tree-ctrl" v-if="iconShow(0,scope.row)">
          <i class="el-icon-plus" v-if="!scope.row._expanded"/>
          <i class="el-icon-minus" v-else/>
        </span>
        {{ scope.row.Name }}
      </template>
    </el-table-column>
    <el-table-column :key="column.value" :label="column.text" :width="column.width" v-else v-for="(column, index) in columns">
      <template slot-scope="scope">
        <!-- Todo -->
        <!-- eslint-disable-next-line vue/no-confusing-v-for-v-if -->
        <span :key="space" class="ms-tree-space" v-for="space in scope.row._level" v-if="index === 0"/>
        <span @click="toggleExpanded(scope.$index)" class="tree-ctrl" v-if="iconShow(index,scope.row)">
          <i class="el-icon-plus" v-if="!scope.row._expanded"/>
          <i class="el-icon-minus" v-else/>
        </span>
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <slot/>
    <el-table-column type="selection" width="45"></el-table-column>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
export default {
  name: 'TreeTable',
  data () {
    return {
      loading: true
    }
  },
  props: {
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    }
  },
  watch: {
    data(val) {
      if (val) {
        this.loading = false;
      }
    }
  },
  methods: {
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    // 切换下级是否展开
    toggleExpanded: function(trIndex) {
      const record = this.formatData[trIndex];
      record._expanded = !record._expanded;
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0;
    },
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    select(selection,row) {
      this.$emit("select", selection,row);
    },
    onTableSelect(rows,row){
      console.log('1',rows,row)

    },
    selectAll(rows){
      console.log(rows)
      this.$emit('selectAll',rows)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    }
  }
};
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: "";
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
