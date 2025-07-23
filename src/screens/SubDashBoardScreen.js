import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Strings } from '../theme/Strings';
import { useSelector } from 'react-redux';
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

  const [dashboardData, setDashboardData] = useState([]);
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const dashboard = async () => {
    if (!user?.branch_id) return;

    setIsLoading(true);
    const formData = {
      branch_id: user?.branch_id,
    };

    try {
      const response = await fetch(`${Strings.APP_BASE_URL}dashboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resp = await response.json();

      if (resp?.status === 'ok') {
        console.log('Dashboard:', JSON.stringify(resp.data, null, 2));
        setDashboardData(resp.data);
      } else {
        console.warn(
          'Dashboard fetch failed:',
          resp?.message || 'Unknown error',
        );
      }
    } catch (error) {
      console.error('Dashboard Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.branch_id) {
      dashboard();
    }
  }, [user?.branch_id]);

  //Alert.alert('Dashboard Data', JSON.stringify(dashboardData, null, 2));

  return (
    <View style={styles.card}>
      <View style={styles.cardContainer}>
        {dashboardData && Object.keys(dashboardData).length > 0 ? (
          Object.values(dashboardData).map((item, index) => (
            <View key={item.id || index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statInfo}>
                  <Text style={styles.statTitle}>{String(item.name)}</Text>
                  <Text style={styles.statValue}>{String(item.no)}</Text>
                  <Text style={styles.statValue}>{String(item.amount)}</Text>
                </View>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: item.color || '#4B5563' },
                  ]}
                >
                  <Icon name="people" size={24} color="#FFFFFF" />
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', padding: 10 }}>
            No dashboard data available
          </Text>
        )}
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
