import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';

import {
  Layout,
  Menu,
  Image,
  MenuProps,
  Typography,
  Row,
  Col,
  Space,
} from 'antd';
import {MenuItemType} from 'antd/lib/menu/hooks/useItems';
import {
  GlobalOutlined,
  PieChartOutlined,
  UserOutlined,
  ReconciliationOutlined,
} from '@ant-design/icons';

import {useAppSelector} from '../../store/hooks';
import {PermissionType} from '../../store/types/permission';

import './index.css';

const {Text} = Typography;

const {Header, Footer, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}


const MainPage: React.FC = () => {
  const permissions = useAppSelector(state => state.user.permissions);

  const getMenuItems = () => {
    const items: MenuItem[] = [
      getItem('工作台', 'dashboard', <PieChartOutlined />),
      getItem('数据地图', 'map', <GlobalOutlined />),
      getItem('养护工作', 'event', <ReconciliationOutlined />),
    ];

    if (
      permissions.includes(PermissionType.USER_ADD) ||
      permissions.includes(PermissionType.USER_EDIT) ||
      permissions.includes(PermissionType.USER_DELETE)
    ) {
      items.push(getItem('用户管理', 'user', <UserOutlined />));
    }
    return items;
  };
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    setMenuItems(getMenuItems());
  }, [permissions]);

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // TODO add subpages' navigation after finishing subpages
  const handleMenuNavigation = (itemtype: MenuItemType) => {
    switch (itemtype.key) {
      case 'dashboard':
        navigate('/main/dashboard');
        break;
      case 'map':
        navigate('/main/map');
        break;
      case 'event':
        navigate('/main/event');
        break;
      case 'user':
        navigate('/main/user');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{minHeight: '100vh'}}>
      <Header className="header">
        <Row justify="space-around" align="middle">
          <Col flex="250px">
            <Space>
              <Image
                height={24}
                width={24}
                preview={false}
                src="/logo512.png"
              />
              <Text style={{color: '#fff', fontSize: 18}}>
                智慧公路信息管理平台
              </Text>
            </Space>
          </Col>
          <Col flex="auto" />
          <Col flex="70px">
            {/* <Dropdown.Button menu={menuProps} placement="bottom" icon={<UserOutlined />}>
              Dropdown
            </Dropdown.Button> */}
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          className="site-layout-background"
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}>
          <Menu
            style={{height: '100%', borderRight: 0}}
            defaultSelectedKeys={['dashboard']}
            mode="inline"
            items={menuItems}
            onClick={handleMenuNavigation}
          />
        </Sider>
        <Layout>
          <Outlet />
          <Footer
            style={{
              textAlign: 'center',
              padding: '13px',
              background: '#092040',
              color: 'white',
            }}>
            智慧公路信息管理平台 by EI6705 Group9
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainPage;
