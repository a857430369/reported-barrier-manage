<template>
  <div class="grouping">
    <el-container>
      <!-- 头部容器 -->
      <el-header style="margin-top:20px">
        <el-card>
          <el-row>
            <el-col :span="18">
              <el-button
                type="primary"
                style="margin-bottom:5px"
                icon="el-icon-plus"
                @click="addGroupingDialog = true"
                >新增</el-button
              >
            </el-col>
            <el-col :span="4">
              <el-input
                placeholder="请输入分组名后回车搜索"
                class="filter-item"
                v-model.trim="searchParams.groupingName"
                @keyup.enter.native="findGroupingList"
              />
            </el-col>
            <el-col :span="2">
              <el-button
                type="success"
                icon="el-icon-search"
                @click="findGroupingList"
                >搜索</el-button
              >
            </el-col>
          </el-row>
        </el-card>
      </el-header>

      <!-- 主内容容器 -->
      <el-main style="margin-top:15px">
        <!-- 新增顶层分组弹窗 -->
        <el-dialog
          title="新增"
          :visible.sync="addGroupingDialog"
          width="30%"
          center
        >
          <el-form
            :model="addGroupingForm"
            :rules="rules"
            status-icon
            label-width="120px"
            ref="addGroupingForm"
          >
            <el-form-item label="分组名称" prop="groupingName">
              <el-input
                v-model.trim="addGroupingForm.groupingName"
                placeholder="例如:分组三"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addGroupingDialog = false">取 消</el-button>
            <el-button type="primary" @click="saveGrouping('addGroupingForm')">
              确 定
            </el-button>
          </div>
        </el-dialog>

        <!-- 编辑顶层分组弹窗 -->
        <el-dialog
          title="编辑"
          :visible.sync="editGroupingDialog"
          width="30%"
          center
        >
          <el-form
            :model="editGroupingForm"
            :rules="rules"
            status-icon
            label-width="120px"
            ref="editGroupingForm"
          >
            <el-form-item label="分组名称" prop="groupingName">
              <el-input
                v-model.trim="editGroupingForm.groupingName"
                placeholder="例如:分组三"
              ></el-input>
            </el-form-item>

            <el-form-item label="有效/无效">
              <el-select
                v-model="editGroupingForm.groupingStatus"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in groupingStatusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editGroupingDialog = false">取 消</el-button>
            <el-button type="primary" @click="editGrouping('editGroupingForm')">
              确 定
            </el-button>
          </div>
        </el-dialog>
        <el-card>
          <!-- 分组表格数据 -->
          <el-table
            :data="groupingList"
            border
            fit
            v-loading="groupingLoading"
            max-height="600"
            style="width: 100%;"
          >
            <el-table-column
              prop="groupingName"
              label="分组名"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
            </el-table-column>

            <el-table-column
              prop="groupingStatus"
              label="有效/无效"
              show-overflow-tooltip
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.groupingStatus == 'E' ? '有效' : '无效' }}
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
              prop="createIp"
              label="创建IP"
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
              prop="lastIp"
              label="修改IP"
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
                  @click="editGroupingInfo(scope.$index, scope.row)"
                  >编辑</el-button
                >
                <el-button
                  v-if="scope.row.groupingStatus == 'E'"
                  size="mini"
                  type="danger"
                  icon="el-icon-close"
                  @click="delInfo(scope.$index, scope.row)"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      addGroupingForm: {
        groupingName: '', // 分组名称
        patherCode: '*', //父类编码
      },
      editGroupingForm: {
        groupingCode: '', //分组编码
        groupingName: '', //分组名称
        patherCode: '', //分组父编码
        groupingStatus: '', //分组状态
      },
      searchParams: {
        groupingName: '',
      },
      groupingStatusOption: [], //分组状态
      groupingLoading: false,
      groupingList: [],
      addGroupingDialog: false,
      editGroupingDialog: false,
      total: 0,
      pageSizes: [10, 20, 50, 100],
      pageInfo: {
        pageNumber: 1,
        pageSize: 10,
        direction: 'DESC',
        property: 'groupingCode',
      },
      pageKey: 0,
      copyPageInfo: {},
      rules: {
        groupingName: [
          { required: true, message: '请填写分组名称', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {},
  created() {
    this.findGroupingList()
    this.getListPar()
  },
  methods: {
    //查询
    findGroupingList() {
      const _this = this
      const params = {
        condition: { ..._this.searchParams },
        page: { ...this.pageInfo },
        rule: {},
      }
      if (_this.searchParams.groupingName) {
        params.rule.groupingName = 'like'
      }
      _this.groupingLoading = true
      _this.$api.group
        .getPage(params)
        .then((res) => {
          _this.groupingList = res.content.list
          _this.total = res.content.total
          _this.groupingLoading = false
        })
        .catch((error) => {
          _this.groupingLoading = false
        })
    },
    //编辑分组信息回显
    editGroupingInfo(index, data) {
      const _this = this
      _this.editGroupingDialog = true //开启弹窗
      _this.editGroupingForm = { ...data } //数据回显
    },
    //编辑信息保存
    editGrouping(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.editGroupingDialog = false
          const params = _this.editGroupingForm
          _this.$api.group
            .editInfo(params)
            .then((res) => {
              _this.$message({
                message: '修改成功',
                type: 'success',
              })
              _this.findGroupingList()
            })
            .catch((error) => {})
        }
      })
    },
    //新增
    saveGrouping(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.addGroupingDialog = false
          const params = _this.addGroupingForm
          _this.$api.group
            .saveInfo(params)
            .then((res) => {
              _this.$message({
                message: '添加成功',
                type: 'success',
              })
              _this.clearAddForm()
              _this.findGroupingList()
            })
            .catch((error) => {})
        }
      })
    },
    //删除分组(逻辑)
    delInfo(index, data) {
      const params = { groupingCode: data.groupingCode }
      this.$confirm('确认禁用吗？', '提示', {}).then(() => {
        this.$api.group
          .delInfo(params)
          .then((res) => {
            this.$message({
              message: '禁用成功',
              type: 'success',
            })
            this.findGroupingList()
          })
          .catch((error) => {})
      })
    },
    //删除分组(真实)
    del(index, data) {
      const params = { groupingCode: data.groupingCode }
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        this.$api.group
          .del(params)
          .then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.findGroupingList()
          })
          .catch((error) => {})
      })
    },
    //查询分组状态
    getListPar() {
      const params = { keys: 'GROUPING_STATUS' }
      this.$api.parameter
        .getListPar(params)
        .then((res) => {
          this.groupingStatusOption = res.content.GROUPING_STATUS
        })
        .catch((error) => {})
    },
    //处理pageSize改变时的方法
    handleSizePage(val) {
      this.pageInfo.pageSize = val
      this.findGroupingList()
    },
    //处理pageNumber改变时的方法
    handlePage(val) {
      this.pageInfo.pageNumber = val
      this.findGroupingList()
    },
    //清除addGroupingForm
    clearAddForm() {
      this.addGroupingForm = {
        groupingName: '',
        patherCode: '*',
      }
    },
    //清除editGroupingForm
    clearEditForm() {
      this.editGroupingForm = {
        groupingCode: '',
        groupingName: '',
        patherCode: '',
        groupingStatus: '',
      }
    },
  },
  filters: {
    dataFormat: function(msg, list) {
      for (let [index, item] of list.entries()) {
        if (item.value == msg) {
          return item.label
        }
      }
    },
  },
}
</script>

<style scoped></style>
