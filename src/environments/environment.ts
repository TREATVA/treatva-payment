// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'dogapp-67827',
    appId: '1:911770351245:web:5d31f70588d98f3c56d4c4',
    databaseURL: 'https://dogapp-67827.firebaseio.com',
    storageBucket: 'dogapp-67827.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyD0dcS7gket5FjBMIjjzhMpwIJjoufjstE',
    authDomain: 'dogapp-67827.firebaseapp.com',
    messagingSenderId: '911770351245',
    measurementId: 'G-KB3DBR4FC7',
  },
  production: false,
  apiUrl:  "http://localhost:8080"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
