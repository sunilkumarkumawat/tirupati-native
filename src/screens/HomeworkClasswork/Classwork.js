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

const ClassWork = () => {
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClassWork, setSelectedClassWork] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClassWork, setEditClassWork] = useState(null);

  const classOptions = ['All', '9th', '10th', '11th', '12th'];
  const sectionOptions = ['All', 'A', 'B', 'C', 'D'];
  const subjectOptions = ['All', 'Accounts (Th)', 'Mathematics', 'English', 'Science', 'Hindi', 'Social Studies'];

  const [classWorkData, setClassWorkData] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      class: '10th',
      section: 'A',
      teacher: 'Mr. David Smith',
      classDate: '02-Jul-2025',
    //   duration: '45 mins',
      status: 'Running',
      description: 'Introduction to Quadratic Equations - Theory and practical examples',
      topic: 'Quadratic Equations',
      priority: 'High',
      classType: 'Theory',
      materials: 'Textbook Ch.4, Calculator',
    },
    {
      id: 2,
      subject: 'Science',
      class: '11th',
      section: 'A',
      teacher: 'Dr. Michael Brown',
      classDate: '02-Jul-2025',
    //   duration: '60 mins',
      status: 'Running',
      description: 'Laboratory session on Chemical Reactions - Hands-on experiments',
      topic: 'Chemical Reactions',
      priority: 'High',
      classType: 'Practical',
      materials: 'Lab equipment, Safety goggles, Lab manual',
    },
    {
      id: 3,
      subject: 'English',
      class: '9th',
      section: 'B',
      teacher: 'Mrs. Emily Davis',
      classDate: '02-Jul-2025',
    //   duration: '40 mins',
      status: 'Completed',
      description: 'Grammar session focusing on tenses and sentence structure',
      topic: 'Grammar - Tenses',
      priority: 'Medium',
      classType: 'Theory',
      materials: 'Grammar book, Worksheets',
    },
    {
      id: 4,
      subject: 'Accounts (Th)',
      class: '10th',
      section: 'A',
      teacher: 'Ms. Sarah Johnson',
      classDate: '01-Jul-2025',
    //   duration: '50 mins',
      status: 'Completed',
      description: 'Balance Sheet preparation and financial statement analysis',
      topic: 'Balance Sheet',
      priority: 'High',
      classType: 'Theory',
      materials: 'Accounting software, Sample data',
    },
    {
      id: 5,
      subject: 'Hindi',
      class: '10th',
      section: 'B',
      teacher: 'Mrs. Priya Sharma',
      classDate: '01-Jul-2025',
    //   duration: '35 mins',
      status: 'Scheduled',
      description: 'Poetry analysis and literary devices discussion',
      topic: 'Poetry Analysis',
      priority: 'Medium',
      classType: 'Discussion',
      materials: 'Hindi textbook, Reference notes',
    },
    {
      id: 6,
      subject: 'Social Studies',
      class: '9th',
      section: 'C',
      teacher: 'Mr. Raj Kumar',
      classDate: '02-Jul-2025',
    //   duration: '45 mins',
      status: 'Running',
      description: 'Indian Independence Movement - Key events and personalities',
      topic: 'Independence Movement',
      priority: 'Medium',
      classType: 'Interactive',
      materials: 'History textbook, Video clips, Maps',
    },
  ]);

  // Filter classwork based on selected filters and search query
  const getFilteredClassWork = () => {
    // If all filters are "All", show empty list to encourage filtering
    if (selectedClass === 'All' && selectedSection === 'All' && selectedSubject === 'All' && searchQuery === '') {
      return [];
    }

    return classWorkData.filter(classwork => {
      const matchesClass = selectedClass === 'All' || classwork.class === selectedClass;
      const matchesSection = selectedSection === 'All' || classwork.section === selectedSection;
      const matchesSubject = selectedSubject === 'All' || classwork.subject === selectedSubject;
      const matchesSearch = searchQuery === '' || 
        classwork.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classwork.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classwork.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classwork.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classwork.class.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesClass && matchesSection && matchesSubject && matchesSearch;
    });
  };

  const handleEdit = (classwork) => {
    setEditClassWork({...classwork});
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editClassWork) return;
    
    setClassWorkData(prev => prev.map(item => 
      item.id === editClassWork.id ? editClassWork : item
    ));
    
    setShowEditModal(false);
    setEditClassWork(null);
    Alert.alert('Success', 'Class work updated successfully!');
  };

  const handleDelete = (classwork) => {
    Alert.alert(
      'Delete Class Work',
      `Are you sure you want to delete class work for ${classwork.subject}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setClassWorkData(prev => prev.filter(item => item.id !== classwork.id));
            Alert.alert('Success', 'Class work deleted successfully!');
          }
        }
      ]
    );
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (classwork) => {
    setSelectedClassWork(classwork);
    setShowDetailsModal(true);
  };

  const handleStartClass = (classwork) => {
    Alert.alert(
      'Start Class',
      `Start ${classwork.subject} class for ${classwork.class} - Section ${classwork.section}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            // Update status to Running
            setClassWorkData(prev => prev.map(item => 
              item.id === classwork.id ? {...item, status: 'Running'} : item
            ));
            Alert.alert('Success', 'Class started successfully!');
          }
        }
      ]
    );
  };

  const handleEndClass = (classwork) => {
    Alert.alert(
      'End Class',
      `End ${classwork.subject} class for ${classwork.class} - Section ${classwork.section}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End', 
          onPress: () => {
            // Update status to Completed
            setClassWorkData(prev => prev.map(item => 
              item.id === classwork.id ? {...item, status: 'Completed'} : item
            ));
            Alert.alert('Success', 'Class ended successfully!');
          }
        }
      ]
    );
  };

  const renderDropdown = (label, value, options, onSelect, showModal, setShowModal) => (
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
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setShowModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    item === value && styles.selectedItem
                  ]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#FF6B6B';
      case 'Medium': return '#FFD93D';
      case 'Low': return '#6BCF7F';
      default: return '#6C7CE7';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Running': return '#FF6B6B';
      case 'Scheduled': return '#FFD93D';
      case 'Completed': return '#6BCF7F';
      default: return '#95A5A6';
    }
  };

  const getClassTypeColor = (type) => {
    switch(type) {
      case 'Theory': return '#3498DB';
      case 'Practical': return '#E67E22';
      case 'Discussion': return '#9B59B6';
      case 'Interactive': return '#1ABC9C';
      default: return '#6C7CE7';
    }
  };

  const filteredClassWork = getFilteredClassWork();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6C7CE7" barStyle="light-content" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by subject, class, teacher, topic..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#95A5A6"
          />
        </View>

        {/* Filter Section */}
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            {renderDropdown('Class', selectedClass, classOptions, setSelectedClass, showClassModal, setShowClassModal)}
            {renderDropdown('Section', selectedSection, sectionOptions, setSelectedSection, showSectionModal, setShowSectionModal)}
          </View>
          {renderDropdown('Subject', selectedSubject, subjectOptions, setSelectedSubject, showSubjectModal, setShowSubjectModal)}
        </View>

        {/* ClassWork Cards */}
        {filteredClassWork.map((classwork) => (
          <View key={classwork.id} style={styles.classWorkCard}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{classwork.subject.charAt(0)}</Text>
                </View>
                <View style={styles.cardHeaderInfo}>
                  <Text style={styles.cardTitle}>{classwork.subject}</Text>
                  <Text style={styles.cardSubtitle}>
                    {classwork.class} - Section {classwork.section}
                  </Text>
                  <Text style={styles.teacherName}>{classwork.teacher}</Text>
                </View>
              </View>
              <View style={styles.cardHeaderRight}>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(classwork.priority) }]}>
                  <Text style={styles.priorityText}>{classwork.priority}</Text>
                </View>
              </View>
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <Text style={styles.topicText}>📚 {classwork.topic}</Text>
              <Text style={styles.descriptionText}>{classwork.description}</Text>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Class Date</Text>
                  <Text style={styles.infoValue}>{classwork.classDate}</Text>
                </View>
                {/* <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>{classwork.duration}</Text>
                </View> */}
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(classwork.status) }]}>
                    <Text style={styles.statusText}>{classwork.status}</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Type</Text>
                  <View style={[styles.typeBadge, { backgroundColor: getClassTypeColor(classwork.classType) }]}>
                    <Text style={styles.typeText}>{classwork.classType}</Text>
                  </View>
                </View>
                {classwork.materials && (
                  <View style={styles.infoItemFull}>
                    <Text style={styles.infoLabel}>Materials</Text>
                    <Text style={styles.materialsText}>📝 {classwork.materials}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Card Actions */}
            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleViewDetails(classwork)}
              >
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
              {classwork.status === 'Scheduled' ? (
                <TouchableOpacity 
                  style={styles.startActionButton}
                  onPress={() => handleStartClass(classwork)}
                >
                  <Text style={styles.primaryActionButtonText}>Start Class</Text>
                </TouchableOpacity>
              ) : classwork.status === 'Running' ? (
                <TouchableOpacity 
                  style={styles.endActionButton}
                  onPress={() => handleEndClass(classwork)}
                >
                  <Text style={styles.primaryActionButtonText}>End Class</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.disabledActionButton}
                  disabled={true}
                >
                  <Text style={styles.disabledActionButtonText}>Completed</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Admin Actions */}
            <View style={styles.adminActions}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEdit(classwork)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(classwork)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Empty state */}
        {filteredClassWork.length === 0 && (
          <View style={styles.emptyState}>
            {selectedClass === 'All' && selectedSection === 'All' && selectedSubject === 'All' && searchQuery === '' ? (
              <>
                <Text style={styles.emptyStateText}>Please select filters to view class work</Text>
                <Text style={styles.emptyStateSubtext}>Choose class, section, or subject to see activities</Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyStateText}>No class work found</Text>
                <Text style={styles.emptyStateSubtext}>Try adjusting your filters or add a new activity</Text>
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
            <Text style={styles.modalTitle}>Class Work Details</Text>
            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          {selectedClassWork && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Subject:</Text>
                <Text style={styles.detailValue}>{selectedClassWork.subject}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Class & Section:</Text>
                <Text style={styles.detailValue}>{selectedClassWork.class} - Section {selectedClassWork.section}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Teacher:</Text>
                <Text style={styles.detailValue}>{selectedClassWork.teacher}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Topic:</Text>
                <Text style={styles.detailValue}>{selectedClassWork.topic}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Class Date:</Text>
                <Text style={styles.detailValue}>{selectedClassWork.classDate}</Text>
              </View>
              {/* <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>{selectedClassWork.duration}</Text>
              </View> */}
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Class Type:</Text>
                <View style={[styles.typeBadge, { backgroundColor: getClassTypeColor(selectedClassWork.classType) }]}>
                  <Text style={styles.typeText}>{selectedClassWork.classType}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Priority:</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedClassWork.priority) }]}>
                  <Text style={styles.priorityText}>{selectedClassWork.priority}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedClassWork.status) }]}>
                  <Text style={styles.statusText}>{selectedClassWork.status}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailDescription}>{selectedClassWork.description}</Text>
              </View>
              {selectedClassWork.materials && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Materials Required:</Text>
                  <Text style={styles.detailDescription}>{selectedClassWork.materials}</Text>
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
            <Text style={styles.modalTitle}>Edit Class Work</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          {editClassWork && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Subject:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editClassWork.subject}
                  onChangeText={(text) => setEditClassWork({...editClassWork, subject: text})}
                />
              </View>
              
              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Topic:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editClassWork.topic}
                  onChangeText={(text) => setEditClassWork({...editClassWork, topic: text})}
                />
              </View>
              
              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Teacher:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editClassWork.teacher}
                  onChangeText={(text) => setEditClassWork({...editClassWork, teacher: text})}
                />
              </View>
              
              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Description:</Text>
                <TextInput
                  style={[styles.editInput, styles.editTextArea]}
                  value={editClassWork.description}
                  onChangeText={(text) => setEditClassWork({...editClassWork, description: text})}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
              
              {/* <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Duration:</Text>
                <TextInput
                  style={styles.editInput}
                  value={editClassWork.duration}
                  onChangeText={(text) => setEditClassWork({...editClassWork, duration: text})}
                  placeholder="e.g., 45 mins"
                />
              </View> */}
              
              <View style={styles.editInputGroup}>
                <Text style={styles.editLabel}>Materials:</Text>
                <TextInput
                  style={[styles.editInput, styles.editTextArea]}
                  value={editClassWork.materials}
                  onChangeText={(text) => setEditClassWork({...editClassWork, materials: text})}
                  multiline={true}
                  numberOfLines={3}
                  placeholder="Required materials and resources"
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
            <Text style={styles.modalTitle}>Add New Class Work</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.addModalText}>Add class work form would be implemented here</Text>
            <TouchableOpacity 
              style={styles.primaryActionButton}
              onPress={() => {
                setShowAddModal(false);
                Alert.alert('Success', 'Add class work functionality would be implemented here');
              }}
            >
              <Text style={styles.primaryActionButtonText}>Save Class Work</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#6C7CE7',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 0,
  },
  
  // Filter Styles
  filterContainer: {
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  dropdownText: {
    fontSize: 15,
    color: '#2C3E50',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6C7CE7',
    marginLeft: 10,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalItemText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  selectedItem: {
    color: '#6C7CE7',
    fontWeight: '600',
  },
  
  // Card Styles
  classWorkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F2F6',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6C7CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 14,
    color: '#6C7CE7',
    fontWeight: '500',
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Card Content
  cardContent: {
    padding: 16,
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
  },
  infoItemFull: {
    width: '100%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#95A5A6',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  materialsText: {
    fontSize: 14,
    color: '#2C3E50',
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Card Actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F2F6',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  startActionButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  endActionButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledActionButton: {
    flex: 1,
    backgroundColor: '#BDC3C7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledActionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  
  // Admin Actions
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#3498DB',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C7CE7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  // Modal Container
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#95A5A6',
    padding: 5,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  
  // Detail Modal
  detailItem: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95A5A6',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  detailDescription: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  
  // Edit Modal
  editInputGroup: {
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  editTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95A5A6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Add Modal
  addModalText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginVertical: 40,
  },
  primaryActionButton: {
    backgroundColor: '#6C7CE7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  
  // Bottom Hint
  bottomHint: {
    backgroundColor: '#6C7CE7',
    paddingVertical: 12,
    alignItems: 'center',
  },
  bottomHintText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  });

export default ClassWork; 