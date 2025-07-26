import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Strings } from '../../theme/Strings';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomDropdown from '../../common/CustomDropdown ';
import Loader from '../../common/Loader';

// !!! IMPORTANT: Disable font scaling globally for consistent text sizes within this component
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// Dummy data for lab tests
const LAB_TESTS = [
  { id: 'cbp', name: 'CBP - Complete Blood Picture' },
  { id: 'lp', name: 'LP - Lipid Profile' },
  { id: 'lft', name: 'LFT - Liver Function Test' },
  { id: 'serum_electrolyte', name: 'Serum Electrolyte (Na/K/Cl)' },
  { id: 'blood_sugar', name: 'Blood Sugar (F/PP/R)' },
  { id: 'bt_ct', name: 'BT/CT - Bleeding Time & Clotting Time' },
  { id: 'blood_grouping', name: 'Blood Grouping (ABO & Rh)' },
];

const LabotaryPage = ({ navigation }) => {
  const [filters, setFilters] = useState({
    patientName: '',
    mobile: '',
    status: '',
  });

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [labotaryData, setLabotaryData] = useState([]); // This would be for overall lab data, not individual tests

  // State for the new test selection table
  const [selectedTests, setSelectedTests] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [testDates, setTestDates] = useState({}); // To store dates for each test

  const API_URL = Strings.APP_BASE_URL || '';
  const branch_id = user?.branch_id || '';

  // Placeholder for fetching overall labotary data (if needed)
  const fetchLabotaryData = async () => {
    if (!user?.branch_id) {
        console.warn('Branch ID is missing. Cannot fetch labotary data.');
        return;
    }

    setIsLoading(true);

    const formData = {
      branchId: user.branch_id,
      patient_name: filters.patientName,
      patient_mobile: filters.mobile,
      lab_status: filters.status,
    };

    console.log('Fetching labotary data with formData:', formData); // Log payload

    try {
      const response = await fetch(
        `${Strings.APP_BASE_URL}getLabotaryList`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      console.log('API Response Status:', response.status); // Log status
      console.log('API Response Headers:', response.headers); // Log headers

      // Attempt to read response text first, then try to parse as JSON
      const responseText = await response.text();
      console.log('API Response Text:', responseText); // Log raw response text

      let data;
      try {
        data = JSON.parse(responseText); // Try parsing the text as JSON
        console.log('Parsed JSON data:', data); // Log parsed JSON
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError.message);
        Alert.alert('Data Error', 'Received invalid data from server.');
        setLabotaryData([]);
        return; // Exit if JSON parsing fails
      }

      if (data?.status === 'ok') {
        const records = data.data?.records || data.data || [];
        setLabotaryData(records);
        console.log('Labotary data fetched successfully:', records.length, 'records.');
      } else {
        console.warn('Failed to fetch labotary data:', data?.message || 'Unknown error. Data status not "ok".');
        Alert.alert('API Error', data?.message || 'Failed to fetch labotary data. Please try again.');
        setLabotaryData([]);
      }
    } catch (error) {
      console.error('Network or Fetch Error:', error.message);
      Alert.alert('Network Error', 'Could not connect to the server. Please check your internet connection.');
      setLabotaryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showFilterDropdown) {
      fetchLabotaryData();
    }
  }, [filters, showFilterDropdown]);

  useEffect(() => {
    fetchLabotaryData();
  }, [user?.branch_id]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      patientName: '',
      mobile: '',
      status: '',
    });
    setShowFilterDropdown(false);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(val => val !== '');
  };

  const handleAddLabotaryEntry = () => {
    Alert.alert('Add Labotary', 'Navigate to Add Labotary Form');
    // navigation.navigate('AddLabotaryForm');
  };

  // --- Test Selection Table Logic ---
  const handleCheckAll = () => {
    if (checkAll) {
      setSelectedTests([]);
    } else {
      setSelectedTests(LAB_TESTS.map(test => test.id));
    }
    setCheckAll(!checkAll);
  };

  const handleTestCheckboxChange = (testId) => {
    setSelectedTests(prevSelected => {
      if (prevSelected.includes(testId)) {
        return prevSelected.filter(id => id !== testId);
      } else {
        return [...prevSelected, testId];
      }
    });
  };

  useEffect(() => {
    // Update checkAll state based on individual test selections
    if (selectedTests.length === LAB_TESTS.length && LAB_TESTS.length > 0) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  }, [selectedTests]);

  const handleDateChange = (testId, date) => {
    // Only allow date changes for the first test (CBP)
    if (testId === 'cbp') {
      setTestDates(prevDates => ({
        ...prevDates,
        [testId]: date,
      }));
    }
  };

  const handleLabResults = () => {
    if (selectedTests.length === 0) {
      Alert.alert('No Tests Selected', 'Please select at least one test to view results.');
      return;
    }
    const selectedTestNames = selectedTests.map(id => LAB_TESTS.find(t => t.id === id)?.name || id);
    Alert.alert('Lab Results', `Viewing results for: ${selectedTestNames.join(', ')}`);
    // Implement actual navigation or data display for lab results
  };

  const handleWhatsAppReport = () => {
    if (selectedTests.length === 0) {
      Alert.alert('No Tests Selected', 'Please select at least one test to send report via WhatsApp.');
      return;
    }
    const selectedTestNames = selectedTests.map(id => LAB_TESTS.find(t => t.id === id)?.name || id);
    Alert.alert('WhatsApp Report', `Sending report via WhatsApp for: ${selectedTestNames.join(', ')}`);
    // Implement actual WhatsApp sharing functionality
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.filterContainer}>
        {/* Filter and Add Button Row */}
        <View style={styles.searchAndAddContainer}>
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <View style={styles.filterButtonContent}>
                <Text style={styles.filterButtonText}>
                  Filter Labotary Entries
                </Text>
                {hasActiveFilters() && (
                  <View style={styles.activeFilterBadge}>
                    <Text style={styles.activeFilterBadgeText}>
                      Active
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.dropdownArrow}>
                {showFilterDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addEntryButton}
            onPress={handleAddLabotaryEntry}
          >
            <Text style={styles.addIcon}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Dropdown */}
        {showFilterDropdown && (
          <View style={styles.filtersContainer}>
            <View style={styles.dropdownMenu}>
              <ScrollView
                style={styles.filterScrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={styles.filterContentContainer}
              >
                <View
                  style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 13 }}
                >
                  {/* Patient Name Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>
                      Patient Name
                    </Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="Enter patient name"
                      value={filters.patientName}
                      onChangeText={text =>
                        handleFilterChange('patientName', text)
                      }
                      placeholderTextColor="#9ca3af"
                    />
                  </View>

                  {/* Mobile Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>
                      Mobile
                    </Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="Enter mobile number"
                      value={filters.mobile}
                      onChangeText={text => handleFilterChange('mobile', text)}
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                    />
                  </View>

                  {/* Status Filter for Labotary */}
                  <View style={styles.filterSection}>
                    <CustomDropdown
                      label="Status"
                      selectedValue={filters.status}
                      onSelect={val => handleFilterChange('status', val)}
                      options={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Reviewed', value: 'reviewed' },
                        { label: 'Cancelled', value: 'cancelled' },
                      ]}
                    />
                  </View>
                </View>

                {/* Filter Action Buttons */}
                <View style={styles.filterActions}>
                  <TouchableOpacity
                    style={styles.clearButtonLarge}
                    onPress={clearFilters}
                  >
                    <Text
                      style={styles.clearButtonLargeText}
                    >
                      Clear All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyButtonLarge}
                    onPress={() => {
                      setShowFilterDropdown(false);
                      fetchLabotaryData();
                    }}
                  >
                    <Text
                      style={styles.applyButtonLargeText}
                    >
                      Apply Filters
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
        scrollEnabled={!showFilterDropdown}
      >
        {/* New Box for Test Selection Table */}
        <View style={styles.testSelectionBox}>
          <Text style={styles.testSelectionTitle}>Select Lab Tests</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderDate}>Date</Text>
            {/* Divider for header */}
            <View style={styles.verticalDivider} />
            <View style={styles.tableHeaderTestNameContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={handleCheckAll}
              >
                <View style={[styles.checkbox, checkAll && styles.checkboxChecked]}>
                  {checkAll && <Icon name="check" size={10} color="#fff" />}
                </View>
                <Text style={styles.checkboxLabel}>Check All</Text>
              </TouchableOpacity>
              <Text style={styles.tableHeaderText}>Test Name</Text>
            </View>
          </View>

          <ScrollView style={styles.tableBody}>
            {LAB_TESTS.map((test, index) => (
              <View key={test.id} style={styles.tableRow}>
                {/* Conditionally render date input only for the first row */}
                {index === 0 ? (
                  <>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="DD/MM/YYYY"
                      value={testDates[test.id] || ''}
                      onChangeText={(text) => handleDateChange(test.id, text)}
                      keyboardType="numeric"
                      maxLength={10} // For DD/MM/YYYY
                      placeholderTextColor="#9ca3af"
                      editable={true} // Always editable for the first row
                    />
                    <View style={styles.verticalDivider} />
                  </>
                ) : (
                  <>
                    {/* Render an empty View for other rows to maintain layout spacing */}
                    <View style={styles.emptyDateCell} />
                    <View style={styles.verticalDivider} />
                  </>
                )}
                <View style={styles.testNameCell}>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => handleTestCheckboxChange(test.id)}
                  >
                    <View style={[
                      styles.checkbox,
                      selectedTests.includes(test.id) && styles.checkboxChecked
                    ]}>
                      {selectedTests.includes(test.id) && <Icon name="check" size={10} color="#fff" />}
                    </View>
                    <Text style={styles.checkboxLabel}>{test.name}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Conditional Buttons */}
          {selectedTests.length > 0 && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.labResultsButton}
                onPress={handleLabResults}
              >
                <Text style={styles.labResultsButtonText}>Lab Results</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.whatsAppReportButton}
                onPress={handleWhatsAppReport}
              >
                <Text style={styles.whatsAppReportButtonText}>WhatsApp Report</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Original content placeholder (can be removed if the table is the primary content) */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Loader title={'Loading Labotary Data...'} />
          </View>
        ) : labotaryData.length > 0 ? (
          <Text style={styles.dataFoundText}>
            Overall Labotary data loaded successfully.
          </Text>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No overall labotary entries found
            </Text>
            <Text style={styles.emptySubtext}>
              Adjust filter criteria or add new entries
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 16,
  },

  // --- Existing Styles (Copied from Appointment.js) ---
  searchAndAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  activeFilterBadge: {
    marginLeft: 8,
    backgroundColor: '#4dd0e1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeFilterBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  addEntryButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4dd0e1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },

  filtersContainer: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 999,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 400,
    height: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    minWidth: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterScrollView: {
    flex: 1,
    paddingRight: 2,
  },
  filterContentContainer: {
    padding: 14,
    paddingBottom: 24,
    paddingRight: 12,
  },
  filterSection: {
    marginBottom: 12,
    width: '48%',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  filterInput: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
    color: '#374151',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  clearButtonLarge: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  clearButtonLargeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4dd0e1',
  },
  applyButtonLarge: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4dd0e1',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#4dd0e1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  applyButtonLargeText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },

  // --- New Styles for Test Selection Box and Table ---
  testSelectionBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20, // Space below the box
  },
  testSelectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f3f4f6', // Light background for header
    borderRadius: 8,
    marginBottom: 5,
    height: 40, // Fixed height for header for consistent row height
  },
  tableHeaderDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 0.3, // Adjusted flex
    textAlign: 'center',
    paddingHorizontal: 10,
    marginRight: 5, // Gap before the divider
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#d1d5db', // Color of the line
    height: '80%', // Make it take most of the height
    alignSelf: 'center', // Center it vertically
  },
  tableHeaderTestNameContainer: {
    flex: 0.7, // Adjusted flex
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Push "Check All" left and "Test Name" right
    paddingLeft: 5, // Padding after the divider
    paddingRight: 10, // Padding at the end of the header column
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tableBody: {
    maxHeight: 300, // Limit height for scrollability
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb', // Lighter separator
  },
  dateInput: {
    flex: 0.3, // Adjusted flex
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 13,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d1d5db',
    textAlign: 'center',
    color: '#374151',
    backgroundColor: '#fff',
    marginRight: 5, // Gap before the divider
  },
  emptyDateCell: {
    flex: 0.3, // Match flex
    paddingVertical: 6, // Match padding of dateInput
    height: 30, // Give it a fixed height if date input has one, to maintain alignment
    marginRight: 5, // Gap before the divider
  },
  testNameCell: {
    flex: 0.7, // Adjusted flex
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align content to the left
    paddingLeft: 5, // Padding after the divider
    paddingRight: 10, // Padding at the end of the row
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically center checkbox and text
    justifyContent: 'flex-start', // Align to start of its space
    marginRight: 10, // Space between checkbox and text
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#4dd0e1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4dd0e1',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#374151',
    flex: 1, // Allow text to take remaining space
    flexWrap: 'wrap', // Allow text to wrap
    lineHeight: 18, // Ensure consistent line height for wrapped text
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    gap: 10,
  },
  labResultsButton: {
    flex: 1,
    backgroundColor: '#4dd0e1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4dd0e1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  labResultsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
  whatsAppReportButton: {
    flex: 1,
    backgroundColor: '#25D366', // WhatsApp green
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsAppReportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },

  // --- Original Content Placeholder Styles ---
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  dataFoundText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  filterContainer: {
    padding: 10,
  },
  loadingContainer: {
    marginTop: '50%',
  },
});

export default LabotaryPage;