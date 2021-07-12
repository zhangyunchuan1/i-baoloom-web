import React, { Fragment, useEffect } from 'react';
import { history } from 'umi';
import './index.scss';

const globalComp = (WrappedComponent: any) => {
  return class MyHOC extends React.Component {
    constructor(props: any) {
      super(props);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
};
export default globalComp;
