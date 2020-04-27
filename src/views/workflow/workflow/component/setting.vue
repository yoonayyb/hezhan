<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
    title="环节设置"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      label-width="160px"
      ref="dataForm"
    >
      <el-form-item
        label="环节名称"
        prop="Link_name"
        :rules="[{ required: true, message: '请填写环节名称'}]"
      >
        <el-input
          placeholder="环节名称"
          style="width:60%;"
          v-model="dataForm.Link_name"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="环节类型"
        prop="Link_type"
        :rules="[{ required: true, message: '请选择环节类型'}]"
      >
        <el-select
          placeholder="请选择"
          style="width:60%;"
          v-model="dataForm.Link_type"
        >
          <el-option
            :key="item.ID"
            :label="item.NAME"
            :value="item.CODE"
            v-for="item in LinkType"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="下一个同意环节"
        prop="Next_yes_link_id"
        :rules="[{ required: true, message: '请选择下一个同意环节'}]"
      >
        <el-select
          placeholder="请选择"
          style="width:60%;"
          v-model="dataForm.Next_yes_link_id"
        >
          <el-option
            :key="item.ID"
            :label="item.LINK_NAME"
            :value="item.ID"
            v-for="item in links"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="下一个拒绝环节"
        prop="Next_no_link_id"
        :rules="[{ required: true, message: '请选择下一个拒绝环节'}]"
      >
        <el-select
          placeholder="请选择"
          style="width:60%;"
          v-model="dataForm.Next_no_link_id"
        >
          <el-option
            :key="item.ID"
            :label="item.LINK_NAME"
            :value="item.ID"
            v-for="item in links"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="审批人类型"
        prop="Object_type"
        :rules="[{ required: true, message: '请选择审批人类型'}]"
      >
        <el-select
          placeholder="请选择"
          style="width:60%;"
          v-model="dataForm.Object_type"
        >
          <el-option
            label="环节内所有人"
            :value="'0'"
          ></el-option>
          <el-option
            label="环节本部门人"
            :value="'1'"
          ></el-option>
          <el-option
            label="从表单内取人"
            :value="'2'"
          ></el-option>
          <el-option
            label="从表单内取科室所有人"
            :value="'3'"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="是否可加医生"
        prop="Org_name"
      >
        <el-radio-group
          size="mini"
          v-model="dataForm.Is_add_table"
        >
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="是否可删除医生"
        prop="Is_del_table"
      >
        <el-radio-group
          size="mini"
          v-model="dataForm.Is_del_table"
        >
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="是否可编辑医生"
        prop="Org_name"
      >
        <el-radio-group
          size="mini"
          v-model="dataForm.Is_edit_table"
        >
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="不可编辑按钮"
        prop="Org_name"
      >
        <el-input
          :rows="2"
          placeholder="请输入不可编辑按钮id"
          style="width:60%;"
          type="textarea"
          v-model="dataForm.Org_name"
        ></el-input>
      </el-form-item>
    </el-form>

    <span
      class="dialog-footer"
      slot="footer"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button
        @click="dataFormSubmit()"
        type="primary"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getWorkflowLinkList, getWorkflowLinkViewModel, saveWorkflowLink, getBaseDict } from '@/api/index.js'

export default {
  data () {
    return {
      visible: false,
      dataForm: {},
      dataRule: {},
      links: [],
      LinkType: []
    }
  },
  mounted () {
    getBaseDict('a41e1993-fc35-46b3-b728-ea701c5be3ee').then(res => {
      this.LinkType = res.data.pageList
    })
    getWorkflowLinkList(this.$route.query.id).then(({ data }) => {
      this.links = data.pageList
      this.links.push({ LINK_NAME: '转出节点', ID: 'turnout' })
      this.links.push({ LINK_NAME: '转回节点', ID: 'turninto' })
      this.links.push({ LINK_NAME: '转回申请节点', ID: 'turnapplyinto' })
      this.links.push({ LINK_NAME: '结束节点', ID: 'over' })
    })
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    init (id) {
      if (id) {
        getWorkflowLinkViewModel(id).then(({ data }) => {
          this.dataForm = data
          this.visible = true
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          saveWorkflowLink(this.dataForm).then(({ data }) => {
            if (data.status === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
