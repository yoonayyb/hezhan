<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm">
      <el-row>
        <el-form-item>
          <el-button @click="addNewMenu" icon="el-icon-plus" type="primary" v-permission="['add']">新增</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <tree-table
      :columns="[{text: '菜单名称', value: 'Name',align: 'center'}, {text: '链接', value: 'PageUrl'}, {text: '排序',value: 'Sort' } ]"
      :data="memuList"
      :expand-all="false"
      border=""
      v-loading="dataListLoading"
    >
      <el-table-column align="center" label="级别" prop="level">
        <template slot-scope="scope">
          <span>{{(scope.row.LeafType+1)+'级菜单'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标" prop="Icon">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.Icon || ''" class="site-sidebar__menu-icon"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用" prop="level">
        <template slot-scope="scope">{{ scope.row.status == 1 ? '启用': '未启用' }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="addChild(scope)" size="small" type="text" v-permission="['add']">添加子菜单</el-button>
          <el-button @click="edit(scope.row.Id,scope)" size="small" type="text" v-permission="['edit']">编辑</el-button>
          <el-button @click="deleteMenu(scope)" size="small" type="text" v-permission="['del']">删除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <Edit @close="editVisible=false" @refresh="getDataList" ref="edit" v-if="editVisible"/>
  </div>
</template>

<script>
import treeTable from "@/components/TreeTable";
import Edit from "./edit.vue";
import { getBaseDict } from "@/api/index";
import { getMenuTree, deleteSysMenu } from "@/utils/api.js";
import Icon from "@/icons";

export default {
  components: {
    treeTable,
    Edit
  },
  created() {
    this.iconList = Icon.getNameList();
    this.getDataList();
    getBaseDict("655ef482-0fde-4ba4-b75a-3f5c54b302ce").then(res => {
      this.authorityList = res.data;
    });
  },
  data() {
    return {
      editVisible: false,
      dataListLoading: false,
      dataForm: {},
      memuList: [] // table数据
    };
  },
  methods: {
    edit(id, scope) {
      this.editVisible = true;
      this.$nextTick(_ => {
        this.$refs["edit"].edit(id, scope);
      });
    },
    addChild(scope) {
      this.editVisible = true;
      this.$nextTick(_ => {
        this.$refs["edit"].addChild(scope);
      });
    },
    addNewMenu() {
      this.editVisible = true;
      this.$nextTick(_ => {
        this.$refs["edit"].addNewMenu();
      });
    },
    // 删除菜单
    deleteMenu(scope) {
      this.$confirm(`确定对此菜单进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteSysMenu(scope.row.Id).then(res => {
          if (res.data.status === 0) {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
      });
    },
    getDataList() {
      this.dataListLoading = true;
      getMenuTree().then(res => {
        console.log(res.data);
        if (res.data) {
          this.memuList = res.data;
          this.dataListLoading = false;
        }
        this.dataListLoading = false;
      });
    }
  }
};
</script>
