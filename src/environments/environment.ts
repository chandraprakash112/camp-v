// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false,
  baseUrl: 'https://qa.samparkme.com/Comp-vision-solution',
  // baseWebSocket: 'ws://94.136.188.209/notification/ws',
  pusher: {
    key: '55af717be18d7bb5fdb1',
    secret: '4bffda7fa1c1035ad4e6',
    endPoint: 'https://qa.samparkme.com/Comp-vision-solution/broadcasting/auth',
    cluster: 'ap2',
    // key : "e2102754b64bf57c64df",
    // endPoint: 'http://localhost:3000/pusher/auth',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
