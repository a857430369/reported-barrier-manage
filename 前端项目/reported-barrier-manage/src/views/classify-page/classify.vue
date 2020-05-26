<template>
  <div class="classify custom_style">
    <el-container>
      <!-- 头部容器 -->
      <el-header style="margin-top:20px">
        <el-card class="filter">
          <el-row>
            <el-col :span="18">
              <el-button
                type="primary"
                size="medium"
                style="margin-bottom:5px"
                icon="el-icon-plus"
                @click="addClassifyDialog = true"
                >新增</el-button
              >
              <el-button
                type="primary"
                size="medium"
                style="margin-bottom:5px"
                icon="el-icon-arrow-left"
                v-if="patherCode != 0"
                @click="go_back"
                >返回上一级</el-button
              >
            </el-col>

            <el-col :span="4">
              <el-input
                placeholder="请输入分类名后回车搜索"
                class="filter-item"
                v-model.trim="searchParams.classifyName"
                @keyup.enter.native="findClassifyList('search')"
              />
            </el-col>
            <el-col :span="2">
              <el-button
                type="success"
                size="medium"
                :loading="searchLoading"
                icon="el-icon-search"
                @click="findClassifyList('search')"
                >搜索</el-button
              >
            </el-col>
          </el-row>
        </el-card>
      </el-header>

      <!-- 主内容容器 -->
      <el-main>
        <!-- 新增顶层分类弹窗 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="addClassifyDialog"
          width="30%"
          center
        >
          <el-form
            :model="addClassifyForm"
            :rules="rules"
            status-icon
            label-width="120px"
            ref="addClassifyForm"
          >
            <el-form-item label="分类名称" prop="classifyName">
              <el-input
                v-model.trim="addClassifyForm.classifyName"
                placeholder="例如:分类三"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="通知时长"
              v-if="patherCode != 0"
              prop="classifyDuration"
            >
              <el-input
                placeholder="例如:0不通知"
                v-model="addClassifyForm.classifyDuration"
                :min="0"
                clearable
              >
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="优先级" v-if="patherCode != 0">
              <el-select
                v-model="addClassifyForm.urgentGrade"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in urgentGradeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="classifyRemark">
              <el-input
                type="textarea"
                maxlength="30"
                show-word-limit
                rows="5"
                v-model.trim="addClassifyForm.classifyRemark"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addClassifyDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveClassify('addClassifyForm')">
              确 定
            </el-button>
          </div>
        </el-dialog>

        <!-- 编辑顶层分类弹窗 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="editClassifyDialog"
          width="30%"
          center
        >
          <el-form
            :model="editClassifyForm"
            :rules="rules"
            status-icon
            label-width="120px"
            ref="editClassifyForm"
          >
            <el-form-item label="分类名称" prop="classifyName">
              <el-input
                v-model.trim="editClassifyForm.classifyName"
                placeholder="例如:分类三"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="通知时长"
              v-if="patherCode != 0"
              prop="classifyDuration"
            >
              <el-input
                placeholder="例如:0不通知"
                v-model="editClassifyForm.classifyDuration"
                :min="0"
                clearable
              >
                <template slot="append">分钟</template>
              </el-input>
            </el-form-item>
            <el-form-item label="优先级" v-if="patherCode != 0">
              <el-select
                v-model="editClassifyForm.urgentGrade"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in urgentGradeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="有效/无效">
              <el-select
                v-model="editClassifyForm.classifyStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in classifyStatusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="classifyRemark">
              <el-input
                type="textarea"
                maxlength="30"
                show-word-limit
                rows="5"
                v-model.trim="editClassifyForm.classifyRemark"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editClassifyDialog = false">取 消</el-button>
            <el-button type="primary" @click="editClassify('editClassifyForm')">
              确 定
            </el-button>
          </div>
        </el-dialog>
        <el-card>
          <!-- 分类表格数据 -->
          <el-table
            :data="classifyList"
            border
            fit
            v-loading="classifyLoading"
            max-height="600"
            style="width: 100%;"
          >
            <el-table-column
              prop="classifyName"
              label="分类名"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <span
                  style="cursor:pointer;color:#66b1ff"
                  @click="jump(scope.row)"
                  v-if="patherCode == 0"
                >
                  {{ scope.row.classifyName }}
                </span>
                <span v-else>
                  {{ scope.row.classifyName }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="urgentGrade"
              label="优先等级"
              show-overflow-tooltip
              header-align="center"
              align="center"
              v-if="patherCode != 0"
            >
              <template slot-scope="scope">
                {{ scope.row.urgentGrade | dataFormat(urgentGradeOption) }}
              </template>
            </el-table-column>

            <el-table-column
              prop="classifyStatus"
              label="有效/无效"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.classifyStatus == 'E' ? '有效' : '无效' }}
              </template>
            </el-table-column>

            <el-table-column
              v-if="patherCode != 0"
              prop="classifyDuration"
              label="通知时长"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="classifyRemark"
              label="描述"
              min-width="200px"
              max-width="350px"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="createDt"
              label="创建时间"
              sortable
              show-overflow-tooltip
              width="160px"
              header-align="center"
              align="center"
            >
            </el-table-column>

            <!-- <el-table-column
              prop="createIp"
              label="创建IP"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column> -->

            <el-table-column
              prop="lastDt"
              label="修改时间"
              sortable
              show-overflow-tooltip
              width="160px"
              header-align="center"
              align="center"
            >
            </el-table-column>

            <!-- <el-table-column
              prop="lastIp"
              label="修改IP"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column> -->

            <el-table-column
              label="操作"
              header-align="center"
              align="center"
              fixed="right"
              width="350px"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="patherCode != 0"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit-outline"
                  @click="openDialog(scope.row)"
                  >用户管理</el-button
                >
                <!-- <el-button
                  v-if="patherCode != 0"
                  size="mini"
                  type="success"
                  icon="el-icon-user"
                  @click="openDialog(scope.row, '用户列表')"
                  >用户列表</el-button
                > -->
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-edit"
                  @click="editClassifyInfo(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-if="scope.row.classifyStatus == 'E'"
                  size="mini"
                  type="danger"
                  icon="el-icon-close"
                  @click="delClassify(scope.$index, scope.row)"
                  >禁用</el-button
                >
                <!-- <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="del(scope.$index, scope.row)"
                  >删除</el-button
                > -->
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页组件 -->
          <el-row type="flex" justify="end" style="margin-top:5px">
            <div class="pagination-container">
              <el-pagination
                @current-change="handlePage"
                @size-change="handleSizePage"
                :current-page="pageInfo.pageNumber"
                :page-sizes="pageSizes"
                :page-size="pageInfo.pageSize"
                :total="total"
                :key="pageKey"
                layout="total, sizes,  prev, pager, next"
              ></el-pagination>
            </div>
          </el-row>
        </el-card>
      </el-main>
    </el-container>

    <!-- 用户管理 -->
    <el-dialog
      :title="title"
      :visible.sync="relationUserDialog"
      :width="width"
      center
      destroy-on-close
    >
      <userSelect
        ref="userSelect"
        :nodeCode="currSmallClassify.classifyCode"
      ></userSelect>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="relationUserDialog = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userSelect from '@/components/users-select/index'
