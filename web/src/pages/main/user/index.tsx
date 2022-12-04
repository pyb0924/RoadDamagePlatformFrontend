import React, {useEffect, useState} from 'react';

import {Button, Space, Modal, Table, Tag, Layout} from 'antd';
import type {TablePaginationConfig} from 'antd/es/table';
import Column from 'antd/lib/table/Column';
import {FilterValue} from 'antd/lib/table/interface';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from '../../../store/api/userApi';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {User, UserModalType} from '../../../store/types/user';
import {PermissionType} from '../../../store/types/permission';
import {
  setUserModalId,
  setUserModalType,
} from '../../../store/slices/userModalSlice';
import {buildRequestWithToken} from '../../../utils/utils';

import UserModal from '../../../components/userModal';


const {Content} = Layout;

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function UserPage() {
  const [deleteUser] = useDeleteUserMutation();

  const token = useAppSelector(state => state.user.token);
  const permissions = useAppSelector(state => state.user.permissions);
  const dispatch = useAppDispatch();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      total: 1,
      current: 1,
      pageSize: 5,
    },
  });

  const {
    data: userList,
    refetch,
    isSuccess: isGetAllUsersSuccess,
  } = useGetAllUsersQuery(
    buildRequestWithToken(
      {
        params: {
          offset: tableParams.pagination.current as number,
          limit: tableParams.pagination.pageSize as number,
        },
      },
      token,
    ),
  );

  // update pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setTableParams({
      pagination,
    });
  };

  // request by page
  useEffect(() => {
    if (
      tableParams.pagination.current === undefined ||
      tableParams.pagination.pageSize === undefined
    ) {
      return;
    }
    try {
      refetch();
    } catch (err) {
      console.log(err);
    }
  }, [tableParams.pagination.current, token, refetch]);

  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        total: userList?.total,
        current: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      },
    });
  }, [tableParams, userList]);

  // handle add: open add modal
  const handleUserAdd = () => {
    dispatch(setUserModalId(''));
    dispatch(setUserModalType(UserModalType.USER_ADD));
  };

  // handle edit: open edit modal
  const handleUserEdit = (record: User) => {
    dispatch(setUserModalId(record.user_id));
    dispatch(setUserModalType(UserModalType.USER_EDIT));
  };

  // handle delete: open delete modal
  const handleUserDelete = (record: User) => {
    Modal.confirm({
      title: '删除用户',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除用户${record.username}吗`,
      cancelText: '取消',
      okText: '确定',
      async onOk() {
        try {
          const deleteUserResponse = await deleteUser({
            path: record.user_id,
            headers: {
              Authorization: token,
            },
          }).unwrap();

          return console.log(deleteUserResponse.message);
        } catch (err) {
          return console.log('删除用户错误');
        }
      },
    });
  };

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 24,
        minHeight: 280,
      }}>
      {permissions.includes(PermissionType.USER_ADD) && (
        <Button
          type="primary"
          style={{marginTop: 16, marginBottom: 16, float: 'right'}}
          icon={<UserAddOutlined />}
          onClick={handleUserAdd}>
          新增用户
        </Button>
      )}

      <UserModal />

      <Table<User>
        dataSource={userList?.user_list}
        pagination={tableParams.pagination}
        rowKey={record => record.user_id}
        loading={!isGetAllUsersSuccess}
        onChange={handleTableChange}>
        <Column
          title="用户名"
          dataIndex="username"
          key="username"
          width={'20%'}
          sorter={true}
        />
        <Column
          title="激活状态"
          dataIndex="is_active"
          key="is_active"
          width={'20%'}
          render={is_active =>
            is_active ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                已激活
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">
                未激活
              </Tag>
            )
          }
        />
        <Column
          title="创建时间"
          dataIndex="create_time"
          key="createTime"
          width={'20%'}
          render={date => new Date(date).toLocaleDateString()}
        />
        <Column
          title="修改时间"
          dataIndex="update_time"
          key="updateTime"
          width={'20%'}
          render={date => new Date(date).toLocaleDateString()}
        />
        {(permissions.includes(PermissionType.USER_EDIT) ||
          permissions.includes(PermissionType.USER_DELETE)) && (
          <Column
            title="操作"
            key="action"
            width={'20%'}
            render={(_text, record) => (
              <Space>
                {permissions.includes(PermissionType.USER_EDIT) && (
                  <Button
                    key="edit"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleUserEdit(record as User)}>
                    编辑用户
                  </Button>
                )}

                {permissions.includes(PermissionType.USER_DELETE) && (
                  <Button
                    key="delete"
                    type="primary"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleUserDelete(record as User)}
                    danger>
                    删除用户
                  </Button>
                )}
              </Space>
            )}
          />
        )}
      </Table>
    </Content>
  );
}
