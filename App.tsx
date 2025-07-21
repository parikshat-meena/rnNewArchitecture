/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Home from './src/component/Home';
import BluetoothScanner from './src/component/Bluetooth';
import LeftSwipeComponent from './src/component/LeftSwipeComp';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type TabType = 'bluetooth' | 'gestures' | 'home';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('bluetooth');

  const renderContent = () => {
    switch (activeTab) {
      case 'bluetooth':
        return <BluetoothScanner />;
      case 'gestures':
        return (
          <View style={styles.gestureContainer}>
            <Text style={styles.sectionTitle}>Gesture Demo</Text>
            <LeftSwipeComponent 
              onSwipeLeft={() => console.log('Custom swipe action triggered!')}
              swipeThreshold={120}
            />
            <Text style={styles.instructions}>
              This component demonstrates Reanimated 3+ with Fabric support.
              Swipe left on the green card to trigger the action.
            </Text>
          </View>
        );
      case 'home':
        return <Home />;
      default:
        return <BluetoothScanner />;
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'bluetooth' && styles.activeTab]}
            onPress={() => setActiveTab('bluetooth')}
          >
            <Text style={[styles.tabText, activeTab === 'bluetooth' && styles.activeTabText]}>
              Bluetooth
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'gestures' && styles.activeTab]}
            onPress={() => setActiveTab('gestures')}
          >
            <Text style={[styles.tabText, activeTab === 'gestures' && styles.activeTabText]}>
              Gestures
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'home' && styles.activeTab]}
            onPress={() => setActiveTab('home')}
          >
            <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
              Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default App;
