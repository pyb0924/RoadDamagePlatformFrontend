import React from "react";

import { Button, Layout, Space } from "antd";

export default function ToolBar() {
  return (
    <Layout style={{background:"#041429"}}>
      <Space>
        <Button type="primary">test1</Button>
        <Button>test2</Button>
        <Button>test3</Button>
      </Space>
    </Layout>
  );
}
