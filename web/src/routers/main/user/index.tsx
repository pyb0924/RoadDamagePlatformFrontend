import React, { useEffect, useState } from "react";

import { Button, Space, Modal, Table, Tag, Layout } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import Column from "antd/lib/table/Column";
import { FilterValue } from "antd/lib/table/interface";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../../app/api/userApi";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { User, UserModalType } from "../../../app/types/user";
import { PermissionType } from "../../../app/types/permission";
import {
  setUserModalId,
  setUserModalType,
} from "../../../app/slices/userModalSlice";

import UserModal from "../../../components/userModal";

const { Content } = Layout;

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function UserPage() {
  const [deleteUser] = useDeleteUserMutation();

  const token = useAppSelector((state) => state.user.token);
  const permissions = useAppSelector((state) => state.user.permissions);
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
  } = useGetAllUsersQuery({
    headers: {
      Authorization: token,
    },
    params: {
      offset: tableParams.pagination.current as number,
      limit: tableParams.pagination.pageSize as number,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableParams.pagination.current, token]);

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
    dispatch(setUserModalId(""));
    dispatch(setUserModalType(UserModalType.USER_ADD));
  };

  const handleUserEdit = (record: User) => {
    dispatch(setUserModalId(record.user_id));
    dispatch(setUserModalType(UserModalType.USER_EDIT));
  };

  // handle delete
  const handleUserDelete = (record: User) => {
    Modal.confirm({
      title: "????????????",
      icon: <ExclamationCircleOutlined />,
      content: `?????????????????????${record.username}???`,
      async onOk() {
        try {
          const deleteUserResponse = await deleteUser({
            id: record.user_id,
            headers: {
              Authorization: token,
            },
          }).unwrap();
         
          return console.log(deleteUserResponse.message);
        } catch (err){
          return console.log("??????????????????");
        }
      },
      onCancel() {},
    });
  };

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 24,
        minHeight: 280,
      }}
    >
      {permissions.includes(PermissionType.USER_ADD) && (
        <Button
          type="primary"
          style={{ marginTop: 16, marginBottom: 16, float: "right" }}
          icon={<PlusOutlined />}
          onClick={handleUserAdd}
        >
          ????????????
        </Button>
      )}

      <UserModal />

      <Table<User>
        dataSource={userList?.user_list}
        pagination={tableParams.pagination}
        rowKey={(record) => record.user_id}
        loading={!isGetAllUsersSuccess}
        onChange={handleTableChange}
      >
        <Column
          title="?????????"
          dataIndex="username"
          key="username"
          sorter={true}
        />
        <Column
          title="????????????"
          dataIndex="is_active"
          key="is_active"
          render={(is_active) =>
            is_active ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                ?????????
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">
                ?????????
              </Tag>
            )
          }
        />
        <Column
          title="????????????"
          dataIndex="create_time"
          key="createTime"
          render={(date) => new Date(date).toLocaleDateString()}
        />
        <Column
          title="????????????"
          dataIndex="update_time"
          key="updateTime"
          render={(date) => new Date(date).toLocaleDateString()}
        />
        {(permissions.includes(PermissionType.USER_EDIT) ||
          permissions.includes(PermissionType.USER_DELETE)) && (
          <Column
            title="??????"
            key="action"
            render={(_text, record) => (
              <Space>
                {permissions.includes(PermissionType.USER_EDIT) && (
                  <Button
                    key="edit"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleUserEdit(record as User)}
                  >
                    ????????????
                  </Button>
                )}

                {permissions.includes(PermissionType.USER_DELETE) && (
                  <Button
                    key="delete"
                    type="primary"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleUserDelete(record as User)}
                    danger
                  >
                    ????????????
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
