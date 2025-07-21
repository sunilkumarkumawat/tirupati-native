import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import CustomeButton from '../../common/CustomeButton';
import ActionButton from '../../common/ActionButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Homework = () => {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHomework, setEditHomework] = useState(null);

  const classOptions = ['All', '9th', '10th', '11th', '12th'];
  const sectionOptions = ['All', 'A', 'B', 'C', 'D'];
  const subjectOptions = [
    'All',
    'Accounts (Th)',
    'Mathematics',
    'English',
    'Science',
    'Hindi',
    'Social Studies',
  ];

  const [homeworkData, setHomeworkData] = useState([
    {
      id: 1,
      subject: 'Accounts (Th)',
      class: '10th',
      section: 'A',
      teacher: 'Ms. Sarah Johnson',
      homeworkDate: '01-Jul-2025',
      submissionDate: '03-Jul-2025',
      status: 'Active',
      description: 'Complete Chapter 5 exercises and prepare balance sheet',
      attachment: 'accounts_homework.pdf',
      priority: 'High',
    },
    {
      id: 2,
      subject: 'Mathematics',
      class: '10th',
      section: 'A',
      teacher: 'Mr. David Smith',
      homeworkDate: '30-Jun-2025',
      submissionDate: '02-Jul-2025',
      status: 'Pending',
      description: 'Solve algebraic equations from page 45-50',
      attachment: null,
      priority: 'Medium',
    },
    {
      id: 3,
      subject: 'English',
      class: '9th',
      section: 'B',
      teacher: 'Mrs. Emily Davis',
      homeworkDate: '29-Jun-2025',
      submissionDate: '01-Jul-2025',
      status: 'Completed',
      description: 'Write an essay on Environmental Conservation',
      attachment: 'essay_guidelines.doc',
      priority: 'Low',
    },
    {
      id: 4,
      subject: 'Science',
      class: '11th',
      section: 'A',
      teacher: 'Dr. Michael Brown',
      homeworkDate: '02-Jul-2025',
      submissionDate: '05-Jul-2025',
      status: 'Active',
      description: 'Lab report on chemical reactions and prepare for quiz',
      attachment: 'lab_instructions.pdf',
      priority: 'High',
    },
    {
      id: 5,
      subject: 'Hindi',
      class: '10th',
      section: 'B',
      teacher: 'Mrs. Priya Sharma',
      homeworkDate: '28-Jun-2025',
      submissionDate: '01-Jul-2025',
      status: 'Completed',
      description: 'Read Chapter 8 and write summary in 200 words',
      attachment: null,
      priority: 'Medium',
    },
  ]);

  // Filter homework based on selected filters and search query
  const getFilteredHomework = () => {
    // If all filters are "All", show empty list to encourage filtering
    if (
      selectedClass === 'All' &&
      selectedSection === 'All' &&
      selectedSubject === 'All' &&
      searchQuery === ''
    ) {
      return [];
    }

    return homeworkData.filter(homework => {
      const matchesClass =
        selectedClass === 'All' || homework.class === selectedClass;
      const matchesSection =
        selectedSection === 'All' || homework.section === selectedSection;
      const matchesSubject =
        selectedSubject === 'All' || homework.subject === selectedSubject;
      const matchesSearch =
        searchQuery === '' ||
        homework.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homework.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        homework.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        homework.class.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesClass && matchesSection && matchesSubject && matchesSearch;
    });
  };

  const handleEdit = homework => {
    setEditHomework({ ...homework });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editHomework) return;

    setHomeworkData(prev =>
      prev.map(item => (item.id === editHomework.id ? editHomework : item)),
    );

    setShowEditModal(false);
    setEditHomework(null);
    Alert.alert('Success', 'Homework updated successfully!');
  };

  const handleDelete = homework => {
    Alert.alert(
      'Delete Homework',
      `Are you sure you want to delete homework for ${homework.subject}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHomeworkData(prev =>
              prev.filter(item => item.id !== homework.id),
            );
            Alert.alert('Success', 'Homework deleted successfully!');
          },
        },
      ],
    );
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = homework => {
    setSelectedHomework(homework);
    setShowDetailsModal(true);
  };

  const handleSendReminder = homework => {
    Alert.alert(
      'Send Reminder',
      `Send reminder for ${homework.subject} homework to students?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Alert.alert(
              'Success',
              'Reminder sent to all students successfully!',
            );
          },
        },
      ],
    );
  };

  const renderDropdown = (
    label,
    value,
    options,
    onSelect,
    showModal,
    setShowModal,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}:</Text>
      <TouchableOpacity
        style={styles.dropdownContainer}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.dropdownText}>{value}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setShowModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      item === value && styles.selectedItem,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const getPriorityColor = priority => {
    switch (priority) {
      case 'High':
        return '#FF6B6B';
      case 'Medium':
        return '#FFD93D';
      case 'Low':
        return '#6BCF7F';
      default:
        return '#6C7CE7';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return '#6BCF7F';
      case 'Pending':
        return '#FFD93D';
      case 'Completed':
        return '#6C7CE7';
      default:
        return '#95A5A6';
    }
  };

  const filteredHomework = getFilteredHomework();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6C7CE7" barStyle="light-content" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by subject, class, teacher, description..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#95A5A6"
          />
        </View>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            {renderDropdown(
              'Class',
              selectedClass,
              classOptions,
              setSelectedClass,
              showClassModal,
              setShowClassModal,
            )}
            {renderDropdown(
              'Section',
              selectedSection,
              sectionOptions,
              setSelectedSection,
              showSectionModal,
              setShowSectionModal,
            )}
          </View>
          {renderDropdown(
            'Subject',
            selectedSubject,
            subjectOptions,
            setSelectedSubject,
            showSubjectModal,
            setShowSubjectModal,
          )}
        </View>

        {/* Homework Cards */}
        {filteredHomework.map(homework => (
          <View key={homework.id} style={styles.homeworkCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {homework.subject.charAt(0)}
                  </Text>
                </View>
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.cardTitle}>{homework.subject}</Text>
                  <Text style={styles.cardSubtitle}>
                    {homework.class} - Section {homework.section}
                  </Text>
                  <Text style={styles.teacherName}>{homework.teacher}</Text>
                </View>
              </View>
              <View style={styles.cardHeaderRight}>
                <ActionButton
                onPress={() => handleViewDetails(homework)}
                iconSource={require('../../theme/asserts/icon/view.png')} // your local image
                iconSize={16}
              />
              <ActionButton
                onPress={() => handleSendReminder(homework)}
                iconSource={require('../../theme/asserts/icon/shedule.png')} // your local image
                iconSize={16}
              />
              <ActionButton
                onPress={() => handleEdit(homework)}
                iconSource={require('../../theme/asserts/icon/edit.png')} // your local image
                iconSize={16}
              />
              <ActionButton
                onPress={() => handleDelete(homework)}
                iconSource={require('../../theme/asserts/icon/delete.png')} // your local image
                iconSize={16}
              />
              </View>
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <Text style={styles.descriptionText}>{homework.description}</Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Assigned Date</Text>
                  <Text style={styles.infoValue}>{homework.homeworkDate}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Due Date</Text>
                  <Text style={styles.infoValue}>
                    {homework.submissionDate}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(homework.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{homework.status}</Text>
                  </View>
                </View>
                {homework.attachment && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Attachment</Text>
                    <TouchableOpacity style={styles.attachmentButton}>
                      <Text style={styles.attachmentText}>
                        📎 {homework.attachment}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

  
            {/* <View>
              <CustomeButton
                iconName="trash" // use any Ionicons name
                iconSize={20}
                iconColor="red"
                onPress={() => console.log('Icon pressed')}
                buttonStyle={{}}
              />
            </View> */}
          </View>
        ))}

        {/* Empty state */}
        {filteredHomework.length === 0 && (
          <View style={styles.emptyState}>
            {selectedClass === 'All' &&
            selectedSection === 'All' &&
            selectedSubject === 'All' &&
            searchQuery === '' ? (
              <>
                <Text style={styles.emptyStateText}>
                  Please select filters to view homework
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Choose class, section, or subject to see assignments
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyStateText}>
                  No homework assignments found
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your filters or add a new assignment
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddNew}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Homework Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          {selectedHomework && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Subject:</Text>
                <Text style={styles.detailValue}>
                  {selectedHomework.subject}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Class & Section:</Text>
                <Text style={styles.detailValue}>
                  {selectedHomework.class} - Section {selectedHomework.section}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Teacher:</Text>
                <Text style={styles.detailValue}>
                  {selectedHomework.teacher}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Assigned Date:</Text>
                <Text style={styles.detailValue}>
                  {selectedHomework.homeworkDate}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Submission Date:</Text>
                <Text style={styles.detailValue}>
                  {selectedHomework.submissionDate}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Priority:</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor: getPriorityColor(
                        selectedHomework.priority,
                      ),
                    },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {selectedHomework.priority}
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(selectedHomework.status),
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {selectedHomework.status}
                  </Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailDescription}>
                  {selectedHomework.description}
                </Text>
              </View>
              {selectedHomework.attachment && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Attachment:</Text>
                  <TouchableOpacity style={styles.attachmentButton}>
                    <Text style={styles.attachmentText}>
                      📎 {selectedHomework.attachment}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Homework</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          {editHomework && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Subject:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editHomework.subject}
                  onChangeText={text =>
                    setEditHomework({ ...editHomework, subject: text })
                  }
                />
              </View>

              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Teacher:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editHomework.teacher}
                  onChangeText={text =>
                    setEditHomework({ ...editHomework, teacher: text })
                  }
                />
              </View>

              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Description:</Text>
                <TextInput
                  style={[styles.editInput, styles.editTextArea]}
                  value={editHomework.description}
                  onChangeText={text =>
                    setEditHomework({ ...editHomework, description: text })
                  }
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Due Date:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editHomework.submissionDate}
                  onChangeText={text =>
                    setEditHomework({ ...editHomework, submissionDate: text })
                  }
                  placeholder="DD-MMM-YYYY"
                />
              </View>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Add Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Homework</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.addModalText}>
              Add homework form would be implemented here
            </Text>
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => {
                setShowAddModal(false);
                Alert.alert(
                  'Success',
                  'Add homework functionality would be implemented here',
                );
              }}
            >
              <Text style={styles.primaryActionButtonText}>Save Homework</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#6C7CE7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#E8EAFF',
    fontSize: 12,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginBottom: 12,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 8,
    fontWeight: '500',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#95A5A6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    maxHeight: 300,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalItemText: {
    fontSize: 14,
    color: '#2C3E50',
  },
  selectedItem: {
    color: '#6C7CE7',
    fontWeight: '600',
  },
  homeworkCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6C7CE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6C7CE7',
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 12,
    color: '#95A5A6',
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
    flexDirection:'row'
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  attachmentButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  attachmentText: {
    fontSize: 12,
    color: '#6C7CE7',
  },
  cardActions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#6C7CE7',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: '#6C7CE7',
    paddingVertical: 10,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  adminActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F2F6',
    paddingTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#3498DB',
    paddingVertical: 8,
    marginRight: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
    marginLeft: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95A5A6',
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C7CE7',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomHint: {
    backgroundColor: '#2C3E50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bottomHintText: {
    color: '#95A5A6',
    fontSize: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    backgroundColor: '#6C7CE7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  detailItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#95A5A6',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  detailDescription: {
    fontSize: 14,
    color: '#5D6D7E',
    lineHeight: 20,
  },
  addModalText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 40,
  },
});

export default Homework;
