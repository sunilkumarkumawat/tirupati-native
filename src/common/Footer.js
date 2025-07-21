import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

const Footer = () => {
  const { themeColor } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const items = [
    { label: 'Home', icon: 'home', screen: 'Dashboard' },
    {
      label: 'Appointment',
      icon: 'appointment',
      screen: 'Attendance',
      // calendar-month
    },
    {
      label: 'History',
      icon: 'history',
      screen: 'NoticeBoard',
      // clipboard-text-outline
    },
    { label: 'Profile', icon: 'profile', screen: 'ProfileView' 
      // account
    },
  ];

  const iconMap = {
    home: require('../theme/asserts/icon/house.png'),
    appointment: require('../theme/asserts/icon/shedule.png'),
    history: require('../theme/asserts/icon/exam.png'),
    profile: require('../theme/asserts/icon/profile.png'),
    // add all icons here
  };
  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: insets.bottom },
        { backgroundColor: themeColor },
      ]}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tab}
          onPress={() => navigation.navigate(item.screen)}
        >
          {/* <Icon name={item.icon} size={24} color="#000" /> */}
          <Image
            source={
              iconMap[item.icon] || require('../theme/asserts/icon/default.png')
            } // optional fallback icon
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
    marginBottom: 8,
  },
});

export default Footer;
