<template>
  <div class="custom_style" style="height: 100%">
    <el-container style="height: 100%">
      <!-- 侧边导航栏 -->
      <el-card
        :style="{
          height: screenHeight - 20 + 'px',
          margin: '10px auto',
          width: '280px',
        }"
        v-if="MenuData.length !== 0"
      >
        <!-- 导航栏数据 -->
        <div :style="{ height: screenHeight - 70 + 'px' }" v-if="isCollapse">
          <h2 class="allFile" style="text-align: center;margin-bottom: 10px">
            <span
              :class="HeaderHightLine ? 'hightLine' : 'none-hightLine'"
              @click="handleHeaderFile"
              ><span>全部文件</span>
            </span>
          </h2>
          <el-scrollbar style="height: 98%">
            <div class="treeStyle">
              <el-tree
                :data="MenuData"
                empty-text=""
                :props="defaultProps"
                text-color="black"
                @node-click="handleNodeClick"
                node-key="menuCode"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <!-- 菜单名称图标 -->
                  <span
                    :class="node.isCurrent ? 'hightLine' : 'none-hightLine'"
                  >
                    <i
                      :class="
                        data.children.length == 0
                          ? 'el-icon-folder'
                          : 'el-icon-folder-opened'
                      "
                    ></i>
                    <span :title="data.menuName">{{ data.menuName }}</span>
                  </span>
                  <!-- 菜单按钮 -->
                  <!-- <span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => reMenuName(data)">
                      <i class="el-icon-edit-outline"></i>
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => menuRemove(data)">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </span> -->
                </span>
              </el-tree>
            </div>
          </el-scrollbar>
          <!-- <div class="addButton">
            <el-button type="primary" style="width:100%" @click="addMenu"><i class="el-icon-circle-plus-outline"></i><span/>添加目录</el-button>
          </div> -->
        </div>
      </el-card>

      <!-- 中心部位 -->
      <el-container :style="{ height: screenHeight - 10 + 'px' }">
        <!-- 头部 -->
        <el-header>
          <el-card class="header">
            <div class="allButton">
              <!-- 上传、预览、分享、下载按钮 -->
              <!-- <el-button
                type="primary"
                @click="disUp">
                  上传文件
                </el-button> -->
              <el-button type="primary" @click="downloadMoreFile">
                <i class="el-icon-download">批量下载</i>
              </el-button>
              <!-- <div class="flexButton" v-if="buttonControl">
                <el-button
                  type="danger"
                  @click="moreDelete">
                  批量删除
                </el-button>
                <el-button
                  type="primary"
                  @click="downloadMoreFile">
                  批量下载
                </el-button>
                <el-button
                type="primary"
                @click="removeMoreFile">批量移动</el-button>
              </div> -->
              <div class="groupButton">
                <el-input
                  style="width:300px"
                  v-model="fileName"
                  placeholder="请输入文件名称"
                  clearable
                  ><i slot="prefix" class="el-input__icon el-icon-search"></i
                ></el-input>
                <el-button
                  @click="screachName"
                  type="primary"
                  style="margin-left: 5px;margin-right: 5px"
                  icon="el-icon-search"
                  >搜索</el-button
                >
                <!-- 可放图标 -->

                <el-radio-group @change="changeIcon" v-model="radio1">
                  <el-radio-button label="1"
                    ><i class="el-icon-s-fold"></i
                  ></el-radio-button>
                  <el-radio-button label="2"
                    ><i class="el-icon-menu"></i
                  ></el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-card>
        </el-header>
        <!-- 内容 -->
        <el-main style="heighy:100%">
          <el-card class="mainTable">
            <!-- 列表形式 -->
            <el-scrollbar class="tablescrollbar" style="height: 100%">
              <div v-if="tableFlag" style="height:100%;">
                <el-table
                  stripe
                  :data="fileData"
                  ref="multipleTable"
                  empty-text="无文件"
                  :cell-style="rowClass"
                  :header-cell-style="headClass"
                  @select="handleSelection"
                  @select-all="handleSelectAll"
                  @row-click="handleRowClick"
                  :max-height="screenHeight - 200"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column
                    label="文件名称"
                    width="200px"
                    show-overflow-tooltip
                    prop="fileName"
                  >
                    <template slot-scope="scope">
                      <el-popover
                        placement="bottom"
                        width="200"
                        trigger="hover"
                        v-if="scope.row.fileRemark"
                        :content="scope.row.fileRemark"
                      >
                        <span slot="reference">{{ scope.row.fileName }}</span>
                      </el-popover>
                      <span v-else>{{ scope.row.fileName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="getMenuCode === 'str'"
                    show-overflow-tooltip
                    label="分类"
                    align="center"
                    prop="menuCode"
                  >
                    <template slot-scope="scope">
                      {{ getMenuName(scope.row.menuCode) }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="200px"
                    label="更新时间"
                    align="center"
                    prop="lastDt"
                  >
                  </el-table-column>
                  <el-table-column label="大小" align="center" prop="fileSize">
                    <template slot-scope="scope">
                      {{ scope.row.fileSize }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    align="center"
                    width="200px"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <!-- <el-button type="primary" size="mini" @click="handleRemove(scope.row)">移动到</el-button> -->
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleDownload(scope.row)"
                        ><i class="el-icon-download">下载</i></el-button
                      >
                      <!-- <el-button type="success" size="mini" @click="handleReName(scope.row)"><i class="el-icon-edit-outline"></i>查看详情</el-button>
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)"><i class="el-icon-delete"></i>删除</el-button> -->
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- 图标形式 -->
              <div v-if="imageFlag" class="iconHieght">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
                <el-checkbox-group
                  v-model="fileImgSelect"
                  @change="handleCheckedChange"
                >
                  <el-checkbox
                    style="text-align: center"
                    v-for="city in fileData"
                    :label="city.fileId"
                    :key="city.fileId"
                  >
                    <el-card
                      :class="
                        handleChecked(city.fileId) ? 'chckedOn' : 'chckedFalse'
                      "
                    >
                      <img
                        :src="
                          require('@/assets/file_images/' +
                            getImage(city.filePath) +
                            '.png')
                        "
                        width="50px"
                        height="50px"
                      /><br />
                      <span class="fileNameIcon">
                        {{ city.fileName }}
                      </span>
                    </el-card>
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <!-- 分页组件 -->
              <div class="block">
                <el-pagination
                  @size-change="handleSizeChange"
                  style="position:relative;text-align: right;bottom:0;margin: 20px auto"
                  @current-change="handleCurrentChange"
                  :current-page.sync="file.page.pageNumber"
                  :page-size="file.page.pageSize"
                  :page-sizes="pageSizes"
                  layout="total,sizes, prev, pager, next"
                  :total="total"
                >
                </el-pagination>
              </div>
            </el-scrollbar>
          </el-card>
        </el-main>
      </el-container>
    </el-container>

    <!-- 打开重命名对话框 -->
    <el-dialog :visible.sync="reName" width="30%" :before-close="handleClose">
      <el-form ref="ruleForm" :rules="rules" :model="form">
        <span class="allSize">文件名</span>
        <el-form-item v-if="form.fileType" prop="fileName">
          <el-input v-model.trim="form.fileName"></el-input>
        </el-form-item>
        <span class="allSize">文件简介描述</span>
        <el-form-item v-if="form.fileType">
          <el-input
            type="textarea"
            :rows="2"
            autosize
            maxlength="200"
            show-word-limit
            placeholder="请输入描述内容"
            v-model="form.fileRemark"
          >
          </el-input>
        </el-form-item>
        <span v-if="form.menuStatus" class="allSize">菜单名</span>
        <el-form-item v-if="form.menuStatus" prop="menuName">
          <el-input v-model.trim="form.menuName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="notReName()">取 消</el-button>
        <el-button type="primary" @click="onSubmit('ruleForm')"
          >修 改</el-button
        >
      </span>
    </el-dialog>

    <!-- 打开修改菜单对话框 -->
    <el-dialog
      :visible.sync="isMenuName"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="ruleMenuForm" :rules="rules" :model="form">
        <span class="allSize">菜单名</span>
        <el-form-item prop="menuName">
          <el-input v-model.trim="form.menuName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="notReName()">取 消</el-button>
        <el-button type="primary" @click="onSubmit('ruleMenuForm')"
          >修 改</el-button
        >
      </span>
    </el-dialog>

    <!-- 打开移动文件夹对话框 -->
    <el-dialog :visible.sync="remove" width="30%" :before-close="handleClose">
      <el-form ref="ruleForm" :rules="rules" :model="form">
        <span class="allSize">选择目录:</span>
        <el-form-item prop="menuCode">
          <el-cascader
            style="width: 100%"
            v-model="form.menuCode"
            :options="MenuOptions"
            :show-all-levels="false"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              value: 'menuCode',
              label: 'menuName',
            }"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.menuName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleNotRemove()">取 消</el-button>
        <el-button type="primary" @click="onSubmit('ruleForm')"
          >修 改</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 下载文件
import { downloadFile, objDeepCopy } from '@/utils/index'

export default {
  data() {
    return {
      screenHeight: document.body.clientHeight,
      isCollapse: true,
      // 列表图标显示控件标识符
      radio1: 1,
      tableFlag: true, //  表格flag
      imageFlag: false, //  图标flag
      // 菜单数据--树形结构
      MenuData: [],
      MenuOptions: [], // 选择项
      // 获取列表结构菜单
      getMenu: [],
      HeaderHightLine: false,
      getNode: null,
      // 菜单默认数据
      menu: {
        code: 0,
      },
      getMenuCode: 0, // 保存菜单id
      // 文件数据
      fileData: [],
      fileImgSelect: [],
      // 文件默认数据
      file: {
        condition: {
          fileStatus: 'E', //必选，状态：E-有效、F-删除
          fileType: 'F', //必选，类型(F-附件下载，P-普通附件)
        }, //  条件查询，可为空,键值对实体
        rule: {},
        page: {
          pageNumber: 1, //必选，页码
          pageSize: 10, //必选，每页的数量
          direction: 'DESC', //排序规则，ASC为升序，DESC为降序
          property: 'fileId', //根据该字段排序
        },
      },
      fileName: '', //   查询文件名字
      defaultProps: {
        children: 'children',
        lable: 'menuName',
      },
      total: 0, //  文件数量
      disAdd: false, //  添加目录对话框
      remove: false, // 移动文件夹对话框
      isMenuName: false,
      isUp: false, //  上传文件对话框
      isPriview: false, //  预览对话框
      multipleSelection: [], //  图标数组
      buttonControl: false, //  组件隐藏flag
      // 重命名组件
      reName: false,
      reNameCount: false,
      pageSizes: [10, 20, 50, 100],
      form: {}, // 提交重命名表单
      // 提交规则
      rules: {
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
        ],
        menuName: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
        ],
        menuCode: [
          { required: true, message: '请选择文件夹', trigger: 'change' },
        ],
      },
      isIndeterminate: false, // 全选复选框状态判断
      checkAll: false, // 全选复选框状态判断
    }
  },
  watch: {
    multipleSelection: function(newVal, oldVal) {
      console.log(newVal)
      if (newVal.length === 0) {
        this.buttonControl = false
      } else {
        this.isIndeterminate =
          newVal.length > 0 && newVal.length < this.fileData.length
        this.buttonControl = true
      }
    },
    MenuData: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
      },
      deep: true,
    },
    getNode: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
      },
    },
  },
  created() {
    this.handleHeaderFile()
    this.getMenuAll()
    this.getAll()
  },
  mounted() {
    // 控制高度自适应
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }
  },
  methods: {
    //控制浏览器显示的高宽
    document_loaded() {
      // GotoMainStep(0);
      var WH = document.body.clientHeight
      console.log(document.getElementById('getTreeHeight'))
      document.getElementById('getTreeHeight').style.height = WH - 10 + 'px'
      var WW = (document.body.scrollWidth * 3) / 4
      console.log(WH)
      document.getElementById('aisdeTree').style.height = WH + 'px'
      document.getElementById('aisdeTree').style.width = 280 + 'px'
    },
    // 打开添加目录对话框
    addMenu() {
      this.disAdd = true
    },
    // 打开上传文件对话框
    disUp() {
      this.isUp = true
    },
    // 根据选中状态修改样式
    handleChecked(val) {
      let get = this.fileImgSelect.some((item) => {
        return item === val
      })
      return get
    },
    // 表头样式
    headClass() {
      return 'background:#eef1f6;'
    },
    // 表格样式设置
    rowClass() {
      return 'font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;color: #989ca5;font-weight: 700;'
    },
    // 插槽按钮调用前事件
    beforeHandleButton() {
      this.multipleSelection = []
      this.toggleSelection(this.multipleSelection)
    },
    // 获取菜单目录名
    getMenuName(row) {
      // 返回菜单名
      let name
      // 如果菜单Code不为null则显示目录名字，否则为“/”
      // 过滤数组，查找对面菜单
      let AllMenu = this.getMenu.filter((item) => {
        return item.menuCode === row
      })
      if (AllMenu.length > 0) {
        name = AllMenu[0].menuName
      } else {
        name = ''
      }
      return name
    },

    // 关闭前提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.form = { menuCode: 'str' }
          done()
        })
        .catch((_) => {})
    },
    // 模糊查询文件名字
    screachName() {
      this.file.condition.fileName = this.fileName
      this.file.rule.fileName = 'like'
      this.getAllFile()
    },
    // 移动文件夹--文件移动处理
    handleRemove(val) {
      this.beforeHandleButton()
      this.form.list = this.multipleSelection
      this.remove = true
      this.MenuOptions = []
      this.MenuOptions.push({
        menuCode: 'str', //主键
        menuName: '无', //菜单名称
        children: [],
      })
      this.form.menuCode = this.MenuOptions[0].menuCode
      this.MenuData.forEach((item) => {
        this.MenuOptions.push(item)
      })
    },
    // 取消移动文件夹
    handleNotRemove() {
      this.remove = false
      this.form = { menuCode: 'str' }
    },
    // 修改文件夹名字--菜单
    reMenuName(data) {
      this.form = JSON.parse(JSON.stringify(data))
      this.isMenuName = true
    },
    // 取消修改文件名字
    notReName() {
      this.reName = false
      this.form = { menuCode: 'str' }
    },
    // 取消修改文件夹名字--菜单
    notReName() {
      this.isMenuName = false
      this.form = { menuCode: 'str' }
    },
    // 删除菜单
    menuRemove(data) {
      this.$confirm('将删除这个菜单，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$api.fileMenu.deletMenuInfo(data.menuCode).then((res) => {
            if (res.code === 0) {
              this.$message({ message: '删除成功', type: 'success' })
              this.getNode = null
              this.handleHeaderFile()
              this.getMenuAll()
              this.getAll()
            }
          })
        })
        .catch((err) => {
          this.$message('已取消删除')
        })
    },

    // 获取对应菜单数据--树形结构
    handleNodeClick(data, node) {
      this.getNode = node
      this.isIndeterminate = false
      this.checkAll = false
      this.file = {
        condition: {
          fileStatus: 'E', //必选，状态：E-有效、F-删除
          fileType: 'F', //必选，类型(F-附件下载，P-普通附件)
        }, //  条件查询，可为空,键值对实体
        rule: {},
        page: {
          pageNumber: 1, //必选，页码
          pageSize: 10, //必选，每页的数量
          direction: 'DESC', //排序规则，ASC为升序，DESC为降序
          property: 'fileId', //根据该字段排序
        },
      }
      this.multipleSelection = []
      this.fileImgSelect = []
      this.file.condition.menuCode = data.menuCode
      this.getMenuCode = data.menuCode
      // 被点击时 全部文件暗下
      this.HeaderHightLine = false
      this.getAllFile()
    },
    // 点击全部文件
    handleHeaderFile() {
      this.isIndeterminate = false
      this.checkAll = false
      this.file = {
        condition: {
          fileStatus: 'E', //必选，状态：E-有效、F-删除
          fileType: 'F', //必选，类型(F-附件下载，P-普通附件)
        }, //  条件查询，可为空,键值对实体
        rule: {},
        page: {
          pageNumber: 1, //必选，页码
          pageSize: 10, //必选，每页的数量
          direction: 'DESC', //排序规则，ASC为升序，DESC为降序
          property: 'fileId', //根据该字段排序
        },
      }
      this.multipleSelection = []
      this.fileImgSelect = []
      // 被点击时 全部文件高亮
      if (this.getNode) {
        this.getNode.isCurrent = false
        this.getNode = null
      }
      this.getMenuCode = 'str'
      this.HeaderHightLine = true
      this.getAllFile()
    },

    // 表格重命名
    handleReName(val) {
      this.beforeHandleButton()
      this.form = JSON.parse(JSON.stringify(val))
      this.reName = true
    },
    // 图标全选
    handleCheckAllChange(val) {
      var get = this.fileData.map((item) => {
        return item.fileId
      })
      this.fileImgSelect = val ? get : []
      let getFile = get.map((item) => {
        let getVal = this.fileData.find((val) => {
          return val.fileId === item
        })
        return getVal
      })
      if (val) {
        this.multipleSelection = getFile
      } else {
        this.multipleSelection = []
      }

      this.isIndeterminate = false
    },
    // 勾选图标
    handleCheckedChange(value) {
      let get = this.fileImgSelect.map((item) => {
        let getVal = this.fileData.find((val) => {
          return val.fileId === item
        })
        return getVal
      })
      this.multipleSelection = get
      let checkedCount = value.length
      this.checkAll = checkedCount === this.fileData.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.fileData.length
    },
    // 获取勾选数组
    handleSelection(val) {
      this.multipleSelection = val
    },
    // 获取所有勾选
    handleSelectAll(val) {
      if (val.length > 0) {
        this.multipleSelection = val
      } else {
        this.multipleSelection = []
      }
    },
    // 勾选当前行
    handleRowClick(row) {
      this.$refs.multipleTable.clearSelection()
      let getIndex = 0
      var a = this.multipleSelection.some((item, index) => {
        getIndex = index
        return item.fileId === row.fileId
      })

      let go = this.multipleSelection
      if (!a) {
        go.push(row)
      } else {
        go.splice(getIndex, 1)
      }
      this.multipleSelection = go
      this.toggleSelection(this.multipleSelection)
    },
    // 当前行勾选渲染
    toggleSelection(rows) {
      if (rows.length !== 0) {
        this.$nextTick(() => {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        })
      } else {
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection()
        })
      }
    },
    // 改变列表显示还是图标显示
    changeIcon(val) {
      // 列表显示
      if (val === '1') {
        this.tableFlag = true
        this.imageFlag = false
        let get = this.fileImgSelect.map((item) => {
          let getVal = this.fileData.find((val) => {
            return val.fileId === item
          })
          return getVal
        })
        this.multipleSelection = get
        this.toggleSelection(this.multipleSelection)
        // 图标显示
      } else {
        this.tableFlag = false
        this.imageFlag = true
        let get = this.multipleSelection.map((item) => {
          return item.fileId
        })
        this.fileImgSelect = get
        this.handleCheckedChange(get)
      }
    },

    // 图片依赖加载(设置图片格式)
    getImage(img) {
      // 后缀获取
      var suffix = ''
      // 获取类型结果
      var result = ''
      try {
        var fileArr = img.split('.')
        suffix = fileArr[fileArr.length - 1]
      } catch (err) {
        suffix = ''
      }
      // img无后缀返回false
      if (!suffix) {
        result = false
        return result
      }
      // 图片格式
      var imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
      // 进行图片匹配
      result = imgList.some((item) => {
        return item === suffix
      })

      if (result) {
        result = 'jpg'
        return result
      }
      // txt文件格式
      var txtList = ['txt']
      result = txtList.some((item) => {
        return item === suffix
      })
      if (result) {
        result = 'txt'
        return result
      }
      // word文件格式
      var wordList = ['doc', 'docx']
      result = wordList.some((item) => {
        return item === suffix
      })
      if (result) {
        result = 'word'
        return result
      }
      // excel文件格式
      var excelList = ['xls', 'xlsx']
      result = excelList.some((item) => {
        return item === suffix
      })
      if (result) {
        result = 'xls'
        return result
      }

      // ppt文件格式
      var pptList = ['ppt', 'pptx', 'pps', 'ppsx', 'ppa', 'ppam', 'pot', 'potx']
      result = pptList.some((item) => {
        return item === suffix
      })
      if (result) {
        result = 'ppt'
        return result
      }

      // pdf文件格式
      var pdfList = ['pdf']
      result = pdfList.some((item) => {
        return item === suffix
      })
      if (result) {
        result = 'pdf'
        return result
      }
      // 视频格式
      var videoList = [
        'avi',
        'mov',
        'qt',
        'asf',
        'mp4',
        'rmvb',
        'rm',
        'divx',
        'mpg',
        'mpeg',
        'mpe',
        'wmv',
        'mkv',
        'vob',
      ]
      result = videoList.some((item) => {
        return item === suffix
      })
      if (result) {
        result = 'video'
        return result
      }

      // 压缩包格式
      var zipList = ['zip']
      result = zipList.some((item) => {
        return item === suffix
      })
      if (result) {
        result = 'zip'
        return result
      } else {
        result = 'white'
        return result
      }
    },
    // 分页控制方法
    handleSizeChange(val) {
      this.file.page.pageSize = val
      this.getAllFile()
    },
    handleCurrentChange(val) {
      this.file.page.pageNumber = val
      this.checkAll = false
      this.multipleSelection = []
      this.fileImgSelect = []
      this.isIndeterminate = false
      this.getAllFile()
    },

    // 单个文件删除
    handleDelete() {
      this.beforeHandleButton()
      this.$confirm('将删除这些文件，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let fileId = []
          for (let key in this.multipleSelection) {
            fileId.push(this.multipleSelection[key].fileId)
          }
          this.handleAlldelet(fileId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    // 批量删除
    moreDelete() {
      this.$confirm('将删除这些文件，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let fileId = []
          for (let key in this.multipleSelection) {
            fileId.push(this.multipleSelection[key].fileId)
          }
          this.handleAlldelet(fileId)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 删除API
    handleAlldelet(fileId) {
      this.$api.file.deleteFile(fileId).then((res) => {
        if (res.code === 0) {
          this.multipleSelection = []
          this.fileImgSelect = []
          this.checkAll = false
          this.isIndeterminate = false
          this.file.page = {
            pageNumber: 1, //必选，页码
            pageSize: 10, //必选，每页的数量
            direction: 'DESC', //排序规则，ASC为升序，DESC为降序
            property: 'fileId', //根据该字段排序
          }
          this.getAllFile()
          this.$message({
            type: 'success',
            message: '已删除',
          })
        }
      })
    },
    // 下载按钮
    handleDownload(val) {
      this.beforeHandleButton()
      this.$api.file
        .downloadExcel(val.fileId)
        .then((res) => {
          downloadFile(res.data, val.fileName)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 批量下载
    downloadMoreFile() {
      let fileId = []
      for (let key in this.multipleSelection) {
        fileId.push(this.multipleSelection[key].fileId)
      }
      if (fileId.length > 0) {
        this.$api.file.downloadMoreFile(fileId).then((res) => {
          downloadFile(res.data, 'undefind.zip')
        })
      } else {
        this.$message.error('请选择文件')
      }
    },
    // 批量移动
    removeMoreFile() {
      this.remove = true
      this.form.list = this.multipleSelection
      this.MenuOptions = []
      this.MenuOptions.push({
        menuCode: 'str', //主键
        menuName: '无', //菜单名称
        children: [],
      })
      this.form.menuCode = this.MenuOptions[0].menuCode

      this.MenuData.forEach((item) => {
        this.MenuOptions.push(item)
      })
    },
    // 提交重命名表单
    onSubmit(formName) {
      let getData = this.form
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 有fileName属性时
          // 修改文件名
          if (getData.fileName) {
            this.$api.file.updateFileName(getData).then((res) => {
              if (res.code === 0) {
                this.form = {
                  menuCode: 'str',
                }
                this.$message({ message: '修改成功', type: 'success' })
                this.getAllFile()
              } else {
                this.$message.erro('未知错误-文件重命名')
              }
            })
            // 否则修改文件夹名称
          } else if (getData.menuName) {
            console.log('还是进来了')
            let get = this.getMenu.some((item) => {
              return item.menuName === getData.menuName
            })
            if (!get) {
              this.$api.fileMenu.editMenuInfo(getData).then((res) => {
                if (res.code === 0) {
                  this.$message({ message: '修改成功', type: 'success' })
                  this.isMenuName = false
                  this.form = {
                    menuCode: 'str',
                  }
                  if (this.getNode) {
                    this.handleNodeClick(getData, this.getNode)
                  } else {
                    this.handleHeaderFile()
                  }

                  this.getMenuAll()
                  this.getAll()
                } else {
                  this.$message.erro('未知错误-文件夹重命名')
                }
              })
            } else {
              getData.menuName = ''
              this.form = objDeepCopy(getData)
              this.$message({
                type: 'info',
                message: '名字重复请重新输入',
              })
            }

            // 批量移动提交表
          } else if (getData.list) {
            let code = this.form.menuCode[this.form.menuCode.length - 1]
            if (code === 'r') {
              getData.menuCode = ''
            } else {
              getData.menuCode = '?menuCode=' + code
            }
            this.$api.file.removeMoreFile(getData).then((res) => {
              if (res.code === 0) {
                this.form = {
                  menuCode: 'str',
                }
                this.getAllFile()
                this.$message({ message: '修改成功', type: 'success' })
              } else {
                this.$message.erro('未知错误')
              }
            })
          }
        } else {
          return false
        }
        this.checkAll = false
        this.isIndeterminate = false
        this.multipleSelection = []
        this.fileImgSelect = []
        this.reName = false
        this.remove = false
      })
      // 如果参数里有fileName时则为修改文件名称
    },
    // 获取附件
    async getAllFile() {
      if (this.getNode) {
        if (this.getNode.data.menuCode !== null) {
          this.file.condition.menuCode = this.getNode.data.menuCode
        }
      }
      await this.$api.file.getAll(this.file).then((res) => {
        this.total = res.content.total
        this.fileData = res.content.list
      })
      this.file.condition = {
        fileStatus: 'E',
        fileType: 'F',
      }
      this.file.rule = {}
    },
    // 获取菜单--树形结构
    async getMenuAll() {
      await this.$api.fileMenu
        .getMenuAll()
        .then((res) => {
          this.MenuData = res.content
        })
        .catch((erro) => {
          console.log(erro)
        })
    },
    // 获取菜单--列表结构
    async getAll() {
      await this.$api.fileMenu.getAll().then((res) => {
        if (res.code === 0) {
          this.getMenu = res.content
        } else {
          console.log('获取列表菜单失败')
        }
      })
    },
  },
}
</script>

<style scoped>
.el-main {
  display: flex;
  height: 100%;
  padding-bottom: 0px;
  width: 100%;
  flex-direction: row;
  margin-top: 10px;
}
.allFile {
  cursor: pointer;
}
.none-allFile {
  cursor: pointer;
  color: #333333;
}
.aisdeTree {
  margin-top: 10px;
  width: 260px;
}
.el-header {
  margin-top: 10px;
}
.hightLine {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #3672fc;
  font-size: 14px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
.none-hightLine {
  width: 100%;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #606266;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}
.header {
  height: 80px;
}
.allButton {
  height: 40px;
  display: flex;
  flex-direction: row;
}
.mainTable {
  margin: 0px auto;
  height: 100%;
  width: 100%;
}
.iconButton {
  float: right;
}
.addButton {
  position: relative;
  width: 100%;
  bottom: 0;
}
.asideButton1 {
  width: 100%;
  margin-left: 10px;
}
.asideButton2 {
  margin-top: 10px;
  border: 1px solid #3672fc;
}
.groupButton {
  display: flex;
  flex-direction: row;
  margin-left: auto;
}
.flexButton {
  margin-left: 10px;
}
.chckedOn {
  background-color: rgb(167, 210, 253);
  height: 150px;
  width: 120px;
}
.chckedFalse {
  height: 150px;
  width: 120px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #3672fc;
  padding-right: 8px;
}
.allSize {
  color: #989ca5;
  font-weight: 700;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}
.fileNameIcon {
  white-space: normal;
  word-break: break-all;
}
.treeStyle {
  height: 98%;
}
.iconHieght {
  height: 100%;
}
.el-aside {
  height: 100vh;
}
.tablescrollbar {
  height: 100%;
}
.isOpen {
  margin: 10px auto;
  width: 280px;
}
.isClose {
  margin: 10px auto;
  width: 120px;
}
</style>
