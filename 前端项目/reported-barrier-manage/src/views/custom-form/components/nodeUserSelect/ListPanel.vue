<template>
  <div class="el-transfer-panel"
       style="width: 100%">
    <p class="el-transfer-panel__header"
       style="background-color: skyblue;color: #FFF;">

      <span style="color: #000;font-size: 14px;"
            id="title_css">
        {{ title }}
      </span>

    </p>
    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <el-select v-show="enableChooseSys"
                 v-model="sysCode"
                 placeholder="请选择所属系统"
                 style="margin: 5px 5px 0 5px;width: 95%;"
                 @change="checkSys">
        <el-option v-for="(item, index) in systemList"
                   :key="index"
                   :value="item.sysCode"
                   :label="item.sysName"></el-option>
      </el-select>
      <!-- 搜索 -->

      <el-input class="el-transfer-panel__filter"
                v-model="query"
                size="small"
                :placeholder="placeholder"
                @mouseenter.native="inputHover = true"
                @mouseleave.native="inputHover = false"
                v-if="filterable && isShow">
        <i slot="prefix"
           :class="['el-input__icon', 'el-icon-' + inputIcon]"
           @click="clearQuery"></i>
      </el-input>
      <el-checkbox-group v-model="checked"
                         :max="1"
                         v-show="!hasNoMatch && data.length > 0"
                         :class="
          enableChooseSys
            ? 'enable_choose_sys'
            : { 'is-filterable': filterable }
        "
                         class="el-transfer-panel__list">
        <el-checkbox class="el-transfer-panel__item"
                     :label="item[keyProp]"
                     :disabled="item[disabledProp]"
                     :key="item[labelProp]"
                     v-for="item in filteredData">
          {{ item[labelProp] + (item['empSms'] ? ' (' + item['empSms'] + ')' : '') }}
        </el-checkbox>
      </el-checkbox-group>
      <p class="el-transfer-panel__empty"
         v-show="hasNoMatch">
        {{ t("el.transfer.noMatch") }}
      </p>
      <p class="el-transfer-panel__empty"
         v-show="data.length === 0 && !hasNoMatch">
        {{ t("el.transfer.noData") }}
      </p>
    </div>
    <p class="el-transfer-panel__footer"
       v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>

<script>
import Locale from "element-ui/src/mixins/locale";
// import {listPersionBySearch} from '@/config/getData'

