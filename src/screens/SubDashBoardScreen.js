import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width } = Dimensions.get('window');
const SubDashBoardScreen = () => {
  const statsData = [
    {
      title: 'OPD Fees',
      count: 'No. 20',
      amount: '₹20/-',
      icon: 'people',
      color: '#3B82F6',
    },
    {
      title: 'Lab Tests',
      count: 'No. 12',
      amount: '₹150/-',
      icon: 'people',
      color: '#10B981',
    },
    {
      title: 'X-Ray Charges',
      count: 'No. 8',
      amount: '₹300/-',
      icon: 'person',
      color: '#F59E0B',
    },
    {
      title: 'Consultation',
      count: 'No. 5',
      amount: '₹500/-',
      icon: 'person',
      color: '#EF4444',
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardContainer}>
        {statsData.map((item, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statInfo}>
                <Text style={styles.statTitle}>{item.title}</Text>
                <Text style={styles.statValue}>{item.count}</Text>
                <Text style={styles.statValue}>{item.amount}</Text>
              </View>
              <View style={[styles.statIcon, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={24} color="#FFFFFF" />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  statCard: {
    width: (width - 58) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 11,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
});

export default SubDashBoardScreen;
