import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

export interface MenuModelState {
  currentPath: string;
}

export interface MenuModelType {
  namespace: 'menu';
  state: MenuModelState;
  effects: {};
  reducers: {
    changeCurrentPath: Reducer<MenuModelState>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',

  state: {
    currentPath: '/layout/home',
  },

  effects: {},
  reducers: {
    changeCurrentPath: (state, action) => {
      return {
        ...state,
        ...action.payload,
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
