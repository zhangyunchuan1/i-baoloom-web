import { LinkSharp } from '@material-ui/icons';
import { now } from '@umijs/deps/compiled/lodash';
import React, { useState, useEffect } from 'react';

import './index.scss';

let list: { name: string; url: string }[] = [];
for (let index = 0; index < 20; index++) {
  list.push({
    name: `tag-${index}`,
    url: `url-${index}`,
  });
}
let aa = [
  {
    name: `1`,
    links: [
      {
        name: `1-1`,
      },
      {
        name: `1-2`,
      },
    ],
  },
  {
    name: `2`,
    links: [
      {
        name: `2-1`,
      },
      {
        name: `2-2`,
      },
    ],
  },
  {
    name: `3`,
    links: [
      {
        name: `3-1`,
      },
      {
        name: `3-2`,
      },
    ],
  },
];

const ShopPage: React.FC = (props) => {
  const [tags, settags] = useState<any>(aa);
  const [nowMoveDom, setnowMoveDom] = useState<any>(null);
  const [moveType, setmoveType] = useState(0); //移动类型： 1: 标签 , 2: 文件夹
  const [nowindex, setnowindex] = useState(0);
  const [nowind, setnowind] = useState(0);
  let locationIndex = -1;
  let locationInd = -1;

  //拖动到覆盖元素的时候，覆盖元素背景色改变为选中状态
  const changeOverBoxBg = (i: any) => {
    let tagDoms = document.getElementsByClassName('item');
    // console.log('tagDoms:', tagDoms);
    tagDoms.forEach((dom: any, index: any) => {
      if (i == index) {
        dom.style.background = '#70a1ff';
      } else {
        dom.style.background = '#dfe4ea';
      }
    });
  };

  const onDragStartTag = (e: any, index: any, ind: any) => {
    console.log('onDragStartTag:', e, index, ind);
    setnowMoveDom(e);
    setnowindex(index);
    setnowind(ind);
    setmoveType(1);
  };

  const onDragEnterBox = (e: any, index: any) => {
    e.preventDefault();
    console.log('onDragEnterBox:', e, index);
    if (index != nowindex) {
      changeOverBoxBg(index);
    } else {
      changeOverBoxBg(-1);
    }
  };

  const onDropTag = (e: any, index: any, ind?: any) => {
    e.preventDefault();
    locationIndex = index;
    locationInd = ind;
    console.log('tag触发-结束拖动', index, ind);
    let tagDom = document.getElementById(`tag-${index}-${ind}`);
    if (tagDom) tagDom.style.borderLeft = 'none';
    // changeOverBoxBg(-1);
  };
  //onDrop={(e)=>onDropTag(e, index,ind)}
  const onDropBox = (e: any, index: any) => {
    let _tags = JSON.parse(JSON.stringify(tags));
    e.preventDefault();
    console.log('box触发-结束拖动', index);
    changeOverBoxBg(-1);
    if (moveType == 1) {
      //移动标签
      if (index != nowindex) {
        //移动到其他文件夹
        //删除当前文件的数据
        let moveTag = _tags[nowindex].links[nowind];
        _tags[nowindex].links.splice(nowind, 1);
        console.log('添加到指定位置：', locationIndex, locationInd);
        if (locationInd == 0) {
          _tags[index].links.splice(0, 0, moveTag);
        } else if (locationInd >= 0) {
          _tags[index].links.splice(locationInd, 0, moveTag);
        } else {
          _tags[index].links.push(moveTag);
        }
        console.log(_tags);
        settags(_tags);
        locationIndex = -1;
        locationInd = -1;
        //在新文件夹下添加标签
      } else {
        //在当前文件夹下移动
        console.log('在当前文件夹下移动s', locationIndex, locationInd);
        if (
          nowMoveDom.target.id != `tag-${locationIndex}-${locationInd}` &&
          locationInd >= 0
        ) {
          let moveTag = _tags[nowindex].links[nowind];
          _tags[index].links.splice(nowind, 1);
          _tags[index].links.splice(locationInd, 0, moveTag);
          console.log(_tags);
          settags(_tags);
          locationIndex = -1;
          locationInd = -1;
        } else {
          let tagDoms = document.getElementsByClassName('ele');
          tagDoms.forEach((dom: any, index: any) => {
            dom.style.borderLeft = 'none';
          });
        }
      }
    }
  };

  //拖动到覆盖tag元素的时候，覆盖元素背景色改变为选中状态
  const changeOverTagBg = (i: any, r: any) => {
    let boxDoms = document.getElementsByClassName('item');
    let tagDoms = document.getElementsByClassName('ele');
    console.log('tagDom:', tagDoms);
    boxDoms.forEach((dom: any, index: any) => {
      if (i == index) {
        dom.style.background = '#70a1ff';
      } else {
        dom.style.background = '#dfe4ea';
      }
    });
    tagDoms.forEach((dom: any, index: any) => {
      console.log(dom);
      if (dom.id == `tag-${i}-${r}`) {
        dom.style.borderLeft = '5px solid red';
      } else {
        dom.style.borderLeft = 'none';
      }
    });
  };

  const onDragEnterTag = (e: any, index: any, ind: any) => {
    e.preventDefault();
    console.log('onDragEnterTag:', e, index, ind, nowMoveDom);
    if (nowMoveDom.target.id != `tag-${index}-${ind}`) {
      changeOverTagBg(index, ind);
    } else {
      let tagDoms = document.getElementsByClassName('ele');
      tagDoms.forEach((dom: any, index: any) => {
        dom.style.borderLeft = 'none';
      });
    }
    // if(index != nowindex){
    //   changeOverTagBg(index, ind);
    // }else{
    //   changeOverTagBg(-1, ind);
    // }
  };

  return (
    <div className="page-shop">
      {tags.map((item: any, index: any) => {
        return (
          <div
            className="item"
            key={index}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragEnter={(e) => {
              onDragEnterBox(e, index);
            }}
            onDrop={(e) => onDropBox(e, index)}
          >
            {item.links.map((ele: any, ind: any) => {
              return (
                <div
                  className="ele"
                  id={`tag-${index}-${ind}`}
                  key={ind}
                  draggable="true"
                  onDragEnter={(e) => {
                    onDragEnterTag(e, index, ind);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDragStart={(e) => {
                    onDragStartTag(e, index, ind);
                  }}
                  onDrop={(e) => onDropTag(e, index, ind)}
                >
                  {ele.name}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ShopPage;
