import React, { useEffect, useState } from "react";

import { Button, Space, Modal, Table } from "antd";
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
  useLazyGetUserByIdQuery,
} from "../../../app/api/userApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { HTTP_OK } from "../../../app/types/base";
import { User, UserModalStateType } from "../../../app/types/user";
import {
  setUserModalState,
  setUserModalData,
  cleanUserModalData,
} from "../../../app/slices/userModalSlice";

import UserModal from "../../../components/userModal";

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function UserPage() {
  const [getUserList, { data: userList, isSuccess: isGetAllUsersSuccess }] =
    useLazyGetAllUsersQuery();
  const [getUserById] = useLazyGetUserByIdQuery();
  const [deleteUser] = useDeleteUserMutation();

  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch();
  
  const [tableParams, setTableParams] = useState<TableParams>({
    // TODO fix bug: data lost after change page
    pagination: {
      current: 1,
      pageSize: 5,
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
    console.log(tableParams.pagination);
    if (
      token !== undefined &&
      tableParams.pagination.current !== undefined &&
      tableParams.pagination.pageSize !== undefined
    ) {
      getUserList({
        headers: {
          Authorization: token,
        },
        params: {
          offset: tableParams.pagination.current as number,
          limit: tableParams.pagination.pageSize as number,
        },
      });
    }
  }, [getUserList, tableParams.pagination, token]);

  // handle add: open add modal
  const handleUserAdd = () => {
    dispatch(cleanUserModalData());
    dispatch(setUserModalState(UserModalStateType.USER_ADD));
  };

  const handleUserEdit = async (record: User) => {
    try {
      const user = await getUserById({
        id: record.user_id,
        headers: {
          Authorization: token,
        },
      }).unwrap();
      console.log(user);
      if ("username" in user && "permissions" in user) {
        dispatch(
          setUserModalData({
            username: user.username,
            password: "",
            permissions: user.permissions,
          })
        );
        dispatch(setUserModalState(UserModalStateType.USER_EDIT));
      }
    } catch (err) {
      console.log(err);
    }
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
        style={{ marginTop: 16, marginBottom: 16, float: "right" }}
        icon={<PlusOutlined />}
        onClick={handleUserAdd}
      >
        新增用户
      </Button>

      <UserModal />

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
                onClick={() => handleUserEdit(record as User)}
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
