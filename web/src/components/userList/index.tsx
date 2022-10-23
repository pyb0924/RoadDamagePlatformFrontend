import { Table, Button, Tag } from "antd";
import React, { useEffect, useState } from "react";
import type { TablePaginationConfig } from "antd/es/table";

import {
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { RoleType } from "../../app/types/base";
import { useLazyGetAllUsersQuery } from "../../app/api/userApi";
import Column from "antd/lib/table/Column";

import { FilterValue } from "antd/lib/table/interface";
import { useAppSelector } from "../../app/hooks";

// const data = Array.from({ length: 23 }).map((_, i) => ({
//   user_id: i,
//   username: `User${i}`,
//   is_active: true,
//   role: [RoleType.User_Add, RoleType.User_Delete],
//   create_time: "1997-05-25 07:51:47",
//   update_time: "2021-06-21 23:39:51",
// }));

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export default function UserList() {
  const token = useAppSelector((state) => state.token);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      offset: 1,
      
    },
  });

  const [getUsersData, { data, isSuccess }] = useLazyGetAllUsersQuery();

  useEffect(() => {
    getUsersData({
      headers: {
        Authorization: token,
      },
      params: {
        offset: tableParams.pagination.offset as number,
        limit: tableParams.pagination.limit as number,
      },
    })
  }, [getUsersData, tableParams.pagination.limit, tableParams.pagination.offset, token])
  

  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setTableParams({
      pagination,
    });
  };

  return (
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
        title="权限"
        dataIndex="role"
        key="role"
        render={(roles: RoleType[]) =>
          roles.map((role) => (
            <Tag color="blue" key={role}>
              {role}
            </Tag>
          ))
        }
      />
      <Column
        title="创建时间"
        dataIndex="create_time"
        key="createTime"
        //render={(date) => Date.parse(date)}
      />
      <Column
        title="修改时间"
        dataIndex="update_time"
        key="updateTime"
        //render={(date) => Date.parse(date)}
      />
      <Column
        title="操作"
        key="action"
        render={() => (
          <>
            <Button key="detail" size="small" icon={<UnorderedListOutlined />}>
              详情
            </Button>
            <Button key="edit" size="small" icon={<EditOutlined />}>
              编辑
            </Button>
            <Button key="delete" size="small" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </>
        )}
      />
    </Table>
  );
}
