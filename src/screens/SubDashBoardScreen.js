import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Strings } from '../theme/Strings';
import { useSelector } from 'react-redux';
import Loader from '../common/Loader';
const { width } = Dimensions.get('window');
const SubDashBoardScreen = () => {
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
      {isLoading ? (
        <Loader title={'Loading Dashboard...'} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.cardContainer}
          showsVerticalScrollIndicator={false}
        >
          {dashboardData && Object.keys(dashboardData).length > 0 ? (
            Object.values(dashboardData).map((item, index) => (
              <View
                key={`${item.id ?? 'no-id'}-${index}`}
                style={styles.statCard}
              >
                <View style={styles.statHeader}>
                  <View style={styles.statInfo}>
                    {item.name != null && (
                      <Text style={styles.statTitle}>{String(item.name)}</Text>
                    )}
                    {item.no != null && (
                      <Text style={styles.statValue}>
                        No. {String(item.no)}
                      </Text>
                    )}
                    {item.amount != null && (
                      <Text style={styles.statValue}>
                        {Array.isArray(item.amount)
                          ? ` ${item.amount?.[0]?.[0]?.totappoin ?? '0'}`
                          : `₹ ${String(item.amount)} /-`}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: item.color || '#4B5563' },
                    ]}
                  >
                    <Icon name="stethoscope" size={24} color="#FFFFFF" />
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', padding: 10 }}>
              No dashboard data available
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    height: 800,
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
    paddingBottom: 100,
  },
});

export default SubDashBoardScreen;
