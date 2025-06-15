import {
  AndroidConfig,
  ConfigPlugin,
  IOSConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withInfoPlist,
} from '@expo/config-plugins';

const pkg = { name: 'react-native-beacons-manager', version: '1.2.0' };

interface BeaconsPluginProps {
  locationAlwaysAndWhenInUsePermission?: string;
  locationAlwaysPermission?: string;
  locationWhenInUsePermission?: string;
  bluetoothAlwaysPermission?: string;
}

const withBeaconsAndroid: ConfigPlugin<BeaconsPluginProps> = (config, props = {}) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    // Add permissions
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.ACCESS_COARSE_LOCATION'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.ACCESS_FINE_LOCATION'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH_ADMIN'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH_SCAN'
    );
    AndroidConfig.Permissions.addPermission(
      androidManifest,
      'android.permission.BLUETOOTH_ADVERTISE'
    );

    // Add uses-feature for Bluetooth LE
    if (!androidManifest.manifest['uses-feature']) {
      androidManifest.manifest['uses-feature'] = [];
    }

    const hasBluetoothLE = androidManifest.manifest['uses-feature'].some(
      (feature: any) => 
        feature.$?.['android:name'] === 'android.hardware.bluetooth_le'
    );

    if (!hasBluetoothLE) {
      androidManifest.manifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.bluetooth_le',
          'android:required': 'true',
        },
      });
    }

    return config;
  });
};

const withBeaconsIOS: ConfigPlugin<BeaconsPluginProps> = (config, props = {}) => {
  return withInfoPlist(config, (config) => {
    const {
      locationAlwaysAndWhenInUsePermission = 'This app uses location services to detect beacons in the background.',
      locationAlwaysPermission = 'This app uses location services to detect beacons in the background.',
      locationWhenInUsePermission = 'This app uses location services to detect beacons when the app is in use.',
      bluetoothAlwaysPermission = 'This app uses Bluetooth to detect beacons.',
    } = props;

    // Add location permissions
    config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription = locationAlwaysAndWhenInUsePermission;
    config.modResults.NSLocationAlwaysUsageDescription = locationAlwaysPermission;
    config.modResults.NSLocationWhenInUseUsageDescription = locationWhenInUsePermission;
    
    // Add Bluetooth permission
    config.modResults.NSBluetoothAlwaysUsageDescription = bluetoothAlwaysPermission;

    // Add background modes for location
    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = [];
    }

    const backgroundModes = config.modResults.UIBackgroundModes;
    if (!backgroundModes.includes('location')) {
      backgroundModes.push('location');
    }
    if (!backgroundModes.includes('bluetooth-central')) {
      backgroundModes.push('bluetooth-central');
    }

    return config;
  });
};

const withBeacons: ConfigPlugin<BeaconsPluginProps> = (config, props = {}) => {
  config = withBeaconsAndroid(config, props);
  config = withBeaconsIOS(config, props);
  return config;
};

export default createRunOncePlugin(withBeacons, pkg.name, pkg.version);