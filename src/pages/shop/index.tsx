import React, { useState, useEffect, createElement } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import name from '@/images/icons/icons-edit.png';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

import './index.scss';

const ShopPage: React.FC = (props) => {
  let _list = JSON.parse(JSON.stringify(tags));

  //弹窗变量
  const classes = useStyles();
  const [addTagModal, setAddTagModal] = React.useState(false);

  const [list, setList] = useState(_list);
  const [selectMenu, setSelectMenu] = useState(0);
  //拖动变量
  const [futureMenuIndex, setFutureMenuIndex] = useState(-1); //拖动标签覆盖到菜单，记录的当前菜单下标
  const [dragType, setDragType] = useState(-1); //拖动类型：1-菜单、2-标签
  const [moveTagIndex, setMoveTagIndex] = useState(-1); //当前拖动的标签下标
  const [targetTagIndex, setTargetTagIndex] = useState(-1); //目标标签
  const [moveMenuIndex, setMoveMenuIndex] = useState(-1); //当前拖动的菜单下标
  const [targetMenuIndex, setTargetMenuIndex] = useState(-1); //目标菜单

  const handleSelectMenu = (index: number) => {
    setSelectMenu(index);
  };

  //移动覆盖菜单
  const handleCoverMenu = (e: any, menuIndex: number) => {
    e.preventDefault();
    if (dragType === 1 && moveMenuIndex != menuIndex) {
      //菜单之间的移动
      setTargetMenuIndex(menuIndex);
    } else if (dragType === 2) {
      //标签添加到菜单
      setFutureMenuIndex(menuIndex);
    }
    setTargetTagIndex(-1);
  };

  //移动覆盖标签
  const handleCoverTag = (e: any, tagIndex: number) => {
    e.preventDefault();
    if (moveTagIndex != tagIndex && dragType === 2) {
      setTargetTagIndex(tagIndex);
    }
  };

  //在菜单中释放
  const handleLeaveMenu = (menuIndex: number) => {
    if (moveMenuIndex != menuIndex) {
      if (dragType === 2) {
        setFutureMenuIndex(-1); //移除菜单覆盖时的背景
        if (selectMenu != menuIndex) {
          //释放的菜单不是同一级
          let copyList = JSON.parse(JSON.stringify(list));
          let moveTag = copyList[selectMenu].child[moveTagIndex]; //移动的标签
          copyList[menuIndex].child.push(moveTag); //目标文件夹新增标签
          copyList[selectMenu].child.splice(moveTagIndex, 1); //原文件夹删除标签
          setList(copyList);
        }
      } else if (dragType === 1) {
        console.log('333333333', targetMenuIndex);
        let copyList = JSON.parse(JSON.stringify(list));
        copyList = moveTagAction(copyList, targetMenuIndex, moveMenuIndex);
        setList(copyList);
        if (moveMenuIndex > targetMenuIndex) {
          setSelectMenu(targetMenuIndex);
        } else {
          setSelectMenu(targetMenuIndex - 1);
        }
      }
    }
    //清空数据
    clearState();
  };

  //在标签中释放
  const handleLeaveTag = (tagIndex: number) => {
    if (moveTagIndex != targetTagIndex && targetTagIndex != -1) {
      //释放的菜单不是同一级
      let copyList = JSON.parse(JSON.stringify(list));
      copyList[selectMenu].child = moveTagAction(
        copyList[selectMenu].child,
        targetTagIndex,
        moveTagIndex,
      );
      setList(copyList);
    }
    //清空数据
    clearState();
  };

  //开始移动菜单
  const handleStartMoveMenu = (e: any, menuIndex: number) => {
    var img = new Image(50, 50);
    img.src =
      'https://iph.href.lu/100x50?text=%E7%A7%BB%E5%8A%A8%E4%B9%A6%E7%AD%BE&fg=666666&bg=cccccc';
    e.dataTransfer.setDragImage(img, -10, -10);
    setDragType(1);
    setMoveMenuIndex(menuIndex);
  };

  //开始拖动标签
  const handleStartMoveTag = (e: any, tagIndex: number) => {
    console.log(e);
    var img = new Image(50, 50);
    img.src =
      'https://iph.href.lu/100x50?text=%E7%A7%BB%E5%8A%A8%E4%B9%A6%E7%AD%BE&fg=666666&bg=cccccc';
    e.dataTransfer.setDragImage(img, -10, -10);
    setDragType(2);
    setMoveTagIndex(tagIndex);
  };

  //拖动完成，清空所有状态
  const clearState = () => {
    setMoveTagIndex(-1);
    setTargetTagIndex(-1);
    setMoveTagIndex(-1);
    setFutureMenuIndex(-1);
    setDragType(-1);
    setTargetMenuIndex(-1);
    setMoveMenuIndex(-1);
  };

  const moveTagAction = (
    arr: any,
    targetTagIndex: number,
    moveTagIndex: number,
  ) => {
    let newArr = JSON.parse(JSON.stringify(arr));
    if (moveTagIndex < targetTagIndex) {
      newArr.splice(targetTagIndex, 0, arr[moveTagIndex]);
      newArr.splice(moveTagIndex, 1);
    } else if (moveTagIndex > targetTagIndex) {
      newArr.splice(targetTagIndex, 0, arr[moveTagIndex]);
      newArr.splice(moveTagIndex + 1, 1);
    }
    console.log('22222222', newArr);
    return newArr;
  };

  const handleGotoUrl = (item: any) => {
    window.open(item.url);
  };

  const handleCloseAddTagModal = () => {
    setAddTagModal(false);
  };

  const handleOpenAddTagMenu = () => {
    setAddTagModal(true);
  };

  return (
    <div className="page-shop">
      <div className="menu-top">
        <div className="menu-boxs">
          {list.map((item: any, index: number) => {
            return (
              <div
                className={`box ${selectMenu == index ? 'select-menu' : ''} ${
                  futureMenuIndex == index ? 'tag-to-menu' : ''
                } ${targetMenuIndex == index ? 'menu-to-menu' : ''} `}
                key={index}
                draggable={true}
                onDragStart={(e) => handleStartMoveMenu(e, index)}
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
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label="add to shopping cart"
                      onClick={handleOpenAddTagMenu}
                    >
                      <AddBoxIcon
                        style={{
                          fontSize: 20,
                          color: 'rgba(99, 110, 114,0.6)',
                        }}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      aria-label="add to shopping cart"
                      onClick={handleOpenAddTagMenu}
                    >
                      <EditIcon
                        style={{
                          fontSize: 20,
                          color: 'rgba(99, 110, 114,0.6)',
                        }}
                      />
                    </IconButton>
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
                onDragStart={(e) => handleStartMoveTag(e, index)}
                onDragOver={(e) => handleCoverTag(e, index)}
                onDrop={() => handleLeaveTag(index)}
                onClick={() => handleGotoUrl(item)}
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
      {/* 新增菜单 */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={addTagModal}
        onClose={handleCloseAddTagModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={addTagModal}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">
              react-transition-group animates me.
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ShopPage;
