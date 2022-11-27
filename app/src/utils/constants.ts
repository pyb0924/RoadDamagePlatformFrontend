import {EventStatus, EventType} from '../store/types/event';

export const eventStatusList = [
  {key: EventStatus.WITHDRAW, title: '已完成'},
  {key: EventStatus.ONCONFIRM, title: '待确认'},
  {key: EventStatus.ONCHECK, title: '待验收'},
  {key: EventStatus.ONCONSERVE, title: '待养护'},
  {key: EventStatus.CONSERVING, title: '养护中'},
];

export const eventTypeList = [
  {key: EventType.HOLE, title: '坑洞'},
  {key: EventType.CRACK, title: '裂痕'},
];
