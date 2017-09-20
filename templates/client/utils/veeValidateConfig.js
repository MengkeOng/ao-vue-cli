import Vue from "vue";
import { mobile, password } from "../constants/patterns";

import zh_CN from "vee-validate/dist/locale/zh_CN";
import VeeValidate, { Validator } from "vee-validate";

Validator.addLocale(zh_CN);

Validator.extend("mobile", {
  messages: {
    zh_CN: field => "手机号码输入不正确"
  },
  validate: value => {
    return mobile.test(value);
  }
});

Validator.extend("password", {
  messages: {
    zh_CN: field => "请输入8至20位的密码"
  },
  validate: value => {
    return password.test(value);
  }
});

export default VeeValidate;
