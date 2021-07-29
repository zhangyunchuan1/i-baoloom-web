import React, { useState, useEffect } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import name from '@/images/icons/icons-edit.png';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const tags = [
  {
    title: 'Flutter资源',
    child: [
      {
        title: 'Flutter中文网',
        url: 'https://flutterchina.club/',
        des:
          'Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。',
      },
      {
        title: 'Dart学习文档',
        url: 'https://pub.dev/',
        des: 'Dart语言基础语法学习文档。',
      },
      {
        title: '《Flutter实战》电子书',
        url: 'https://book.flutterchina.club/',
        des:
          '本书是第一本系统介绍Flutter技术的中文书籍，它是Flutter中文社区发起的开源项目之一，旨在帮助开发者入门，系统地、循序渐进的了解Flutter。',
      },
    ],
  },
  {
    title: '资源分享',
    child: [
      {
        title: '前端之巅1',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
      {
        title: '前端之巅2',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
      {
        title: '前端之巅3',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
      {
        title: '前端之巅4',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
    ],
  },
  {
    title: '服务器相关',
    child: [
      {
        title: '我的博客1',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
      {
        title: '我的博客2',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
      {
        title: '我的博客3',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
      {
        title: '我的博客4',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
    ],
  },
];

import './index.scss';

const ShopPage: React.FC = (props) => {
  const [selectMenu, setSelectMenu] = useState(0);
  //拖动变量
  const [futureMenuIndex, setFutureMenuIndex] = useState(-1); //拖动标签覆盖到菜单，记录的当前菜单下标
  const [dragType, setDragType] = useState(-1); //拖动类型：1-菜单、2-标签

  const handleSelectMenu = (index: number) => {
    setSelectMenu(index);
  };

  //移动覆盖
  const handleCoverMenu = (e: any, menuIndex: number) => {
    e.preventDefault();
    setFutureMenuIndex(menuIndex);
  };

  //在菜单中释放
  const handleLeaveMenu = (menuIndex: number) => {
    console.log(`菜单中释放,菜单索引 - ${menuIndex}`);
    setFutureMenuIndex(-1); //移除菜单覆盖时的背景
  };

  const handleLeaveTag = (tagIndex: number) => {
    console.log(`标签中释放，菜单索引 - ${selectMenu}，标签索引 - ${tagIndex}`);
  };

  return (
    <div className="page-shop">
      <div className="menu-top">
        <div className="menu-boxs">
          {tags.map((item, index) => {
            return (
              <div
                className={`box ${
                  selectMenu == index || futureMenuIndex == index
                    ? 'selected-box'
                    : ''
                }`}
                key={index}
                onClick={() => handleSelectMenu(index)}
                onDragOver={(e) => handleCoverMenu(e, index)}
                onDrop={() => handleLeaveMenu(index)}
              >
                <div className="box-color-name">
                  <span className="box-color"></span>
                  <span className="box-name">{item.title}</span>
                </div>
                <span className="box-num">{item.child.length}</span>
                <div className="box-option">
                  <div className="option-warp">
                    <AddBoxIcon
                      style={{
                        fontSize: 20,
                        color: 'rgba(99, 110, 114,0.6)',
                        marginRight: '5px',
                      }}
                    />
                    <EditIcon
                      style={{ fontSize: 20, color: 'rgba(99, 110, 114,0.6)' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="menu-tags">
          {tags[selectMenu].child.map((item, index) => {
            return (
              <div
                className="tag"
                draggable={true}
                key={index}
                onDrop={() => handleLeaveTag(index)}
              >
                <h3 className="tag-title">{item.title}</h3>
                <p className="tag-desc">{item.des}</p>
                <div className="tag-bot">
                  <div className="tag-bot-left">
                    <img
                      className="tag-logo"
                      src={`https://api.clowntool.cn/getico/?url=${item.url}`}
                      alt=""
                    />
                    <span className="tag-url" title={item.url}>
                      {item.url}
                    </span>
                  </div>
                  <div className="tag-bot-right">
                    <img
                      src={require('../../images/icons/icons-edit.png')}
                      alt=""
                    />
                    <img
                      src={require('../../images/icons/icons-delete.png')}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
