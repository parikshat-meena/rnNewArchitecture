import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

const LeftSwipeComponent = () => {
  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.translationX < -100) {
      console.log('Left swipe detected!');
      // You can trigger delete or navigation here
    }

    // Reset the position
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onEnded={onHandlerStateChange}
    >
      <Animated.View style={[styles.box, { transform: [{ translateX }] }]}>
        <Text style={styles.text}>Swipe me left!</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#4CAF50',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LeftSwipeComponent;
