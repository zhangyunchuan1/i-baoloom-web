import React, { useEffect, useState } from 'react';
import ReactWEditor from 'wangeditor-for-react';
import { Button, Modal, Backdrop, Fade } from '@material-ui/core';
import './index.scss';

const HomePage: React.FC = (props) => {
  const [title, settitle] = useState('');
  const [html, sethtml] = useState('');
  const [open, setOpen] = React.useState(false);

  useEffect(() => {});

  const handleChangeTitle = (e: any) => {
    console.log('title:', e.target.value);
    settitle(e.target.value);
  };

  const handleSaveDraft = () => {
    console.log('保存为草稿：', title, html);
  };

  const handleSave = () => {
    console.log('发布文章：', title, html);
    handleOpen();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="page-add-article">
      <div className="article-title">
        <div className="input-box">
          <input
            type="text"
            name=""
            id=""
            placeholder="标题 (1-100个字)"
            onChange={handleChangeTitle}
          />
          <div className="title-num">{title.length}/100</div>
        </div>
        <div className="article-option">
          <Button
            variant="outlined"
            className="btn-cg"
            disableRipple
            onClick={handleSaveDraft}
          >
            保存为草稿
          </Button>
          <Button
            variant="outlined"
            className="btn-fb"
            disableRipple
            onClick={handleSave}
          >
            发布文章
          </Button>
        </div>
      </div>
      <ReactWEditor
        className="wangeditor"
        config={{
          uploadImgShowBase64: true,
        }}
        defaultValue={html}
        onChange={(html: string) => {
          console.log('onChange html:', html);
          sethtml(html);
        }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div>
            <h2 id="transition-modal-title">Transition modal</h2>
            <p id="transition-modal-description">
              react-transition-group animates me.
            </p>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default HomePage;
