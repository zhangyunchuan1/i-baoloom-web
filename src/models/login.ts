import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

interface UserInfo {
  userName: string;
  avatar: string;
  email: string;
  createTime: string;
  id: string;
}

export interface LoginModelState {
  name: string;
  userInfo: any;
  token: string;
  loginStatus: boolean;
}

export interface LoginModelType {
  namespace: 'login';
  state: LoginModelState;
  effects: {};
  reducers: {
    changeUserInfo: Reducer<LoginModelState>;
    loginOut: Reducer<LoginModelState>;
  };
  subscriptions: {};
}

const LoginModel: LoginModelType = {
  namespace: 'login',

  state: {
    name: '王八',
    userInfo: sessionStorage.getItem('userInfo')
      ? JSON.parse(sessionStorage.getItem('userInfo') || '')
      : {},
    token: sessionStorage.getItem('token') || '',
    loginStatus: sessionStorage.getItem('loginStatus')
      ? JSON.parse(sessionStorage.getItem('loginStatus') || '')
      : false,
  },

  effects: {},
  reducers: {
    changeUserInfo: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    loginOut: (state, action) => {
      //本地清空个人信息
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('loginStatus');
      //store清空个人信息
      let data = {
        userInfo: {},
        token: '',
        loginStatus: false,
      };
      return {
        ...state,
        ...data,
        ...action.payload,
      };
    },
  },
  subscriptions: {},
};

export default LoginModel;
