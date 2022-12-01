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