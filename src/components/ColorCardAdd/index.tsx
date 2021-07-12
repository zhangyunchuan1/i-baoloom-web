import React, { useState, useEffect, useCallback } from 'react';
import { Toast } from '@/tool/tool';
import { PhotoshopPicker } from 'react-color';
import { Popover, Backdrop } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { KeyboardBackspace, Check } from '@material-ui/icons';
import copy from 'copy-to-clipboard';
import Http from '@/tool/http';
import './index.scss';

const useStyles = makeStyles((theme: Theme) => ({
  avatars: {
    cursor: 'pointer',
  },
  paper: {
    padding: '0px',
    boxShadow: '0px 0px 7px 0px rgb(0 0 0 / 10%)',
  },
}));

const backdropStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

//默认颜色
const defultList: any[] | (() => any[]) = [];
for (let index = 1; index < 21; index++) {
  defultList.push({
    color: `rgba(0, 0, 0, ${(0.05 * index).toFixed(2)})`,
    name: `示例${index}`,
  });
}

interface IProps {
  close: Function;
}

const ColorCardAdd: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const backdropClasses = backdropStyles();
  const [colorValue, setColorValue] = useState('red');
  const [title, settitle] = useState('');
  const [num, setNum] = useState(0); //用于更新页面状态
  const [colorPickerEl, setColorPickerEl] = useState(null);
  const open = Boolean(colorPickerEl);
  const id = open ? 'simple-popover' : undefined;
  const [openCopyModal, setOpenCopyModal] = useState(false);
  let clone_defultList = JSON.parse(JSON.stringify(defultList));
  const [colorList, setColorList] = useState(clone_defultList);

  useEffect(() => {
    setColorList(defultList);
    setNum(new Date().getTime());
  }, []);

  const handleChangeComplete = (color: any, event: any) => {
    setColorValue(color.hex);
    console.log('handleChangeComplete:', color);
  };
  const handleChangeColor = (color: any) => {
    console.log('handleChangeColor:', color);
  };

  const handleCloseColorPickerPopover = () => {
    setColorPickerEl(null);
  };

  const handleOpenColorPickerPopover = (event: any) => {
    setColorPickerEl(event.currentTarget);
  };

  const onAccept = (e: any) => {
    console.log('onAccept:', e);
    handleCloseColorPickerPopover();
    setOpenCopyModal(true);
    setTimeout(() => {
      setOpenCopyModal(false);
    }, 500);
    copy(colorValue);
  };

  const onCancel = (e: any) => {
    console.log('onCancel:', e);
    handleCloseColorPickerPopover();
  };

  const onfocus = (index: number) => {
    let nowColorDom = document.getElementById(`item-mask-${index}`);
    console.log(nowColorDom?.style);
    if (nowColorDom) {
      nowColorDom.style.display = 'flex';
    }
  };

  const onblur = (index: number) => {
    let nowColorDom = document.getElementById(`item-mask-${index}`);
    console.log(nowColorDom?.style);
    if (nowColorDom) {
      nowColorDom.style.display = 'none';
    }
  };

  const handleChangeColorValue = useCallback((e: any, index: number) => {
    let _colorList = colorList;
    _colorList[index].color = e.target.value;
    setColorList(_colorList);
    setNum(new Date().getTime());
  }, []);

  const handleChangeColorName = (e: any, index: number) => {
    let _colorList = colorList;
    _colorList[index].name = e.target.value;
    setColorList(_colorList);
    setNum(new Date().getTime());
  };

  const handleCloseModal = () => {
    props.close();
  };

  const handleChangeTitle = (e: any) => {
    settitle(e.target.value);
  };

  const handleSaveColor = () => {
    console.log(!title);
    if (!title) {
      return Toast.warning('请输入您的色卡标题！', '温馨提示');
    }
    let params = {
      title: title,
      colors: JSON.stringify(colorList),
      type: '2',
    };
    Http.post('/color/addColorCard', params).then((res: any) => {
      if (res.status === 200) {
        Toast.success('色卡添加成功！', '温馨提示');
        props.close(1); //关闭新增modal，并查询我的色卡
      } else {
        Toast.warning(res.message, '温馨提示');
      }
    });
  };

  return (
    <div className="color-card-add">
      <div className="add-header">
        <div className="back-btn" onClick={handleCloseModal}>
          <KeyboardBackspace />
          <span>返回</span>
        </div>
        <div
          className="color-pre-btn"
          style={{ background: colorValue }}
          onClick={handleOpenColorPickerPopover}
        ></div>
        {/* 取色器 */}
        <Popover
          id={id}
          open={open}
          anchorEl={colorPickerEl}
          onClose={handleCloseColorPickerPopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{
            paper: classes.paper,
          }}
        >
          <PhotoshopPicker
            className="my-color-picker"
            color={colorValue}
            onChange={handleChangeColor}
            onChangeComplete={handleChangeComplete}
            onAccept={onAccept}
            onCancel={onCancel}
          />
        </Popover>
        {/* 复制弹窗 */}
        <Backdrop
          className={backdropClasses.backdrop}
          style={{ backgroundColor: colorValue }}
          open={openCopyModal}
        >
          <div className="copy-modal-color">
            <p className="title">copy</p>
            <p className="color-value">{colorValue}</p>
          </div>
        </Backdrop>
        <div className="save-btn" onClick={handleSaveColor}>
          <span>保存</span>
          <Check />
        </div>
      </div>
      <div className="add-container">
        <div className="card-box">
          <div className="card">
            {colorList.map((item, index) => {
              return (
                <div
                  className="item"
                  style={{ background: item.color }}
                  key={index}
                >
                  <div
                    className={`item-mask msk-${index}`}
                    id={`item-mask-${index}`}
                  >
                    <input
                      className="color-value-input"
                      type="text"
                      placeholder="色值"
                      defaultValue={item.color}
                      onFocus={() => onfocus(index)}
                      onBlur={() => onblur(index)}
                      onChange={(e) => handleChangeColorValue(e, index)}
                    />
                    <input
                      className="color-name-input"
                      type="text"
                      placeholder="色名"
                      defaultValue={item.name}
                      onFocus={() => onfocus(index)}
                      onBlur={() => onblur(index)}
                      onChange={(e) => handleChangeColorName(e, index)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card-title">
            <input
              type="text"
              placeholder="色卡标题"
              onChange={handleChangeTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCardAdd;
