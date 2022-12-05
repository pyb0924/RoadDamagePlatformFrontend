import React from 'react';

import {Layout} from 'antd';

const {Content} = Layout;

export default function DashBoard() {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 24,
        minHeight: 280,
      }}>
      <iframe
        title="dashboard"
        style={{height: '100%', width: '100%'}}
        src={
          'http://8.133.173.48:3000/d/36qs3vF4z/zhi-hui-gong-lu-yang-hu-shu-ju-da-ping?orgId=2&kiosk'
        }></iframe>
    </Content>
  );
}
