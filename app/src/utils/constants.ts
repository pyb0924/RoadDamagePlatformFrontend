import {EventStatus, EventType} from '../store/types/event';

export const eventStatusList = [
  {key: 'onconfirm', name: EventStatus.ONCONFIRM, title: '待确认'},
  {key: 'onconserve', name: EventStatus.ONCONSERVE, title: '待养护'},
  {key: 'conserving', name: EventStatus.CONSERVING, title: '养护中'},
  {key: 'oncheck', name: EventStatus.ONCHECK, title: '待验收'},
  {key: 'checked', name: EventStatus.CHECKED, title: '已验收'},
  {key: 'withdraw', name: EventStatus.WITHDRAW, title: '已完成'},
];

export const eventTypeList = [
  {key: 'uncatelogued', name: EventType.UNCATELOGUED, title: '未分类'},
  {key: 'hole', name: EventType.HOLE, title: '坑洞'},
  {key: 'crack', name: EventType.CRACK, title: '裂痕'},
];
