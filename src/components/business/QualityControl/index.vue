<template>
  <div>
    <div style="margin-top: 20px">
      <el-radio-group
        size="mini"
        v-model="radio"
      >
        <el-radio-button label="0">一级</el-radio-button>
        <el-radio-button label="1">二级</el-radio-button>
        <el-radio-button label="2">三级</el-radio-button>
        <el-radio-button label="3">11-13周</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 一级质控 -->
    <div
      style="width:100%;margin-top:20px;"
      v-show="radio==='0'"
    >
      <el-row :gutter="20">
        <el-col
          :key="item.bg"
          :span="8"
          class="mbt-20 mt-20"
          v-for="(item,index) in iData"
        >
          <div
            @click="showImg(item.img)"
            class="grid-content"
          >
            <span class="tag">{{(index+1)+'.'+item.Title}}</span>
            <span
              class="not-upload-tag"
              v-if="!item.img"
            >未上传(框内为模式图)</span>
            <div class="avatar-uploader">
              <div
                class="el-upload el-upload--text"
                tabindex="0"
              >
                <img
                  :src="item.ThumbnailPath"
                  alt="点击放大"
                  class="avatar"
                  v-if="item.img&&item.img!==''"
                >
                <img
                  :src="item.bg"
                  v-else
                  class="avatar"
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 二级 -->
    <div
      style="width:100%;margin-top:20px"
      v-show="radio==='1'"
    >
      <el-row :gutter="20">
        <el-col
          :key="index+'week'"
          :span="8"
          style="margin-bottom:20px"
          v-for="(item,index) in iiData"
        >
          <div
            @click="showImg(item.img)"
            class="grid-content"
          >
            <span class="tag">{{(index+1)+'.'+item.Title}}</span>
            <span
              class="not-upload-tag"
              v-if="!item.img"
            >未上传(框内为模式图)</span>

            <div class="avatar-uploader">
              <div
                class="el-upload el-upload--text"
                tabindex="0"
              >

                <img
                  :src="item.ThumbnailPath"
                  class="avatar"
                  v-if="item.img&&item.img!==''"
                >
                <img
                  :src="item.bg"
                  v-else
                  class="avatar"
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div
      style="width:100%;margin-top:20px"
      v-show="radio==='2'"
    >
      <el-row :gutter="20">
        <el-col
          :key="index+'iii'"
          :span="8"
          style="margin-bottom:20px"
          v-for="(item,index) in iiiData"
        >
          <div
            @click="showImg(item.img)"
            class="grid-content"
          >
            <span class="tag">{{(index+1)+'.'+item.Title}}</span>
            <span
              class="not-upload-tag"
              v-if="!item.img"
            >未上传(框内为模式图)</span>
            <div class="avatar-uploader">
              <div
                class="el-upload el-upload--text"
                tabindex="0"
              >

                <img
                  :src="item.ThumbnailPath"
                  class="avatar"
                  v-if="item.img&&item.img!==''"
                >
                <img
                  :src="item.bg"
                  v-else
                  class="avatar"
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div
      style="width:100%;margin-top:20px"
      v-show="radio==='3'"
    >
      <el-row :gutter="20">
        <el-col
          :key="index+'week'"
          :span="8"
          style="margin-bottom:20px"
          v-for="(item,index) in weekData"
        >
          <div
            @click="showImg(item.img)"
            class="grid-content"
          >
            <span class="tag">{{(index+1)+'.'+item.Title}}</span>
            <span
              class="not-upload-tag"
              v-if="!item.img"
            >未上传(框内为模式图)</span>
            <div class="avatar-uploader">
              <div
                class="el-upload el-upload--text"
                tabindex="0"
              >
                <img
                  :src="item.bg"
                  class="avatar"
                >
                <img
                  :src="item.ThumbnailPath"
                  class="avatar"
                  v-if="item.img&&item.img!==''"
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      style="text-align:center"
    >
      <img
        :src="imgUrl"
        alt
        style="max-width:100%"
      >
    </el-dialog>
  </div>
</template>

