import React, { useState } from 'react';
import './index.scss';
import {
  Button,
  IconButton,
  MenuItem,
  Menu,
  Avatar,
  Popover,
  Divider,
} from '@material-ui/core';
import { useDispatch, history } from 'umi';
import { MenuProps } from '@material-ui/core/Menu';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Backup, Apps } from '@material-ui/icons';
import icons_logo from '../../images/logo.png';
import icons_search_black from '../../images/icons/icons_search_black.png';
import icons_article from '../../images/icons/icons-article.png';
import icons_question from '../../images/icons/icons-question.png';

interface IProps {
  userInfo: any;
  loginStatus: boolean;
}

const StyledMenu = withStyles({
  paper: {
    borderBottom: '1px solid #d3d4d5',
    borderLeft: '1px solid #d3d4d5',
    borderRight: '1px solid #d3d4d5',
    borderRadius: '0px !important',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    autoFocus={false}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => {
  return {
    root: {
      '&:focus': {
        // backgroundColor: "#2ed573",  //"$themeColor",更换主题色，要更新这个值
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          // color: "#ffffff",
        },
      },
    },
  };
})(MenuItem);

const useStyles = makeStyles((theme) => ({
  avatars: {
    cursor: 'pointer',
  },
  paper: {
    padding: '0px',
    boxShadow: '0px 0px 7px 0px rgb(0 0 0 / 10%)',
  },
}));

const GlobalHeader: React.FC<IProps> = (props) => {
  const classes = useStyles();
  //redux
  const dispatch = useDispatch();
  //上传选项dom
  const [uploadEl, setUploadEl] = useState<null | HTMLElement>(null);
  //用户card dom
  const [userCardEl, setUserCardEl] = useState(null);
  const open = Boolean(userCardEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClickUpload = (event: React.MouseEvent<HTMLElement>) => {
    setUploadEl(event.currentTarget);
  };

  const handleCloseUpload = () => {
    setUploadEl(null);
  };

  const handleOpenUserInfoPopover = (event: any) => {
    setUserCardEl(event.currentTarget);
  };

  const handleCloseUserInfoPopover = () => {
    setUserCardEl(null);
  };

  const handleJumpePage = (e: string) => {
    handleCloseUpload();
    switch (e) {
      case '1':
        history.push('/layout/addArticle');
      default:
        break;
    }
  };

  const handleGoLogin = () => {
    history.push('/login');
  };

  const handleLoginOut = () => {
    setUserCardEl(null);
    dispatch({
      type: 'login/loginOut',
      payload: {},
    });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const getAvatarZm = (name: any) => {
    let fristName = name.substr(0, 1);
    return fristName;
  };

  return (
    <header className="globalHeader">
      <div className="header-logo">
        <img src={icons_logo} alt="" />
      </div>
      <div className="header-search">
        <input type="text" name="" id="" placeholder="搜索" />
        <div className="search-btn">
          <img src={icons_search_black} alt="" />
        </div>
      </div>
      <div className="header-option">
        {/* 新增选项 */}
        {props.loginStatus && (
          <IconButton aria-label="add an alarm" onClick={handleClickUpload}>
            <Backup />
          </IconButton>
        )}
        <IconButton aria-label="add an alarm">
          <Apps />
        </IconButton>
        {/* 登录及用户信息 */}
        {!props.loginStatus && (
          <Button
            variant="outlined"
            className="btn-login"
            disableRipple
            onClick={handleGoLogin}
          >
            登录
          </Button>
        )}
        {props.loginStatus &&
          (props.userInfo.avatar ? (
            <Avatar
              alt="Remy Sharp"
              className={classes.avatars}
              src={props.userInfo.avatar}
              onClick={handleOpenUserInfoPopover}
            />
          ) : (
            <Avatar
              className={classes.avatars}
              onClick={handleOpenUserInfoPopover}
            >
              {getAvatarZm(props.userInfo.userName)}
            </Avatar>
          ))}
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
          <div className="header-user-card">
            <div className="user-card-item">
              {props.loginStatus &&
                (props.userInfo.avatar ? (
                  <Avatar
                    alt="Remy Sharp"
                    className={classes.avatars}
                    src={props.userInfo.avatar}
                    onClick={handleOpenUserInfoPopover}
                  />
                ) : (
                  <Avatar
                    className={classes.avatars}
                    onClick={handleOpenUserInfoPopover}
                  >
                    {getAvatarZm(props.userInfo.userName)}
                  </Avatar>
                ))}
              <span className="user-card-item-name">
                {props.userInfo.userName}
              </span>
            </div>
            <Divider />
            <div className="user-card-bottom-options">
              <Button size="small" onClick={handleLoginOut}>
                退出
              </Button>
            </div>
          </div>
        </Popover>
      </div>
      <StyledMenu
        id="customized-menu"
        anchorEl={uploadEl}
        keepMounted
        open={Boolean(uploadEl)}
        onClose={handleCloseUpload}
      >
        <StyledMenuItem disableRipple onClick={() => handleJumpePage('1')}>
          <div className="header-option-item">
            <img className="option-icon" src={icons_article} alt="" />
            <span className="option-title">发文章</span>
          </div>
        </StyledMenuItem>
        <StyledMenuItem disableRipple onClick={() => handleJumpePage('2')}>
          <div className="header-option-item">
            <img className="option-icon" src={icons_question} alt="" />
            <span className="option-title">提问题</span>
          </div>
        </StyledMenuItem>
      </StyledMenu>
    </header>
  );
};

export default GlobalHeader;
