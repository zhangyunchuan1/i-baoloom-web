/**
 * 主要布局组件
 */

import React, { useEffect, useState } from 'react';
import Http from '@/tool/http';
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
    getMyTools();
    sethidden(layoutStore.hidden);
  }, []);

  //获取我的工具
  const getMyTools = () => {
    Http.post('/tool/myTool').then((res: any) => {
      if (res.status === 200) {
        dispatch({
          type: 'menu/changeUserTools',
          payload: res.data,
        });
      }
    });
  }

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
          toolList={menuStore.userTools}
        />
        <section className="page-warp">{props.children}</section>
      </main>
    </section>
  );
};

export default Layout;
