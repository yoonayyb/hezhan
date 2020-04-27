<template>
  <el-dialog :close-on-click-modal="false" :title="form.Id?'修改':'新增'" :visible.sync="visible" @close="closeDialog">
    <el-form :model="form" label-width="200px" ref="dataForm">
      <el-form-item label="父级" prop="ParentId">
        <el-input :readonly="true" :value="form.ParentName" style="width:60%;display:inline-block"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称" prop="Name" :rules="[{ required: true, message: '请填写菜单名称'}]">
        <el-input style="width:60%;display:inline-block" v-model="form.Name"></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="Code">
        <el-input style="width:60%;display:inline-block" v-model="form.Code"></el-input>
      </el-form-item>
      <el-form-item label="PC端链接" prop="PageUrl">
        <el-input style="width:60%;display:inline-block" v-model="form.PageUrl"></el-input>
      </el-form-item>
      <el-form-item label="APP端链接" prop="PageUrl">
        <el-input style="width:60%;display:inline-block" v-model="form.appPageUrl"></el-input>
      </el-form-item>
      <el-form-item label="PC端图标" prop="icon" v-if="form.type !== 2">
        <el-row>
          <el-col :span="22">
            <el-popover
              placement="bottom-start"
              popper-class="mod-menu__icon-popover"
              ref="iconListPopover"
              trigger="click"
            >
              <div class="mod-menu__icon-list" style="width:370px">
                <el-button
                  :class="{ 'is-active': item === form.icon }"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  v-for="(item, index) in iconList"
                >
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </el-popover>
            <el-input
              class="icon-list__input"
              placeholder="菜单图标名称"
              style="width:65%;display:inline-block"
              v-model="form.Icon"
              v-popover:iconListPopover
            ></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="APP端图标" prop="icon" v-if="form.type !== 2">
        <el-row>
          <el-col :span="22" style="display:flex;align-items: center">
            <img
              :src="path||($url+form.appIcon)"
              v-if="form.appIcon"
              alt=""
              style="width:30px;height:30px;display:inline-block;margin-right:10px;"
            >
            <el-upload
              class="upload-demo"
              style="display:inline-block"
              action="https://jsonplaceholder.typicode.com/posts/"
              :before-upload="handle_before"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="排序" prop="NATIONAL_IDENTIFIER">
        <el-input style="width:60%;display:inline-block" v-model.number="form.SortId"></el-input>
      </el-form-item>
      <el-form-item label="功能" prop="NATIONAL_IDENTIFIER">
        <el-checkbox-group @change="authorityChange" size="mini" v-model="authorityListModel">
          <el-checkbox-button :key="item.ID" :label="item.CODE" v-for="item in authorityList">{{item.NAME}}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="APP显示" prop="menuType">
        <el-radio-group size="mini" v-model="form.menuType">
          <el-radio-button :label="1">是</el-radio-button>
          <el-radio-button :label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="Status">
        <el-radio-group size="mini" v-model="form.Status">
          <el-radio-button :label="1">开启</el-radio-button>
          <el-radio-button :label="0">关闭</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="submitButtonLoading" @click="submitForm()" type="primary">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getBaseDict, upload } from "@/api/index";
import { saveMenuTree, sysMenuEdit, getSysMenuViewModel } from "@/utils/api.js";
import Icon from "@/icons";

