<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="!dataForm.ID ? '新增' : '修改'"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      label-width="200px"
      ref="dataForm"
      style="width:500px"
      :rules="rulesDict"
    >
      <el-form-item label="药品编号" prop="Drugs_code">
        <el-input v-model="dataForm.Drugs_code"></el-input>
      </el-form-item>

      <el-form-item label="药品名称" prop="Drugs_name">
        <el-input v-model="dataForm.Drugs_name"></el-input>
      </el-form-item>

      <el-form-item label="药品规格" prop="Spec">
        <el-input v-model="dataForm.Spec"></el-input>
      </el-form-item>

      <el-form-item label="药品属性" prop="Property">
        <el-input v-model="dataForm.Property"></el-input>
      </el-form-item>

      <el-form-item label="药品单位" prop="Unit" :rules="{ required: true, message: '请填写药品单位'}">
        <el-input v-model="dataForm.Unit"></el-input>
      </el-form-item>

      <el-form-item label="单价" prop="Price" :rules="{ required: true, message: '请填写单价'}">
        <el-input v-model="dataForm.Price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="药品剂量" prop="Dose" :rules="{ required: true, message: '请填写药品剂量'}">
        <el-input v-model="dataForm.Dose"></el-input>
      </el-form-item>
      <el-form-item label="剂量单位" prop="Dose_unit" :rules="{ required: true, message: '请填写剂量单位'}">
        <el-input v-model="dataForm.Dose_unit"></el-input>
      </el-form-item>
      <el-form-item label="拼音码" prop="Py_code">
        <el-input v-model="dataForm.Py_code"></el-input>
      </el-form-item>
      <el-form-item label="五笔码" prop="Wb_code">
        <el-input v-model="dataForm.Wb_code"></el-input>
      </el-form-item>
      <el-form-item label="药品说明" prop="Explain">
        <el-input v-model="dataForm.Explain"></el-input>
      </el-form-item>
      <el-form-item label="给药方式" prop="Route_name" :rules="{ required: true, message: '请填写给药方式'}">
        <el-input v-model="dataForm.Route_name"></el-input>
      </el-form-item>
      <el-form-item label="药品类别" prop="Category" :rules="{ required: true, message: '请填写药品类别'}">
        <el-input v-model="dataForm.Category"></el-input>
      </el-form-item>
      <el-form-item label="取整策略" prop="Strategy">
        <el-input v-model="dataForm.Strategy"></el-input>
      </el-form-item>
      <el-form-item label="TPN" prop="Tpn">
        <el-input v-model="dataForm.Tpn"></el-input>
      </el-form-item>
      <el-form-item
        label="抗生素标志"
        prop="Is_antibiptic"
        :rules="{ required: true, message: '请填写抗生素标志'}"
      >
        <el-select v-model="dataForm.Is_antibiptic" placeholder="请选择抗生素标志">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.Is_antibiptic"></el-input> -->
      </el-form-item>
      <el-form-item
        label="基本药物标志"
        prop="Is_essential"
        :rules="{ required: true, message: '请填写基本药物标志'}"
      >
        <el-select v-model="dataForm.Is_essential" placeholder="请选择基本药物标志">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.Is_essential"></el-input> -->
      </el-form-item>
      <el-form-item label="皮试判别" prop="Is_shin" :rules="{ required: true, message: '请选择皮试判别'}">
        <el-select v-model="dataForm.Is_shin" placeholder="请选择皮试判别">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.Is_essential"></el-input> -->
      </el-form-item>
      <el-form-item label="作废判别" prop="Is_delete" :rules="{ required: true, message: '请选择作废判别'}">
        <el-select v-model="dataForm.Is_delete" placeholder="请选择作废判别">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.Is_essential"></el-input> -->
      </el-form-item>
      <el-form-item label="处方用药备注" prop="Remarks">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" v-model="dataForm.Remarks"></el-input>
      </el-form-item>
    </el-form>

    <span class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary" :loading="submitButtonLoading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  data () {
    return {
      visible: false,
      dataForm: {
        Is_delete: '0'
      },
      options: [
        {
          value: '0',
          label: '是'
        },
        {
          value: '1',
          label: '否'
        }
      ],
      options1: [
        {
          value: '1',
          label: '是'
        },
        {
          value: '0',
          label: '否'
        }
      ],
      types: [],
      chilrenTypes: [],
      submitButtonLoading: false,
      rulesDict: {
        Drugs_code: [
          { required: true, message: '请填写药品编号' },
          { max: 18, message: '长度在小于18个字符', trigger: 'blur' }
        ],
        Drugs_name: [
          { required: true, message: '请填写药品名称'},
          { max: 22, message: '长度在小于22个字符', trigger: 'blur' }
        ],
        Spec: [
          { required: true, message: '请填写药品规格'},
          { max: 18, message: '长度在小于18个字符', trigger: 'blur' }
        ],
        Property: [
          { required: true, message: '请填写药品属性'},
          { max: 22, message: '长度在小于22个字符', trigger: 'blur' }
        ],
        Remarks: [
          { required: true, message: '请填写处方用药备注'},
          { max: 15, message: '长度在小于15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // this.getChilrenTypes()
  },

  methods: {
    init (id) {
      this.dataForm.Id = id || 0
      this.$http({
        url: '/api/RemoteClinicDrugsBase/GetViewModel/0',
        method: 'get'
      })
        .then(({ data }) => {
          this.dataForm = data
        })
        .then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        })
        .then(() => {
          if (id) {
            this.dataForm.ID = id
            this.$http({
              url: this.$http.adornUrl(
                `/api/RemoteClinicDrugsBase/GetViewModel/${this.dataForm.ID}`
              ),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              this.dataForm = data
            })
          }
        })
      // this.getTypes()
    },
    // 获取字典类型
    // getTypes () {
    //   this.$http({
    //     url: this.$http.adornUrl('/api/baseDictType/getlist'),
    //     method: 'GET',
    //     params: this.$http.adornParams({
    //       pageIndex: 1,
    //       pageSize: 999
    //     })
    //   }).then(({ data }) => {
    //     if (data) {
    //       this.types = data.pageList
    //       for (var i = 0; i < data.pageList.length; i++) {
    //         var m = data.pageList[i]
    //         this.types[i].id = m.ID
    //         this.types[i].code = m.CODE
    //         this.types[i].label = m.NAME
    //       }
    //     }
    //   })
    // },
    // typeChange (val) {
    //   if (val && val !== '') {
    //     this.getChilrenTypes()
    //   }
    // },
    // getChilrenTypes () {
    //   this.$http({
    //     url: '/api/baseDictType/GetSubtypesByTypeID',
    //     method: 'get',
    //     params: { typeID: this.dataForm.TYPE_ID }
    //   }).then(({ data }) => {
    //     if (data && data.length > 0) {
    //       this.chilrenTypes = data
    //     } else {
    //       this.chilrenTypes = []
    //     }
    //   })
    // },
    // 表单提交
    dataFormSubmit () {
      // console.log(JSON.stringify(this.dataForm))
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.submitButtonLoading = true
          this.$http({
            url: `/api/RemoteClinicDrugsBase/Save`,
            method: 'post',
            data: this.dataForm
          })
            .then(({ data }) => {
              if (data && data.status === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.submitButtonLoading = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.submitButtonLoading = false
              }
            })
            .catch(() => {
              this.submitButtonLoading = false
            })
        }
      })
    }
  }
}
</script>