import orgTree from '@/components/work-order/orgTree'
export default {
  filters: {
    dataFormat: function(msg, list) {
      for (let [index, item] of list.entries()) {
        if (item.value == msg) {
          return item.label
        }
      }
    },
  },
  components: {
    userSelect,
    orgTree,
  },
  data() {
    const onePoint = (rule, value, callback) => {
      if (!/^[0-9]+?$/.test(value)) {
        callback(new Error('请填写正整数'))
      } else {
        callback()
      }
    }
    return {
      relationUserDialog: false,
      relationUserParams: {},
      title: '',
      width: '',
      currSmallClassify: '',

      patherCode: 0,
      dialogTitle: '大类',
      addClassifyForm: {
        classifyName: '', // 分类名称
        urgentGrade: '1', // 优先级
        classifyDuration: 1, //通知时长
        classifyRemark: '', //描述
      },
      editClassifyForm: {
        classifyName: '', // 分类名称
        patherCode: '', // 父分类CODE
        urgentGrade: '', // 优先级
        classifyDuration: undefined, //通知时长
        classifyStatus: '', // 状态：E-有效、F-无效
        classifyRemark: '', //描述
      },
      searchParams: {
        classifyName: '',
      },
      paramsForm: {
        classifyCode: '',
        classifyName: '',
        urgentGrade: '',
      },
      classifyStatusOption: [], //分类选项
      urgentGradeOption: [], //分类紧急度
      classifyLoading: false,
      searchLoading: false,
      classifyList: [],
      addClassifyDialog: false,
      editClassifyDialog: false,
      total: 0,
      pageSizes: [10, 20, 50, 100],
      pageInfo: {
        pageNumber: 1,
        pageSize: 10,
        direction: 'desc',
        property: 'classifyCode',
      },
      pageKey: 0,
      copyPageInfo: {},
      rules: {
        classifyName: [
          { required: true, message: '请填写分类名称', trigger: 'blur' },
        ],
        classifyDuration: [
          { required: true, message: '请填写通知时长', trigger: 'blur' },
          {
            validator: onePoint,
            message: '请填写正整数',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  mounted() {},
  created() {
    this.findClassifyList()
    this.getListPar()
  },
  methods: {
    //子组件传值
    selectedUser(val) {
      this.userInfo = val
    },
    checkUserInfo() {
      const userInfo = this.userInfo
      if (!userInfo) {
        this.$message({
          message: '请选择人员',
          type: 'warning',
        })
        return false
      }
      return true
    },

    //对话框
    openDialog(data, width = '60%') {
      this.title = data.classifyName + '用户管理'
      this.width = width
      this.relationUserDialog = true
      this.currSmallClassify = data
    },
    closeDialog() {
      this.relationUser()
      this.relationUserDialog = false
    },

    //API
    //关联用户
    relationUser() {
      const userCodeList = this.$refs['userSelect'].userCodeList
      const curr = this.currSmallClassify
      const params = {
        type: 'F',
        userCodeList: userCodeList,
        classifyCode: curr.classifyCode,
      }
      this.$api.classify.relationUser(params).then((res) => {
        this.$message({
          message: '修改成功',
          type: 'success',
        })
      })
    },
    //查询
    findClassifyList(type = 'passive') {
      const _this = this
      const params = {
        condition: { patherCode: _this.patherCode },
        page: { ..._this.pageInfo },
        rule: {},
      }
      if (_this.searchParams.classifyName) {
        params.condition.classifyName = _this.searchParams.classifyName
        params.rule.classifyName = 'like'
      }
      type == 'passive'
        ? (_this.classifyLoading = true)
        : (_this.searchLoading = true)

      this.$api.classify
        .getPage(params)
        .then((res) => {
          _this.classifyList = res.content.list
          _this.total = res.content.total
          type == 'passive'
            ? (_this.classifyLoading = false)
            : (_this.searchLoading = false)
        })
        .catch((error) => {
          type == 'passive'
            ? (_this.classifyLoading = false)
            : (_this.searchLoading = false)
        })
    },
    //编辑分类信息回显
    editClassifyInfo(index, data) {
      const _this = this
      _this.editClassifyDialog = true //开启弹窗
      _this.editClassifyForm = { ...data } //数据回显
    },
    //编辑信息保存
    editClassify(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.editClassifyDialog = false
          const params =
            _this.patherCode == 0
              ? { ..._this.editClassifyForm, ...{ urgentGrade: '' } }
              : { ..._this.editClassifyForm }
          this.$api.classify
            .editInfo(params)
            .then((res) => {
              _this.$message({
                message: '修改成功',
                type: 'success',
              })
              _this.findClassifyList()
            })
            .catch((error) => {})
        }
      })
    },
    //新增
    saveClassify(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.addClassifyDialog = false
          const params = Object.assign(
            { patherCode: _this.patherCode },
            _this.addClassifyForm
          )
          this.$api.classify
            .saveInfo(params)
            .then((res) => {
              _this.$message({
                message: '添加成功',
                type: 'success',
              })
              _this.clearAddForm()
              _this.findClassifyList()
            })
            .catch((error) => {})
        }
      })
    },
    //删除分类(逻辑)
    delClassify(index, data) {
      const _this = this
      const params = { classifyCode: data.classifyCode }
      this.$confirm('确认禁用吗？', '提示', {}).then(() => {
        _this.$api.classify
          .delInfo(params)
          .then((res) => {
            _this.$message({
              message: '禁用成功',
              type: 'success',
            })
            _this.findClassifyList()
          })
          .catch((error) => {})
      })
    },
    //删除分类(真实)
    del(index, data) {
      const _this = this
      const params = { classifyCode: data.classifyCode }
      _this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.$api.classify
          .del(params)
          .then((res) => {
            _this.$message({
              message: '删除成功',
              type: 'success',
            })
            _this.findClassifyList()
          })
          .catch((error) => {})
      })
    },
    //查询分类优先等级,分类状态
    getListPar() {
      const _this = this
      const params = { keys: 'URGENT_GRADE,CLASSIFY_STATUS' }
      this.$api.parameter
        .getListPar(params)
        .then((res) => {
          _this.urgentGradeOption = res.content.URGENT_GRADE
          _this.classifyStatusOption = res.content.CLASSIFY_STATUS
        })
        .catch((error) => {})
    },
    //跳转下级分类
    jump(data) {
      const _this = this
      ;(_this.dialogTitle = '小类'), (_this.patherCode = data.classifyCode)
      _this.copyPageInfo = Object.assign({}, _this.pageInfo) //备份外部pageInfo
      _this.initPageInfo() //初始化pageInfo
      _this.clearAddForm()
      _this.findClassifyList()
    },
    //返回上一级
    go_back() {
      const _this = this
      ;(_this.dialogTitle = '大类'), (_this.patherCode = 0)
      _this.pageInfo = Object.assign({}, _this.copyPageInfo) //还原pageInfo
      _this.clearAddForm()
      _this.findClassifyList()
      ++_this.pageKey //分页组件重新渲染
    },
    //处理pageSize改变时的方法
    handleSizePage(val) {
      const _this = this
      _this.pageInfo.pageSize = val
      _this.findClassifyList()
    },
    //处理pageNumber改变时的方法
    handlePage(val) {
      const _this = this
      _this.pageInfo.pageNumber = val
      _this.findClassifyList()
    },
    //初始化pageInfo
    initPageInfo() {
      const _this = this
      _this.pageInfo = {
        pageNumber: 1,
        pageSize: 10,
        direction: 'desc',
        property: 'classifyCode',
      }
    },
    //清除addClassifyForm
    clearAddForm() {
      const _this = this
      _this.addClassifyForm = {
        classifyName: '',
        urgentGrade: '1',
        classifyRemark: '',
      }
    },
    //清除editClassifyForm
    clearEditForm() {
      const _this = this
      _this.editClassifyForm = {
        classifyName: '',
        patherCode: '',
        urgentGrade: '',
        classifyStatus: '',
        classifyRemark: '',
      }
    },
  },
}
</script>

<style scoped></style>
