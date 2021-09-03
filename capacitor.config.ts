import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.henrikdev.mygus',
  appName: 'MyGUS',
  webDir: 'dist',
  bundledWebRuntime: false,
  "plugins": {

    "SplashScreen": {

      "launchShowDuration": 0,

      "launchAutoHide": true,

      "backgroundColor": "#ffffffff"

      }

  },
};

export default config;
