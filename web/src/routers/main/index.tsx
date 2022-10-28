import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import type { MenuItemProps, MenuProps } from "antd";
import { Layout, Menu } from "antd";
import {
  FileAddOutlined,
  GlobalOutlined,
  PieChartOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";


import "./index.css";
import { MenuItemType } from "rc-menu/lib/interface";

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


// TODO name change DashBoard => LayOut
const AppLayOut: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // TODO add subpages' navigation after finishing subpages
  const handleClick = (itemtype: MenuItemType) => {
    switch (itemtype.key) {
      case "dashboard":
        navigate("/main/dashboard");
        break;
      case "map":
        navigate("/main/map");
        break;
      case "upload":
        break;
      case "9":
        break;
      case "user":
        navigate("/main/user");
        break;
      default:
        break;
    }
  };

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
          onClick={handleClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          1234
        </Header>
        <Content style={{ margin: "0 16px" }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayOut;
