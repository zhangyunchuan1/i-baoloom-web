import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from 'antd';
import { history, useSelector } from 'umi';
import { Divider, Avatar } from '@material-ui/core';
import './index.scss';
import Http from '@/tool/http';
import { ToastContainer, toast } from 'material-react-toastify';
import SimpleEditor from '@/components/SimpleEditor';
import CommentCell from '@/components/CommentCell';
import { makeStyles } from '@material-ui/core/styles';
import icons_like from '@/images/icons/icons-like.png';
import icons_like_yes from '@/images/icons/icons-like-yes.png';
import icons_update from '@/images/icons/icons-update.png';


const useStyles = makeStyles((theme) => ({
  avatars: {
    marginRight: "15px"
  },
  paper: {
    padding: '0px',
    boxShadow: '0px 0px 7px 0px rgb(0 0 0 / 10%)',
  },
}));

const ArticleDetailPage: React.FC = (props) => {
  const classes = useStyles();
  const loginStore = useSelector((state: any) => state.login);
  const [articleDetail, setArticleDetail] = useState<any>({});
  const [commentList, setCommentList] = useState<Array<any>>([]);
  const [showInputId, setShowInputId] = useState(""); //当前需要评论/回复的内容id
  const [commentContent, setCommentContent] = useState("");
  const [userInfo, setUserInfo] = useState<any>({});
  const [liked, setLiked] = useState(false); //是否点赞
  const [likes, setLikes] = useState(0); //点赞数
  const [hasFoloow, setHasFoloow] = useState(false); //是否关注

  useEffect(()=>{
    getArticleDetail();
  }, []);

  const getArticleDetail = () => {
    let id = history.location.query?.id;
    let params = {
      id: id
    };
    Http.post('/article/articleDetail', params).then((res: any) => {
      if (res.status === 200) {
        let { userInfo, liked, likes, followed } = res.data;
        setArticleDetail(res.data);
        setLiked(liked);
        setLikes(likes);
        getCommentList();
        setUserInfo(userInfo);
        setHasFoloow(followed);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const getCommentList = () => {
    let id = history.location.query?.id;
    let params = {
      belong: id
    };
    Http.post('/article/getComment', params).then((res: any) => {
      if (res.status === 200) {
        setCommentList(res.data);
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const handleShowReplyInput = (id: string) => {
    setShowInputId(id);
  }

  //一级评论
  const submitComment = () => {
    if(!loginStore.loginStatus){
      return toast.warning("请先登录哦！", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    let id = history.location.query?.id;
    if(!commentContent){
        return toast.error("请输入评论内容！", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
    }
    let params = {
      content: commentContent,
      belong: id,
      parant: id,
      createTo: articleDetail.createBy
    };
    Http.post('/article/comment', params).then((res: any) => {
      if (res.status === 200) {
        getCommentList();
        setCommentContent("");
        setShowInputId("");
        toast.success(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }
  //二级回复
  const submitReply = (data: any) => {
    let id = history.location.query?.id;
    console.log('回复的那条数据：', data, commentContent);
    if(!commentContent){
        return toast.error(`请输入${data.type === "1" ? "评论" : "回复"}内容！`, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
    }
    let params = {
      content: commentContent,
      belong: id, //文章id
      parant: data.type === "1" ? data.id : data.parant, 
      createTo: data.createBy
    };
    Http.post('/article/comment', params).then((res: any) => {
      if (res.status === 200) {
        getCommentList();
        setCommentContent("");
        setShowInputId("");
        toast.success(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  // 点赞
  const handleLike = (type: string) => {
    let id = history.location.query?.id;
    let _likes;
    let params = {
      id,
      type, //1:点赞/2:取消点赞
      likeType:"article"
    };
    Http.post('/article/likeOrDislike', params).then((res: any) => {
      if (res.status === 200) {
        switch (type) {
          case "1":
            setLiked(true);
            _likes = likes+1;
            setLikes(_likes);
            break;
          case "2":
            setLiked(false);
            _likes = likes-1;
            setLikes(_likes);
            break;
          default:
            break;
        }
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  }

  const getAvatarZm = (name: any) => {
    let fristName = name.substr(0, 1);
    return fristName;
  };

  //关注/取消关注  1: 关注， 2: 取消关注
  const handleFollow = (type: string) => {
    let params = {
      id: articleDetail.createBy,
      type,
    };
    Http.post('/user/followUser', params).then((res: any) => {
      if (res.status === 200) {
        if(type === "1"){
          setHasFoloow(true);
        }else if(type === "2"){
          setHasFoloow(false);
        }
      }else{
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    })
  }

  return (
    <div className="page-article-detail">
      <div className="article-detail-content">
        <div className="main">
          <p className="article-title">{articleDetail.title}</p>
          <div className="user-info-num">
            <div className="left">
              <span className="user-name">{articleDetail.userName}</span>
              <span className="upload-time">{articleDetail.createTime}</span>
            </div>
            <div className="statistics">
              <span>浏览:{articleDetail.views}</span>
              <span>评论:{commentList.length}</span>
            </div>
          </div>
          <Divider />
          <div className="html-content" dangerouslySetInnerHTML={{__html: articleDetail.content}}></div>
          <div className="likes-box">
            <div className="like-warp">
              {liked ? (<img src={icons_like_yes} alt="" onClick={()=>handleLike("2")} />):(<img src={icons_like} alt="" onClick={()=>handleLike("1")} />)}
            </div>
            <span className="like-num">{likes}</span>
          </div>
          <div className="comment-box">
            <div className="reply-box">
              <SimpleEditor 
                value={commentContent}
                placeholder="评论楼主：" 
                onChange={(html: string) => {
                  setCommentContent(html);
                }} 
              />
              <div className="reply-btn" onClick={submitComment}>评论</div>
            </div>
            <div className="comment-list">
              <div className="comment-head">
                <span>全部评论（{commentList.length}）</span>
              </div>
              {commentList.map((item,index)=>{
                return (
                  <div className="comment-item" key={index}>
                    <CommentCell 
                      data={item} 
                      userId={articleDetail.createBy}
                      showInputId={showInputId} 
                      showInput={handleShowReplyInput} 
                      html={commentContent}
                      onChange={(html: string) => {
                        setCommentContent(html);
                      }}  
                      submit={submitReply}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="left-content">
          <div className="avatar-name">
            {(userInfo.avatar ? (
              <Avatar
                alt="Remy Sharp"
                className={classes.avatars}
                src={userInfo.avatar}
              />
            ) : (
              <Avatar
                className={classes.avatars}
              >
                {getAvatarZm(userInfo.userName || "")}
              </Avatar>
            ))}
            <p className="userName">{userInfo.userName}</p>
          </div>
          <div className="statistics">
              <div className="item">
                <span className="num">{userInfo.articleTotal}</span>
                <span className="title">文章</span>
              </div>
              <div className="item center">
                <span className="num">{userInfo.visits}</span>
                <span className="title">访问量</span>
              </div>
              <div className="item">
                <span className="num">{userInfo.fansNum}</span>
                <span className="title">粉丝</span>
              </div>
          </div>
          {hasFoloow ? (
            <div className="fans-btn-cancle" onClick={()=>{handleFollow("2")}}>取消关注</div>
          ) : (
            <div className="fans-btn" onClick={()=>{handleFollow("1")}}>关注</div>
          )}
          <div className="about-hot">
            <div className="title-btn">
              <span className="title">相关推荐</span>
              <span className="update"><img src={icons_update} alt="" /> 换一换</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ArticleDetailPage;
