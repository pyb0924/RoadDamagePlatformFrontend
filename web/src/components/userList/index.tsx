import React, { useEffect, useState } from "react";

import { Table, Button, Space } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import Column from "antd/lib/table/Column";
import { FilterValue } from "antd/lib/table/interface";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import { useAppSelector } from "../../app/hooks";
import { useLazyGetAllUsersQuery } from "../../app/api/userApi";

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function UserList() {
  const token = useAppSelector((state) => state.user.token);
  const [getUsersData, { data, isSuccess }] = useLazyGetAllUsersQuery();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      defaultCurrent: 1,
      defaultPageSize: 5,
    },
  });

  useEffect(() => {
    getUsersData({
      headers: {
        Authorization: token,
      },
      params: {
        offset: tableParams.pagination.offset as number,
        limit: tableParams.pagination.limit as number,
      },
    });
  }, [
    getUsersData,
    tableParams.pagination.limit,
    tableParams.pagination.offset,
    token,
  ]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setTableParams({
      pagination,
    });
  };

  const handleUserAdd = () => {
    // TODO Add User
  };

  const handleUserEdit = () => {
    //TODO Edit User
  };

  const handleUserDelete = () => {
    //TODO Delete User
  };

  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16, float: "right" }}
        icon={<PlusOutlined />}
        onClick={handleUserAdd}
      >
        新建用户
      </Button>
      <Table
        dataSource={data}
        pagination={tableParams.pagination}
        rowKey={(record) => record.user_id}
        loading={!isSuccess}
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
          render={() => (
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
                onClick={handleUserDelete}
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
