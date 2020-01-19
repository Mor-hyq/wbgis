<template>
  <div class="def-error">
    <el-dialog
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="modal"
      top="10vh"
      custom-class="choose-dialog_wrapper"
      title="素材库"
      width="1090px"
      style="text-align:left;"
      @close="hideDialog"
    >
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px" style="padding:0 20px;">
        <el-form-item>
          <el-date-picker
            v-model="searchForm.year"
            type="year"
            placeholder="年份"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchForm.month"
            type="month"
            placeholder="月份"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="submitForm('searchForm')">搜索</el-button>
        </el-form-item>
        <el-button class="float-right" type="primary">上传图片</el-button>
      </el-form>
      <ul id="previewimages" class="list">
        <li v-for="(item, index) in mockImageList" :key="item.id" class="item">
          <div class="box">
            <div class="top">
              <!-- <img :src="item[campareItem]" class="img-bg"> -->
              <!-- <img v-lazy="{'src':item[campareItem],'error':iconVideo}" class="img-bg"> -->
              <el-image
                class="img-bg"
                fit="contain"
                :src="item[campareItem]"
              />
            </div>
            <div class="bottom">{{ item.name }}</div>
            <div :class="{'slct-box': item.selected}" class="tool-box">
              <div class="tool-top">
                <div class="preview-btn">
                  <!-- 通过img标签触发viewerjs的图片预览功能 -->
                  <img :src="item[campareItem]" :data-original-src="item[campareItem]" class="icon-img">
                  <!-- <i class="icon el-icon-search" @click="preview(index, item)" /> -->
                  <i class="icon el-icon-search" />
                  <p>查看</p>
                </div>
                <div class="slct">
                  <i class="icon el-icon-circle-check" @click="selected(index,item)" />
                  <p>选择</p>
                </div>
                <div>
                  <i class="icon el-icon-delete" @click="deleteItem(index, item)" />
                  <p>删除</p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <pagination v-show="total>0" class="pagination2" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      <div v-if="multiple" slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="multipleSelectComfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'ImageLibrary',
  components: {

  },
  props: {
    multiple: {
      type: Boolean, // 是否可以多选图片
      default: false
    },
    selectedImages: { // 已选中的图片
      type: [Array],
      default: () => []
    },
    modal: {
      type: Boolean, // 是否需要背景框
      default: true
    },
    listUrl: { // 列表接口地址
      type: String,
      default: ''
    },
    uploadUrl: { // 上传接口地址
      type: String,
      default: ''
    },
    campareItem: { // 进行选中判断的字段名称
      type: String,
      default: 'url'
    }
  },
  data() {
    return {
    //   iconVideo: require('@/assets/images/icon-nopic.png'),
      iconVideo: '',
      total: 400,
      listQuery: {
        limit: 10,
        page: 1
      },
      visible: false,
      searchForm: {
        year: '',
        month: ''
      },
      mockImageList: [
        {
          id: 1,
          url: 'https://static.woxiugonghui.com/attachment/images/test/2019/08/GqZ5A58j7q6tL668y6oH8H0V7659t5.jpg',
          name: 'PMZFS-013.jpg',
          time: '2019-03-20 12:00'
        },
        {
          id: 2,
          url: 'https://static.woxiugonghui.com/attachment/images/test/2019/06/S8H6RVrvGGr5e38LJIiLIU3b8GSBJH.jpg',
          name: 'PMZFS-013.jpg',
          time: '2019-03-20 12:00'
        },
        {
          id: 3,
          url: 'https://static.woxiugonghui.com/attachment/images/test/2019/07/AspxSX3HAjxsSSgJ4fP44VF99a6F96.jpg',
          name: '长图文',
          time: '2019-08-01 13:00'
        }
      ],
      selectedList: [],
      imgViewer: ''
    }
  },
  computed: {
    previewList() { // 预览图片时的列表
      return this.mockImageList.map(v => v[this.campareItem])
    }
  },
  methods: {
    showDialog() {
      this.visible = true
      this.initSelectedList()
      this.$nextTick(() => {
        if (!this.imgViewer) {
          const viewer = new Viewer(document.getElementById('previewimages'), {
            url: 'data-original-src',
            movable: false
          })
          this.imgViewer = viewer
          this.$once('hook:beforeDestroy', function() {
            viewer.destroy()
          })
        }
      })
    },
    hideDialog() {
      this.visible = false
      this.selectedList = []
      this.mockImageList.forEach(v => {
        if (v.selected) {
          v.selected = false
        }
      })
    },
    handleCurrentChange(val) {
      if (val.page % 2) {
        setTimeout(() => {
          this.mockImageList = [
            {
              id: 4,
              url: 'https://static.woxiugonghui.com/attachment/images/test/2019/06/S8H6RVrvGGr5e38LJIiLIU3b8GSBJH.jpg',
              name: 'PMZFS-013.jpg',
              time: '2019-03-20 12:00'
            },
            {
              id: 5,
              url: 'https://static.woxiugonghui.com/attachment/images/test/2019/08/GqZ5A58j7q6tL668y6oH8H0V7659t5.jpg',
              name: 'PMZFS-013.jpg',
              time: '2019-03-20 12:00'
            }
          ]
          this.$nextTick(() => {
            this.imgViewer.update()
          })
        }, 300)
      } else {
        setTimeout(() => {
          this.mockImageList = [
            {
              id: 6,
              url: 'https://static.woxiugonghui.com/attachment/images/test/2019/08/GqZ5A58j7q6tL668y6oH8H0V7659t5.jpg',
              name: 'PMZFS-013.jpg',
              time: '2019-03-20 12:00'
            },
            {
              id: 7,
              url: 'https://static.woxiugonghui.com/attachment/images/test/2019/06/TupbKP1d1Bp7dBMqIB3d9ubqDpBQd1.jpg',
              name: 'PMZFS-013.jpg',
              time: '2019-03-20 12:00'
            }

          ]
          this.$nextTick(() => {
            this.imgViewer.update()
          })
        })
      }
      //   console.log(this.mockImageList)
      this.listQuery.page = val.page
      this.listQuery.limit = val.limit
    //   this.setImageSelection()
    },
    preview(idx, item) {
      // 调用图片预览
    //   this.$imagePreview({
    //     images: this.previewList,
    //     index: idx
    //   })
    },
    selected(idx, item) {
      // 多选图片
      if (this.multiple) {
        this.$set(this.mockImageList[idx], 'selected', !this.mockImageList[idx].selected)
        this.multipleSelect(item)
      } else {
        // 单选时直接传递数据
        this.$emit('confirm', [item])
        this.hideDialog()
      }
    },
    multipleSelect(item) {
      const findIndex = this.selectedList.findIndex(v => item[this.campareItem] === v[this.campareItem])
      if (findIndex < 0) {
        this.selectedList.push(item)
      } else {
        this.selectedList.splice(findIndex, 1)
      }
    },
    multipleSelectComfirm() {
      // 多选时点击确定按钮传递数据
      this.$emit('confirm', this.selectedList)
      this.hideDialog()
    },
    deleteItem(idx, item) {
      this.$confirm('确定要删除该图片吗？', '删除图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {

        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      })
    },
    initSelectedList() {
      // 初始化设置selected列表
    //   this.selectedList = this.selectedImages.map(v => ({ [this.campareItem]: v }))
    //   this.setImageSelection()
      this.selectedList = []
    },
    // setImageSelection() {
    //   // 设置图片为已选状态
    //   this.selectedList.forEach((item) => {
    //     const idx = this.mockImageList.findIndex(v => item[this.campareItem] === v[this.campareItem])
    //     if (idx >= 0) {
    //       this.$set(this.mockImageList[idx], 'selected', true)
    //     }
    //   })
    // },
    // setSelectdList(item) {
    //   // 判断选中的图片是否在已选列表中 不在则将已选中的图片放入已选列表中
    //   const findIndex = this.selectedList.findIndex(v => item.id === v.id)
    //   if (findIndex < 0) {
    //     this.selectedList.push(item)
    //   }
    // },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            message: '搜索成功',
            type: 'success'
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
    /deep/.choose-dialog_wrapper .el-dialog__body {
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
    }
}

