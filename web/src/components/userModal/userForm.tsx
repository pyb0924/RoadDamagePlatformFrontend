import React, { useEffect, useState } from "react";

import { Button, Form, Input, Modal, Space, Switch, Tree } from "antd";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUserModalType } from "../../app/slices/userModalSlice";
import { UserFormData, UserModalType } from "../../app/types/user";
import {
  useAddUserMutation,
  useLazyGetUserByIdQuery,
} from "../../app/api/userApi";

import { HTTP_OK } from "../../app/types/base";
import { useGetPermissionTreeQuery } from "../../app/api/permissionApi";

export default function UserForm() {
  const userModalState = useAppSelector((state) => state.userModal);
  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch();

  const { data: treeData } = useGetPermissionTreeQuery({
    headers: {
      Authorization: token,
    },
  });
  const [addUser] = useAddUserMutation();
  const [getUser] = useLazyGetUserByIdQuery();

  const [form] = Form.useForm();

  const [userFormData, setuserFormData] = useState<UserFormData>({
    username: "",
    password: "",
    is_active: 1,
    permissions: [],
  });

  const fetchAndSetUser = async (id: string) => {
    const user = await getUser({
      id: id,
      headers: {
        Authorization: token,
      },
    }).unwrap();
    setuserFormData({
      username: user.username,
      is_active: user.is_active,
      permissions: user.permission_ids,
    });
  };

  useEffect(() => {
    if (userModalState.id !== "") {
      fetchAndSetUser(userModalState.id);
    } else {
      setuserFormData({
        username: "",
        password: "",
        is_active: 1,
        permissions: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userModalState.id]);

  useEffect(() => {
    form.resetFields();
    console.log(userFormData);
  }, [form, userFormData]);

  const handleCancel = () => {
    dispatch(setUserModalType(UserModalType.DEFAULT));
  };

  const handleUserAddOk = async (values: UserFormData) => {
    if (values.password === undefined) {
      return;
    }

    try {
      const addUserResponse = await addUser({
        headers: {
          Authorization: token,
        },
        body: {
          username: values.username,
          password: values.password,
          permissions: values.permissions,
        },
      }).unwrap();
      console.log(addUserResponse)
      if (addUserResponse.code === HTTP_OK) {
        Modal.success({
          title: "用户添加成功！",
          content: `用户名：${values.username}，密码：${values.password}`,
        });
        dispatch(setUserModalType(UserModalType.DEFAULT));
      } else {
        //console.log(addUserResponse);
        Modal.error({
          title: "用户添加失败！",
          content: addUserResponse.message,
        });
      }
    } catch (err: any) {
      Modal.error({
        title: "用户添加失败！",
        content: err,
      });
    }
  };

  const handleUserEditOk = async (values: UserFormData) => {
    // TODO handle edit user
  };

  const handleOk = async (values: UserFormData) => {
    switch (userModalState.modalType) {
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

  const handleOKFailed = (err: any) => {
    console.log(err);
  };

  const handlePermissionCheck = (
    checkedKeysValue:
      | React.Key[]
      | {
          checked: React.Key[];
          halfChecked: React.Key[];
        }
  ) => {
    console.log("onCheck", checkedKeysValue);
    if ("checked" in checkedKeysValue) {
      setuserFormData({
        ...userFormData,
        permissions: checkedKeysValue.checked as string[],
      });
    } else {
      setuserFormData({
        ...userFormData,
        permissions: checkedKeysValue as string[],
      });
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleOk}
      onFinishFailed={handleOKFailed}
      labelCol={{ span: 4 }}
      preserve={false}
      initialValues={{
        username: userFormData.username,
        is_active:
          userModalState.modalType === UserModalType.USER_ADD ||
          userFormData.is_active === 1,
        permissions: userFormData.permissions,
      }}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input />
      </Form.Item>

      {userModalState.modalType === UserModalType.USER_ADD && (
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Form.Item label="激活状态" name="is_active" valuePropName="checked">
        <Switch
          disabled={userModalState.modalType === UserModalType.USER_ADD}
        />
      </Form.Item>

      <Form.Item
        label="权限选择"
        name="permissions"
        valuePropName="checkedKeys"
      >
        <Tree
          checkable
          onCheck={handlePermissionCheck}
          treeData={treeData}
          defaultExpandAll
        />
      </Form.Item>

      <div style={{ textAlign: "right" }}>
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Space>
      </div>
    </Form>
  );
}
