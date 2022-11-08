import React from "react";

import { Layout } from "antd";

const { Content } = Layout;

export default function DashBoard() {
  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 24,
        minHeight: 280,
      }}
    >
      <div>This is a dashboard</div>
    </Content>
  );
}
