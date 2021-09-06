import React, { useEffect, useState } from 'react';
import { Divider, Avatar } from '@material-ui/core';
import { Textsms, Favorite, ThumbUpAlt } from '@material-ui/icons';
import './index.scss';
import { history, Link } from 'umi';

interface IProps {
  data: any;
}

const ArticaleCard: React.FC<IProps> = (props) => {

  return (
    <div className="articale-card">
      {props.data.cover && (<img className="card-img" src={props.data.cover} alt="" />)}
      <div className="artical-content">
      <Link target = "_blank"  rel="opener" to={`/layout/articleDetail?id=${props.data.id}`}><p className="articale-title">{props.data.title}</p></Link>
        <div className="tags-box">
          <span>Ant Design</span>
          <span>设计语言</span>
          <span>蚂蚁金服</span>
        </div>
        <p className="articale-desc">
          段落示意：蚂蚁金服设计平台
          {/* ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台
          ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。 */}
        </p>
        <div className="articale-user-info">
          <Avatar className="info-avatar">H</Avatar>
          <span className="info-name">王失聪</span>
          <span className="info-time">发布于 2021-12-30 12:34:22</span>
        </div>
        <div className="article-options">
          <div className="option">
            <Favorite className="option-icon" /> <span>345</span>
          </div>
          <span className="line"></span>
          <div className="option">
            <ThumbUpAlt className="option-icon" /> <span>345</span>
          </div>
          <span className="line"></span>
          <div className="option">
            <Textsms className="option-icon" /> <span>345</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticaleCard;
