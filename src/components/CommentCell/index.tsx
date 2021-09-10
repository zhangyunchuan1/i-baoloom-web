import React, { useEffect, useState } from 'react';
import './index.scss';
import SimpleEditor from '@/components/SimpleEditor';
import {Avatar} from '@material-ui/core';
import { useSelector } from 'umi';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'material-react-toastify';

interface IProps {
  data: any,
  userId: string,
  html: string,
  showInputId: string,
  showInput: Function,
  onChange: Function,
  submit: Function,
}

const useStyles = makeStyles((theme) => ({
  avatars: {
    marginRight: "15px"
  },
  paper: {
    padding: '0px',
    boxShadow: '0px 0px 7px 0px rgb(0 0 0 / 10%)',
  },
}));

const CommentCell: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const loginStore = useSelector((state: any) => state.login);
  const [showReply, setShowReply] = useState(false);
  const getAvatarZm = (name: any) => {
    let fristName = name.substr(0, 1);
    return fristName;
  };
  return (
    <div className="comment-cell-warp">
      <div className="comment-cell">
        {(props.data.createByAvatar ? (
          <Avatar
            alt="Remy Sharp"
            className={classes.avatars}
            src={props.data.createByAvatar}
          />
        ) : (
          <Avatar
            className={classes.avatars}
          >
            {getAvatarZm(props.data.createByName)}
          </Avatar>
        ))}
        {/* <img className="avatar" src="https://img0.baidu.com/it/u=2064236049,533493186&fm=26&fmt=auto&gp=0.jpg" alt="" /> */}
        <div className="comment-main">
          {props.data.type === "1" && (
            <div className="userName">
              {props.data.createByName}
              {props.userId === props.data.createBy && (<div className="louzhu">楼主</div>)}
            </div>
          )}
          {props.data.type === "2" && (
            <div className="reply-title">
              <div className="userName">
                {props.data.createByName}
                {props.userId === props.data.createBy && (<div className="louzhu">楼主</div>)}
              </div>
              <span className="re-tip">回复</span> 
              <div className="userName">
                {props.data.createToName}
                {props.userId === props.data.createTo && (<div className="louzhu">楼主</div>)}
              </div>
            </div>
          )}
          <div className="content" dangerouslySetInnerHTML={{__html: props.data.content}}></div>
          <div className="time-options">
            <div className="left">
              <span className="time">{props.data.createTime}</span>
              {props.data.children && props.data.children.length > 0  && (showReply ? (<div className="see-reply" onClick={()=>{setShowReply(false)}}>收起评论</div>) : (<div className="see-reply" onClick={()=>{setShowReply(true)}}>查看{props.data.children.length}条回复&gt;</div>))}
            </div>
            <div className="options">
              {loginStore.userInfo.id != props.data.createBy && (
                <span onClick={()=>{
                  if(!loginStore.loginStatus){
                    return toast.warning("请先登录哦！", {
                      position: toast.POSITION.BOTTOM_CENTER,
                    });
                  }
                  props.showInput(props.data.id);
                }}>回复</span>
              )}
              {/* <span>点赞</span> */}
            </div>
          </div>
        </div>
      </div>
      {props.showInputId === props.data.id && (
        <div className="reply-input">
          <SimpleEditor 
            value={props.html}
            placeholder="输入回复：" 
            onChange={(html: string) => {
              props.onChange(html);
            }}  
          />
          <div className="reply-option">
            <span className="font-num-tip">还能输入1000个字符</span>
            <div className="option">
              <div className="reply-btn-cancle" onClick={()=>{
                props.showInput("");
                props.onChange("");
              }}>取消回复</div>
              <div className="reply-btn-submit" onClick={()=>{props.submit(props.data);}}>发布回复</div>
            </div>
          </div>
        </div>
      )}
      {showReply && (
        props.data.children.map((ele: any, ind: number)=>{
          return (
            <div className="two-reply" key={ind}>
              <CommentCell 
                data={ele} 
                userId={props.userId}
                showInputId={props.showInputId} 
                showInput={(id:string)=>{
                  props.showInput(id);
                }} 
                html={props.html}
                onChange={(html: string) => {
                  props.onChange(html);
                }}  
                submit={(cell: any)=>props.submit(cell)}
              />
            </div>
          )
        })
      )}
    </div>
  );
}

export default CommentCell;