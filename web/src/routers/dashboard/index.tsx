import React, { useState } from "react";

import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import {
  FileAddOutlined,
  GlobalOutlined,
  PieChartOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

import UserList from "../../components/userList";

import "./index.css";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("工作台", "dashboard", <PieChartOutlined />),
  getItem("数据地图", "map", <GlobalOutlined />),
  getItem("数据上传", "upload", <PlusCircleOutlined />),
  getItem("当前流程", "9", <FileAddOutlined />),
  getItem("用户管理", "user", <UserOutlined />),
];

const DashBoard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} >
          1234
        </Header>
        <Content style={{ margin: "0 16px" }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <UserList />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashBoard;
