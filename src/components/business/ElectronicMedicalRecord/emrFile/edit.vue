<template>
  <div>
    <!-- <el-button type="text" @click="outerVisible = true">点击打开外层 Dialog</el-button> -->

    <el-dialog :append-to-body="true" title="上传病历文件" :visible.sync="outerVisible" left :before-close="FalshPage">
      <div>
      <el-row>
            <el-col :span="6" v-for="(item,index) in recordType" :key="index" style="text-align: left">
              <div>
                <el-button
                  type="primary"
                  @click="toAddRecord(item)"
                  style="margin: 10px;width:150px"
                >{{ item.name }}</el-button>
              </div>
            </el-col>
          </el-row>
          </div>
      <!-- <el-dialog width="30%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body></el-dialog> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="FalshPage">取 消</el-button>
        <!-- <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button> -->
      </div>
    </el-dialog>
  <addFile ref='Add' v-if="insideVisble"></addFile>
  </div>
</template>

<script>
import addFile from './addfile.vue'
export default {
  props: ['p_sn', 'patientID'],
  data () {
    return {
      recordType: '',
      outerVisible: false,
      insideVisble: false
      // innerVisible: false
    }
  },
  components: {
    addFile
  },
  methods: {
    showDialog () {
      this.outerVisible = true
      this.insideVisble = true
      console.log(this.patientID)
      this.getTypeOfRecord()
    },
    // 获取所有可以添加的病历类型
    getTypeOfRecord () {
      this.$http({
        url: '/api/Progress/GetlistUse',
        methods: 'GET',
        params: {
          patientID: this.patientID,
          vistSn: this.p_sn
        }
      }).then(({ data }) => {
        // console.log(data)
        this.recordType = data.pageList
      })
    },
    async toAddRecord (item) {
      this.insideVisble = true
      setTimeout(() => {
        this.$refs.Add.showAdd(item, this.p_sn, this.patientID)
      }, 100)
    },
    FalshPage () {
      this.outerVisible = false
    },
    ChangeInsiteStatus () {
      this.insideVisble = false
    }
  }
}
</script>