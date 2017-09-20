import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as filters from "./filters";
import { sync } from "vuex-router-sync";

import axios from "./utils/axiosConfig";
import NProgress from "vue-nprogress";
import VeeValidate from "./utils/veeValidateConfig";
import toastConfig from "./utils/toastConfig";
import StorageHelper from "./utils/storageHelper";

import { authMobile } from "./constants/app";
import { TOGGLE_SIDEBAR, USER_LOGIN } from "vuex-store/mutation-types";

Vue.router = router;

Vue.prototype.axios = axios;

Vue.use(NProgress);

toastConfig(Vue);

Vue.use(require("vue-moment"));

Vue.use(VeeValidate, {
  locale: "zh_CN"
});

// Enable devtools
Vue.config.devtools = true;

sync(store, router);

const nprogress = new NProgress({ parent: ".nprogress-container" });

const { state } = store;

let username = StorageHelper.getItem(authMobile);
if (username) {
  store.commit(USER_LOGIN, { name: username });
}

router.beforeEach((to, from, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false);
  }
  if (!StorageHelper.getItem(authMobile) && to.path !== "/login") {
    next({ path: "/login" });
  } else {
    next();
  }
});

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

const app = new Vue({
  router,
  store,
  axios,
  nprogress,
  ...App
});

export { app, router, store };
