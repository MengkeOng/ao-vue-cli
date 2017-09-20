import * as types from "../mutation-types";

const state = {
  device: {
    isMobile: false,
    isTablet: false
  },
  sidebar: {
    opened: true,
    hidden: false
  },
  effect: {
    translate3d: true
  },
  user: {
    name: ""
  },
  proposer: {}
};

const mutations = {
  [types.TOGGLE_DEVICE](state, device) {
    state.device.isMobile = device === "mobile";
    state.device.isTablet = device === "tablet";
  },

  [types.TOGGLE_SIDEBAR](state, config) {
    if (state.device.isMobile && config.hasOwnProperty("opened")) {
      state.sidebar.opened = config.opened;
    } else {
      state.sidebar.opened = true;
    }

    if (config.hasOwnProperty("hidden")) {
      state.sidebar.hidden = config.hidden;
    }
  },

  [types.SWITCH_EFFECT](state, effectItem) {
    for (let name in effectItem) {
      state.effect[name] = effectItem[name];
    }
  },

  [types.USER_LOGIN](state, userItem) {
    for (let name in userItem) {
      state.user[name] = userItem[name];
    }
  },

  [types.USER_LOGINOUT](state) {
    state.user.name = "";
  },

  [types.PROPOSER_INFO_LOAD](state, proposerInfo) {
    state.proposer = proposerInfo;
  }
};

export default {
  state,
  mutations
};
