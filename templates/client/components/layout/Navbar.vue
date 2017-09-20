<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <a class="nav-item is-hidden-tablet" @click="toggleSidebar({opened: !sidebar.opened})">
            <i class="fa fa-bars" aria-hidden="true" v-show="!sidebar.hidden"></i>
          </a>
        </div>
        <div class="nav-center">
          <router-link :to="{ path:'/search'}" class="nav-item hero-brand">
            <img src="../../assets/logo.png">
            <div class="is-hidden-mobile tooltip--success tooltip--small tooltip--rounded tooltip--always tooltip--no-animate">
              <span class="wld">管理</span>
              <strong class="admin">系统</strong>
            </div>
          </router-link>
        </div>
        <div class="nav-right is-flex">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link  is-active" href="javascript:void(0)">
              {{user.name}}
            </a>
            <div class="navbar-dropdown ">
              <a class="navbar-item is-active" href="javascript:void(0)" @click="loginout()">
                退出登录
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import Tooltip from 'vue-bulma-tooltip'
import StorageHelper from '../../utils/storageHelper';
import { authMobile } from '../../constants/app';
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Tooltip
  },

  props: {
    show: Boolean
  },

  computed: mapGetters({
    pkginfo: 'pkg',
    sidebar: 'sidebar',
    user: 'user'
  }),

  methods: {
    ...mapActions([
      'toggleSidebar',
      'userLoginout'
    ]),
    loginout() {
      StorageHelper.removeItem(authMobile);
      this.userLoginout()
      this.$router.push({ name: 'login' });
    }
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';

.app-navbar {
  position: fixed;
  min-width: 100%;
  z-index: 1024;
  box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

  .container {
    margin: auto 10px;
  }

  .nav-right {
    align-items: stretch;
    align-items: stretch;
    flex: 1;
    justify-content: flex-end;
    overflow: inherit;
    overflow-x: visible;
    white-space: nowrap;
  }
}

.hero-brand {
  .wld {
    margin-left: 6px;
    color: #f60;
  }
  .admin {
    color: #28374B;
  }
}

.hero-head {
  background: #fff;
}
</style>
