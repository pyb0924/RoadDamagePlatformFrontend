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
} from "../../../app/api/userApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { HTTP_OK } from "../../../app/types/base";
import { User, UserModalType } from "../../../app/types/user";
import { PermissionType } from "../../../app/types/permission";
import {
  setUserModalId,
  setUserModalType,
} from "../../../app/slices/userModalSlice";

import UserModal from "../../../components/userModal";

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function UserPage() {
  const [getUserList, { isSuccess: isGetAllUsersSuccess }] =
    useLazyGetAllUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const token = useAppSelector((state) => state.user.token);
  const permissions = useAppSelector((state) => state.user.permissions);
  const dispatch = useAppDispatch();

  const [userList, setuserList] = useState([] as User[]);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      total: 1,
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

  const fetchAndUpdateData = async () => {
    try {
      const response = await getUserList({
        headers: {
          Authorization: token,
        },
        params: {
          offset: tableParams.pagination.current as number,
          limit: tableParams.pagination.pageSize as number,
        },
      }).unwrap();

      setTableParams({
        ...tableParams,
        pagination: {
          total: response.total,
          current: tableParams.pagination.current,
          pageSize: tableParams.pagination.pageSize,
        },
      });
      setuserList(response.user_list);
    } catch (err) {
      console.log(err);
    }
  };

  // request by page
  useEffect(() => {
    if (
      tableParams.pagination.current !== undefined &&
      tableParams.pagination.pageSize !== undefined
    ) {
      fetchAndUpdateData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserList, tableParams.pagination.current, token]);

  // handle add: open add modal
  const handleUserAdd = () => {
    dispatch(setUserModalId(""));
    dispatch(setUserModalType(UserModalType.USER_ADD));
  };

  const handleUserEdit = (record: User) => {
    dispatch(setUserModalId(record.user_id));
    dispatch(setUserModalType(UserModalType.USER_EDIT));
  };

  // handle delete
  // TODO render after delete
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
      {permissions.includes(PermissionType.USER_ADD) && (
        <Button
          type="primary"
          style={{ marginTop: 16, marginBottom: 16, float: "right" }}
          icon={<PlusOutlined />}
          onClick={handleUserAdd}
        >
          新增用户
        </Button>
      )}

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
        <Column title="激活状态" dataIndex="is_active" key="is_active" />
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
        {(permissions.includes(PermissionType.USER_EDIT) ||
          permissions.includes(PermissionType.USER_DELETE)) && (
            <Column
              title="操作"
              key="action"
              render={(_text, record) => (
                <Space>
                  {permissions.includes(PermissionType.USER_EDIT) && (
                    <Button
                      key="edit"
                      icon={<EditOutlined />}
                      onClick={() => handleUserEdit(record as User)}
                    >
                      编辑用户
                    </Button>
                  )}

                  {permissions.includes(PermissionType.USER_DELETE) && (
                    <Button
                      key="delete"
                      type="primary"
                      icon={<DeleteOutlined />}
                      onClick={() => handleUserDelete(record as User)}
                      danger
                    >
                      删除用户
                    </Button>
                  )}
                </Space>
              )}
            />
          )}
      </Table>
    </div>
  );
}
