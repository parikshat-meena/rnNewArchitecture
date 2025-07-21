# React Native New Architecture Project

A React Native 0.80.1 project with **New Architecture (Fabric + TurboModules)** support, featuring Bluetooth Low Energy (BLE) connectivity and advanced gesture handling.

## 🚀 Features

- ✅ **New Architecture (Fabric + TurboModules)** enabled
- ✅ **Hermes + JSI** engine for optimal performance
- ✅ **Bluetooth Low Energy (BLE)** with `react-native-ble-plx`
- ✅ **Gesture Handler** with Reanimated 3+ support
- ✅ **Production-grade** permission handling for Android API 31+
- ✅ **Fabric-compliant** components and animations

## 📋 Requirements

- Node.js >= 18
- React Native 0.80.1
- Android SDK API 31+ / iOS 13+
- Android Studio / Xcode

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup

```bash
cd ios && pod install && cd ..
```

### 3. Android Setup

The project is already configured for Android with proper permissions.

### 4. Run the Project

```bash
# Android
npm run android

# iOS
npm run ios
```

## 🔧 New Architecture Configuration

### Gradle Properties (`android/gradle.properties`)
```properties
newArchEnabled=true
hermesEnabled=true
```

### Babel Configuration (`babel.config.js`)
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-gesture-handler/swg',
    'react-native-reanimated/plugin',
  ],
};
```

### Root Index (`index.js`)
```javascript
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

## 📱 Bluetooth Configuration

### Android Permissions (`android/app/src/main/AndroidManifest.xml`)

The app includes comprehensive Bluetooth permissions for Android API 31+:

```xml
<!-- Bluetooth Legacy Permissions (API < 31) -->
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />

<!-- Bluetooth New Permissions (API 31+) -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />

<!-- Location permission for Bluetooth scanning -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### iOS Permissions (`ios/dummyProject/Info.plist`)

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app uses Bluetooth to connect to devices.</string>
<key>NSBluetoothPeripheralUsageDescription</key>
<string>This app uses Bluetooth to connect to peripheral devices.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to scan for Bluetooth devices.</string>
```

## 🎮 Gesture Handler Setup

### App Wrapper (`App.tsx`)
```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* App content */}
    </GestureHandlerRootView>
  );
}
```

### Reanimated 3+ Usage
The gesture components use modern Reanimated 3 features:
- `useSharedValue` for shared values
- `useAnimatedGestureHandler` for gesture handling
- `useAnimatedStyle` for animated styles
- `withSpring` for smooth animations
- `runOnJS` for JavaScript thread operations

## 📁 Project Structure

```
src/
├── component/
│   ├── Bluetooth.tsx          # BLE scanner with New Architecture support
│   ├── LeftSwipeComp.tsx      # Swipe gesture with Reanimated 3+
│   ├── Home.tsx               # Home component
│   └── Swipable.tsx           # Additional swipe component
```

## 🔍 Key Components

### BluetoothScanner Component

- **New Architecture Compatible**: Uses JSI-optimized BLE operations
- **Modern Permissions**: Handles Android API 31+ permissions correctly
- **Production Features**: Connection management, error handling, device discovery
- **Performance**: Optimized scanning with proper cleanup

### LeftSwipeComponent

- **Reanimated 3+**: Uses modern animation APIs
- **Fabric Compatible**: Optimized for New Architecture
- **Smooth Gestures**: Spring animations with proper gesture handling
- **TypeScript**: Fully typed for better development experience

## 📊 Performance Features

### JSI Integration
- Direct JavaScript-to-native communication
- Reduced bridge overhead
- Improved Bluetooth and animation performance

### Hermes Engine
- Optimized JavaScript execution
- Reduced memory usage
- Faster app startup

### Fabric Renderer
- Improved UI responsiveness
- Better animation performance
- Modern React concurrent features

## 🔍 Usage Examples

### Bluetooth Scanning
```typescript
// Automatically handles permissions and starts scanning
// Displays found devices with connection capability
// Includes proper error handling and state management
```

### Gesture Handling
```typescript
// Left swipe gesture with visual feedback
// Customizable threshold and callbacks
// Smooth Reanimated 3+ animations
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro Bundle Error**: Clear cache with `npx react-native start --reset-cache`
2. **Android Build Error**: Clean with `cd android && ./gradlew clean && cd ..`
3. **iOS Build Error**: Clean build folder in Xcode
4. **Gesture Not Working**: Ensure `GestureHandlerRootView` wraps the app
5. **Bluetooth Not Scanning**: Check permissions in device settings

### Debug Commands

```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clean Android build
cd android && ./gradlew clean && cd ..

# Reinstall dependencies
rm -rf node_modules && npm install

# iOS clean (if CocoaPods available)
cd ios && pod deintegrate && pod install && cd ..
```

## 📝 Development Notes

- All components are Fabric-compatible
- Bluetooth operations use JSI for optimal performance
- Gesture handling leverages Reanimated 3+ worklets
- Proper cleanup and memory management implemented
- TypeScript support throughout the project

## 🎯 Next Steps

1. **Add More BLE Features**: Characteristic read/write, notifications
2. **Expand Gestures**: Add more gesture types (pinch, rotate)
3. **Error Boundaries**: Add React error boundaries for better UX
4. **Testing**: Add unit tests for Bluetooth and gesture components
5. **Performance Monitoring**: Add Flipper or similar debugging tools

## 📄 License

This project is licensed under the MIT License.
