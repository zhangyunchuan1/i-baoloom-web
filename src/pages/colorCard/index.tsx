import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, history } from 'umi';
import { Dialog, Slide, Modal, Backdrop } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import ColorCardAdd from '@/components/ColorCardAdd';
import ShowCardModal from '@/components/ShowCardModal';
import Http from '@/tool/http';
import icons_add from '@/images/icons/icons-add.png';
import empty_bg from '@/images/empty-bg.png';
import './index.scss';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ColorPage: React.FC = (props) => {
  //page store
  const loginStore = useSelector((state: any) => state.login);
  //page state
  const [colorList, setcolorList] = useState<Array<any>>([]);
  const [myColorList, setmyColorList] = useState<Array<any>>([]);
  const [cardModal, setCardModal] = useState(false);
  const [showColorMldal, setShowColorMldal] = useState(false);
  const [showColorValue, setShowColorValue] = useState<Array<any>>([]);

  useEffect(() => {
    initRecommendColor();
    initMyColor();
  }, []);

  //获取热门色板
  const initRecommendColor = () => {
    Http.post('/color/queryRecommendColor').then((res: any) => {
      console.log('热门色卡结果：', res);
      if (res.status === 200) {
        setcolorList(res.data);
      }
    });
  };

  //获取我的色板
  const initMyColor = () => {
    Http.post('/color/queryMyColor').then((res: any) => {
      console.log('我的色卡结果：', res);
      if (res.status === 200) {
        setmyColorList(res.data);
      }
    });
  };

  //关闭新增modal
  const handleCloseAddCardModal = (isRefuse?: number) => {
    setCardModal(false);
    if (isRefuse && isRefuse == 1) {
      initMyColor();
    }
  };

  const handleOpenAddCardModal = () => {
    setCardModal(true);
  };

  const handleCloseShowColorMldal = () => {
    setShowColorMldal(false);
  };

  const handleOpenShowCardModal = (index: number, type: number) => {
    if (type == 1) {
      setShowColorValue(colorList[index].colors);
    } else {
      setShowColorValue(myColorList[index].colors);
    }
    setShowColorMldal(true);
  };

  return (
    <div className="page-color">
      <h3 className="plate-title">热门色板</h3>
      <div className="color-container">
        {colorList.map((item: any, index) => {
          return (
            <div
              className="color-card"
              key={index}
              onClick={() => handleOpenShowCardModal(index, 1)}
            >
              <div className="card">
                {item.colors.map((value: any, i: any) => {
                  return (
                    <div
                      className="item"
                      style={{ background: value.color }}
                      key={i}
                    ></div>
                  );
                })}
              </div>
              <p className="title">{item.title}</p>
            </div>
          );
        })}
      </div>
      <h3 className="plate-title">我的色板</h3>
      {loginStore.loginStatus && (
        <div className="color-container">
          {myColorList.map((item: any, index) => {
            return (
              <div
                className="color-card"
                key={index}
                onClick={() => handleOpenShowCardModal(index, 2)}
              >
                <div className="card">
                  {item.colors.map((value: any, i: any) => {
                    return (
                      <div
                        className="item"
                        style={{ background: value.color }}
                        key={i}
                      ></div>
                    );
                  })}
                </div>
                <p className="title">{item.title}</p>
              </div>
            );
          })}
          {/* 新增按钮 */}
          <div className="color-card add-btn" onClick={handleOpenAddCardModal}>
            <img src={icons_add} alt="" />
          </div>
        </div>
      )}
      {!loginStore.loginStatus && (
        <div className="empty-box">
          <img className="empty" src={empty_bg} alt="" />
          <p>
            登录后可添加属于您的色卡哟～{' '}
            <span
              onClick={() => {
                history.push('/login');
              }}
            >
              去登录
            </span>
          </p>
        </div>
      )}
      <Dialog
        fullScreen
        open={cardModal}
        onClose={() => handleCloseAddCardModal()}
        TransitionComponent={Transition}
      >
        <ColorCardAdd close={handleCloseAddCardModal} />
      </Dialog>
      <Dialog
        open={showColorMldal}
        onClose={handleCloseShowColorMldal}
        aria-labelledby="customized-dialog-title"
        className="show-color-modal-dilog"
      >
        <ShowCardModal
          colors={showColorValue}
          close={handleCloseShowColorMldal}
        />
      </Dialog>
    </div>
  );
};

export default ColorPage;
