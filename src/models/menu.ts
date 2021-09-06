import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

export interface MenuModelState {
  currentPath: string;
  userTools: [];
}

export interface MenuModelType {
  namespace: 'menu';
  state: MenuModelState;
  effects: {};
  reducers: {
    changeCurrentPath: Reducer<MenuModelState>;
    changeUserTools: any;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',

  state: {
    currentPath: '/layout/home',
    userTools: [],
  },

  effects: {},
  reducers: {
    changeCurrentPath: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeUserTools: (state: any, action: { payload: any; }) => {
      console.log('444555454545:', action.payload)
      return {
        ...state,
        userTools: action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        dispatch({
          type: 'changeCurrentPath',
          payload: {
            currentPath: pathname,
          },
        });
      });
    },
  },
};

export default MenuModel;
