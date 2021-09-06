import React, { Fragment, useEffect, useState } from 'react';
import Http from '@/tool/http';
import { history, useSelector, useDispatch } from 'umi';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { ToastContainer, toast } from 'material-react-toastify';
import empty_bg from '@/images/empty-bg.png';
import './index.scss';

let list = [
  {
    title: "书签",
    img: "https://img0.baidu.com/it/u=282199628,1621255696&fm=26&fmt=auto&gp=0.jpg",
    subscribe: true,
    pathName: '/layout/shop',
    des:"开发了说那是咖喱说三闾大夫是冷水，起风了给你问过你我里嗡嗡过呢我，钱塘区了给你问吧，为他你很同情年富力强温暖，喂辅我儿one好，位居国内热乎5个5，问他为i她你为i她你。"
  },
  {
    title: "配色板",
    img: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp2.itc.cn%2Fq_70%2Fimages03%2F20210720%2Fb4a12e353b7d4f3c9a0def4de0da4345.png&refer=http%3A%2F%2Fp2.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631259082&t=409d456e8c957ee83f4380ab1a0e714b",
    subscribe: true,
    pathName: '/layout/color',
    des:"开发了说那是咖喱说三闾大夫是冷水，起风了给你问过你我里嗡嗡过呢我，钱塘区了给你问吧，为他你很同情年富力强温暖，喂辅我儿one好，位居国内热乎5个5，问他为i她你为i她你。"
  },
  {
    title: "计划表",
    img: "https://img0.baidu.com/it/u=3332002069,3441161385&fm=26&fmt=auto&gp=0.jpg",
    subscribe: false,
    pathName: '/layout/plan',
    des:"开发了说那是咖喱说三闾大夫是冷水，起风了给你问过你我里嗡嗡过呢我，钱塘区了给你问吧，为他你很同情年富力强温暖，喂辅我儿one好，位居国内热乎5个5，问他为i她你为i她你。"
  },
];

const PlanPage: React.FC = (props) => {
  //store
  const dispatch = useDispatch();
  const loginStore = useSelector((state: any) => state.login);
  //state
  const [selectType, setSelectType] = useState(1);  //1: 我的工具  2: 其他工具
  
  const [toolList, setToolList] = useState<Array<any>>([]);
  const [showInfoIndex, setShowInfoIndex] = useState(-1);

  useEffect(()=>{
    if(loginStore.loginStatus){
      getMyTools();
    }else{
      getAllTools();
    }
  },[]);

  //获取我的工具
  const getMyTools = () => {
    Http.post('/tool/myTool').then((res: any) => {
      if (res.status === 200) {
        setToolList(res.data);
      } else {
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  //获取我的未订阅工具
  const getOtherTools = () => {
    Http.post('/tool/allTool').then((res: any) => {
      if (res.status === 200) {
        setToolList(res.data);
      } else {
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  //获取所有工具
  const getAllTools = () => {
    Http.post('/tool/tools').then((res: any) => {
      if (res.status === 200) {
        setToolList(res.data);
      } else {
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  //点击订阅/取消订阅
  const handleSubscribe = (tool: any) => {
    if(!loginStore.loginStatus) return toast.warning("请先登录哦！", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    if(!tool.subscribed){  //未订阅的，去订阅
      goSubscribe(tool.toolId);
    }else{  //取消订阅
      // toast.success("取消订阅", {
      //   position: toast.POSITION.BOTTOM_CENTER,
      // });
    }
  }

  //去订阅
  const goSubscribe = (toolId: string) => {
    let params = {
      toolId: toolId
    };
    Http.post('/tool/subscribe', params).then((res: any) => {
      if (res.status === 200) {
        toast.success(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        getOtherTools();
        //更新我的菜单
        Http.post('/tool/myTool').then((res: any) => {
          if (res.status === 200) {
            dispatch({
              type: 'menu/changeUserTools',
              payload: res.data,
            });
          } else {
            toast.error(res.message, {
              position: toast.POSITION.BOTTOM_CENTER,
            });
          }
        });
      } else {
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const handleChangeType = (type: number) => {
    if(type == 1){
      getMyTools();
    }else{
      getOtherTools();
    }
    setSelectType(type);
  }
  const handleCloseInfo = () => {
    setShowInfoIndex(-1);
  }
  const handleOpenInfo = (index: number) => {
    setShowInfoIndex(index);
  }
  const handleSelectTool = (path: string) => {
    path && history.push(path);
  }
  return (
    <div className="page-tool-introduce">
      <div className="tool-header">
        {loginStore.loginStatus ? (
          <Fragment>
            <span className={ selectType == 1 ? 'title-type title-selected' : 'title-type' } onClick={()=>handleChangeType(1)}>我的工具</span>
            <span className={ selectType == 2 ? 'title-type title-selected' : 'title-type' } onClick={()=>handleChangeType(2)}>其他工具</span>
          </Fragment>
        ):(
          <span className="title-type title-selected">所有工具</span>
        )}
      </div>
      <div className="tool-box">
        {toolList.map((item, index)=>{
          return (
            <div className="tool" key={index}>
              <div className={item.subscribed ? 'subscribed' : 'subscribe'} onClick={()=>handleSubscribe(item)}>{item.subscribed ? '已订阅' : '订阅'}</div>
              <img src={item.img} alt="" />
              <p className="tool-title" onClick={()=>handleSelectTool(item.path)}>{item.title}</p>
              <p className="tool-des" title="查看完整介绍" onClick={()=>handleOpenInfo(index)}>{item.describe}</p>
              <div className={showInfoIndex == index ? "tool-info-des info-show" : "tool-info-des"}>
                <div className="tool-info-des-title">
                  <h4>工具描述：</h4>
                  <IconButton size="small" disableRipple onClick={handleCloseInfo}>
                    <CloseIcon style={{color: "#bfbfbf"}} />
                  </IconButton>
                </div>
                <p>{item.describe}</p>
              </div>
            </div>
          )
        })}
        {toolList.length == 0 && (
        <div className="empty-box">
          <img className="empty" src={empty_bg} alt="" />
          {selectType == 1 && (
            <p>
              您还没有订阅的功能哦
              <span
                onClick={()=>handleChangeType(2)}
              >
                快去订阅吧
              </span>
            </p>
          )}
          {selectType == 2 && (
            <p>
              i-baoloom正在研发新的功能，敬请期待～
            </p>
          )}
        </div>
      )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PlanPage;