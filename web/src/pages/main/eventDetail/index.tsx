import React from 'react';
import {useNavigate} from 'react-router-dom';

import {Button, Divider} from 'antd';
import {Content} from 'antd/lib/layout/layout';

import {LeftOutlined} from '@ant-design/icons';

// TODO finish EventDetailPage
export default function EventDetailPage() {
  const navigate = useNavigate();

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 24,
        minHeight: 280,
      }}>
      <Button
        type="primary"
        ghost
        shape="round"
        icon={<LeftOutlined />}
        onClick={() => {
          navigate('/main/event');
        }}>
        返回
      </Button>
      <Divider>事件详情</Divider>
      <div>This is a detail page.</div>
    </Content>
  );
}
