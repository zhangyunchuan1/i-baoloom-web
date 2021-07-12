import React, { useState } from 'react';
import {
  withStyles,
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import { Select, MenuItem, Popover, Backdrop } from '@material-ui/core';
import { KeyboardBackspace, Check } from '@material-ui/icons';
import { formatColor } from '@/tool/tool';
import copy from 'copy-to-clipboard';
import './index.scss';

interface IProps {
  colors: any;
  close: Function;
}

const useStyles = makeStyles((theme) => ({
  avatars: {
    cursor: 'pointer',
  },
  paper: {
    padding: '0px',
    boxShadow: '0px 0px 7px 0px rgb(0 0 0 / 10%)',
  },
}));

const backdropStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const ShowCardModal: React.FC<IProps> = (props) => {
  const classes = useStyles();
  const backdropClasses = backdropStyles();
  const [colorValue, setColorValue] = useState('#ffffff');
  const [openCopyModal, setOpenCopyModal] = useState(false);
  const [formatType, setformatType] = useState('HEX-(#FEA47F)');
  const [age, setAge] = React.useState('');
  const [userCardEl, setUserCardEl] = useState(null);
  const open = Boolean(userCardEl);
  const id = open ? 'simple-popover' : undefined;
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
  };
  const handleCloseUserInfoPopover = () => {
    setUserCardEl(null);
  };

  const handleOpenSelect = (event: any) => {
    setUserCardEl(event.currentTarget);
  };

  const handleFormat = (type: string) => {
    setformatType(type);
    handleCloseUserInfoPopover();
  };

  const handleCloseShowCardModal = () => {
    props.close();
  };

  const handleCopy = (color: string) => {
    let _color = '';
    switch (formatType) {
      case 'HEX-(#FEA47F)':
        _color = formatColor('HEX', color);
        setColorValue(_color);
        copy(_color);
        break;
      case 'HEX-(FEA47F)':
        _color = formatColor('hex', color);
        setColorValue(_color);
        copy(_color);
        break;
      case 'RGB-(1,2,3)':
        _color = formatColor('RGB', color);
        setColorValue(_color);
        copy(_color);
        break;
      case 'RGBA-(1,2,3,1.0)':
        _color = formatColor('RGBA', color);
        setColorValue(_color);
        copy(_color);
        break;
      default:
        break;
    }
    setOpenCopyModal(true);
    setTimeout(() => {
      setOpenCopyModal(false);
    }, 500);
  };

  return (
    <div className="show-card-modal">
      <div className="show-card-box">
        <div className="show-card-header">
          <div className="back-btn" onClick={handleCloseShowCardModal}>
            <KeyboardBackspace />
            <span>返回</span>
          </div>
          <div className="cuurent-format" onClick={handleOpenSelect}>
            复制格式：{formatType}
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={userCardEl}
            onClose={handleCloseUserInfoPopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            classes={{
              paper: classes.paper,
            }}
          >
            <MenuItem
              value={'HEX-(#FEA47F)'}
              onClick={() => handleFormat('HEX-(#FEA47F)')}
            >
              HEX-(#FEA47F)
            </MenuItem>
            <MenuItem
              value={'HEX-(FEA47F)'}
              onClick={() => handleFormat('HEX-(FEA47F)')}
            >
              HEX-(FEA47F)
            </MenuItem>
            <MenuItem
              value={'RGB-(1,2,3)'}
              onClick={() => handleFormat('RGB-(1,2,3)')}
            >
              RGB-(1,2,3)
            </MenuItem>
            <MenuItem
              value={'RGBA-(1,2,3,1.0)'}
              onClick={() => handleFormat('RGBA-(1,2,3,1.0)')}
            >
              RGBA-(1,2,3,1.0)
            </MenuItem>
          </Popover>
          <div style={{ width: '66px' }}></div>
        </div>
        <div className="card-main">
          {props.colors.map((item: any, index: number) => {
            return (
              <div
                className="card"
                style={{ background: item.color }}
                key={index}
                onClick={() => handleCopy(item.color)}
              >
                <div className="copy-msk">
                  <div className="copy">COPY</div>
                </div>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
        <Backdrop
          className={backdropClasses.backdrop}
          style={{ backgroundColor: colorValue }}
          open={openCopyModal}
        >
          <div className="copy-modal-color">
            <p className="title">copy</p>
            <p className="color-value">{colorValue}</p>
          </div>
        </Backdrop>
      </div>
    </div>
  );
};

export default ShowCardModal;
