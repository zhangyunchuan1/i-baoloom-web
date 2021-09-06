import axios from 'axios';
import { httpUrl } from './config';
import QS from 'qs';
import { getDvaApp } from 'umi';

const CancelToken = axios.CancelToken;
const pendingReq = <any>{};

// axios.defaults.baseURL = 'http://47.108.158.162/api';
axios.defaults.baseURL = httpUrl;
axios.defaults.timeout = 60000; //请求超时

axios.defaults.headers.common['Content-Type'] =
  'application/json;charset=UTF-8';

//请求拦截
axios.interceptors.request.use(
  (config) => {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    let token = sessionStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    const key = config.url + '&' + config.method;
    pendingReq[key] && pendingReq[key]('请求取消，操作太频繁了~');
    config.cancelToken = new CancelToken((c) => {
      pendingReq[key] = c;
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//响应拦截
axios.interceptors.response.use(
  (response) => {
    console.log('响应数据', response);
    switch (response.data.status) {
      case 201: //登录失效
        const { dispatch } = getDvaApp()._store;
        dispatch({
          type: 'login/loginOut',
          payload: {},
        });
        break;
      default:
        break;
    }
    // 取消请求
    const key = response.config.url + '&' + response.config.method;
    pendingReq[key] && delete pendingReq[key];
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const get = (url: string, params = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const post = (url: string, params = {}, config = {}) => {
  console.log(`请求路径-${url}`);
  console.log(`请求参数-`, params);
  return new Promise((resolve, reject) => {
    axios.post(url, params, config).then(
      (response) => {
        resolve(response.data);
      },
      (err) => {
        reject(err);
      },
    );
  });
};

export default {
  post,
  get,
};