.list {
    display: flex;
    flex-wrap: wrap;
    max-height: 570px;
    overflow-y: auto;
    padding: 0 15px;
    margin: 10px 0;
    .item {
        flex: 0 0 260px;
        padding: 10px;
        cursor: pointer;
        list-style: none;
        .box {
            position: relative;
            width: 100%;
            height: 170px;
            border: 1px solid #ddd;
            &:hover {
                .tool-box {
                    display: block;
                }
            }
            .top {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 5;
                overflow: hidden;
                .img-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    &[lazy=error] {
                        object-fit: scale-down;
                        top: -5%;
                    }
                }
                .icon-video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    // background: url('../../assets/images/icon-video.png') center  no-repeat;
                }

            }
            .bottom {
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 10;
                width: 100%;
                line-height: 34px;
                padding: 0 10px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                background-color: rgba(0, 0, 0, 0.5);
                color: #fff;
                font-size: 16px;
            }
            .tool-box {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 15;
                background-color: rgba(0, 0, 0, 0.5);
                &.slct-box {
                  display: block;
                  .slct {
                          color: #67c23a;
                        }
                }
                .tool-top {
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 5;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    div {
                        color: #fff;
                        text-align: center;
                        &:hover {
                            color: #409EFF;
                        }
                        p {
                            display: block;
                            font-size: 14px;
                            margin: 0;
                        }
                    }
                    .preview-btn {
                        position: relative;
                        .icon-img {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 1;
                            opacity: 0;
                        }
                    }
                }
                .icon {
                    height: 40px;
                    padding: 8px;
                    line-height: 24px;
                    font-size: 20px;
                }
            }
        }
    }
}
.def-error /deep/ .el-form-item .el-input__inner {
  border-color: #DCDFE6;
}
.def-error /deep/ .el-form-item.is-success .el-input__inner {
  border-color: #67C23A;
}
.def-error /deep/ .el-form-item.is-error .el-input__inner {
  border-color: #f56c6c;
}
// .pagination2 /deep/ .el-input__inner {
//   border-color: #DCDFE6;
// }
// .pagination2 /deep/ .el-input__inner:focus {
//   border-color: #409EFF;
// }
</style>
