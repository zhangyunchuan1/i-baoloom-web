import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Avatar } from '@material-ui/core';
import Http from '@/tool/http';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { toast } from 'material-react-toastify';
import './index.scss';
import MyArticleComp from './myArticle';
import user_center_article from '@/images/icons/user_center_article.png';
import user_center_question from '@/images/icons/user_center_question.png';
import user_center_message from '@/images/icons/user_center_message.png';
import user_center_shouchang from '@/images/icons/user_center_shouchang.png';

const useStyles = makeStyles((theme) => ({
  avatars: {
    cursor: 'pointer',
    width: "100px",
    height: "100px"
  },
  paper: {
    padding: '0px',
    boxShadow: '0px 0px 7px 0px rgb(0 0 0 / 10%)',
  },
}));

const TABS = [
  {
    title: "文章", 
    icon: user_center_article
  },
  {
    title: "问答", 
    icon: user_center_question
  },
  {
    title: "消息", 
    icon: user_center_message
  },
  {
    title: "收藏", 
    icon: user_center_shouchang
  },
];

const UserCenterPage: React.FC = (props) => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState<any>({});
  const [tabIndex, setTabIndex] = useState(0);

  const getAvatarZm = (name: any) => {
    let fristName = name?.substr(0, 1);
    return fristName;
  };

  const handleChangeTab = (index: number) => {
    setTabIndex(index);
  };

  const initUserInfo = () => {
    let params = {};
    Http.post('/user/queryMyUserInfo', params).then((res: any) => {
      if (res.status === 200) {
        setUserInfo(res.data);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  useEffect(() => {
    initUserInfo();
  }, []);

  return (
    <div className="page-user-center">
      <div className="user-info-head">
        <div className="left">
          {userInfo.avatar ? (
            <Avatar
              alt="Remy Sharp"
              className={classes.avatars}
              src={userInfo.avatar}
            />
          ) : (
            <Avatar
              className={classes.avatars}
            >
              {getAvatarZm(userInfo.userName)}
            </Avatar>
          )}
          <div className="info-content">
            <h2>{userInfo.userName}</h2>
            <p>邮箱： {userInfo.email || "未绑定邮箱"}</p>
            <p>简介： {userInfo.introduce || "这个砍脑壳的是个懒批，撒子都不写！"}</p>
          </div>
        </div>
        <div className="right">
            <div className="edit-btn">编辑个人资料</div>
        </div>
      </div>
      <div className="user-content">
        <div className="tab-head-num">
          <div className="tab-head">
            {TABS.map((item,index)=>{
              return (
                <div className="tab-item" key={index} onClick={()=>handleChangeTab(index)}>
                  <img className="tab-icon" src={item.icon} alt="" />
                  <span className={tabIndex === index ? "tab-title-selected" : "tab-title"}>{item.title}</span>
                  {tabIndex === index && (<span className="selected-bar"></span>)}
                </div>
              )
            })}
          </div>
          <div className="num-head">
            <div className="item-num">
              <span className="title">关注</span>
              <span className="num">{userInfo.followNum}</span>
            </div>
            <div className="item-num">
              <span className="title">粉丝</span>
              <span className="num">{userInfo.fansNum}</span>
            </div>
            <div className="item-num">
              <span className="title">浏览量</span>
              <span className="num">{userInfo.visits}</span>
            </div>
          </div>
        </div>
        <div className="tab-body">
          {tabIndex === 0 && (<MyArticleComp />)}
        </div>
      </div>
    </div>
  );
};

export default UserCenterPage;
