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
  TouchableWithoutFeedback,
  Button, // Still needed for filter dropdown keyboard dismissal
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler'; // Ensure this is imported
import { useDispatch, useSelector } from 'react-redux';
import { Strings } from '../../theme/Strings';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomDropdown from '../../common/CustomDropdown ';
import Loader from '../../common/Loader';
import { fetchGenders } from '../../redux/genderSlice';
import { fetchDoctors } from '../../redux/doctorSlice';

// Define the single appointment template to match OT.js's single patient display

const PAGE_SIZE = 20;

const AppointmentPage = ({ navigation }) => {
  const [filters, setFilters] = useState({
    patientName: '',
    mobile: '',
    gender: '',
    doctor: '',
    status: '',
  });

  // const genders = useSelector(state => state.gender.genders || []);
  const doctors = useSelector(state => state.doctors.doctors || []);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = Strings.APP_BASE_URL || '';
  const brach_id = user?.branch_id || '';
  // console.log('brach_id:', brach_id || 'Unknown error');
  const dispatch = useDispatch();
  useEffect(() => {
    if (API_URL) {
      // dispatch(fetchGenders({ API_URL }));
      dispatch(fetchDoctors({ API_URL, branchId: brach_id }));
    }
  }, [API_URL, dispatch]);

  const appointment = async () => {
    if (!user?.branch_id) return;

    setIsLoading(true);

    const formData = {
      branchId: user.branch_id,
      patient_name: filters.patientName,
      patient_mobile: filters.mobile,
      appointment_status: filters.status,
      specialist_id: filters.doctor,
    };

    try {
      const response = await fetch(
        `${Strings.APP_BASE_URL}getAppointmentList`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data?.status === 'ok') {
        const records = data.data?.records || data.data || [];
        setAppointmentData(records);
        setCurrentPage(1);
        setTotalPages(Math.ceil(records.length / PAGE_SIZE));
      } else {
        console.warn('Failed to fetch:', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Call appointment when filters change
  useEffect(() => {
    if (!showFilterDropdown) {
      appointment();
    }
  }, [filters]);

  // update current 10 data slice
  useEffect(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setPaginatedData(appointmentData.slice(start, end));
  }, [appointmentData, currentPage]);

  useEffect(() => {
    appointment();
  }, [user?.branch_id]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      patientName: '',
      mobile: '',
      status: '',
      doctor: '',
    });

    setShowFilterDropdown(false);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Scheduled':
        return '#6366f1'; // Blue
      case 'Completed':
        return '#10b981'; // Green
      case 'Cancelled':
        return '#ef4444'; // Red
      case 'Pending':
        return '#f59e0b'; // Amber/Orange
      default:
        return '#6b7280'; // Gray
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Handle add appointment - NOW NAVIGATES TO AddAppointmentForm.js
  const handleAddAppointment = () => {
    navigation.navigate('AddAppointmentForm');
  };

  const toggleCardExpansion = appointmentId => {
    setExpandedCards(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));
  };

  const AppointmentCard = ({ appt, index }) => {
    const { Appointment, Specialist, Refdoctor, Panel, PatientSalutation } =
      appt;
    const isExpanded = expandedCards[Appointment.id];
    return (
      <View style={styles.patientCard}>
        <View style={styles.srSection}>
          <Text style={styles.srText}>
            {(currentPage - 1) * PAGE_SIZE + index + 1}
          </Text>
        </View>
        {/* Header with Appointment Basic Info */}
        <View style={styles.patientHeader}>
          <View style={styles.patientMainInfo}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText} allowFontScaling={false}>
                {Appointment.patient_name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.patientBasicDetails}>
              <View style={[styles.patientMetaRow]}>
                <Text style={styles.patientName} allowFontScaling={false}>
                  {PatientSalutation.salutation ?? ''}{' '}
                  {Appointment.patient_name ?? '-'} {Appointment.l_name}
                </Text>
                <View style={styles.bottomActionButtons}>
                  {/* Renamed buttons to match OT.js but kept original colors */}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewButton]}
                  >
                    <Text
                      style={styles.actionButtonIcon}
                      allowFontScaling={false}
                    >
                      👁
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                  >
                    <Text
                      style={styles.actionButtonIcon}
                      allowFontScaling={false}
                    >
                      ✏️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => {
                      Alert.alert(
                        'Confirm Delete',
                        'Are you sure you want to delete this appointment?',
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Yes',
                            onPress: () =>
                              handleDeleteAppointment(Appointment.id),
                            style: 'destructive',
                          },
                        ],
                        { cancelable: true },
                      );
                    }}
                  >
                    <Text
                      style={styles.actionButtonIcon}
                      allowFontScaling={false}
                    >
                      🗑️
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.patientMetaRow}>
                <Text style={styles.uhidText} allowFontScaling={false}>
                  UHID: {appt.uhidPatientId ?? '-'}
                </Text>
                <Text style={styles.doaText} allowFontScaling={false}>
                  Apt ID: {Appointment.appoint_no ?? '-'}
                </Text>
              </View>
              <View style={styles.doctorRow}>
                <Text style={styles.doctorText} allowFontScaling={false}>
                  Doctor: {Specialist.specialist_name ?? '-'}
                </Text>
                <View style={styles.statusBadge}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(Appointment.appointment_status) },
                    ]}
                    allowFontScaling={false}
                  >
                    {Appointment.appointment_status ?? '-'}
                  </Text>
                </View>
              </View>
              {/* New row for Age and Gender */}
              <View style={styles.patientMetaRow}>
                <Text style={styles.uhidText} allowFontScaling={false}>
                  Age: {Appointment.doby ? `${Appointment.doby} yrs` : '-'}
                </Text>
                <Text style={styles.doaText} allowFontScaling={false}>
                  Gender: {Appointment.gender ?? '-'}
                </Text>
              </View>
              {/* New row for Appointment Date */}
              <View style={styles.patientMetaRow}>
                <Text style={styles.uhidText} allowFontScaling={false}>
                  Apt Date: {formatDate(Appointment.time_of_visit)}
                </Text>
                <Text style={styles.uhidText} allowFontScaling={false}>
                  Token Number: {Appointment.token ?? '-'}
                </Text>
              </View>
            </View>
          </View>

          {/* Removed: 3-dot menu button */}
        </View>

        {/* Removed: Dropdown Menu for 3-dot button */}

        {/* Expanded Details - Only show details NOT already visible in the header */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                Mobile:
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {Appointment.phone_code ?? '-'}{' '}
                {Appointment.patient_mobile ?? '-'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                DOB:
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {formatDate(Appointment.date_brith)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                Email:
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {Appointment.email ?? '-'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                Panel/Medical Aid:
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {Panel.name ?? '-'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                Token Number:
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {Appointment.token ?? '-'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel} allowFontScaling={false}>
                Address:
              </Text>
              <Text style={styles.detailValue} allowFontScaling={false}>
                {Appointment.address ?? '-'}
              </Text>
            </View>
          </View>
        )}

        {/* Footer Section */}
        <View style={styles.patientCardFooter}>
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => toggleCardExpansion(Appointment.id)}
          >
            <Text style={styles.seeMoreText} allowFontScaling={false}>
              {isExpanded ? 'See Less' : 'See More...'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(val => val !== '');
  };

  const handleDeleteAppointment = async appointmentId => {
    const formData = {
      appointmentId: appointmentId,
    };

    try {
      setIsLoading(true); // Start loader

      const response = await fetch(`${Strings.APP_BASE_URL}deleteAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data?.status === 'ok') {
        Alert.alert('Success', 'Appointment deleted successfully.');
        appointment(); // Refresh appointment list
      } else {
        Alert.alert('Failed', data?.message || 'Failed to delete appointment.');
      }
    } catch (error) {
      console.error('Delete Error:', error.message);
      Alert.alert('Error', 'An error occurred while deleting the appointment.');
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  //Alert.alert('Doctor', JSON.stringify(doctors, null, 2));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Removed: Full-screen overlay as three-dot menu is gone */}
      <View style={styles.filterContainer}>
        {/* Filter and Add Button Row */}
        <View style={styles.searchAndAddContainer}>
          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <View style={styles.filterButtonContent}>
                <Text style={styles.filterButtonText} allowFontScaling={false}>
                  Filter Appointments
                </Text>
                {hasActiveFilters() && (
                  <View style={styles.activeFilterBadge}>
                    <Text
                      style={styles.activeFilterBadgeText}
                      allowFontScaling={false}
                    >
                      Active
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.dropdownArrow} allowFontScaling={false}>
                {showFilterDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addAppointmentButton}
            onPress={handleAddAppointment} // Now navigates to AddAppointmentForm
          >
            <Text style={styles.addIcon} allowFontScaling={false}>
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
                    <Text style={styles.filterLabel} allowFontScaling={false}>
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
                      allowFontScaling={false}
                    />
                  </View>

                  {/* Mobile Filter */}
                  <View style={styles.filterSection}>
                    <Text style={styles.filterLabel} allowFontScaling={false}>
                      Mobile
                    </Text>
                    <TextInput
                      style={styles.filterInput}
                      placeholder="Enter mobile number"
                      value={filters.mobile}
                      onChangeText={text => handleFilterChange('mobile', text)}
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      allowFontScaling={false}
                    />
                  </View>

                  {/* Status Filter */}
                  <View style={styles.filterSection}>
                    <CustomDropdown
                      label="Status"
                      selectedValue={filters.status}
                      onSelect={val => handleFilterChange('status', val)}
                      options={[
                        { label: 'Pending', value: 'pending' },
                        { label: 'Confirmed', value: 'confirmed' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Cancelled', value: 'cancelled' },
                      ]}
                    />
                  </View>
                  {/* Doctor Filter */}
                  <View style={styles.filterSection}>
                    <CustomDropdown
                      label="Doctor"
                      selectedValue={filters.doctor}
                      onSelect={val => handleFilterChange('doctor', val)}
                      options={doctors.map(item => ({
                        label: item.label, // Replace with actual key from API
                        value: item.value, // Replace with actual key from API
                      }))}
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
                      allowFontScaling={false}
                    >
                      Clear All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyButtonLarge}
                    onPress={() => {
                      setShowFilterDropdown(false);
                      appointment();
                    }}
                  >
                    <Text
                      style={styles.applyButtonLargeText}
                      allowFontScaling={false}
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
        // Adjusted scrollEnabled as showMenuForAppointmentId is removed
        scrollEnabled={!showFilterDropdown}
      >
        {/* Appointment List */}
        <View style={styles.patientsList}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Loader title={'Loading Appointment List...'} />
            </View>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((appt, index) => (
              <View key={appt.Appointment.id}>
                <AppointmentCard appt={appt} index={index} />
                {index < paginatedData.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText} allowFontScaling={false}>
                No appointments found
              </Text>
              <Text style={styles.emptySubtext} allowFontScaling={false}>
                Try adjusting your filter criteria
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={styles.preButton}
        >
          <Icon
            name="arrow-left"
            size={12}
            color="#FFFFFF"
            style={{ margin: 'auto' }}
          />
        </TouchableOpacity>
        <Text style={styles.totalPages}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={styles.nexButton}
        >
          <Icon
            name="arrow-right"
            size={12}
            color="#FFFFFF"
            style={{ margin: 'auto' }}
          />
        </TouchableOpacity>
      </View>
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

  // Search and Add Button Row (now Filter and Add) - Copied from OT.js
  searchAndAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  searchContainer: {
    flex: 1, // Allow the filter button to take up remaining space
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
  addAppointmentButton: {
    width: 40, // Fixed width for the button
    height: 40, // Fixed height for the button
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
    fontSize: 28, // Increased font size for better visibility in a fixed button
    color: 'white',
    fontWeight: 'bold',
  },

  // Filter Dropdown - Copied from OT.js
  filtersContainer: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 999, // Ensure dropdown is on top
  },
  dropdownMenu: {
    position: 'absolute',
    top: 0, // Position relative to its parent (filtersContainer)
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
    paddingRight: 2, // Added for scroll indicator
  },
  filterContentContainer: {
    padding: 14,
    paddingBottom: 24,
    paddingRight: 12, // Added for scroll indicator
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
  dateFiltersRow: {
    // Added from OT.js for consistency, even if not used by Appointment filters
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateFilterSection: {
    // Added from OT.js for consistency
    flex: 1,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  clearButtonLarge: {
    flex: 1,
    paddingVertical: 10, // Adjusted from 12 for OT.js consistency
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
    paddingVertical: 10, // Adjusted from 12 for OT.js consistency
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

  // Patient card styles - Copied and adapted from OT.js
  patientsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12, // Adjusted from 8 to match OT.js
    padding: 12, // Adjusted from 10 to match OT.js
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // Adjusted for stronger shadow
    shadowOpacity: 0.1,
    shadowRadius: 6, // Adjusted for stronger shadow
    elevation: 3, // Adjusted for stronger shadow
    borderLeftWidth: 4, // Adjusted from 2
    borderLeftColor: '#4dd0e1',
    position: 'relative',
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  patientMainInfo: {
    // Renamed from patientInfo
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 38, // Adjusted from 50
    height: 38, // Adjusted from 50
    borderRadius: 5, // Adjusted from 25
    backgroundColor: '#4dd0e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // Adjusted from 15
    shadowColor: '#4dd0e1', // Added shadow from OT.js
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: 'white',
    fontSize: 22, // Adjusted from 20
    fontWeight: '800', // Adjusted from 700
  },
  patientBasicDetails: {
    // Renamed from studentDetails
    flex: 1,
  },
  patientName: {
    // Renamed from studentName
    fontSize: 18, // Adjusted from 16
    fontWeight: '700',
    color: '#1f2937', // Adjusted from #111827
    marginBottom: 6, // Adjusted from 4
  },
  patientMetaRow: {
    // New style from OT.js
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  uhidText: {
    // New style from OT.js
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  doaText: {
    // New style from OT.js (repurposed for Apt ID/Doctor)
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginHorizontal: 8,
  },
  doctorRow: {
    // New style from OT.js
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  doctorText: {
    // New style from OT.js
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
    flex: 1,
  },
  statusBadge: {
    // New style from OT.js
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Removed: Three dot menu button and its styles
  // Removed: Dropdown menu for three dots and its styles
  fullScreenOverlay: {
    // Still needed for filter dropdown keyboard dismissal
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 5,
  },

  // Expanded details - Copied from OT.js
  expandedDetails: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  detailLabel: {
    fontSize: 13, // Adjusted from 12
    color: '#6b7280',
    fontWeight: '600',
    flex: 0.4, // Adjusted from 1
  },
  detailValue: {
    fontSize: 13, // Adjusted from 12
    color: '#374151',
    fontWeight: '500',
    flex: 0.6, // Adjusted from 1
    textAlign: 'right',
  },
  // Patient card footer - Copied from OT.js
  patientCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 5,
  },
  seeMoreButton: {
    paddingHorizontal: 8,
    alignSelf: 'flex-end', // Ensure it aligns to the right if not using full row
  },
  seeMoreText: {
    fontSize: 12,
    color: '#4dd0e1',
    fontWeight: '600',
  },
  bottomActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 25,
    height: 25,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
  },
  viewButton: {
    // Reschedule in Appointment.js now maps to View in OT.js
    backgroundColor: '#4dd0e1',
  },
  editButton: {
    // Complete in Appointment.js now maps to Edit in OT.js
    backgroundColor: '#f59e0b',
  },
  deleteButton: {
    // Cancel in Appointment.js now maps to Delete in OT.js
    backgroundColor: '#ef4444',
  },
  actionButtonIcon: {
    fontSize: 14,
  },
  // Empty state - Copied from OT.js
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60, // Adjusted from 40
    paddingHorizontal: 20, // Added
  },
  emptyText: {
    fontSize: 18, // Adjusted from 16
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center', // Added
  },
  emptySubtext: {
    fontSize: 14, // Adjusted from 13
    color: '#9ca3af',
    textAlign: 'center', // Added
    lineHeight: 20, // Added
  },
  srSection: {
    position: 'absolute',
    backgroundColor: '#4dd0e1',
    width: 20,
    height: 20,
    borderRadius: 50,
    top: 5,
    left: 5,
  },
  srText: {
    fontSize: 12,
    margin: 'auto',
    color: '#ffffff',
  },
  preButton: {
    width: 10,
    backgroundColor: '#7be7e7',
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  nexButton: {
    width: 10,
    backgroundColor: '#7be7e7',
    width: 20,
    height: 20,
    borderRadius: 5,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    gap: 8,
  },
  loadingContainer: {
    marginTop: '50%',
  },
  filterContainer: {
    padding: 10,
  },
});

export default AppointmentPage;
