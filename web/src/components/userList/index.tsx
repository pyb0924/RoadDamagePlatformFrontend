import { Avatar, Button, Dropdown, Menu, Space, Table, Tag } from "antd";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import React, { useRef } from "react";
import { ProTable } from "@ant-design/pro-components";

import {
  DeleteOutlined,
  EditOutlined,
  UnorderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";

type UserItem = {
  avatar: string;
  id: number;
  username: string;
  tags: { role: string; status: string[] };
};

const data = Array.from({ length: 23 }).map((_, i) => ({
  avatar: "https://joeschmoe.io/api/v1/random",
  id: i,
  username: `User${i}`,
  tags: {
    role: "user",
    status: ["status1", "status2"],
  },
}));

const columns: ProColumns<UserItem>[] = [
  {
    dataIndex: "index",
    valueType: "index",
    width: 48,
  },
  {
    title: "用户名",
    dataIndex: "avatar",
    valueType: "avatar",
    width: 200,
    ellipsis: true,
    render: (dom, record) => (
      <Space>
        <span>{dom}</span>
        <span>{record.username}</span>
      </Space>
    ),
  },
  {
    disable: true,
    title: "标签",
    dataIndex: "tags",
    filters: true,
    onFilter: true,
    search: false,
    render: (_, record) => (
      <Space>
        <Tag color={"blue"} key={record.tags.role}>
          {record.tags.role}
        </Tag>
        {record.tags.status.map((status) => (
          <Tag color={"red"} key={status}>
            {status}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: "操作",
    valueType: "option",
    key: "option",
    render: (text, record, _, action) => [
      <Button key="detail" size="small" icon={<UnorderedListOutlined />}>
        详情
      </Button>,
      <Button key="edit" size="small" icon={<EditOutlined />}>
        编辑
      </Button>,
      <Button key="delete" size="small" icon={<DeleteOutlined />} danger>
        删除
      </Button>,
    ],
  },
];

export default function UserList() {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<UserItem>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      dataSource={data}
      // request={async (params = {}, sort, filter) => {
      //   console.log(sort, filter);
      //   return request<{
      //     data: GithubIssueItem[];
      //   }>("https://proapi.azurewebsites.net/github/issues", {
      //     params,
      //   });
      // }}
      editable={{
        type: "multiple",
      }}
      columnsState={{
        persistenceKey: "pro-table-singe-demos",
        persistenceType: "localStorage",
        onChange(value) {
          console.log("value: ", value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === "get") {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="用户管理"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
      ]}
    />
  );
}
