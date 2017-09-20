<template>
  <div class="login content has-text-centered">
    <h3 class="is-title is-bold">{{appName}}</h3>
    <div class="columns is-vcentered flex-center">
      <div class="column is-3">
        <div class="box" :class="{'no-pointer-events': submitting}">
          <form v-on:submit.prevent="getSms" v-show="!secondFactor" novalidate>
            <label class="label">用户名</label>
            <p class="control">
              <input
                type="text"
                name="username"
                class="input"
                maxlength="11"
                placeholder="11位有效手机号"
                v-model="params.username"
                v-validate="'required|mobile'"
                :class="{'is-danger':errors.has('username')}"
                autofocus
              >
            </p>
            <label class="label">密码</label>
            <p class="control">
              <input
                type="password"
                name="password"
                class="input"
                maxlength="20"
                placeholder="密码"
                v-model="params.password"
                v-validate="'required|password'"
                :class="{'is-danger':errors.has('password')}"
              >
            </p>
            <p class="has-text-centered">
              <button
                type="submit"
                class="button is-block is-primary"
                :class="{'is-loading':submitting}"
                :disabled="errors.any() || submitting">
                登录
              </button>
            </p>
          </form>
          <form v-on:submit.prevent="login" v-show="secondFactor" novalidate>
            <label class="label">验证码</label>
            <p class="control">
              <input
                id="otp"
                type="text"
                name="otp"
                class="input"
                maxlength="6"
                placeholder="验证码"
                v-validate="'required'"
                v-model="params.otp"
                :class="{'is-danger':errors.has('otp')}"
              >
            </p>
            <p class="has-text-centered">
              <button
                type="submit"
                class="button is-block is-primary"
                :class="{'is-loading':submitting}"
                :disabled="errors.any() || submitting">
                提交
              </button>
            </p>
          </form>
        </div>
        <div v-show="error" class="notification is-warning text-break">{{error}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import StorageHelper from '../../utils/storageHelper';
import { mapGetters, mapActions } from 'vuex';
import { appName, authToken, authMobile } from '../../constants/app';

export default {
  
  data() {
    return {
      appName: appName,
      submitting: false,
      secondFactor: false,
      error: null,
      params: {
        username: null,
        password: null,
        otp: null
      }
    }
  },
  mounted() {

  },
  components: {

  },
  methods: {
    ...mapActions([
      'userLogin'
    ]),
    errorHanler(error) {
      this.error = error.message || error.error
    },
    setSubmitState(state) {
      this.submitting = state;
    },
    getSms() {
      this.error = null;
      this.secondFactor = true;
      this.setSubmitState(false);
      setTimeout(() => document.getElementById('otp').focus())
    },
    login() {
      StorageHelper.setItem(authToken, 'token', { expire: 0.5 });
      StorageHelper.setItem(authMobile, 'mobile', { expire: 0.5 });
      this.setSubmitState(true);
      this.userLogin({ name: 'mobile' });
      this.$router.push({ path: '/demo' });
    }
  }

}
</script>

<style lang="scss" scoped>
  .login {
    padding: 10em 0;
    font-size: 16px;
  }
  .is-title {
    text-transform: capitalize;
  }
</style>
