<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <span v-else @click.prevent="handleLink(item)">
          <span
            class="el-icon-menu"
            style="margin-right:5px;color: #409EFF;"
          ></span>
          <!-- <span style="color: #97a8be;cursor: text;">当前页面位置: </span> -->
          <a style="cursor:pointer;">{{ item.meta.title }}</a>
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  props: {
    whiteList: {
      type: Array,
      required: false,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      levelList: null,
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]
      const whiteList = this.whiteList
      const path = first.path
      if (whiteList.includes(path)) {
        if (!this.isDashboard(first)) {
          matched = [
            {
              path: '/workdesk',
              redirect: '/workdesk/index',
              meta: { title: '工作台' },
            },
          ].concat(matched)
        }
        this.levelList = matched.filter(
          (item) =>
            item.meta && item.meta.title && item.meta.breadcrumb !== false
        )
      }
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 15px;
  line-height: 20px;
  margin-left: 22px;
  margin-bottom: -15px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
