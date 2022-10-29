import React from "react";

import { Button, Form, Input, Modal, Space } from "antd";

import { useAddUserMutation } from "../../app/api/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { HTTP_OK } from "../../app/types/base";
import { PermissionType } from "../../app/types/permission";
import { UserModalData, UserModalStateType } from "../../app/types/user";
import { setUserModalState } from "../../app/slices/userModalSlice";

interface UserModalProps {
  placeholder: UserModalData;
}

export function UserModal({ placeholder }: UserModalProps) {
  const [addUser] = useAddUserMutation();
  const token = useAppSelector((state) => state.user.token);
  const userModalState = useAppSelector((state) => state.userModal.modelState);

  const dispatch = useAppDispatch();

  const handleCancel = () => {
    dispatch(setUserModalState(UserModalStateType.DEFAULT));
  };

  const handleUserAddOk = async (values: UserModalData) => {
    try {
      const addUserResponse = await addUser({
        headers: {
          Authorization: token,
        },
        // TODO permissions list
        body: {
          username: values.username,
          password: values.password,
          permissions: [],
        },
      }).unwrap();
      if (addUserResponse.code === HTTP_OK) {
        Modal.success({
          title: "用户添加成功！",
          content: `用户名：${values.username}，密码：${values.password}`,
        });
        dispatch(setUserModalState(UserModalStateType.DEFAULT));
      } else {
        Modal.error({
          title: "用户添加失败！",
          content: addUserResponse.message,
        });
      }
    } catch (err: any) {
      Modal.error({
        title: "用户添加失败！",
        content: err.toString(),
      });
    }
  };

  const handleUserEditOk = async (values: UserModalData) => {};

  const handleOk = async (values: {
    username: string;
    password: string;
    permissions: PermissionType[];
  }) => {
    switch (userModalState) {
      case UserModalStateType.USER_ADD:
        handleUserAddOk(values);
        break;
      case UserModalStateType.USER_EDIT:
        handleUserEditOk(values);
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      title={
        userModalState === UserModalStateType.USER_ADD ? "添加用户" : "编辑用户"
      }
      open={
        userModalState === UserModalStateType.USER_ADD ||
        userModalState === UserModalStateType.USER_EDIT
      }
      footer={[]}
      closable={false}
    >
      <Form onFinish={handleOk} labelCol={{ span: 4 }} preserve={false}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder={placeholder?.username} />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder={placeholder?.password} />
        </Form.Item>

        {/* <Form.Item label="权限" name="permission">
            // TODO add PermissionTree
          </Form.Item> */}
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

export default UserModal;
