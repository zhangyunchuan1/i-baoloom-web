/**
 * 主要布局组件
 */

import React, { useEffect, useState } from 'react';
import GlobalHeader from '../../components/GlobalHeader';
import GlobalMenu from '../../components/GlobalMenu';
import { useSelector, useDispatch, history } from 'umi';
import './index.scss';

const Layout: React.FC = (props) => {
  //page store
  const layoutStore = useSelector((state: any) => state.layout);
  const menuStore = useSelector((state: any) => state.menu);
  const loginStore = useSelector((state: any) => state.login);
  const dispatch = useDispatch();
  //page state
  const [hidden, sethidden] = useState(false);

  useEffect(() => {
    console.log('layout props', props);
    sethidden(layoutStore.hidden);
  }, []);

  const change = () => {
    dispatch({
      type: 'layout/changeShowMenu',
      payload: {
        hidden: !layoutStore.hidden,
      },
    });
    sethidden(!layoutStore.hidden);
  };

  return (
    <section className="layout-warp">
      <GlobalHeader
        userInfo={loginStore.userInfo}
        loginStatus={loginStore.loginStatus}
      />
      <main
        className={hidden ? 'main-layout layout-showInfo-tran' : 'main-layout'}
      >
        <GlobalMenu
          currentPath={menuStore.currentPath}
          change={change}
          hidden={layoutStore.hidden}
        />
        <section className="page-warp">{props.children}</section>
      </main>
    </section>
  );
};

export default Layout;
