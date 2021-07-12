import React, { useEffect } from 'react';
import { history } from 'umi';
import './index.scss';
import icons_left from '../../images/icons/icon-left.png';
import icons_right from '../../images/icons/icons-right.png';
import icons_home from '../../images/icons/icons-home.png';
import icons_home_black from '../../images/icons/icons-home-black.png';
import icons_nav from '../../images/icons/icons-nav.png';
import icons_nav_black from '../../images/icons/icons-nav-black.png';
import icons_color from '../../images/icons/icons-color.png';
import icons_color_black from '../../images/icons/icons-color-black.png';

const MENUS = [
  {
    title: '首页',
    icon: icons_home_black,
    iconSle: icons_home,
    pathName: '/layout/home',
  },
  {
    title: '书签',
    icon: icons_nav_black,
    iconSle: icons_nav,
    pathName: '/layout/shop',
  },
  {
    title: '配色板',
    icon: icons_color_black,
    iconSle: icons_color,
    pathName: '/layout/color',
  },
  {
    title: '计划表',
    icon: icons_color_black,
    iconSle: icons_color,
    pathName: '/layout/plan',
  },
];

interface IProps {
  change: Function;
  hidden: boolean;
  currentPath: string;
}

const GlobalMenu: React.FC<IProps> = (props) => {
  useEffect(() => {
    console.log('GlobalMenu props', props);
  }, [props.currentPath]);

  const handleChangeMenu = () => {
    props.change();
  };

  const handjumpPage = (path: string): void => {
    history.push(path);
  };

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
                props.currentPath == item.pathName
                  ? 'menu-item menu-selected'
                  : 'menu-item'
              }
              key={index}
              onClick={() => handjumpPage(item.pathName)}
            >
              <img
                src={
                  props.currentPath == item.pathName ? item.iconSle : item.icon
                }
                alt=""
              />
              <span>{item.title}</span>
            </div>
          );
        })}
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
              onClick={() => handjumpPage(item.pathName)}
            >
              <img
                src={
                  props.currentPath == item.pathName ? item.iconSle : item.icon
                }
                alt=""
              />
              <span
                className={
                  props.currentPath == item.pathName
                    ? 'mune-title title-selected'
                    : 'mune-title'
                }
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
      <div className="btn-menu-change" onClick={handleChangeMenu}>
        <img
          className="btn-icon"
          src={props.hidden ? icons_right : icons_left}
          alt=""
        />
      </div>
    </div>
  );
};

export default GlobalMenu;
