import React, { useState, useEffect } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import name from '@/images/icons/icons-edit.png';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const tags = [
  {
    id: 11,
    title: 'Flutter资源',
    child: [
      {
        id: 111,
        title: 'Flutter中文网',
        url: 'https://flutterchina.club/',
        des:
          'Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。',
      },
      {
        id: 112,
        title: 'Dart学习文档',
        url: 'https://pub.dev/',
        des: 'Dart语言基础语法学习文档。',
      },
      {
        id: 113,
        title: '《Flutter实战》电子书',
        url: 'https://book.flutterchina.club/',
        des:
          '本书是第一本系统介绍Flutter技术的中文书籍，它是Flutter中文社区发起的开源项目之一，旨在帮助开发者入门，系统地、循序渐进的了解Flutter。',
      },
    ],
  },
  {
    id: 12,
    title: '资源分享',
    child: [
      {
        id: 121,
        title: '前端之巅1',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
      {
        id: 122,
        title: '前端之巅2',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
      {
        id: 123,
        title: '前端之巅3',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
      {
        id: 124,
        title: '前端之巅4',
        url: 'http://www.youtube.com',
        des: '本文旨在用最通俗的语言讲述最枯燥的基本知识。',
      },
    ],
  },
  {
    id: 13,
    title: '服务器相关',
    child: [
      {
        id: 131,
        title: '我的博客1',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
      {
        id: 132,
        title: '我的博客2',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
      {
        id: 133,
        title: '我的博客3',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
      {
        id: 134,
        title: '我的博客4',
        url: 'https://www.cnblogs.com/W-Kr/p/5455862.html',
        des: '面向新手的Web服务器搭建。',
      },
    ],
  },
];

import './index.scss';

const ShopPage: React.FC = (props) => {
  let _list = JSON.parse(JSON.stringify(tags));

  const [list, setList] = useState(_list);
  const [selectMenu, setSelectMenu] = useState(0);
  //拖动变量
  const [futureMenuIndex, setFutureMenuIndex] = useState(-1); //拖动标签覆盖到菜单，记录的当前菜单下标
  const [dragType, setDragType] = useState(-1); //拖动类型：1-菜单、2-标签
  const [moveTagIndex, setMoveTagIndex] = useState(-1); //当前拖动的标签下标
  const [targetTagIndex, setTargetTagIndex] = useState(-1); //目标标签

  const handleSelectMenu = (index: number) => {
    setSelectMenu(index);
  };

  //移动到菜单
  const handleCoverMenu = (e: any, menuIndex: number) => {
    e.preventDefault();
    setFutureMenuIndex(menuIndex);
  };

  //移动覆盖标签
  const handleCoverTag = (e: any, tagIndex: number) => {
    e.preventDefault();
    if (moveTagIndex != tagIndex) {
      setTargetTagIndex(tagIndex);
    }
  };

  //在菜单中释放
  const handleLeaveMenu = (menuIndex: number) => {
    console.log(`菜单中释放,菜单索引 - ${menuIndex}`);
    setFutureMenuIndex(-1); //移除菜单覆盖时的背景
    if (selectMenu != menuIndex) {
      //释放的菜单不是同一级
      let copyList = JSON.parse(JSON.stringify(list));
      let moveTag = copyList[selectMenu].child[moveTagIndex]; //移动的标签
      copyList[menuIndex].child.push(moveTag); //目标文件夹新增标签
      copyList[selectMenu].child.splice(moveTagIndex, 1); //原文件夹删除标签
      console.log('移动后的list:', copyList);
      setList(copyList);
    }
    //清空数据
    setMoveTagIndex(-1);
    setTargetTagIndex(-1);
    setTargetTagIndex(-1);
  };

  //在标签中释放
  const handleLeaveTag = (tagIndex: number) => {
    console.log(`标签中释放，菜单索引 - ${selectMenu}，标签索引 - ${tagIndex}`);
    console.log(moveTagIndex, targetTagIndex, moveTagIndex != targetTagIndex);
    if (moveTagIndex != targetTagIndex && targetTagIndex != -1) {
      //释放的菜单不是同一级
      let copyList = JSON.parse(JSON.stringify(list));
      copyList[selectMenu].child = moveTagAction(
        copyList[selectMenu].child,
        targetTagIndex,
        moveTagIndex,
      );
      console.log('移动后的list:', copyList);
      setList(copyList);
    }
    //清空数据
    setMoveTagIndex(-1);
    setTargetTagIndex(-1);
    setTargetTagIndex(-1);
  };

  //开始拖动标签
  const handleStartMoveTag = (tagIndex: number) => {
    console.log('开始拖动的标签：', tagIndex);
    setMoveTagIndex(tagIndex);
  };

  //移动标签位置
  const moveTagAction = (arr: any, index: number, tindex: number) => {
    //如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
    //我们再把数组之前的那个拖动的元素删除掉，所以要len+1
    if (index > tindex) {
      arr.splice(tindex, 0, arr[index]);
      arr.splice(index + 1, 1);
    } else {
      //如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，
      //这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index
      arr.splice(tindex + 1, 0, arr[index]);
      arr.splice(index, 1);
    }
    return arr;
  };

  return (
    <div className="page-shop">
      <div className="menu-top">
        <div className="menu-boxs">
          {list.map((item: any, index: number) => {
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
          {list[selectMenu].child.map((item: any, index: number) => {
            return (
              <div
                className={targetTagIndex == index ? 'tag tag-cover' : 'tag'}
                draggable={true}
                key={index}
                onDragStart={() => handleStartMoveTag(index)}
                onDragOver={(e) => handleCoverTag(e, index)}
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
