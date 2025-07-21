import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const LeftSwipeActions = () => {
  return (
    <View style={styles.leftAction}>
      <Text style={styles.actionText}>Delete</Text>
    </View>
  );
};

const SwipeableRow = () => {
  return (
    <Swipeable
      renderLeftActions={LeftSwipeActions}
      onSwipeableLeftOpen={() => console.log('Swiped left!')}
    >
      <View style={styles.box}>
        <Text style={styles.text}>Swipe left to delete</Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
  },
  text: {
    fontSize: 18,
  },
  leftAction: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SwipeableRow;
