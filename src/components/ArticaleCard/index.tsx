import React, { useEffect, useState } from 'react';
import { Divider, Avatar } from '@material-ui/core';
import { Textsms, Favorite, ThumbUpAlt } from '@material-ui/icons';
import './index.scss';
import { history, Link } from 'umi';

interface IProps {
  data: any;
}

const ArticaleCard: React.FC<IProps> = (props) => {
  const removeHTMLTag = (str:string) => {
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/ /ig,'');//去掉 
    return str;
  }

  const getAvatarZm = (name: any) => {
    let fristName = name.substr(0, 1);
    return fristName;
  };

  return (
    <div className="articale-card">
      {props.data.cover && (<img className="card-img" src={props.data.cover} alt="" />)}
      <div className="artical-content">
      <Link target = "_blank"  rel="opener" to={`/layout/articleDetail?id=${props.data.id}`}><p className="articale-title">{props.data.title}</p></Link>
        <p className="articale-desc">
          {removeHTMLTag(props.data.content)}
        </p>
        <div className="articale-user-info">
          <div className="left">
            {(props.data.avatar ? (
              <Avatar
                alt="Remy Sharp"
                className="info-avatar"
                src={props.data.avatar}
              />
            ) : (
              <Avatar
              className="info-avatar"
              >
                {getAvatarZm(props.data.userName || "")}
              </Avatar>
            ))}
            <span className="info-name">{props.data.userName}</span>
            <span className="info-time">发布于 {props.data.createTime}</span>
          </div>
          <span className="right">{props.data.views}次浏览</span>
        </div>
      </div>
    </div>
  );
};

export default ArticaleCard;
