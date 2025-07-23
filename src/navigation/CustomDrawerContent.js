// CustomDrawerContent.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { removeUser } from '../utils/storage';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const menuItems = [
  {
    id: 1,
    title: 'Dashboard',
    icon: 'house',
    screen: 'Dashboard',
    color: '#667eea',
    submenus: [],
  },
  {
    id: 2,
    title: 'Fees Report',
    icon: 'money',
    screen: 'MarkStudentAttendence',
    color: '#f093fb',
  },
  {
    id: 3,
    title: 'Students',
    icon: 'students',
    color: '#4facfe',
    screen: 'OTPage',
  },
  {
    id: 4,
    title: 'Examination',
    icon: 'exam',
    color: '#43e97b',
  },
  {
    id: 5,
    title: 'Disciplinary',
    icon: 'disciplinary',
    color: '#fa709a',
  },
  {
    id: 6,
    title: 'Human Resource',
    icon: 'desk',
    color: '#fa709a',
  },
  {
    id: 7,
    title: 'Academics',
    icon: 'graduate',
    color: '#fa709a',
  },
  {
    id: 8,
    title: 'Income / Expense',
    icon: 'salary',
    color: '#fa709a',
  },
  {
    id: 9,
    title: 'Front Office',
    icon: 'receptionist',
    color: '#fa709a',
  },
  {
    id: 10,
    title: 'Homework / Classwork',
    icon: 'write',
    color: '#fa709a',
  },
  {
    id: 11,
    title: 'User',
    icon: 'write',
    color: '#fa709a',
  },

  {
    id: 12,
    title: 'Settings',
    icon: 'settings',
    color: '#a8edea',
    screen: 'Setting',
  },
];

const CustomDrawerContent = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [activeItemId, setActiveItemId] = useState();
  const { themeColor } = useTheme();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await removeUser();
          dispatch(logout());
        },
      },
    ]);
  };

  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredModules = Object.values(user.module).filter(item =>
    item.modulename.toLowerCase().includes(searchText.toLowerCase()),
  );

  const navigateToScreen = screenName => {
    navigation.navigate(screenName);
    navigation.closeDrawer();
  };

  const hiddenModuleIds = ['50', '101', '111', '129', '135'];

  return (
    <View style={styles.drawerContainer}>
      {/* Elegant Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: themeColor }]}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  user?.profileImage ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              }}
              style={styles.profileImage}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.user_name || 'John Doe'}
            </Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileRole}>
                {user?.role_name || 'Administrator'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{ borderBottomWidth: 1, height: 45, borderColor: '#f3f4f6' }}
      >
        <View style={[styles.searchContainer, { width: 280 }]}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
            <Icon
              name="search"
              size={18}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
            onChangeText={setSearchText}
            value={searchText}
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingTop: 6 }}>
        {filteredModules.filter(
          item => !hiddenModuleIds.includes(item.id?.toString()),
        ).length > 0 ? (
          filteredModules
            .filter(item => !hiddenModuleIds.includes(item.id?.toString()))
            .map(item => (
              <View key={item.id}>
                <TouchableOpacity
                  style={[
                    styles.moduleButton,
                    activeItemId === item.id && styles.moduleButtonActive,
                  ]}
                  onPress={() => {
                    setActiveItemId(item.id); // <-- Mark active
                    navigateToScreen(item.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={
                      item.image_url
                        ? { uri: item.image_url }
                        : require('../theme/asserts/icon/default.png')
                    }
                    style={{ width: 18, height: 18 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.moduleButtonText,
                      activeItemId === item.id && { color: '#667eea' },
                    ]}
                  >
                    {(item.modulename || '').replace(/\s*\(.*?\)/g, '').trim()}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 10 }}>
            This Module Not Found
          </Text>
        )}
      </ScrollView>

      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutGradient}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    position: 'relative',
    // Create gradient effect with overlay
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  profileHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4ade80',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  profileBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileRole: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuContainer: {
    paddingHorizontal: 12,
  },
  menuItemContainer: {
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    flex: 1,
  },
  submenuContainer: {
    overflow: 'hidden',
    marginLeft: 20,
    marginRight: 8,
  },
  submenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 1,
  },
  submenuConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 14,
    borderRadius: 1,
  },
  emojiIcon: {
    textAlign: 'center',
  },
  submenuEmojiIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  expandIcon: {
    fontSize: 16,
    color: '#8e8e93',
    fontWeight: 'bold',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  hamburgerIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  submenuText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
  },
  logoutSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#EF4444',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#EF4444',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  appVersion: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  hamburgerButton: {
    marginLeft: 16,
    padding: 4,
  },
  hamburgerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  moduleButtonActive: {
    backgroundColor: '#F3F4F6',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  moduleButtonText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(221, 226, 235, 1)',
    borderRadius: 20,
    padding: 3,
    margin: 'auto',
    height: 35,
    paddingLeft: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    padding: 0,
  },
});

export default CustomDrawerContent;
