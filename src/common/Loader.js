// components/Loader.js
import React from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Loader = ({title}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.centeredWrapper}>
      <View style={styles.loaderBox}>
        <View style={styles.iconContainer}>
          <Icon name="stethoscope" style={styles.icon} />
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Icon name="heart" style={[styles.icon, { color: 'red' }]} solid />
          </Animated.View>
          <Icon name="hospital" style={styles.icon} />
        </View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    margin:'auto'
  },
  loaderBox: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  icon: {
    fontSize: 40,
    color: '#1976d2',
    marginHorizontal: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d47a1',
  },
});

export default Loader;
