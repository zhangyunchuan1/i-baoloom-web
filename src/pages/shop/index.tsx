import React, { useState } from 'react';

import './index.scss';

let list: { name: string; url: string }[] = [];
for (let index = 0; index < 20; index++) {
  list.push({
    name: `tag-${index}`,
    url: `url-${index}`,
  });
}

const ShopPage: React.FC = (props) => {
  const [tags, settags] = useState<any>(list);
  const [nowMoveDom, setnowMoveDom] = useState<any>(null);

  //拖动到覆盖元素的时候，覆盖元素背景色改变为选中状态
  const changeOverBg = (i: any) => {
    let tagDoms = document.getElementsByClassName('tag');
    console.log('tagDoms:', tagDoms);
    tagDoms.forEach((dom: any, index: any) => {
      if (i == index) {
        dom.style.background = 'red';
      } else {
        dom.style.background = '#bfbfbf';
      }
    });
  };

  const onDragStart = (e: any, name: any) => {
    console.log('onDragStart', e, name);
    setnowMoveDom(name);
  };

  const onDragEnter = (e: any, name: any) => {
    console.log('onDragEnter', e, name);
    if (nowMoveDom != name) {
      changeOverBg(name);
    } else {
      changeOverBg(-1);
    }
  };

  const onDragOver = (e: any, name: any) => {
    // console.log('onDragOver', e, name);
  };

  return (
    <div className="page-shop">
      {tags.map((tag: any, index: any) => {
        return (
          <div
            key={index}
            id={`tag-${index}`}
            className="tag"
            draggable="true"
            onDragStart={(e) => {
              onDragStart(e, index);
            }}
            onDragEnter={(e) => {
              onDragEnter(e, index);
            }}
            onDragOver={(e) => {
              onDragOver(e, index);
            }}
          >
            {tag.name}
          </div>
        );
      })}
    </div>
  );
};

export default ShopPage;
