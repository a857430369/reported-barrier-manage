<template>
  <div>
    <div class="container">
      <breadcrumb v-if="$store.state.breadcrumb.flag" :whiteList="whiteList" />
      <router-view />
    </div>
  </div>
</template>

<script>
import store from '@/store/module/user'
import breadcrumb from './component/breadcrumb'
import { whiteList } from '@/router'

export default {
  components: {
    breadcrumb,
  },
  data() {
    return {
      whiteList: whiteList,
    }
  },
}
</script>
