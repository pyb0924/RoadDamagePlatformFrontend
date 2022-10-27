import React, { useState } from "react";

import { Button, Form, Input, Modal, Space } from "antd";

import { useAddUserMutation } from "../../app/api/userApi";
import { useAppSelector } from "../../app/hooks";

import { HTTP_OK } from "../../app/types/base";
import { PermissionType } from "../../app/types/permission";
import { UserFormType } from "../../app/types/user";

interface UserFormProps {
  isVisible: boolean;
  formType: UserFormType;
  values?: {
    username: string;
    password: string;
    permissions: PermissionType[];
  };
}

function UserForm({ isVisible, formType, values }: UserFormProps) {
  const [addUser] = useAddUserMutation();
  const token = useAppSelector((state) => state.user.token);

  const handleUserAddCancel = () => {
    Modal.destroyAll();
  };

  const handleUserAddOk = async (values: {
    username: string;
    password: string;
  }) => {
    console.log(values);
    try {
      const addUserResponse = await addUser({
        headers: {
          Authorization: token,
        },
        body: { ...values, permissions: [] },
      }).unwrap();
      if (addUserResponse.code === HTTP_OK) {
        Modal.destroyAll();
        Modal.success({
          title: "用户添加成功！",
          content: `用户名：${values.username}，密码：${values.password}`,
        });
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

  return (
    <Modal
      title={formType === UserFormType.USER_ADD ? "添加用户" : "编辑用户"}
      open={isVisible}
      footer={[]}
    >
      <Form onFinish={handleUserAddOk} labelCol={{ span: 4 }} preserve={false}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder={values?.username} />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder={values?.password} />
        </Form.Item>

        {/* <Form.Item label="权限" name="permission">
            // TODO add PermissionTree
          </Form.Item> */}
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleUserAddCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

export default UserForm;
