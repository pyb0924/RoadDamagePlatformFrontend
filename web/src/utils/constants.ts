import {EventStatus, EventType} from '../store/types/event';

export interface FilterItem {
  key: string;
  name: any;
  title: string;
}

export const eventStatusList = [
  {key: 'withdraw', name: EventStatus.WITHDRAW, title: '已完成'},
  {key: 'onconfirm', name: EventStatus.ONCONFIRM, title: '待确认'},
  {key: 'oncheck', name: EventStatus.ONCHECK, title: '待验收'},
  {key: 'onconserve', name: EventStatus.ONCONSERVE, title: '待养护'},
  {key: 'conserving', name: EventStatus.CONSERVING, title: '养护中'},
];

export const eventTypeList = [
  {key: 'hole', name: EventType.HOLE, title: '坑洞'},
  {key: 'crack', name: EventType.CRACK, title: '裂痕'},
];