import React, { useState } from "react";

import { Button, Form, Input, Modal, Space } from "antd";

import { useAddUserMutation } from "../../app/api/userApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { HTTP_OK } from "../../app/types/base";
import { PermissionType } from "../../app/types/permission";
import { UserModalData, UserModalType } from "../../app/types/user";
import {
  setAddUserModalOpen,
  setEditUserModalOpen,
} from "../../app/slices/userModalSlice";

interface UserModalProps {
  modalType: UserModalType;
  values?: UserModalData;
}

export function UserModal({ modalType, values }: UserModalProps) {
  const [addUser] = useAddUserMutation();
  const token = useAppSelector((state) => state.user.token);
  const isAddUserModalOpen = useAppSelector(
    (state) => state.userModal.isAddUserModalOpen
  );
  const isEditUserModalOpen = useAppSelector(
    (state) => state.userModal.isEditUserModalOpen
  );

  const dispatch = useAppDispatch();

  const handleCancel = () => {
    switch (modalType) {
      case UserModalType.USER_ADD:
        dispatch(setAddUserModalOpen(false));
        break;
      case UserModalType.USER_EDIT:
        dispatch(setEditUserModalOpen(false));
        break;
      default:
        break;
    }
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

  const handleUserEditOk = async (values: UserModalData) => {};

  const handleOk = async (values: {
    username: string;
    password: string;
    permissions: PermissionType[];
  }) => {
    console.log(values);
    switch (modalType) {
      case UserModalType.USER_ADD:
        handleUserAddOk(values);
        break;
      case UserModalType.USER_EDIT:
        handleUserEditOk(values);
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      title={modalType === UserModalType.USER_ADD ? "添加用户" : "编辑用户"}
      open={isEditUserModalOpen || isAddUserModalOpen}
      footer={[]}
      closable={false}
    >
      <Form onFinish={handleOk} labelCol={{ span: 4 }} preserve={false}>
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
