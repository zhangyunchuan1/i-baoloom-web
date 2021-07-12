import React, { useEffect } from 'react';
import './index.scss';

interface IProps {
  className?: string; //按钮新增类名
  variant?: string; //按钮类型
}

const IButton: React.FC<IProps> = (props) => {
  return (
    <div
      className={props.className ? `i-button ${props.className}` : 'i-button'}
    >
      {props.children}
    </div>
  );
};

export default IButton;