export default {
  mixins: [Locale],
  // name: 'ListPanel',
  // componentName: 'ListPanel',
  props: {
    isShow: {
      type: Boolean,
      default: true
    },

    data: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: "名字"
    },
    title: {
      type: String,
      default: "title"
    },
    filterable: Boolean,
    format: {
      type: Object,
      default() {
        return {};
      }
    },
    filterMethod: Function,
    defaultChecked: {
      type: Array,
      default() {
        return [];
      }
    },
    props: {
      type: Object,
      default() {
        return {
          label: "label",
          key: "key",
          disabled: "disabled"
        };
      }
    },
    enableChooseSys: {
      type: Boolean,
      default: false
    },
    systemList: {
      type: Array,
      default() {
        return [
          { sysCode: "unification", sysName: "佛山综合信息统一管理平台" }
        ];
      }
    },
    addCss: {
      type: Boolean,
      default: false
    },
    parent: {
      type: String,
      default: ""
    }
  },
  mounted() {},
  data() {
    return {
      filteredData: [],
      checked: [],
      allChecked: false,
      query: "",
      inputHover: false,
      checkChangeByUser: true,
      historyData: [],
      sysCode: "",
      sysName: "",
      defaultProps: {
        children: "children",
        id: "id",
        label: "label"
      }
    };
  },
  watch: {
    query(val, oldVal) {
      if (val && val != "") {
        this.filteredData = this.data.filter(item => {
          return item.userName.indexOf(val) != -1;
        });
      } else {
        this.filteredData = JSON.parse(JSON.stringify(this.data));
      }
    },
    checked(val, oldVal) {
      let data = {}
      let operCode = val.length > 0 ? val[0] : ''
      this.data.map(item => {
        if (item.operCode == operCode) {
          data = item
        }
      })

      this.updateAllChecked();
      if (this.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
        this.$emit("checked-change", data, this.checked.length == 0);
      } else {
        this.$emit("checked-change", data,this.checked.length == 0);
        this.checkChangeByUser = true;
      }
    },
    data: {
      immediate: true,
      handler(val, oldVal) {
        this.filteredData = JSON.parse(JSON.stringify(val));
        const checked = [];
        // 得到所有的key,保存在filteredDataKeys
        const filteredDataKeys = this.filteredData.map(
          item => item[this.keyProp]
        );
        this.checked.forEach(item => {
          if (filteredDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });

        this.checkChangeByUser = false;
        this.checked = checked;
      }
    },
    checkableData() {
      this.updateAllChecked();
    },
    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (
          oldVal &&
          val.length === oldVal.length &&
          val.every(item => oldVal.indexOf(item) > -1)
        )
          return;
        const checked = [];
        const checkableDataKeys = this.checkableData.map(
          item => item[this.keyProp]
        );
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      }
    }
  },
  computed: {
    // filteredData () {
    //   return this.data.filter(item => {
    //     if (typeof this.filterMethod === 'function') {
    //       return this.filterMethod(this.query, item)
    //     } else {
    //       const label = item[this.labelProp] || item[this.keyProp].toString()
    //       if (this.parent === 'personSelect') {
    //         return label.toLowerCase()
    //       }
    //       else {
    //         return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1
    //       }
    //     }
    //   })
    // },
    checkableData() {
      return this.filteredData.filter(item => !item[this.disabledProp]);
    },
    checkedSummary() {
      const checkedLength = this.checked.length;
      const dataLength = this.data.length;
      const { noChecked, hasChecked } = this.format;
      if (noChecked && hasChecked) {
        return checkedLength > 0
          ? hasChecked
              .replace(/\${checked}/g, checkedLength)
              .replace(/\${total}/g, dataLength)
          : noChecked.replace(/\${total}/g, dataLength);
      } else {
        return `${checkedLength}/${dataLength}`;
      }
    },
    isIndeterminate() {
      const checkedLength = this.checked.length;
      return checkedLength > 0 && checkedLength < this.checkableData.length;
    },
    hasNoMatch() {
      return this.query.length > 0 && this.filteredData.length === 0;
    },
    inputIcon() {
      return this.query.length > 0 && this.inputHover
        ? "circle-close"
        : "search";
    },
    labelProp() {
      return this.props.label || "label";
    },
    keyProp() {
      return this.props.key || "key";
    },
    disabledProp() {
      return this.props.disabled || "disabled";
    },
    hasFooter() {
      return !!this.$slots.default;
    }
  },
  methods: {
    updateAllChecked() {
      const checkableDataKeys = this.checkableData.map(
        item => item[this.keyProp]
      );
      this.allChecked =
        checkableDataKeys.length > 0 &&
        checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
    },
    handleAllCheckedChange(value) {
      this.checked = value
        ? this.checkableData.map(item => item[this.keyProp])
        : [];
    },
    resetCheck() {
      this.checked = false
      this.checked = []
    },
    clearQuery() {
      if (this.inputIcon === "circle-close") {
        this.query = "";
      }
    },
    search() {
      if (this.historyData.length === 0) {
        this.historyData = this.data;
      }
      if (this.query === "") {
        this.data = this.historyData;
        this.historyData = [];
      } else {
        if (this.parent === "personSelect") {
          let searchInfo = { search: this.query };
          // searchInfo.code = id
          // listPersionBySearch(searchInfo).then(response => {
          //   let code = response.data.code
          //   if (code === 200) {
          //     let searchData = response.data
          //     this.data = searchData.data
          //   } else {
          //     this.$message.error(response.data.msg)
          //   }
          // }).catch(error => {
          //   this.$message.error(error)
          // })
        }
      }
    },

    // 选择系统
    checkSys(val) {
      //this.roleCode = ''
      this.$emit("changesys", val);
      this.systemList.map(item => {
        if (item.sysCode === val) {
          this.sysName = item.sysName;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-transfer-panel__header {
  background-color: skyblue;
  // background-color: #409eff;
  color: #fff;
}

.enable_choose_sys {
  height: 236px;
  padding-top: 0;
}
</style>



<style>
#update_update_css
  .el-transfer-panel
  .el-transfer-panel__header
  .el-checkbox
  .el-checkbox__label {
  color: #fff;
  font-size: 14px;
}
</style>
