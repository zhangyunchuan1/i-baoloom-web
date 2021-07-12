import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

export interface LayoutModelState {
  hidden: boolean;
}

export interface LayoutModelType {
  namespace: 'layout';
  state: LayoutModelState;
  effects: {};
  reducers: {
    changeShowMenu: Reducer<LayoutModelState>;
  };
  subscriptions: {};
}

const LayoutModel: LayoutModelType = {
  namespace: 'layout',

  state: {
    hidden: false,
  },

  effects: {},
  reducers: {
    changeShowMenu: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  subscriptions: {},
};

export default LayoutModel;
