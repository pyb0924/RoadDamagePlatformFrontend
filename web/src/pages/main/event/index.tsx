import React, {useState} from 'react';

import {Space, Table, Tag, Layout, Button, Input, Checkbox} from 'antd';
import {CheckboxValueType} from 'antd/lib/checkbox/Group';
import Column from 'antd/es/table/Column';

import {
  MinusCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';

import {EventStatus} from '../../../store/types/event';

const {Content} = Layout;
const {Search} = Input;

const plainOptions = [
  {label: '无需养护', value: 0},
  {label: '待确认', value: 1},
  {label: '待养护', value: 2},
  {label: '养护中', value: 3},
  {label: '待验收', value: 4},
  {label: '已验收', value: 5},
  {label: '只看自己', value: 6},
];

interface TableParams {
  name: string;
  status: number;
  starttime: string;
  lastchangetime: string;
}

const data: TableParams[] = [
  {
    name: '范德萨2',
    status: 0,
    starttime: '2022/01/02',
    lastchangetime: '2022/01/04',
  },
  {
    name: '范德萨1',
    status: 1,
    starttime: '2022/02/04',
    lastchangetime: '2022/06/04',
  },
  {
    name: '范德萨5',
    status: 2,
    starttime: '2022/06/02',
    lastchangetime: '2022/10/24',
  },
  {
    name: '范德萨4',
    status: 3,
    starttime: '1997/02/04',
    lastchangetime: '2200/06/04',
  },
  {
    name: '范德萨3',
    status: 4,
    starttime: '4396/06/02',
    lastchangetime: '1882/10/24',
  },
  {
    name: '范德萨6',
    status: 5,
    starttime: '1996/06/22',
    lastchangetime: '2034/10/24',
  },
];

export default function EventPage() {
  const [tableData, setTableData] = useState<TableParams[]>(data);

  const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    setTableData(data.filter(data => checkedValues.includes(data.status)));
    console.log('checked = ', checkedValues);
  };

  return (
    <Content
      className="site-layout-background"
      style={{
        padding: 24,
        margin: 24,
        minHeight: 280,
      }}>
      <div style={{paddingBottom: 24, display: 'flex', alignItems: 'center'}}>
        <Search
          placeholder="input search text"
          size="large"
          enterButton="Search"
          loading
          style={{maxWidth: 500, paddingRight: 100}}
        />

        <Checkbox.Group
          options={plainOptions}
          defaultValue={[0, 1, 2, 3, 4, 5, 6]}
          onChange={handleCheckboxChange}
        />
      </div>

      <Table dataSource={tableData}>
        <Column
          title="养护事件名称"
          dataIndex="name"
          key="eventid"
          width={'20%'}
          sorter={true}
        />
        <Column
          title="事件状态"
          dataIndex="status"
          key="status"
          width={'20%'}
          render={status => {
            let tagIcon;
            let tagColor;
            let tagText;
            switch (status) {
              case EventStatus.WITHDRAW:
                tagIcon = <MinusCircleOutlined />;
                tagColor = 'volcano';
                tagText = '无需养护';
                break;
              case EventStatus.ONCONFIRM:
                tagIcon = <ClockCircleOutlined />;
                tagColor = 'processing';
                tagText = '等待确认';
                break;
              case EventStatus.ONCONSERVE:
                tagIcon = <ClockCircleOutlined />;
                tagColor = 'processing';
                tagText = '等待养护';
                break;
              case EventStatus.CONSERVING:
                tagIcon = <SyncOutlined spin />;
                tagColor = 'geekblue';
                tagText = '正在养护';
                break;
              case EventStatus.ONCHECK:
                tagIcon = <ClockCircleOutlined />;
                tagColor = 'processing';
                tagText = '等待验收';
                break;
              case EventStatus.CHECKED:
                tagIcon = <CheckCircleOutlined />;
                tagColor = 'success';
                tagText = '验收完成';
                break;
              default:
                break;
            }
            return (
              <Tag icon={tagIcon} color={tagColor}>
                {tagText}
              </Tag>
            );
          }}
        />
        <Column title="创建时间" dataIndex="starttime" width={'20%'} />
        <Column title="上次修改时间" dataIndex="lastchangetime" width={'20%'} />
        <Column
          key="action"
          render={() => (
            <Space>
              <Button
                key="detail"
                type="primary"
                size="small"
                icon={<LinkOutlined />}
                //onClick={}
              >
                查看详情
              </Button>
            </Space>
          )}
        />
      </Table>
    </Content>
  );
}
