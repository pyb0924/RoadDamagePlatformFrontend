import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { MenuItemType } from "antd/lib/menu/hooks/useItems";
import {
  GlobalOutlined,
  PieChartOutlined,
  UserOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";

import "./index.css";
import ToolBar from "../../components/toolBar";
import { useAppSelector } from "../../app/hooks";
import { PermissionType } from "../../app/types/permission";

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

// TODO name change DashBoard => LayOut
const MainPage: React.FC = () => {
  const permissions = useAppSelector((state) => state.user.permissions);

  const getMenuItems = () => {
    const items: MenuItem[] = [
      getItem("工作台", "dashboard", <PieChartOutlined />),
      getItem("数据地图", "map", <GlobalOutlined />),
      getItem("待办流程", "todo", <ReconciliationOutlined />),
    ];

    if (
      permissions.includes(PermissionType.USER_ADD) ||
      permissions.includes(PermissionType.USER_EDIT) ||
      permissions.includes(PermissionType.USER_DELETE)
    ) {
      items.push(getItem("用户管理", "user", <UserOutlined />));
    }
    return items;
  };
  const [menuItems] = useState(getMenuItems());
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // TODO add subpages' navigation after finishing subpages
  const handleMenuNavigation = (itemtype: MenuItemType) => {
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
      <Header className="header">
        <div className="logo" />
        <ToolBar />
      </Header>
      <Layout>
        <Sider
          className="site-layout-background"
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            style={{ height: "100%", borderRight: 0 }}
            defaultSelectedKeys={["dashboard"]}
            mode="inline"
            items={menuItems}
            onClick={handleMenuNavigation}
          />
        </Sider>
        <Layout style={{ padding: "24px 24px 0 24px" }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center", padding: "13px" }}>
            智慧公路信息管理平台 by EI6705 Group9
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainPage;
