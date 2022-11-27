import {eventStatusList} from './constants';

export const positionToString = (position: {
  latitude: number;
  longitude: number;
}) => {
  return (
    `${Math.abs(position.longitude).toFixed(2)}°${
      position.longitude > 0 ? 'N' : 'S'
    }` +
    ' ' +
    `${Math.abs(position.latitude).toFixed(2)}°${
      position.latitude > 0 ? 'E' : 'W'
    }`
  );
};

export const buildRequestWithToken = (request: any, token: string) => {
  return {...request, headers: {Authorization: token}};
};

export const getDefaultFilter = (arr: {key: any; title: string}[]) => {
  const filter = {};
  arr.map(item => Reflect.defineProperty(filter, item.key, {value: true}));
  return filter;
};

export const buildFilterQueryArray = (obj: {[key: string]: boolean}) => {
  const filterList = [];
  for (const key in obj) {
    if (obj[key]) {
      filterList.push(
        eventStatusList.find(item => item.key.toString() === key)?.key,
      );
    }
  }
  return filterList;
};
