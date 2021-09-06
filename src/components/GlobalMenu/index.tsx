import React, { Fragment, useEffect, useState } from 'react';
import { history } from 'umi';
import Http from '@/tool/http';
import { ToastContainer, toast } from 'material-react-toastify';
import './index.scss';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import icons_left from '../../images/icons/icon-left.png';
import icons_right from '../../images/icons/icons-right.png';
import icons_home from '../../images/icons/icons-home.png';
import icons_home_black from '../../images/icons/icons-home-black.png';
import icons_color from '../../images/icons/icons-color.png';
import icons_color_black from '../../images/icons/icons-color-black.png';

const MENUS = [
  {
    title: '首页',
    icon: icons_home_black,
    selectedIcon: icons_home,
    path: '/layout/home',
  },
];

interface IProps {
  change: Function;
  hidden: boolean;
  currentPath: string;
  toolList: any;
}

const GlobalMenu: React.FC<IProps> = (props) => {
  const [toolEl, setToolEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(toolEl);
  const id = open ? 'simple-popover' : undefined;


  useEffect(() => {
    console.log('GlobalMenu props', props);
  }, [props.currentPath]);

  useEffect(() => {
    
  }, []);

  const handleChangeMenu = () => {
    props.change();
  };

  const handjumpPage = (path: string): void => {
    path && history.push(path);
  };

  const handleShowTool = (event: React.MouseEvent<HTMLButtonElement>) => {
    setToolEl(event.currentTarget);
  };

  const handleHiddenTool = () => {
    setToolEl(null);
  };

  const handleShowCurrent = () => {
    return props.toolList.some((ele: { path: string; }) => ele.path === props.currentPath);
  }

  const handleSelectTool = (path: string) => {
    handjumpPage(path);
    handleHiddenTool();
  }

  return (
    <div
      className={props.hidden ? 'globalMenu menuShowInfo-tran' : 'globalMenu'}
    >
      <div
        className={
          props.hidden ? 'menu-containr max' : 'menu-containr max show'
        }
      >
        {MENUS.map((item, index) => {
          return (
            <div
              className={
                props.currentPath == item.path
                  ? 'menu-item menu-selected'
                  : 'menu-item'
              }
              key={index}
              onClick={() => handjumpPage(item.path)}
            >
              <img
                src={
                  props.currentPath == item.path ? item.selectedIcon : item.icon
                }
                alt=""
              />
              <span>{item.title}</span>
            </div>
          );
        })}
        <Divider />
        {props.toolList.length > 0 && (
          <Fragment>
            <h4 className="menu-type-title">我的工具</h4>
              {props.toolList.map((item: any, index: number) => {
                return (
                  <div
                    className={
                      props.currentPath == item.path
                        ? 'menu-item menu-selected'
                        : 'menu-item'
                    }
                    key={index}
                    onClick={() => handjumpPage(item.path)}
                  >
                    <img
                      src={
                        props.currentPath == item.path ? item.selectedIcon : item.icon
                      }
                      alt=""
                    />
                    <span>{item.title}</span>
                  </div>
                );
              })}
          </Fragment>
        )}
      </div>
      <div
        className={
          props.hidden ? 'menu-containr min show' : 'menu-containr min'
        }
      >
        {MENUS.map((item, index) => {
          return (
            <div
              className="menu-item"
              key={index}
              onClick={() => handjumpPage(item.path)}
            >
              <img
                src={
                  props.currentPath == item.path ? item.selectedIcon : item.icon
                }
                alt=""
              />
              <span
                className={
                  props.currentPath == item.path
                    ? 'mune-title title-selected'
                    : 'mune-title'
                }
              >
                {item.title}
              </span>
            </div>
          );
        })}
        {/* 我的工具 */}
        {props.toolList.length > 0 && (
          <div className="tool-menu-item" onClick={handleShowTool}>
            <img src={ handleShowCurrent() ? icons_color : icons_color_black } alt="" />
            <span className={handleShowCurrent() ? 'tool-mune-title title-selected' : 'tool-smune-title' }>工具</span>
          </div>
        )}
      </div>
      <div className="btn-menu-change" onClick={handleChangeMenu}>
        <img
          className="btn-icon"
          src={props.hidden ? icons_right : icons_left}
          alt=""
        />
      </div>
      {/* 我的工具 */}
      <Popover
        id={id}
        open={open}
        anchorEl={toolEl}
        onClose={handleHiddenTool}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className="min-menu-tool">
          {props.toolList.map((item: any, index: number) => {
            return (
              <div
                className={
                  props.currentPath == item.path
                    ? 'menu-item menu-selected'
                    : 'menu-item'
                }
                key={index}
                onClick={() => handleSelectTool(item.path)}
              >
                <img
                  src={
                    props.currentPath == item.path ? item.selectedIcon : item.icon
                  }
                  alt=""
                />
                <span>{item.title}</span>
              </div>
            );
          })}
        </div>
      </Popover>
      <ToastContainer />
    </div>
  );
};

export default GlobalMenu;
