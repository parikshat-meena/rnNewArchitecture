import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';

const manager = new BleManager();

interface BluetoothDevice extends Device {
  rssi?: number;
}

const BluetoothScanner: React.FC = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const requestBluetoothPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+ (API 31+) permissions
        const permissions = [
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        return Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        // Android 11 and below
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
        ];

        const granted = await PermissionsAndroid.requestMultiple(permissions);
        
        return Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED,
        );
      }
    }
    return true; // iOS permissions are handled via Info.plist
  }, []);

  const scanForDevices = useCallback(async () => {
    const hasPermissions = await requestBluetoothPermissions();
    
    if (!hasPermissions) {
      Alert.alert(
        'Permission denied',
        'Bluetooth permissions are required to scan for devices',
      );
      return;
    }

    // Check Bluetooth state
    const bluetoothState = await manager.state();
    if (bluetoothState !== 'PoweredOn') {
      Alert.alert(
        'Bluetooth not enabled',
        'Please enable Bluetooth to scan for devices',
      );
      return;
    }

    setDevices([]);
    setIsScanning(true);
    
    // Start scanning with JSI-optimized parameters
    manager.startDeviceScan(
      null, // UUIDs filter - null for all devices
      { 
        allowDuplicates: false,
        scanMode: 'LowPowerScan' as any, // Type assertion for compatibility
      },
      (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          setIsScanning(false);
          Alert.alert('Scan Error', error.message);
          return;
        }

        if (device?.name && device.name.trim() !== '') {
          setDevices(prevDevices => {
            const existingDevice = prevDevices.find(d => d.id === device.id);
            if (existingDevice) {
              return prevDevices; // Don't add duplicates
            }
            return [...prevDevices, device as BluetoothDevice].sort((a, b) => 
              (b.rssi || -100) - (a.rssi || -100)
            );
          });
        }
      },
    );

    // Auto-stop scan after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  }, [requestBluetoothPermissions]);

  const connectToDevice = useCallback(async (device: Device) => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      // Stop scanning before connecting
      manager.stopDeviceScan();
      setIsScanning(false);

      console.log(`Connecting to device: ${device.name} (${device.id})`);
      
      // Connect with timeout and proper error handling
      const connectedDevice = await device.connect({
        requestMTU: 512, // Request larger MTU for better performance
        timeout: 10000,  // 10 second timeout
      });
      
      // Discover services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      setConnectedDevice(connectedDevice);
      
      Alert.alert(
        'Connected Successfully', 
        `Connected to ${device.name || 'Unknown Device'}`
      );

      // Optional: Read device information or setup notifications
      await readDeviceInformation(connectedDevice);
      
    } catch (error: any) {
      console.error('Connection error:', error);
      Alert.alert(
        'Connection Failed', 
        error.message || 'Failed to connect to device'
      );
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const readDeviceInformation = useCallback(async (device: Device) => {
    try {
      // Example: Read device information service
      const services = await device.services();
      console.log('Available services:', services.map(s => s.uuid));
      
      // You can implement specific characteristic reads here
      // Example for reading battery level:
      // const batteryService = services.find(s => s.uuid === '180F');
      // if (batteryService) {
      //   const characteristics = await batteryService.characteristics();
      //   // Read battery level characteristic
      // }
      
    } catch (error) {
      console.error('Error reading device information:', error);
    }
  }, []);

  const disconnectDevice = useCallback(async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        Alert.alert('Disconnected', 'Device disconnected successfully');
      } catch (error: any) {
        console.error('Disconnect error:', error);
        Alert.alert('Disconnect Error', error.message);
      }
    }
  }, [connectedDevice]);

  useEffect(() => {
    // Initialize BLE manager with Fabric-compatible settings
    const subscription = manager.onStateChange((state) => {
      console.log('Bluetooth state changed:', state);
      if (state === 'PoweredOn') {
        console.log('Bluetooth is ready');
      }
    }, true);

    return () => {
      subscription.remove();
      manager.stopDeviceScan();
      if (connectedDevice) {
        connectedDevice.cancelConnection().catch(console.error);
      }
      manager.destroy();
    };
  }, [connectedDevice]);

  const renderDevice = useCallback(({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
      disabled={isConnecting}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceId} numberOfLines={1}>
          {item.id}
        </Text>
        {item.rssi && (
          <Text style={styles.rssi}>RSSI: {item.rssi} dBm</Text>
        )}
      </View>
      {isConnecting && (
        <ActivityIndicator size="small" color="#007AFF" />
      )}
    </TouchableOpacity>
  ), [connectToDevice, isConnecting]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {connectedDevice
            ? `Connected: ${connectedDevice.name || 'Unknown'}`
            : 'Bluetooth Scanner'}
        </Text>
        
        <View style={styles.buttonRow}>
          {!connectedDevice ? (
            <TouchableOpacity
              style={[styles.button, isScanning && styles.buttonDisabled]}
              onPress={scanForDevices}
              disabled={isScanning}
            >
              <Text style={styles.buttonText}>
                {isScanning ? 'Scanning...' : 'Scan Devices'}
              </Text>
              {isScanning && (
                <ActivityIndicator
                  size="small"
                  color="#FFF"
                  style={styles.buttonLoader}
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.disconnectButton]}
              onPress={disconnectDevice}
            >
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!connectedDevice && (
        <FlatList
          data={devices}
          keyExtractor={item => item.id}
          renderItem={renderDevice}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isScanning
                ? 'Scanning for Bluetooth devices...'
                : 'No devices found. Tap "Scan Devices" to start.'}
            </Text>
          }
          style={styles.deviceList}
        />
      )}

      {connectedDevice && (
        <View style={styles.connectedInfo}>
          <Text style={styles.connectedText}>
            Device connected successfully! You can now implement read/write operations.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  disconnectButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLoader: {
    marginLeft: 8,
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
  },
  rssi: {
    fontSize: 12,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  connectedInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  connectedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default BluetoothScanner;
