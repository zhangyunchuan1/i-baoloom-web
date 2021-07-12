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
  const [userName, setuserName] = useState('');
  const [password, setpassword] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [hasSend, sethasSend] = useState(false);
  const [time, setTime] = useState(10);

  useEffect(() => {
    console.log('login props ', props);
  });

  useEffect(() => {
    clearInterval(timeChange);
    return () => clearInterval(timeChange);
  }, []);

  useEffect(() => {
    if (time > 0 && time < 10) {
      setTime(time);
    } else {
      clearInterval(timeChange);
      setTime(10);
      sethasSend(false);
    }
  }, [time]);

  const handleChangeUserName = (e: any) => {
    setuserName(e.target.value);
  };

  const handleChangePassword = (e: any) => {
    setpassword(e.target.value);
  };

  const handleLogin = () => {
    if (!userName) {
      return seterrorMessage(`温馨提示：请输入用户名！`);
    }
    if (!password) {
      return seterrorMessage(`温馨提示：请输入密码！`);
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
        seterrorMessage('');
        history.goBack();
      } else {
        seterrorMessage(`温馨提示：${res.message}`);
      }
    });
  };

  const handleSendCode = useCallback(() => {
    // 注意，不要使用 setTime(t-1) ： 闭包问题会导致time一直为59
    timeChange = setInterval(() => setTime((t) => --t), 1000);
    sethasSend(true);
  }, []);

  return (
    <div className="page-login">
      <div className="main">
        <div className="main-banner"></div>
        <div className="main-form">
          <p className="form-title">
            Hi
            <br />
            欢迎登录 i-baoloom
          </p>
          {/* 用户名登录 */}
          {logintype == '1' && (
            <Fragment>
              <div className="form-item">
                <img src={icons_user} alt="" />
                <input
                  type="text"
                  placeholder="用户名"
                  onChange={handleChangeUserName}
                />
              </div>
              <div className="form-item">
                <img src={icons_password} alt="" />
                <input
                  type="password"
                  placeholder="密码"
                  onChange={handleChangePassword}
                />
              </div>
            </Fragment>
          )}
          {/* 邮箱验证码登录 */}
          {logintype == '2' && (
            <Fragment>
              <div className="form-item">
                <img src={icons_email} alt="" />
                <input
                  type="text"
                  placeholder="邮箱"
                  onChange={handleChangeUserName}
                />
              </div>
              <div className="form-item-code">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="验证码"
                  onChange={handleChangePassword}
                />
                <span
                  className={hasSend ? 'code hasSend' : 'code'}
                  onClick={handleSendCode}
                >
                  {hasSend ? `已发送 ${time}` : '发送验证码'}
                </span>
              </div>
            </Fragment>
          )}
          <div className="login-tips">{errorMessage}</div>
          <div className="form-btn" onClick={handleLogin} draggable="true">
            登录
          </div>
        </div>
      </div>
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
