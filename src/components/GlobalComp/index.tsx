import React, { Fragment, useEffect } from 'react';
import BlToast from '@/components/bl-toast';
import { history } from 'umi';
import './index.scss';

const globalComp = (WrappedComponent: any) => {
  return class MyHOC extends React.Component {
    constructor(props: any) {
      super(props);
    }
    render() {
      return (
        <Fragment>
          <WrappedComponent {...this.props} />
          <BlToast />
        </Fragment>
      );
    }
  };
};
export default globalComp;
