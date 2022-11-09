import React from 'react';
import {useNavigate} from 'react-router-dom';

import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Checkbox, Form, Input, Modal, Typography} from 'antd';

import {useLoginMutation} from '../../app/api/loginApi';
import {useLazyGetUserByIdQuery} from '../../app/api/userApi';
import {useAppDispatch} from '../../app/hooks';
import {setToken, setUser} from '../../app/slices/userSlice';

import './index.css';

const {Text} = Typography;

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserByIdQuery();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onFinish = async (values: LoginFormData) => {
    try {
      const loginResponse = await login({
        body: {
          username: values.username,
          password: values.password,
        },
        headers: {},
      }).unwrap();

      navigate('/main');
      const newToken =
        loginResponse.token_type + ' ' + loginResponse.access_token;

      dispatch(setToken(newToken));

      const userResponse = await getUser({
        id: loginResponse.user_id,
        headers: {
          Authorization: newToken,
        },
      }).unwrap();
      dispatch(setUser(userResponse));
      //console.log(loginResponse.message);
    } catch (err: any) {
      Modal.error({
        title: '用户登录失败',
        content: err.data.message,
      });
    }
  };

  // TODO href route to url
  return (
    <>
      <div className="bg">
        <div className="heard">
          <h1 className="title">欢迎使用智慧公路信息管理平台</h1>
        </div>
        <div className="login-card">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{remember: true}}
            onFinish={onFinish}>
            <Form.Item
              name="username"
              rules={[{required: true, message: '请输入用户名'}]}>
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{required: true, message: '请输入密码'}]}>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码 "
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              {/* <a className="login-form-forgot" href="">
            Forgot password
          </a> */}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button">
                Log in
              </Button>
              {/* Or <a href="">register now!</a> */}
            </Form.Item>
          </Form>
          <Text>BaseUrl:{process.env.REACT_APP_BASEURL}</Text>
        </div>
      </div>
    </>
  );
};

export default Login;
