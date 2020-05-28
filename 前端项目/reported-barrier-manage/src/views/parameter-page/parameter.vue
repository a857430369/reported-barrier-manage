<template>
  <div class="custom_style">
    <el-container>
      <!-- 头部容器 -->
      <el-header>
        <el-card class="filter">
          <el-row>
            <el-col :span="18">
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-plus"
                @click="addparameterDialog = true"
                >新增</el-button
              >
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-arrow-left"
                v-if="patherCode != '*'"
                @click="go_back"
                >返回</el-button
              >
            </el-col>

            <el-col :span="4" v-if="patherCode == '*'">
              <el-input
                placeholder="请输入参数名后回车搜索"
                class="filter-item"
                v-model.trim="searchParams.colName"
                @keyup.enter.native="searchparameterName"
              />
            </el-col>
            <el-col :span="4" v-else>
              <el-input
                placeholder="请输入参数项后回车搜索"
                class="filter-item"
                v-model.trim="searchKYParams.parKey"
                @keyup.enter.native="searchparameterName"
              />
            </el-col>
            <el-col :span="2">
              <el-button
                type="success"
                size="medium"
                :loading="searchLoading"
                icon="el-icon-search"
                @click="searchparameterName"
                >搜索</el-button
              >
            </el-col>
          </el-row>
        </el-card>
      </el-header>

      <!-- 主内容容器 -->
      <el-main style="padding: 10px 20px 20px 20px;">
        <!-- 新增顶层参数弹窗 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="addparameterDialog"
          width="30%"
          center
        >
          <el-form
            :model="addparameterForm"
            ref="addparameterForm"
            label-width="100px"
            :rules="rules"
            status-icon
          >
            <el-form-item
              label="参数名称"
              label-width="120px"
              prop="colName"
              v-if="patherCode == '*'"
            >
              <el-input
                v-model.trim="addparameterForm.colName"
                placeholder="例如:状态"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="参数编码"
              label-width="120px"
              prop="colCode"
              v-if="patherCode == '*'"
            >
              <el-input
                v-model.trim="addparameterForm.colCode"
                placeholder="例如:Status"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="参数项键"
              label-width="120px"
              prop="parKey"
              v-if="patherCode != '*'"
            >
              <el-input
                v-model.trim="addparameterForm.parKey"
                placeholder="例如:成功"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="参数项值"
              label-width="120px"
              prop="parVal"
              v-if="patherCode != '*'"
            >
              <el-input
                v-model.trim="addparameterForm.parVal"
                placeholder="例如:Y"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addparameterDialog = false">取 消</el-button>
            <el-button
              type="primary"
              @click="saveparameter('addparameterForm')"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>

        <!-- 编辑顶层参数弹窗 -->
        <el-dialog
          :title="dialogTitle"
          :visible.sync="editParameterDialog"
          width="30%"
          center
        >
          <el-form
            :model="editParameterForm"
            ref="editParameterForm"
            :rules="rules"
            status-icon
          >
            <el-form-item
              label="参数名称"
              label-width="120px"
              prop="colName"
              v-if="patherCode == '*'"
            >
              <el-input
                v-model.trim="editParameterForm.colName"
                placeholder="例如:状态"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="参数编码"
              label-width="120px"
              prop="colCode"
              v-if="patherCode == '*'"
            >
              <el-input
                v-model.trim="editParameterForm.colCode"
                placeholder="例如:Status"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="参数项键"
              label-width="120px"
              prop="parKey"
              v-if="patherCode != '*'"
            >
              <el-input
                v-model.trim="editParameterForm.parKey"
                placeholder="例如:成功"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="参数项值"
              label-width="120px"
              prop="parVal"
              v-if="patherCode != '*'"
            >
              <el-input
                v-model.trim="editParameterForm.parVal"
                placeholder="例如:Y"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="有效/无效" label-width="120px">
              <el-select
                v-model="editParameterForm.parStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in parStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editParameterDialog = false">取 消</el-button>
            <el-button type="primary" @click="editParameter">
              确 定
            </el-button>
          </div>
        </el-dialog>
        <el-card>
          <!-- 参数表格数据 -->
          <el-table
            :data="parameterList"
            border
            fit
            v-loading="parameterLoading"
            max-height="600"
            style="width: 100%;"
          >
            <el-table-column
              prop="colName"
              label="参数名称"
              show-overflow-tooltip
              header-align="center"
              align="center"
              v-if="patherCode == '*'"
            >
              <template slot-scope="scope">
                <span
                  style="cursor:pointer;color:#66b1ff"
                  @click="jump(scope.row)"
                >
                  {{ scope.row.colName }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              prop="parKey"
              label="参数项键"
              show-overflow-tooltip
              header-align="center"
              align="center"
              v-else
            >
              <template slot-scope="scope">
                {{ scope.row.parKey }}
              </template>
            </el-table-column>

            <el-table-column
              prop="colCode"
              label="参数编码"
              show-overflow-tooltip
              header-align="center"
              align="center"
              v-if="patherCode == '*'"
            >
            </el-table-column>

            <el-table-column
              prop="parVal"
              label="参数项值"
              show-overflow-tooltip
              header-align="center"
              align="center"
              v-else
            >
            </el-table-column>

            <el-table-column
              prop="parStatus"
              label="有效/无效"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.parStatus == 'E' ? '有效' : '无效' }}
              </template>
            </el-table-column>

            <el-table-column
              prop="createDt"
              label="创建时间"
              sortable
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="lastDt"
              label="修改时间"
              sortable
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="操作"
              header-align="center"
              align="center"
              fixed="right"
              width="250px"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-edit"
                  @click="editParameterInfo(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-close"
                  @click="delParameter(scope.$index, scope.row)"
                  >禁用</el-button
                >
                <!-- <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="del(scope.$index, scope.row)"
                  >真实删除</el-button
                > -->
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页组件 -->
          <el-row type="flex" justify="end" style="margin-top:5px">
            <div class="pagination-container" :key="pageKey">
              <el-pagination
                @current-change="handlePage"
                @size-change="handleSizePage"
                :current-page="pageInfo.pageNumber"
                :page-sizes="pageSizes"
                :page-size="pageInfo.pageSize"
                :total="total"
                layout="total, sizes,  prev, pager, next"
              ></el-pagination>
            </div>
          </el-row>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      patherCode: '*',
      dialogTitle: '参数类别',
      addparameterForm: {
        colName: '', // 参数名称
        colCode: '', // 参数编码
      },
      editParameterForm: {
        parId: '', //主键
        colName: '', //参数名
        colCode: '', //参数值
        patherCode: '', //父编码
        parKey: '', //键
        parVal: '', //值
        parStatus: '', //状态
      },
      searchParams: {
        colName: '',
      },
      searchKYParams: {
        parKey: '',
      },
      paramsForm: {
        parameterCode: '',
        parameterName: '',
        urgentGrade: '',
      },
      parStatus: [],
      parameterLoading: false,
      searchLoading: false,
      parameterList: [],
      addparameterDialog: false,
      editParameterDialog: false,
      total: 0,
      pageSizes: [10, 20, 50, 100],
      pageInfo: {
        pageNumber: 1,
        pageSize: 10,
        direction: 'desc',
        property: 'parId',
      },
      pageKey: 0,
      copyPageInfo: {},
      rules: {
        colName: [
          { required: true, message: '请填写参数类型名称', trigger: 'blur' },
        ],
        colCode: [
          { required: true, message: '请填写参数编码', trigger: 'blur' },
        ],
        parKey: [
          { required: true, message: '请填写参数项键', trigger: 'blur' },
        ],
        parVal: [
          { required: true, message: '请填写参数项值', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {},
  created() {
    this.findParameterList()
    this.getListPar()
  },
  methods: {
    //查询
    findParameterList() {
      const params = {
        condition: { patherCode: this.patherCode },
        page: { ...this.pageInfo },
        rule: {},
      }
      this.parameterLoading = true
      this.$api.parameter
        .getPage(params)
        .then((res) => {
          this.parameterList = res.content.list
          this.total = res.content.total
          this.parameterLoading = false
        })
        .catch((error) => {
          this.parameterLoading = false
        })
    },
    //编辑参数信息回显
    editParameterInfo(index, data) {
      this.editParameterDialog = true //开启弹窗
      this.editParameterForm = { ...data } //数据回显
      console.log(data)
    },
    //编辑信息保存
    editParameter() {
      this.editParameterDialog = false
      const params =
        this.patherCode == '*'
          ? { ...this.editParameterForm, ...{ parKey: '', parVal: '' } }
          : { ...this.editParameterForm, ...{ colName: '', colCode: '' } }
      this.$api.parameter.editInfo(params).then((res) => {
        this.$message({
          message: '修改成功',
          type: 'success',
        })
        this.findParameterList()
      })
    },
    //新增
    saveparameter(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addparameterDialog = false
          const params = Object.assign(
            { patherCode: this.patherCode },
            this.addparameterForm
          )
          this.$api.parameter.saveInfo(params).then((res) => {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.clearAddForm()
            this.findParameterList()
          })
        } else {
          return false
        }
      })
    },
    //删除参数(逻辑)
    delParameter(index, data) {
      const params = { parId: data.parId }
      this.$confirm('确认禁用吗？', '提示', {}).then(() => {
        this.$api.parameter.delInfo(params).then((res) => {
          this.$message({
            message: '禁用成功',
            type: 'success',
          })
          this.findParameterList()
        })
      })
    },
    //删除参数(真实)
    del(index, data) {
      const params = { parId: data.parId }
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.$api.parameter.del(params).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success',
          })
          this.findParameterList()
        })
      })
    },
    //条件查询
    searchparameterName() {
      const params = {
        condition:
          this.patherCode == '*'
            ? { ...this.searchParams, patherCode: this.patherCode }
            : { ...this.searchKYParams, patherCode: this.patherCode },
        page: { ...this.pageInfo },
        rule: this.patherCode == '*' ? { colName: 'like' } : { parKey: 'like' },
      }
      this.searchLoading = true
      this.$api.parameter
        .getPage(params)
        .then((res) => {
          this.parameterList = res.content.list
          this.total = res.content.total
          this.searchLoading = false
        })
        .catch((error) => {
          this.searchLoading = false
        })
    },
    //查询参数状态
    getListPar() {
      const params = { keys: 'PAR_STATUS' }
      this.$api.parameter.getListPar(params).then((res) => {
        this.parStatus = res.content.PAR_STATUS
      })
    },
    //跳转下级参数
    jump(data) {
      ;(this.dialogTitle = '参数键值对'), (this.patherCode = data.colCode)
      this.clearAddForm()
      this.copyPageInfo = Object.assign({}, this.pageInfo) //备份外部pageInfo
      this.initPageInfo() //初始化pageInfo
      this.findParameterList()
    },
    //返回上一级
    go_back() {
      ;(this.dialogTitle = '参数类别'), (this.patherCode = '*')
      this.pageInfo = Object.assign({}, this.copyPageInfo) //还原pageInfo
      this.clearAddForm()
      this.searchKYParams.parKey = '' //清理参数项搜索条件
      this.findParameterList()
      ++this.pageKey //分页组件重新渲染
    },
    //处理pageSize改变时的方法
    handleSizePage(val) {
      this.pageInfo.pageSize = val
      this.findParameterList()
    },
    //处理pageNumber改变时的方法
    handlePage(val) {
      this.pageInfo.pageNumber = val
      this.findParameterList()
    },
    //初始化pageInfo
    initPageInfo() {
      this.pageInfo = {
        pageNumber: 1,
        pageSize: 10,
        direction: 'desc',
        property: 'parId',
      }
    },
    //清除addparameterForm
    clearAddForm() {
      this.addparameterForm = {
        colName: '',
        colCode: '',
      }
    },
    //清除editParameterForm
    clearEditForm() {
      this.editParameterForm = {
        parId: '', //主键
        colName: '', //参数名
        colCode: '', //参数值
        patherCode: '', //父编码
        parKey: '', //键
        parVal: '', //值
        parStatus: '', //状态
      }
    },
  },
}
</script>

<style scoped></style>
