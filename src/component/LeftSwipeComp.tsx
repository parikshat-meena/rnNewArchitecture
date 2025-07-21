import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import {
  PanGestureHandler,
  GestureHandlerGestureEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';

interface LeftSwipeComponentProps {
  onSwipeLeft?: () => void;
  swipeThreshold?: number;
}

const LeftSwipeComponent: React.FC<LeftSwipeComponentProps> = ({
  onSwipeLeft,
  swipeThreshold = 100,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const triggerSwipeAction = () => {
    if (onSwipeLeft) {
      onSwipeLeft();
    } else {
      Alert.alert('Swipe Action', 'Left swipe detected!');
    }
  };

  const gestureHandler = useAnimatedGestureHandler<
    GestureHandlerGestureEvent<PanGestureHandlerEventPayload>
  >({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      // Only allow left swipes (negative translation)
      if (event.translationX < 0) {
        translateX.value = context.startX + event.translationX;
        // Create opacity effect based on swipe progress
        const progress = Math.abs(event.translationX) / swipeThreshold;
        opacity.value = Math.max(0.3, 1 - progress * 0.7);
      }
    },
    onEnd: (event) => {
      const isSwipeValid = event.translationX < -swipeThreshold;
      
      if (isSwipeValid) {
        // Complete the swipe animation
        translateX.value = withSpring(-300, {
          damping: 15,
          stiffness: 150,
        });
        opacity.value = withSpring(0);
        
        // Trigger the swipe action
        runOnJS(triggerSwipeAction)();
        
        // Reset after animation completes
        setTimeout(() => {
          'worklet';
          translateX.value = withSpring(0);
          opacity.value = withSpring(1);
        }, 500);
      } else {
        // Reset to original position
        translateX.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
        opacity.value = withSpring(1);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, -swipeThreshold],
      ['#4CAF50', '#FF5722']
    );

    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      backgroundColor,
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const scale = interpolateColor(
      Math.abs(translateX.value),
      [0, swipeThreshold],
      [1, 1.05] as any
    );

    return {
      opacity: Math.abs(translateX.value) / swipeThreshold,
    };
  });

  return (
    <View style={styles.container}>
      {/* Background indicator */}
      <Animated.View style={[styles.background, backgroundStyle]}>
        <Text style={styles.backgroundText}>Swipe Left to Delete</Text>
      </Animated.View>

      {/* Main swipeable content */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <View style={styles.content}>
            <Text style={styles.text}>Swipe me left!</Text>
            <Text style={styles.subtext}>
              Drag left to trigger the swipe action
            </Text>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  backgroundText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  box: {
    backgroundColor: '#4CAF50',
    minHeight: 80,
  },
  content: {
    padding: 20,
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtext: {
    color: '#E8F5E8',
    fontSize: 14,
    opacity: 0.9,
  },
});

export default LeftSwipeComponent;
