import {FilterItem} from './constants';

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

export const buildFilterQueryArray = (
  obj: {[key: string]: boolean},
  arr: FilterItem[],
) => {
  const filterList = [];
  for (const key in obj) {
    if (obj[key]) {
      filterList.push(arr.find(item => item.key === key)?.name);
    }
  }
  console.log('filter query', filterList);
  return filterList;
};
