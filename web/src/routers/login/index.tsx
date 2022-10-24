import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography } from "antd";

import { useLoginMutation } from "../../app/api/loginApi";
import { useAppDispatch } from "../../app/hooks";
import { setToken } from "../../app/slices/user";
import { LoginRequest, TokenDataWithId } from "../../app/types/login";

import "./index.css";

const { Text } = Typography;

const Login: React.FC = () => {
  const [login] = useLoginMutation();
  const [loginState, setloginState] = useState("未登录");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (values: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    const loginRequest: LoginRequest = {
      body: {
        username: values.username,
        password: values.password,
      },
    };

    try {
      const loginResponse = await login(loginRequest).unwrap();
      if (loginResponse.code === 200) {
        setloginState(
          `登陆成功: 用户名:${values.username} 密码:${values.password}`
        );
        dispatch(setToken(loginResponse.data as TokenDataWithId));
        navigate("/dashboard");
      } else {
        setloginState("登陆失败!");
      }
    } catch (err) {
      setloginState("登陆失败!");
      console.log(err);
    }
  };
  // TODO beautify login page
  // TODO href route to url
  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
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
            className="login-form-button"
          >
            Log in
          </Button>
          {/* Or <a href="">register now!</a> */}
        </Form.Item>
      </Form>
      <Text type="danger">{loginState}</Text>
      <Text>BaseUrl:{process.env.REACT_APP_BASEURL}</Text>
    </>
  );
};

export default Login;
