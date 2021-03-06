import Vue from "vue";
import axios from "axios";
import StorageHelper from "./storageHelper";
import environment from "../environment";
import { authToken, authMobile } from "../constants/app";

const { server } = environment;

function isHttpUrl(input) {
  return /^https?:\/\//.test(input);
}

function isPlainRequest(input) {
  return /\.(html?|xml|txt)$/.test(input);
}

function useOrigin(res) {
  return res.config.useOrigin;
}

function defineError(res) {
  return res.config.defineError;
}

function getAuthHeader() {
  let auth = {};
  auth["Content-Type"] = "application/json;charset=UTF-8";
  return auth;
}

function request(config) {
  // be sure each request use latest authToken && authMobile
  config.headers[authToken] = StorageHelper.getItem(authToken);
  config.headers[authMobile] = StorageHelper.getItem(authMobile);

  const input = config.url;
  // absolute remote url
  if (isHttpUrl(input)) config.url = input;
  else
    // current server
    config.url = `${server}${input}`;

  return config;
}

function response(response) {
  return isPlainRequest(response.config.url) || useOrigin(response)
    ? response
    : response.data;
}

function requestError(rejection) {
  return useOrigin(rejection)
    ? Promise.reject(rejection)
    : Promise.reject(rejection.data);
}

function responseError(error) {
  // console.dir(error)
  const { data } = error.response;
  const rejection = Promise.reject(data);
  const unfeedback = data.message || data.error;
  const errorMessage = getResponseError(data.status, unfeedback);
  Vue.toasted.global.error(errorMessage);
  return rejection;
}

function getResponseError(input, unfeedback) {
  return (
    {
      "-1": "服务器异常，请联系网站管理员",
      "401": "您的会话已过期，请重新登录",
      "403": "您的权限受到限制，请咨询管理员获取权限",
      "404": "错误的参数或请求地址，请检查",
      "500": "服务器内部错误",
      undefined: "请求失败"
    }[input] || unfeedback
  );
}

axios.defaults.timeout = 60 * 1000;
axios.interceptors.request.use(request, requestError);
axios.interceptors.response.use(response, responseError);

export default axios;
