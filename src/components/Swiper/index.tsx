import React, { useEffect, useState } from 'react';
import './index.scss';

interface IProps {
  data: Array<string>;
}

const Swiper: React.FC<IProps> = (props) => {
  const [current, setcurrent] = useState(1);

  useEffect(() => {
    console.log('swiper props', props, props.data.length - 1);
    setcurrent(props.data.length - 1);
  }, []);

  const handleChangeCurrent = (index: number) => {
    console.log('change:', index);
    setcurrent(index);
  };

  return (
    <div className="swiper-wrap">
      <img className="item-img" src={props.data[current]} alt="" />
      <div className="swiper-option">
        {props.data.map((item, index) => {
          return (
            <div
              className="option-box"
              key={index}
              onClick={() => {
                handleChangeCurrent(index);
              }}
            >
              <img className="item-option" src={item} alt="" />
              <div
                className="option-warp"
                style={{ opacity: index == current ? 0 : 0.5 }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Swiper;
