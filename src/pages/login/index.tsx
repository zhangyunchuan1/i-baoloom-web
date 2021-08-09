import React, { Fragment, useEffect, useState, useCallback } from 'react';
import './index.scss';
import {
  LoginModelState,
  ConnectProps,
  Loading,
  connect,
  useDispatch,
  history,
} from 'umi';
import Http from '@/tool/http';
import GlobalComp from '@/components/GlobalComp';
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import login_main_title from '@/images/login-main-title.png';
import icons_user from '@/images/icons/icons-user.png';
import icons_password from '@/images/icons/icons-password.png';
import icons_email from '@/images/icons/icons-email.png';

interface PageProps extends ConnectProps {
  login: LoginModelState;
  loading: boolean;
}

let timeChange: NodeJS.Timeout;

const LoginPage: React.FC<PageProps> = (props) => {
  //redux
  const dispatch = useDispatch();
  //state
  const [logintype, setlogintype] = useState('1'); //1: 用户名登录  2: 邮箱验证码登录
  const [nowType, setNowType] = useState(1); //1：登录 2:注册
  const [userName, setuserName] = useState('');
  const [password, setpassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [reSend, setReSend] = useState(false); //是否显示重新获取验证码
  const [hasSend, sethasSend] = useState(false);
  const [time, setTime] = useState(30);

  useEffect(() => {
    // console.log('login props ', props);
    console.log(time, hasSend);
  });

  useEffect(() => {
    clearInterval(timeChange);
    return () => clearInterval(timeChange);
  }, []);

  useEffect(() => {
    if (time > 0 && time < 30) {
      setTime(time);
    } else {
      clearInterval(timeChange);
      setTime(30);
      sethasSend(false);
    }
  }, [time]);

  const handleChangeUserName = (e: any) => {
    setuserName(e.target.value);
  };

  const handleChangePassword = (e: any) => {
    setpassword(e.target.value);
  };

  const handleChangeRePassword = (e: any) => {
    setRePassword(e.target.value);
  };

  const handleChangeEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const handleChangeCode = (e: any) => {
    setCode(e.target.value);
  };

  const handleLogin = () => {
    if (!userName) {
      return toast.error('温馨提示：请输入用户名！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if (!password) {
      return toast.error('温馨提示：请输入密码！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    let params = {
      userName,
      password,
      type: '1', //1:用户名 2:邮箱
    };
    Http.post('/user/login', params).then((res: any) => {
      if (res.status === 200) {
        // 个人信息存入redux
        dispatch({
          type: 'login/changeUserInfo',
          payload: {
            userInfo: res.data.user,
            token: res.data.token,
            loginStatus: true,
          },
        });
        //本地存储个人信息
        sessionStorage.setItem('userInfo', JSON.stringify(res.data.user));
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('loginStatus', JSON.stringify(true));
        history.goBack();
      } else {
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  };

  const hanldeRegister = () => {
    if (!userName) {
      return toast.error('温馨提示：请输入用户名！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if (!password) {
      return toast.error('温馨提示：请输入密码！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if (!rePassword) {
      return toast.error('温馨提示：请再输入密码！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if (!email) {
      return toast.error('温馨提示：请输入邮箱！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if (!code) {
      return toast.error('温馨提示：请输入验证码！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    let params = {
      userName,
      password,
      rePassword,
      email,
      code,
    };
    Http.post('/user/register', params).then((res: any) => {
      if (res.status === 200) {
        toast.success(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        toast.error(res.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    });
  };

  const handleSendCode = useCallback(() => {
    console.log('点击：', hasSend);
    if (!email) {
      return toast.error('温馨提示：请输入邮箱！', {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
    if (!hasSend) {
      let params = {
        email,
      };
      Http.post('/user/registerSendCode', params).then((res: any) => {
        if (res.status === 200) {
          toast.success(res.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
          if (!reSend) {
            setReSend(true);
          }
          // 注意，不要使用 setTime(t-1) ： 闭包问题会导致time一直为59
          timeChange = setInterval(() => setTime((t) => --t), 1000);
          sethasSend(true);
        } else {
          toast.error(res.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          });
        }
      });
    }
  }, [hasSend, email]);

  return (
    <div className="page-login">
      <div className="main">
        {nowType == 1 && (
          <div className="form-box-login">
            <img className="form-box-title" src={login_main_title} alt="" />
            <span className="title-bar"></span>
            <input
              className="form-inp userName"
              type="text"
              placeholder="用户名"
              onChange={handleChangeUserName}
            />
            <input
              className="form-inp password"
              type="text"
              placeholder="密码"
              onChange={handleChangePassword}
            />
            <p className="remember">
              <input type="checkbox" />
              记住密码
            </p>
            <div className="login-btn" onClick={handleLogin}>
              登录
            </div>
            <p className="to-register">
              还没账户？
              <span
                onClick={() => {
                  setNowType(2);
                }}
              >
                去注册
              </span>
            </p>
          </div>
        )}
        {nowType == 2 && (
          <div className="form-box-register">
            <input
              className="form-inp register-password"
              type="text"
              placeholder="用户名"
              onChange={handleChangeUserName}
            />
            <input
              className="form-inp register-password"
              type="text"
              placeholder="密码"
              onChange={handleChangePassword}
            />
            <input
              className="form-inp register-password-agin"
              type="text"
              placeholder="再次确认密码"
              onChange={handleChangeRePassword}
            />
            <input
              className="form-inp register-email"
              type="text"
              placeholder="邮箱"
              onChange={handleChangeEmail}
            />
            <div className="code-box">
              <input
                className="code-inp"
                type="text"
                placeholder="验证码"
                onChange={handleChangeCode}
              />
              <span className="code-btn" onClick={handleSendCode}>
                {hasSend ? time : reSend ? '重新获取验证码' : '发送验证码'}
              </span>
            </div>
            <div className="login-btn" onClick={hanldeRegister}>
              注册
            </div>
            <p className="to-register">
              已有账户！
              <span
                onClick={() => {
                  setNowType(1);
                }}
              >
                去登录
              </span>
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default connect(
  ({ login, loading }: { login: LoginModelState; loading: Loading }) => {
    console.log(loading);
    return {
      login,
      loading: loading.models.login,
    };
  },
)(GlobalComp(LoginPage));
