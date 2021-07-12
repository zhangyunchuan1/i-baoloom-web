import React, { useState } from 'react';
import './index.scss';

const PlanPage: React.FC = (props) => {
  return (
    <div className="page-plan">
      <div className="project-menu">
        <div className="title-add">
          <span className="title">项目</span>
          <span className="add">+</span>
        </div>
        <ul>
          <li>莘知教育APP设计</li>
          <li>永辉生活SDK</li>
          <li>i-baoloom</li>
        </ul>
      </div>
      <div className="project-plan"></div>
    </div>
  );
};

export default PlanPage;
