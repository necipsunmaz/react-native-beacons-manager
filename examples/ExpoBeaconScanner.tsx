// Simple Beacon Scanner Component for Expo
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Platform } from 'react-native';
import Beacons from 'react-native-beacons-manager';

export default function BeaconScanner() {
  const [beacons, setBeacons] = useState([]);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    // Request permissions for iOS
    Beacons.requestWhenInUseAuthorization();

    // Define a region to monitor
    const beaconRegion = {
      identifier: 'MyBeaconRegion',
      uuid: 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0', // Replace with your beacon UUID
    };

    setRegion(beaconRegion);

    // For Android, detect iBeacons
    if (Platform.OS === 'android') {
      Beacons.detectIBeacons()
        .then(() => console.log('iBeacon detection enabled'))
        .catch(error => console.error('iBeacon detection failed:', error));
    }

    // Start monitoring for the region
    Beacons.startMonitoringForRegion(beaconRegion)
      .then(() => console.log('Monitoring started successfully'))
      .catch(error => {
        console.error('Monitoring failed:', error);
        Alert.alert('Error', 'Failed to start monitoring beacons');
      });

    // Start ranging beacons in the region
    Beacons.startRangingBeaconsInRegion(beaconRegion)
      .then(() => console.log('Ranging started successfully'))
      .catch(error => {
        console.error('Ranging failed:', error);
        Alert.alert('Error', 'Failed to start ranging beacons');
      });

    // Listen for beacons
    const beaconsDidRangeSubscription = Beacons.BeaconsEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        console.log('Beacons detected:', data.beacons);
        setBeacons(data.beacons);
      }
    );

    // Listen for region enter/exit
    const regionDidEnterSubscription = Beacons.BeaconsEventEmitter.addListener(
      'regionDidEnter',
      (data) => {
        console.log('Entered region:', data);
        Alert.alert('Beacon Region', 'Entered beacon region');
      }
    );

    const regionDidExitSubscription = Beacons.BeaconsEventEmitter.addListener(
      'regionDidExit',
      (data) => {
        console.log('Exited region:', data);
        Alert.alert('Beacon Region', 'Exited beacon region');
      }
    );

    // Cleanup
    return () => {
      beaconsDidRangeSubscription.remove();
      regionDidEnterSubscription.remove();
      regionDidExitSubscription.remove();
      
      if (beaconRegion) {
        Beacons.stopRangingBeaconsInRegion(beaconRegion);
        Beacons.stopMonitoringForRegion(beaconRegion);
      }
    };
  }, []);

  const renderBeacon = ({ item, index }) => (
    <View style={styles.beaconItem}>
      <Text style={styles.beaconText}>Beacon {index + 1}</Text>
      <Text>UUID: {item.uuid}</Text>
      <Text>Major: {item.major}</Text>
      <Text>Minor: {item.minor}</Text>
      <Text>Distance: {item.distance?.toFixed(2) || item.accuracy?.toFixed(2) || 'Unknown'} m</Text>
      <Text>RSSI: {item.rssi}</Text>
      <Text>Proximity: {item.proximity || 'Unknown'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beacon Scanner</Text>
      <Text style={styles.subtitle}>Detected Beacons: {beacons.length}</Text>
      
      {beacons.length > 0 ? (
        <FlatList
          data={beacons}
          renderItem={renderBeacon}
          keyExtractor={(item, index) => `${item.uuid}-${item.major}-${item.minor}-${index}`}
          style={styles.list}
        />
      ) : (
        <Text style={styles.noBeacons}>No beacons detected</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  beaconItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  beaconText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noBeacons: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
});
