import Toasted from 'vue-toasted';

const defaults = {
  duration: 10000,
  position: 'bottom-right',
  className: 'toasted-customize',
  action: [
    {
      text: '关闭',
      onClick: (e, t) => {
        t.goAway(0);
      }
    }
  ]
};

function getPayload(payload) {
  return payload ? payload : 'Something Went Wrong..';
}

function getRegisterToastedArgs(options = {}) {
  return [options.type, getPayload, Object.assign({}, defaults, options)];
}

export default Vue => {
  Vue.use(Toasted);
  Vue.toasted.register(...getRegisterToastedArgs({ type: 'info' }));
  Vue.toasted.register(...getRegisterToastedArgs({ type: 'error' }));
  Vue.toasted.register(...getRegisterToastedArgs({ type: 'success' }));
};

/**
 * @useage
 * this.$toasted.global.success(message) || Vue.toasted.global.success(message);
 */