export default {
  created() {
    this.iconList = Icon.getNameList();
    getBaseDict("655ef482-0fde-4ba4-b75a-3f5c54b302ce").then(res => {
      this.authorityList = res.data.pageList;
    });
  },
  data() {
    return {
      visible: false,
      // 表单
      form: {
        AuthorityList: []
      },
      iconList: [],
      authorityList: [],
      authorityListModel: [],
      submitButtonLoading: false,
      path: "",
      isCoverImg: false
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    async handle_before(file) {
      let formData = new FormData();
      await formData.append("FileData", file);
      console.log(formData.get("FileData").name);
      upload(formData).then(({ data }) => {
        if (data && data.status === 0) {
          this.form.appIcon = data.data.Path;
          this.path = this.$url + this.form.appIcon;
          this.isCoverImg = true;
          console.log(this.path);
        }
      });
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 初始化
    init(id) {
      // this.visible = true;
      // return getSysMenuViewModel({ id: 0 }).then(_ => {
      //   this.visible = true;
      //   this.form = _.data;
      //   this.form.AuthorityList = [];
      //   this.$nextTick(() => {
      //     this.$refs["dataForm"].resetFields();
      //   });
      // });
    },
    // 增加新菜单
    addNewMenu() {
      this.form.AuthorityList = [];
      this.form.ParentName = "无";
      this.visible = true;
      this.form.ParentId = "0";
      // sysMenuEdit({ id: 0 }).then(({ data }) => {
      //   if (data) {
      //     this.form = data;
      //     this.form.AuthorityList = [];
      //     this.form.ParentName = "无";
      //     this.visible = true;
      //   }
      // });
    },
    // 保存
    submitForm() {
      this.submitButtonLoading = true;
      if (!this.form.Id) {
        this.form.Id = "0";
      }
      saveMenuTree(this.form)
        .then(({ data }) => {
          if (data && data.status === 0) {
            this.$message({
              message: data.msg,
              type: "success",
              duration: 1000,
              onClose: () => {
                this.visible = false;
                this.submitButtonLoading = false;

                this.$emit("refresh");
              }
            });
          } else {
            this.$message.error(data.msg);
            this.visible = false;
            this.submitButtonLoading = false;
          }
        })
        .catch(() => {
          this.submitButtonLoading = false;
        });
    },
    // 功能列表选择
    authorityChange(val) {
      let arr = [];
      let new_func_arr = [];
      let that = this;
      // 取出后台返回现有的功能
      if (this.form.AuthorityList) {
        this.form.AuthorityList.forEach(item => {
          arr.push(item.TYPE);
        });
      }

      // 对比，如果改变有的就直接取后台返回的数据，如果没有就重构
      if (arr.length > val.length) {
        arr.forEach(item => {
          if (val.includes(item)) {
            that.form.AuthorityList.forEach(i => {
              if (i.TYPE === item) {
                new_func_arr.push(i);
              }
            });
          }
        });

        console.log(new_func_arr);
        this.form.AuthorityList = new_func_arr;
      } else {
        val.forEach(item => {
          if (!arr.includes(item)) {
            let label = this.authorityList.find(i => {
              return i.CODE === item;
            });
            this.form.AuthorityList.push({
              TYPE_NAME: label.NAME,
              TYPE: item
            });
          }
        });
      }
      console.log(this.form.AuthorityList);
    },
    // 修改
    edit(id, scope) {
      console.log(scope);
      sysMenuEdit({ id: id }).then(({ data }) => {
        this.visible = true;
        this.form = data.data;
        this.form.ParentName = scope.row.parent ? scope.row.parent.Name : "无";
        console.log(this.form);
        // 去重 后台返回重复数据 设置cur默认类型为数组，并且初始值为空的数组
        let obj = {};
        let authorityList = this.form.AuthorityList.reduce((cur, next) => {
          obj[next.TYPE] ? "" : (obj[next.TYPE] = true && cur.push(next));
          return cur;
        }, []);

        // 功能列表默认显示
        let allAuthortyList = [];
        let arr = [];
        authorityList.forEach(item => {
          allAuthortyList.push(item);
          arr.push({ TYPE_NAME: item.TYPE_NAME, TYPE: item.TYPE });
        });
        this.form.AuthorityList = authorityList;

        let hash = [];
        allAuthortyList.forEach(item => {
          if (hash.indexOf(item) === -1) {
            hash.push(item.TYPE);
          }
        });
        this.authorityListModel = hash;
        console.log(this.form);
      });
    },
    // 增加子菜单
    addChild(scope) {
      if (!scope) {
        return;
      }
      this.visible = true;
      this.$set(this.form, "ParentId", scope.row.Id);
      this.$set(this.form, "ParentName", scope.row.Name);
      this.$set(this.form, "LeafType", scope.row._level);
    },
    // 关闭弹框
    closeDialog() {
      this.$emit("close");
      this.$refs.dataForm.resetFields();
    },
    //  设置菜单的图标
    iconActiveHandle(iconName) {
      this.$set(this.form, "Icon", iconName);
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-demo {
  /deep/.el-upload-list {
    display: none;
  }
}

.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    max-width: 370px;
  }
  &__icon-list {
    // max-height: 180px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
.mod-menu__icon-popover {
  width: 250px;
}
</style>