<script>
import { loadFileByBizTypeId } from '@/api/index'
export default {
  data () {
    return {
      radio: '0',
      ConsId: '',
      imgUrl: '',
      baseUrl: window.SITE_CONFIG['baseUrl'],
      attachmentList: [],
      dialogVisible: false,
      iData: [
        {
          Title: '脑丘水平横切面',
          TypeId: '', //
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脑丘水平横切面',
            FileTypeId: '8e664ad3-e3c3-4d35-9441-8650fa06aeb8'
          }
        },
        {
          Title: '上腹部横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '上腹部横切面',
            FileTypeId: '93163b9b-ea17-46a1-97fb-bbabdc45aec9'
          }
        },
        {
          Title: '股骨纵切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '股骨纵切面',
            FileTypeId: 'f74f55bf-e044-40fc-9ef3-c0746f1a189b'
          }
        },
        {
          Title: '宫颈内口矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '宫颈内口矢状切面',
            FileTypeId: 'f483a446-6a82-484e-834a-cdd2a85ccae1'
          }
        },
        {
          Title: '测量胎心率图(多普勒或者M型)',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '测量胎心率图(多普勒或者M型)',
            FileTypeId: '2a2bc3ba-31a0-4aa7-a8f7-ae1841c21305'
          }
        },
        {
          Title: '胎盘及羊水测量',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎盘及羊水测量',
            FileTypeId: '1eed60e1-5132-40a5-bc48-d77a2ba5309d'
          }
        }
      ],
      iiData: [
        {
          Title: '脑丘水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脑丘水平横切面',
            FileTypeId: '52FA8C50-BDF8-42CF-AA6E-1F759AA153BC'
          }
        },
        {
          Title: '小脑水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '小脑水平横切面',
            FileTypeId: 'D1FCE759-6504-40E1-9BF5-85F2E83A5AF7'
          }
        },
        {
          Title: '四腔心切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '四腔心切面',
            FileTypeId: 'F01B7981-8ADB-4B3A-A1D1-621304582A31'
          }
        },
        {
          Title: '上腹部横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '上腹部横切面',
            FileTypeId: '421CBDFD-03B9-4C7D-A0B0-C5D4E8A3AC12'
          }
        },
        {
          Title: '脐带腹壁入口处横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脐带腹壁入口处横切面',
            FileTypeId: '9441808E-8BA1-4B34-AEF1-B50DD8F2A0EC'
          }
        },
        {
          Title: '膀胱水平横切面彩色血流图',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '膀胱水平横切面彩色血流图',
            FileTypeId: '2187DF31-4703-4FE8-9E63-688A5D986F61'
          }
        },
        {
          Title: '双肾横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '双肾横切面',
            FileTypeId: '23D36EC5-19AB-4ACD-BE09-DF44AEA4D291'
          }
        },
        {
          Title: '脊柱矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脊柱矢状切面',
            FileTypeId: 'BBB824C5-3EAD-4423-A5C1-44AA4366A6BB'
          }
        },
        {
          Title: '股骨纵切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '股骨纵切面',
            FileTypeId: 'A71FCC4E-2931-4ACE-AB53-17E908E62E9D'
          }
        },

        {
          Title: '宫颈内口矢量状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '宫颈内口矢量状切面',
            FileTypeId: '04E58D30-B7C7-422A-8880-36C5ACDAE81D'
          }
        },
        {
          Title: '测量胎心率图(多普勒或M型)',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '测量胎心率图(多普勒或M型)',
            FileTypeId: '7394DA13-C1EB-469C-B73F-F1CF143EB224'
          }
        },
        {
          Title: '胎盘及羊水测量',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎盘及羊水测量',
            FileTypeId: '2903D94A-7FD1-41C0-ADB5-EB4AC898819F'
          }
        }
      ],
      iiiData: [
        {
          Title: '丘脑水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '丘脑水平横切面',
            FileTypeId: 'A1E37BE1-2E52-4A93-9BC9-CB686483C745'
          }
        },
        {
          Title: '侧脑室水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '侧脑室水平横切面',
            FileTypeId: '3D1DF071-B70B-4115-9E90-3E8888385A9D'
          }
        },
        {
          Title: '小脑水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '小脑水平横切面',
            FileTypeId: 'DA045491-4A72-4EFC-9F46-6F325C8284D0'
          }
        },
        {
          Title: '鼻唇冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '鼻唇冠状切面',
            FileTypeId: 'FFA39B9F-AF4D-4542-A8F3-7BD50C15F558'
          }
        },
        {
          Title: '双眼球水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '双眼球水平横切面',
            FileTypeId: '473B8BF7-9F70-42B0-9843-03A0C4F8AAB0'
          }
        },
        {
          Title: '颜面部正中矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '颜面部正中矢状切面',
            FileTypeId: '8EF8E113-F3AE-40D6-8CDE-13EF11A5D3DF'
          }
        },
        {
          Title: '四腔心切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '四腔心切面',
            FileTypeId: '338B56C4-AA86-4685-A3B8-7E914D4C1E03'
          }
        },
        {
          Title: '左室流出道切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '左室流出道切面',
            FileTypeId: '57B556D2-B76A-4A88-9973-C36BC22840B5'
          }
        },
        {
          Title: '右室流出道切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '右室流出道切面',
            FileTypeId: '50A32133-E868-49A9-83B3-BCB08AAB874D'
          }
        },
        {
          Title: '三血管切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '三血管切面',
            FileTypeId: '4C8CA008-8E82-4FA5-9385-5134379F94D9'
          }
        },
        {
          Title: '三血管-气管切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '三血管-气管切面',
            FileTypeId: '1F61EA89-1C22-46D7-B7DC-A33C917AC1E8'
          }
        },
        {
          Title: '测量胎心率图(多普勒或M型)',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '测量胎心率图(多普勒或M型)',
            FileTypeId: 'B2B19DEA-D992-45DB-9DC8-5299451F4979'
          }
        },
        {
          Title: '膈肌冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '膈肌冠状切面',
            FileTypeId: '623CE4AC-D777-4495-9255-B9FD6909C1D5'
          }
        },
        {
          Title: '右侧膈肌矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '右侧膈肌矢状切面',
            FileTypeId: '97DF2D3B-C948-4519-BD7C-66CF99266675'
          }
        },
        {
          Title: '左侧膈肌矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '左侧膈肌矢状切面',
            FileTypeId: 'E7BD1E35-0E6E-4B6D-B38F-D33922375F58'
          }
        },

        {
          Title: '上腹部横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '上腹部横切面',
            FileTypeId: '9DE3F80A-CF6D-4119-886A-B1C2688E371D'
          }
        },
        {
          Title: '脐带腹壁入口处横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脐带腹壁入口处横切面',
            FileTypeId: 'ADEB0CE7-AF4E-4E12-8F24-BFDB45E6CE12'
          }
        },
        {
          Title: '膀胱水平横切面彩色血液',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '膀胱水平横切面彩色血液',
            FileTypeId: '89A11326-B0C6-468F-9C60-344E77D8788B'
          }
        },
        {
          Title: '双肾横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '双肾横切面',
            FileTypeId: '1783D891-5716-43F7-8B18-EAE3541D429F'
          }
        },
        {
          Title: '双肾矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '双肾矢状切面',
            FileTypeId: '014E2C48-B7D2-4B06-95A9-6439F4626489'
          }
        },
        {
          Title: '双肾冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '双肾冠状切面',
            FileTypeId: '45330BC5-20AB-4272-9378-B75A4C0C9788'
          }
        },
        {
          Title: '脊柱矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脊柱矢状切面',
            FileTypeId: 'A4114BA9-8F9C-4176-AAAA-271E9E131B53'
          }
        },
        {
          Title: '脊柱横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脊柱横切面',
            FileTypeId: '469DD7E5-381D-41C0-8F0B-B803DF86EEB5'
          }
        },
        {
          Title: '脊柱冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '脊柱冠状切面',
            FileTypeId: '2AFFCE64-B698-4D79-817A-6D57917CE745'
          }
        },
        {
          Title: '肩胛骨水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '肩胛骨水平横切面',
            FileTypeId: '8B7C7471-8C2D-4D33-99C2-A4AC5F49E01E'
          }
        },
        {
          Title: '肱骨纵切面x2',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '肱骨纵切面x2',
            FileTypeId: '2EF365A0-C567-4747-967A-81F604F4B7C1'
          }
        },
        {
          Title: '前臂及手纵切面及前臂横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '前臂及手纵切面及前臂横切面',
            FileTypeId: 'D7943964-9669-4420-89A6-3E444583B371'
          }
        },
        {
          Title: '前臂及手冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '前臂及手冠状切面',
            FileTypeId: 'E342CC6F-EABB-4448-92B8-3E47D8BB3917'
          }
        },
        {
          Title: '手切面x2',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '手切面x2',
            FileTypeId: '81C309A4-2DBC-4507-B0D1-E70C9EEF07AA'
          }
        },
        {
          Title: '骼脊水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '骼脊水平横切面',
            FileTypeId: '20D44641-7071-41D5-905A-F3230E93284E'
          }
        },
        {
          Title: '股骨纵切面x2',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '股骨纵切面x2',
            FileTypeId: 'E4F7D1E0-A18B-4FE5-82F5-440E5A0B5D7F'
          }
        },
        {
          Title: '小腿及足纵切面小腿横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '小腿及足纵切面小腿横切面',
            FileTypeId: 'D5D8FA51-F686-4F5E-9C6E-F5BA8B71FE45'
          }
        },
        {
          Title: '小腿冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '小腿冠状切面',
            FileTypeId: '231F2567-BA2E-498C-A825-A2AE198F658B'
          }
        },
        {
          Title: '足底切面x2',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '足底切面x2',
            FileTypeId: '515F58F7-7006-4BB5-B285-54AF8C5F7548'
          }
        },
        {
          Title: '孕妇宫颈纵切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '孕妇宫颈纵切面',
            FileTypeId: '7D69AA20-F579-4273-A4F4-4430334DC03D'
          }
        },
        {
          Title: '胎盘脐带入口切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎盘脐带入口切面',
            FileTypeId: '47D01A37-15B8-4E27-B21A-38E79EC716B8'
          }
        }
      ],
      weekData: [
        {
          Title: '胎儿正中矢状切面图',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿正中矢状切面图',
            FileTypeId: 'EF6F2056-C46F-4FD5-9531-72A23949FCCD'
          }
        },
        {
          Title: '胎儿头颅及上胸部正中矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿头颅及上胸部正中矢状切面',
            FileTypeId: '1F66C7C7-6D85-4CD1-B9EE-BA5CF2480654'
          }
        },
        {
          Title: '胎儿鼻骨矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿鼻骨矢状切面',
            FileTypeId: '730D4507-A246-47E3-9722-E9C83CA46105'
          }
        },
        {
          Title: '侧脑室水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '侧脑室水平横切面',
            FileTypeId: '0E7E0F73-4D65-4747-ABC4-E4A8254533C6'
          }
        },
        {
          Title: '胎儿小脑水平横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿小脑水平横切面',
            FileTypeId: 'CE3B4BCD-115A-407A-AC90-D63B971CB343'
          }
        },
        {
          Title: '胎儿双眼球及双耳冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿双眼球及双耳冠状切面',
            FileTypeId: 'D01A8CC5-B5A0-4286-B4CF-6A2A379F289D'
          }
        },
        {
          Title: '胎儿鼻后三角冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿鼻后三角冠状切面',
            FileTypeId: 'B91D566F-8430-4ADE-88A6-CA300DC0A7AC'
          }
        },
        {
          Title: '胎儿鼻唇冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿鼻唇冠状切面',
            FileTypeId: '57479834-1AA5-42BD-ACB5-6F53934F5CCB'
          }
        },
        {
          Title: '胎儿四腔心切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿四腔心切面',
            FileTypeId: 'C9D1A04C-B386-4755-9D2B-6C40C895E877'
          }
        },
        {
          Title: '胎儿四腔心切面彩色血液',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿四腔心切面彩色血液',
            FileTypeId: 'D90F8646-E636-4349-9F30-431CE8602799'
          }
        },
        {
          Title: '胎儿三血管-气管切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿三血管-气管切面',
            FileTypeId: '43015784-E676-44A7-9A33-3D029B466461'
          }
        },
        {
          Title: '胎儿三血管-气管切面彩色血液',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿三血管-气管切面彩色血液',
            FileTypeId: '3D422753-320F-47C5-ADE1-204AB07527B0'
          }
        },
        {
          Title: '胎儿上腹部横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿上腹部横切面',
            FileTypeId: '7A39F629-8374-40D8-BB0A-BD30FC7D9644'
          }
        },
        {
          Title: '胎儿脐带腹壁插入口横切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿脐带腹壁插入口横切面',
            FileTypeId: 'D21C8FE7-C4FC-4251-8925-60BB82167621'
          }
        },
        {
          Title: '胎儿膀胱水平横切面彩色血液',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿膀胱水平横切面彩色血液',
            FileTypeId: '91149831-1AC5-4A0B-A72F-7C82A56140DF'
          }
        },
        {
          Title: '胎儿左侧膈肌矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿左侧膈肌矢状切面',
            FileTypeId: '342B958F-333A-4C61-AD9D-B30C42CF8BB5'
          }
        },
        {
          Title: '胎儿右侧膈肌矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿右侧膈肌矢状切面',
            FileTypeId: '5009B557-965E-428B-80E1-08AB5B07E01E'
          }
        },
        {
          Title: '胎儿左上肢冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿左上肢冠状切面',
            FileTypeId: '9EDE118C-4760-4727-8ED6-13A2434324F8'
          }
        },
        {
          Title: '胎儿右上肢冠状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿右上肢冠状切面',
            FileTypeId: '959F9C4A-4A48-4C1B-B306-52DC5A221303'
          }
        },
        {
          Title: '胎儿左下肢矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿左下肢矢状切面',
            FileTypeId: '1C81EFB2-3847-430C-8338-6D0137DB5FE4'
          }
        },
        {
          Title: '胎儿右下肢矢状切面',
          TypeId: '',
          FileTypeInfo: {
            tableId: this.$route.query.id ? this.$route.query.id : '0',
            FileType: '胎儿右下肢矢状切面',
            FileTypeId: 'F681882D-8329-4D6B-85DF-F809A8FA996E'
          }
        }
      ]
    }
  },
  mounted () {
    const that = this
    this.initBg()
    if (this.$route.params.ID !== '0') {
      loadFileByBizTypeId(this.$route.params.ID).then(res => {
        console.log('图片', res.data)
        let list = res.data.data
        list.forEach(item => {
          this.iData.find((i, index) => {
            if (i.FileTypeInfo.FileTypeId === item.FileTypeId) {
              this.$set(this.iData[index], 'img', this.baseUrl + item.Path)
              this.$set(this.iData[index], 'ThumbnailPath', this.baseUrl + item.ThumbnailPath)
            }
          })
          this.iiData.find((i, index) => {
            if (i.FileTypeInfo.FileTypeId === item.FileTypeId) {
              this.$set(this.iiData[index], 'img', this.baseUrl + item.Path)
              this.$set(this.iiData[index], 'ThumbnailPath', this.baseUrl + item.ThumbnailPath)
            }
          })
          this.iiiData.find((i, index) => {
            if (i.FileTypeInfo.FileTypeId === item.FileTypeId) {
              that.$set(that.iiiData[index], 'img', that.baseUrl + item.Path)
              that.$set(that.iiiData[index], 'ThumbnailPath', that.baseUrl + item.ThumbnailPath)
            }
          })
          this.weekData.find((i, index) => {
            if (i.FileTypeInfo.FileTypeId === item.FileTypeId) {
              this.$set(this.weekData[index], 'img', this.baseUrl + item.Path)
              this.$set(this.weekData[index], 'ThumbnailPath', this.baseUrl + item.ThumbnailPath)
            }
          })
        })
        console.log(this.iData)
      })
    }
  },
  methods: {
    addAttachmentList (val) {
      // 如果数组里存在这个类型的文件就替换，不然就直接新增
      let itemIndex
      let length = this.attachmentList.find((item, index) => {
        if (item.FileTypeId === val.FileTypeId) {
          itemIndex = index
        }
      })
      if (length) {
        this.attachmentList[itemIndex] = length
      } else {
        this.attachmentList.push({ Id: val.Id, FileTypeId: val.FileTypeId })
      }
    },
    showImg (src, isImg) {
      if (src && src !== '') {
        this.dialogVisible = true
        this.imgUrl = src
      }
    },
    initBg () {
      let iiiArr = []
      let iiArr = []
      let iArr = []
      let weekArr = []

      this.iData.forEach((item, i) => {
        item['bg'] = require(`@/assets/img/i/i_${i + 1}.png`)
        iArr.push(item)
      })
      this.iiiData.forEach((item, i) => {
        if (i >= 9) {
          item['bg'] = require(`@/assets/img/iii/iii_${i + 1}.png`)
        } else {
          item['bg'] = require(`@/assets/img/iii/iii_0${i + 1}.png`)
        }
        iiiArr.push(item)
      })
      this.iiData.forEach((item, i) => {
        if (i >= 9) {
          item['bg'] = require(`@/assets/img/ii/ii_${i + 1}.png`)
        } else {
          item['bg'] = require(`@/assets/img/ii/ii_0${i + 1}.png`)
        }
        iiArr.push(item)
      })

      this.weekData.forEach((item, i) => {
        if (i >= 9) {
          item['bg'] = require(`@/assets/img/week/week_${i + 1}.png`)
        } else {
          item['bg'] = require(`@/assets/img/week/week_0${i + 1}.png`)
        }
        weekArr.push(item)
      })

      this.iiiData = iiiArr
      this.iiData = iiArr
      this.iData = iArr
      this.weekData = weekArr
    }
  }
}
</script>

<style lang="scss" scope>
.grid-content {
  height: 200px;
  position: relative;
  .tag {
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: inline-block;
    padding: 2px 5px;
    z-index: 5;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }
  .not-upload-tag {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: inline-block;
    padding: 2px 5px;
    z-index: 5;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }
}
.mbt-20 {
  margin-bottom: 20px;
}
.mt-20 {
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;

  line-height: 178px;
  text-align: center;
}
.avatar {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
}
</style>
