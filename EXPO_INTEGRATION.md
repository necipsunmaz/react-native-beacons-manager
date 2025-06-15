# Expo Integration Guide for react-native-beacons-manager

This guide explains how to use the updated react-native-beacons-manager library in your Expo project.

## Installation

### 1. Install the package

```bash
npm install react-native-beacons-manager
# or
yarn add react-native-beacons-manager
```

### 2. Add the Expo config plugin

Add the plugin to your `app.json` or `app.config.js`:

#### app.json

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-beacons-manager",
        {
          "locationAlwaysAndWhenInUsePermission": "This app uses location services to detect beacons in the background.",
          "locationAlwaysPermission": "This app uses location services to detect beacons in the background.",
          "locationWhenInUsePermission": "This app uses location services to detect beacons when the app is in use.",
          "bluetoothAlwaysPermission": "This app uses Bluetooth to detect beacons."
        }
      ]
    ]
  }
}
```

#### app.config.js

```javascript
export default {
  expo: {
    plugins: [
      [
        'react-native-beacons-manager',
        {
          locationAlwaysAndWhenInUsePermission: 'This app uses location services to detect beacons in the background.',
          locationAlwaysPermission: 'This app uses location services to detect beacons in the background.',
          locationWhenInUsePermission: 'This app uses location services to detect beacons when the app is in use.',
          bluetoothAlwaysPermission: 'This app uses Bluetooth to detect beacons.'
        }
      ]
    ]
  }
};
```

### 3. Configure your Expo development build

Since this library uses native code, you'll need to create a development build:

```bash
expo install expo-dev-client
expo run:ios
# or
expo run:android
```

## Usage

The API remains the same as the original library:

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Beacons from 'react-native-beacons-manager';

export default function BeaconScanner() {
  const [beacons, setBeacons] = useState([]);

  useEffect(() => {
    // Request permission (iOS)
    Beacons.requestWhenInUseAuthorization();

    // Define a region to monitor
    const region = {
      identifier: 'MyBeacon',
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0'
    };

    // Start monitoring
    Beacons.startMonitoringForRegion(region)
      .then(() => console.log('Monitoring started'))
      .catch(error => console.error('Monitoring failed:', error));

    // Start ranging
    Beacons.startRangingBeaconsInRegion(region)
      .then(() => console.log('Ranging started'))
      .catch(error => console.error('Ranging failed:', error));

    // Listen for beacon events
    const subscription = Beacons.BeaconsEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        console.log('Beacons detected:', data.beacons);
        setBeacons(data.beacons);
      }
    );

    return () => {
      subscription.remove();
      Beacons.stopRangingBeaconsInRegion(region);
      Beacons.stopMonitoringForRegion(region);
    };
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Detected Beacons: {beacons.length}
      </Text>
      {beacons.map((beacon, index) => (
        <Text key={index}>
          UUID: {beacon.uuid}, Major: {beacon.major}, Minor: {beacon.minor}
        </Text>
      ))}
    </View>
  );
}
```

## Android Specific Setup

For Android, you can detect different beacon types:

```javascript
// Detect iBeacons
Beacons.detectIBeacons()
  .then(() => console.log('iBeacon detection enabled'))
  .catch(error => console.error('iBeacon detection failed:', error));

// Detect AltBeacons
Beacons.detectAltBeacons()
  .then(() => console.log('AltBeacon detection enabled'))
  .catch(error => console.error('AltBeacon detection failed:', error));
```

## Permissions

The Expo config plugin automatically adds the required permissions:

### iOS

- `NSLocationAlwaysAndWhenInUseUsageDescription`
- `NSLocationAlwaysUsageDescription`
- `NSLocationWhenInUseUsageDescription`
- `NSBluetoothAlwaysUsageDescription`
- Background modes: `location`, `bluetooth-central`

### Android

- `ACCESS_COARSE_LOCATION`
- `ACCESS_FINE_LOCATION`
- `BLUETOOTH`
- `BLUETOOTH_ADMIN`
- `BLUETOOTH_SCAN`
- `BLUETOOTH_ADVERTISE`
- Bluetooth LE hardware feature requirement

## Notes

1. This library requires a development build and cannot be used with Expo Go
2. Make sure to test on physical devices as beacon detection doesn't work in simulators
3. For iOS, location permission is required for beacon detection
4. For Android API 23+, runtime permissions may be needed

## Troubleshooting

1. **"Module not found" error**: Make sure you've created a development build after adding the plugin
2. **Permission denied**: Ensure location permissions are granted at runtime
3. **No beacons detected**: Check that your beacons are broadcasting and in range

## Migration from Previous Versions

If you're migrating from an older version:

1. Remove any manual native configuration
2. Add the Expo config plugin to your app.json
3. Create a new development build
4. The JavaScript API remains the same

For more examples and detailed API documentation, see the main README.md file.
