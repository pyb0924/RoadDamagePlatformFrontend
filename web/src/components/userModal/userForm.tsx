import React, {useEffect, useState} from 'react';

import {Button, Form, Input, Modal, Space, Switch, Tree} from 'antd';

import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {setUserModalType} from '../../store/slices/userModalSlice';
import {UserFormData, UserModalType} from '../../store/types/user';
import {
  useAddUserMutation,
  useEditUserMutation,
  useLazyGetUserByIdQuery,
} from '../../store/api/userApi';
import {useGetPermissionTreeQuery} from '../../store/api/permissionApi';
import {showErrorModal} from '../../utils';

// TODO fix bug: flash after cancel
export default function UserForm() {
  const userModalState = useAppSelector(state => state.userModal);
  const token = useAppSelector(state => state.user.token);
  const dispatch = useAppDispatch();

  const {data: treeData} = useGetPermissionTreeQuery({
    headers: {
      Authorization: token,
    },
  });
  const [addUser] = useAddUserMutation();
  const [getUser] = useLazyGetUserByIdQuery();
  const [editUser] = useEditUserMutation();

  const [form] = Form.useForm();

  const [userFormDefaultData, setuserFormData] = useState<UserFormData>({
    username: '',
    password: '',
    is_active: 1,
    permissions: [],
  });

  const fetchAndSetUser = async (id: string) => {
    try {
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
    } catch (err) {
      showErrorModal(err, '用户信息获取失败');
    }
  };

  useEffect(() => {
    if (userModalState.id !== '') {
      fetchAndSetUser(userModalState.id);
    } else {
      setuserFormData({
        username: '',
        password: '',
        is_active: 1,
        permissions: [],
      });
    }
  }, [userModalState.modalType, userModalState.id]);

  useEffect(() => {
    form.resetFields();
    console.log(userFormDefaultData);
  }, [form, userFormDefaultData]);

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
      console.log(addUserResponse);

      Modal.success({
        title: '用户添加成功！',
        content: `用户名：${values.username}，密码：${values.password}`,
      });
      dispatch(setUserModalType(UserModalType.DEFAULT));
    } catch (err) {
      showErrorModal(err, '用户添加失败！');
    }
  };

  const handleUserEditOk = async (values: UserFormData) => {
    try {
      const editUserResponse = await editUser({
        id: userModalState.id,
        headers: {
          Authorization: token,
        },
        body: {
          is_active: values.is_active,
          permission_ids: values.permissions,
        },
      }).unwrap();
      console.log(editUserResponse);

      Modal.success({
        title: '用户信息修改成功！',
        content: `用户名：${values.username}  ${editUserResponse.message}`,
      });
      dispatch(setUserModalType(UserModalType.DEFAULT));
    } catch (err) {
      showErrorModal(err, '用户信息修改失败！');
    }
  };

  const handleOk = async (values: UserFormData) => {
    console.log(values);
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
        },
  ) => {
    console.log('onCheck', checkedKeysValue);
    if ('checked' in checkedKeysValue) {
      form.setFieldValue('permissions', checkedKeysValue.checked as string[]);
    } else {
      form.setFieldValue('permissions', checkedKeysValue as string[]);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleOk}
      onFinishFailed={handleOKFailed}
      labelCol={{span: 4}}
      preserve={false}
      initialValues={{
        username: userFormDefaultData.username,
        password: userFormDefaultData.password,
        is_active:
          userModalState.modalType === UserModalType.USER_ADD ||
          userFormDefaultData.is_active === 1,
        permissions: userFormDefaultData.permissions,
      }}>
      <Form.Item
        label="用户名"
        name="username"
        rules={[{required: true, message: '请输入用户名'}]}>
        <Input />
      </Form.Item>

      {userModalState.modalType === UserModalType.USER_ADD && (
        <Form.Item
          label="密码"
          name="password"
          rules={[{required: true, message: '请输入密码'}]}>
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
        valuePropName="checkedKeys">
        <Tree
          checkable
          onCheck={handlePermissionCheck}
          treeData={treeData}
          defaultExpandAll
        />
      </Form.Item>

      <div style={{textAlign: 'right'}}>
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
