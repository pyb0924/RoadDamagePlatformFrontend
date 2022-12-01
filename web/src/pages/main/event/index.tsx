import React, {useState, useEffect} from 'react';

import {Space, Table, Tag, Layout, Button, Input, Checkbox} from 'antd';
import {CheckboxValueType} from 'antd/lib/checkbox/Group';
import {TablePaginationConfig} from 'antd/es/table';
import Column from 'antd/es/table/Column';

import {
  MinusCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';

import {useAppSelector} from '../../../store/hooks';
import {useGetEventsQuery} from '../../../store/api/eventApi';
import {Event, EventStatus, EventType} from '../../../store/types/event';
import {buildRequestWithToken} from '../../../utils/utils';


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
  pagination: TablePaginationConfig;
}

export default function EventPage() {
  const token = useAppSelector(state => state.user.token);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      total: 1,
      current: 1,
      pageSize: 10,
    },
  });

  // todo: request events by status
  // const [eventStatusFilter, setEventStatusFilter] = useState();

  const {data: eventList, refetch} = useGetEventsQuery(
    buildRequestWithToken(
      {
        params: {
          // status: eventStatusFilter,
          offset: tableParams.pagination.current as number,
          limit: tableParams.pagination.pageSize as number,
        },
      },
      token,
    ),
  );

  const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    //  setEventStatusFilter(checkedValues);
    // console.log(checkedValues);
    // refetch();
  };

  // update pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
    console.log(pagination);
    setTableParams({
      pagination,
    });
  };

  // request by page
  useEffect(() => {
    if (
      tableParams.pagination.current === undefined ||
      tableParams.pagination.pageSize === undefined
    ) {
      return;
    }
    try {
      refetch();
    } catch (err) {
      console.log(err);
    }
  }, [tableParams.pagination.current, token]);

  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        total: eventList?.data.total,
        current: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      },
    });
  }, [tableParams, eventList]);

  // todo: handle check details: open a new router
  const handleCheckDetails = () => {};

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

      <Table<Event>
        dataSource={eventList?.data.event_list}
        pagination={tableParams.pagination}
        onChange={handleTableChange}>
        <Column
          title="事件名称"
          dataIndex="event_id"
          key="eventID"
          width={'20%'}
          sorter={true}
        />
        <Column
          title="事件状态"
          dataIndex="status"
          key="status"
          width={'10%'}
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
        <Column
          title="病害类型"
          dataIndex="type"
          key="type"
          render={status => {
            let tagColor;
            let tagText;
            switch (status) {
              case EventType.HOLE:
                tagColor = "#87d068";
                tagText = '坑洞';
                break;

              case EventType.CRACK:
                tagColor = '#108ee9';
                tagText = '裂缝';
                break;

              default:
                break;
            }
            return (
              <Tag color={tagColor}>
                {tagText}
              </Tag>
            )
          }}
          width={'10%'}
        />
        <Column
          title="事件创建时间"
          dataIndex="event_id"
          key="createTime"
          width={'20%'}
        />
        <Column
          title="上次修改时间"
          dataIndex="event_id"
          key="lastChangeTime"
          width={'20%'}
        />
        <Column
          title="查看详情"
          key="action"
          render={() => (
            <Space>
              <Button
                key="detail"
                type="primary"
                size="small"
                icon={<LinkOutlined />}
                onClick={handleCheckDetails}>
                查看详情
              </Button>
            </Space>
          )}
        />
      </Table>
    </Content>
  );
}
