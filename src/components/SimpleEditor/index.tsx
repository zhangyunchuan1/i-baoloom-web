import React, { useEffect, useState } from 'react';
import ReactWEditor from 'wangeditor-for-react';
import './index.scss';

interface IProps {
  value: string,
  placeholder?: string,
  onChange: Function,
}

const SimpleEditor: React.FC<IProps> = (props) => {
  return (
    <div className="simple-editor-warp">
      <ReactWEditor
            className="simple-editor"
            value={props.value}
            config={{
              menus:[
                'bold',
                'head',
                'link',
                'italic',
                'underline',
                'emoticon',
              ],
              placeholder: props.placeholder || "",
              showFullScreen: false,
              showLinkImg: false,
              uploadImgMaxLength: 1,
            }}
            onChange={(html: string) => {
              props.onChange(html);
            }}
          />
    </div>
  );
}

export default SimpleEditor;