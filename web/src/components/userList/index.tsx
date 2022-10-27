import React, { useEffect, useState } from "react";

import { Button, Space, Modal, Table, Form, Input } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import Column from "antd/lib/table/Column";
import { FilterValue } from "antd/lib/table/interface";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  useLazyGetAllUsersQuery,
  useDeleteUserMutation,
  useAddUserMutation,
} from "../../app/api/userApi";
import { useAppSelector } from "../../app/hooks";
import { HTTP_OK } from "../../app/types/base";
import { User, UserFormType } from "../../app/types/user";
import UserForm from "../userForm";

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function UserList() {
  const [getUserList, { data: userList, isSuccess: isGetAllUsersSuccess }] =
    useLazyGetAllUsersQuery();
  const [deleteUser, { data: deleteUserResponse }] = useDeleteUserMutation();
  const [addUser, { data: addUserResponse }] = useAddUserMutation();

  const token = useAppSelector((state) => state.user.token);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      defaultCurrent: 1,
      defaultPageSize: 5,
    },
  });

  // update pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setTableParams({
      pagination,
    });
  };

  // request by page
  useEffect(() => {
    getUserList({
      headers: {
        Authorization: token,
      },
      params: {
        offset: tableParams.pagination.current as number,
        limit: tableParams.pagination.pageSize as number,
      },
    });
  }, [getUserList, tableParams.pagination, token]);

  // handle add: open add modal
  const handleUserAdd = () => {
    setAddUserModalOpen(true);
  };

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

  const handleUserEdit = () => {
    //TODO Edit User
  };

  // handle delete
  const handleUserDelete = (record: User) => {
    console.log(record);
    Modal.confirm({
      title: "删除用户",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除用户${record.username}吗`,
      async onOk() {
        try {
          const deleteUserResponse = await deleteUser({
            id: record.user_id,
            headers: {
              Authorization: token,
            },
          }).unwrap();
          if (deleteUserResponse.code === HTTP_OK) {
          }
          return console.log(deleteUserResponse.message);
        } catch {
          return console.log("删除用户错误");
        }
      },
      onCancel() {},
    });
  };

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16, float: "right" }}
        icon={<PlusOutlined />}
        onClick={handleUserAdd}
      >
        新增用户
      </Button>

      <UserForm
        isVisible={isAddUserModalOpen || isEditUserModalOpen}
        formType={UserFormType.USER_ADD}
      />

      <Table<User>
        dataSource={userList}
        pagination={tableParams.pagination}
        rowKey={(record) => record.user_id}
        loading={!isGetAllUsersSuccess}
        onChange={handleTableChange}
      >
        <Column
          title="用户名"
          dataIndex="username"
          key="username"
          sorter={true}
        />
        <Column
          title="创建时间"
          dataIndex="create_time"
          key="createTime"
          render={(date) => new Date(date).toLocaleDateString()}
        />
        <Column
          title="修改时间"
          dataIndex="update_time"
          key="updateTime"
          render={(date) => new Date(date).toLocaleDateString()}
        />
        <Column
          title="操作"
          key="action"
          render={(_text, record) => (
            <Space>
              <Button
                key="edit"
                size="small"
                icon={<EditOutlined />}
                onClick={handleUserEdit}
              >
                权限更改
              </Button>
              <Button
                key="delete"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleUserDelete(record as User)}
                danger
              >
                删除用户
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}
