import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  baseUrl: 'https://qa.samparkme.com/Comp-vision-solution',
  baseWebSocket: 'ws://94.136.188.209/notification/ws',
  pusher: {
    key: '55af717be18d7bb5fdb1',
    secret: '4bffda7fa1c1035ad4e6',
    endPoint: 'https://qa.samparkme.com/Comp-vision-solution/broadcasting/auth',
    cluster: 'ap2',
    // key : "e2102754b64bf57c64df",
    // endPoint: 'http://localhost:3000/pusher/auth',
  },
};
