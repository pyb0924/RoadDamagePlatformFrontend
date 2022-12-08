import React, {useState, useEffect} from 'react';

import {Space, Table, Tag, Layout, Button, Input, Checkbox} from 'antd';
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
import {useNavigate} from 'react-router-dom';
import {eventStatusList, eventTypeList} from '../../../utils/constants';

const {Content} = Layout;
const {Search} = Input;

const statusOptions = eventStatusList.map(item => {
  return Object.assign({}, {label: item.title, value: item.name});
});

const typeOptions = eventTypeList.map(item => {
  return Object.assign({}, {label: item.title, value: item.name});
});

interface TableParams {
  pagination: TablePaginationConfig;
}

export default function EventPage() {
  const navigate = useNavigate();
  const token = useAppSelector(state => state.user.token);
  const user_id = useAppSelector(state => state.user.user_id);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      total: 1,
      current: 1,
      pageSize: 15,
    },
  });

  // get events by eventStatus & eventType & user_id
  const [eventStatusFilter, setEventStatusFilter] = useState([
    EventStatus.WITHDRAW,
    EventStatus.ONCONFIRM,
    EventStatus.ONCONSERVE,
    EventStatus.CONSERVING,
    EventStatus.ONCHECK,
    EventStatus.CHECKED,
  ]);
  const [eventTypeFilter, setEventTypeFilter] = useState([
    EventType.HOLE,
    EventType.CRACK,
  ]);
  const [eventUserFilter, setEventUserFilter] = useState('');

  const {data: eventList, refetch} = useGetEventsQuery(
    buildRequestWithToken(
      {
        params: {
          status: eventStatusFilter,
          type: eventTypeFilter,
          user_id: eventUserFilter,
          offset: tableParams.pagination.current as number,
          limit: tableParams.pagination.pageSize as number,
        },
      },
      token,
    ),
  );

  // refetch data when changing eventStatus & eventType & user_id
  useEffect(() => {
    if (eventStatusFilter.length !== 0 || eventTypeFilter.length !== 0)
      refetch();
  }, [eventStatusFilter, eventTypeFilter, eventUserFilter, refetch]);

  // update pagination
  const handleTableChange = (pagination: TablePaginationConfig) => {
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
    // eslint-disable-next-line
  }, [tableParams.pagination.current, token, refetch]);

  useEffect(() => {
    setTableParams({
      ...tableParams,
      pagination: {
        total:
          eventStatusFilter.length === 0 || eventTypeFilter.length === 0
            ? 0
            : eventList?.data.total,
        current: tableParams.pagination.current,
        pageSize: tableParams.pagination.pageSize,
      },
    });
  }, [tableParams, eventList, eventStatusFilter, eventTypeFilter]);

  // TODO search function
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
          options={statusOptions}
          defaultValue={[0, 1, 2, 3, 4, 5]}
          style={{paddingLeft: 50, paddingRight: 100}}
          onChange={checkedValues => {
            const statusFilter = checkedValues.map(Number);
            setEventStatusFilter(statusFilter);
          }}
        />

        <Checkbox.Group
          options={typeOptions}
          defaultValue={[0, 1]}
          onChange={checkedValues => {
            const typeFilter = checkedValues.map(Number);
            setEventTypeFilter(typeFilter);
          }}
        />

        <Checkbox
          style={{paddingLeft: 100}}
          onChange={e => {
            if (e.target.checked) {
              setEventUserFilter(user_id);
            } else {
              setEventUserFilter('');
            }
          }}>
          只看自己
        </Checkbox>
      </div>

      <Table<Event>
        dataSource={
          eventStatusFilter.length === 0 || eventTypeFilter.length === 0
            ? []
            : eventList?.data.event_list
        }
        pagination={tableParams.pagination}
        rowKey={record => record.event_id}
        onChange={handleTableChange}>
        <Column
          align="center"
          title="事件位置"
          dataIndex="address"
          key="address"
          width={'30%'}
          sorter={true}
        />
        <Column
          align="center"
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
          align="center"
          title="病害类型"
          dataIndex="type"
          key="type"
          render={status => {
            let tagColor;
            let tagText;
            switch (status) {
              case EventType.HOLE:
                tagColor = '#87d068';
                tagText = '坑洞';
                break;

              case EventType.CRACK:
                tagColor = '#108ee9';
                tagText = '裂缝';
                break;

              default:
                break;
            }
            return <Tag color={tagColor}>{tagText}</Tag>;
          }}
          width={'10%'}
        />
        <Column
          align="center"
          title="创建时间"
          dataIndex="create_time"
          key="createTime"
          width={'17.5%'}
        />
        <Column
          align="center"
          title="修改时间"
          dataIndex="update_time"
          key="updateTime"
          width={'17.5%'}
        />
        <Column
          align="center"
          title="查看详情"
          key="action"
          width={'15%'}
          render={record => (
            <Space>
              <Button
                key="detail"
                type="primary"
                size="small"
                icon={<LinkOutlined />}
                onClick={() => {
                  navigate('/main/event/'.concat(record.event_id));
                }}>
                查看详情
              </Button>
            </Space>
          )}
        />
      </Table>
    </Content>
  );
}
