"use client"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  Modal,
  Alert,
} from "react-native"

const { width } = Dimensions.get("window")

const AdmissionEnquiry = () => {
  const [searchText, setSearchText] = useState("")
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Status")
  const [selectedClassFilter, setSelectedClassFilter] = useState("All Classes") // Renamed from selectedGradeFilter
  const [enquiryData, setEnquiryData] = useState([])
  const [filteredEnquiries, setFilteredEnquiries] = useState([])
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [showEnquiryDetailModal, setShowEnquiryDetailModal] = useState(false)
  const [showCreateEnquiryModal, setShowCreateEnquiryModal] = useState(false)
  const [showStatusFilterModal, setShowStatusFilterModal] = useState(false)
  const [showClassFilterModal, setShowClassFilterModal] = useState(false) // Renamed from showGradeFilterModal

  // New enquiry form states
  const [newName, setNewName] = useState("")
  const [newParentName, setNewParentName] = useState("")
  const [newContactNumber, setNewContactNumber] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newClassInterested, setNewClassInterested] = useState("") // Renamed from newGradeInterested
  const [newEnquiryDate, setNewEnquiryDate] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [newFollowUpDate, setNewFollowUpDate] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [newAddress, setNewAddress] = useState("") // Renamed from newSource

  const enquiryStatuses = ["All Status", "New", "Follow-up", "Admitted", "Rejected", "On Hold"]
  const classList = [
    "All Classes", // Renamed from All Grades
    "Nursery",
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ]

  // Sample admission enquiry data
  const admissionEnquiryData = [
    {
      id: 1,
      name: "Aarav Sharma",
      parentName: "Mr. & Mrs. Sharma",
      contactNumber: "+919876543210",
      email: "aarav.p@example.com",
      classInterested: "Grade 5", // Renamed from gradeInterested
      enquiryDate: "2024-11-01",
      status: "Follow-up",
      followUpDate: "2024-11-20",
      notes: "Parents interested in extracurricular activities, especially sports.",
      address: "Website", // Renamed from source
    },
    {
      id: 2,
      name: "Diya Singh",
      parentName: "Ms. Singh",
      contactNumber: "+918765432109",
      email: "diya.s@example.com",
      classInterested: "Grade 1", // Renamed from gradeInterested
      enquiryDate: "2024-10-25",
      status: "New",
      followUpDate: null,
      notes: "Enquired about admission process and fee structure.",
      address: "Walk-in", // Renamed from source
    },
    {
      id: 3,
      name: "Kabir Khan",
      parentName: "Mr. Khan",
      contactNumber: "+917654321098",
      email: "kabir.k@example.com",
      classInterested: "Grade 9", // Renamed from gradeInterested
      enquiryDate: "2024-10-15",
      status: "Admitted",
      followUpDate: "2024-10-30",
      notes: "Completed all admission formalities. Admission confirmed.",
      address: "Referral", // Renamed from source
    },
    {
      id: 4,
      name: "Sara Ali",
      parentName: "Mrs. Ali",
      contactNumber: "+919988776655",
      email: "sara.a@example.com",
      classInterested: "Kindergarten", // Renamed from gradeInterested
      enquiryDate: "2024-11-05",
      status: "On Hold",
      followUpDate: "2024-11-25",
      notes: "Family relocating, will confirm by end of month.",
      address: "Online Ad", // Renamed from source
    },
    {
      id: 5,
      name: "Rohan Verma",
      parentName: "Mr. & Mrs. Verma",
      contactNumber: "+919012345678",
      email: "rohan.v@example.com",
      classInterested: "Grade 7", // Renamed from gradeInterested
      enquiryDate: "2024-11-02",
      status: "Rejected",
      followUpDate: null,
      notes: "Did not meet admission criteria after assessment.",
      address: "Website", // Renamed from source
    },
  ]

  useEffect(() => {
    setEnquiryData(admissionEnquiryData)
    filterEnquiries(admissionEnquiryData)
  }, [])

  useEffect(() => {
    filterEnquiries(enquiryData)
  }, [searchText, selectedStatusFilter, selectedClassFilter, enquiryData]) // Updated filter dependency

  const filterEnquiries = (data) => {
    let filtered = data

    if (selectedStatusFilter && selectedStatusFilter !== "All Status") {
      filtered = filtered.filter((enquiry) => enquiry.status === selectedStatusFilter)
    }

    if (selectedClassFilter && selectedClassFilter !== "All Classes") {
      filtered = filtered.filter((enquiry) => enquiry.classInterested === selectedClassFilter) // Updated filter logic
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (enquiry) =>
          enquiry.name.toLowerCase().includes(searchLower) ||
          enquiry.parentName.toLowerCase().includes(searchLower) ||
          enquiry.contactNumber.toLowerCase().includes(searchLower) ||
          enquiry.email.toLowerCase().includes(searchLower) ||
          enquiry.classInterested.toLowerCase().includes(searchLower) || // Updated search field
          enquiry.notes.toLowerCase().includes(searchLower) ||
          enquiry.address.toLowerCase().includes(searchLower), // Updated search field
      )
    }

    setFilteredEnquiries(filtered)
  }

  const getStatusColor = (status) => {
    const colors = {
      New: "#3b82f6", // Blue
      "Follow-up": "#f59e0b", // Amber
      Admitted: "#10b981", // Green
      Rejected: "#ef4444", // Red
      "On Hold": "#6b7280", // Gray
    }
    return colors[status] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const icons = {
      New: "bell-badge",
      "Follow-up": "calendar-clock",
      Admitted: "check-circle",
      Rejected: "close-circle",
      "On Hold": "pause-circle",
    }
    return icons[status] || "help-circle"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleEnquiryPress = (enquiry) => {
    setSelectedEnquiry(enquiry)
    setShowEnquiryDetailModal(true)
  }

  const closeEnquiryDetailModal = () => {
    setShowEnquiryDetailModal(false)
    setSelectedEnquiry(null)
  }

  const handleAddEnquiry = () => {
    setShowCreateEnquiryModal(true)
  }

  const closeCreateEnquiryModal = () => {
    setShowCreateEnquiryModal(false)
    // Reset form fields
    setNewName("")
    setNewParentName("")
    setNewContactNumber("")
    setNewEmail("")
    setNewClassInterested("") // Renamed
    setNewEnquiryDate("")
    setNewStatus("")
    setNewFollowUpDate("")
    setNewNotes("")
    setNewAddress("") // Renamed
  }

  const handleSaveNewEnquiry = () => {
    if (!newName || !newContactNumber || !newClassInterested || !newEnquiryDate || !newStatus) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields (Name, Contact, Class, Enquiry Date, Status).", // Updated text
      )
      return
    }

    const newEntry = {
      id: enquiryData.length + 1, // Simple ID generation
      name: newName,
      parentName: newParentName,
      contactNumber: newContactNumber,
      email: newEmail,
      classInterested: newClassInterested, // Renamed
      enquiryDate: newEnquiryDate,
      status: newStatus,
      followUpDate: newFollowUpDate || null,
      notes: newNotes,
      address: newAddress, // Renamed
    }

    setEnquiryData((prevData) => [...prevData, newEntry])
    Alert.alert("Success", "New admission enquiry created successfully!")
    closeCreateEnquiryModal()
  }

  const EnquiryCard = ({ enquiry }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleEnquiryPress(enquiry)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Icon name="account-plus" size={24} color="#6366f1" />
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} allowFontScaling={false}>
            {enquiry.name}
          </Text>
          <Text style={styles.cardSubtitle} allowFontScaling={false}>
            Interested in {enquiry.classInterested} {/* Updated text */}
          </Text>
          <Text style={styles.cardDate} allowFontScaling={false}>
            Enquiry Date: {formatDate(enquiry.enquiryDate)}
          </Text>
        </View>
        <View style={styles.cardStatusContainer}>
          <Icon name={getStatusIcon(enquiry.status)} size={16} color={getStatusColor(enquiry.status)} />
          <Text style={[styles.cardStatusText, { color: getStatusColor(enquiry.status) }]} allowFontScaling={false}>
            {enquiry.status}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const EnquiryDetailModal = ({ enquiry, visible, onClose }) => {
    if (!enquiry) return null

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Enquiry Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Basic Info */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Applicant Information
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Applicant Name
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {enquiry.name}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Parent Name
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {enquiry.parentName || "N/A"}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Class Interested {/* Updated text */}
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {enquiry.classInterested} {/* Updated field */}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Status
                  </Text>
                  <View style={styles.statusContainer}>
                    <Icon name={getStatusIcon(enquiry.status)} size={16} color={getStatusColor(enquiry.status)} />
                    <Text
                      style={[styles.statusText, { color: getStatusColor(enquiry.status) }]}
                      allowFontScaling={false}
                    >
                      {enquiry.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Contact & Dates */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Contact & Timeline
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="phone" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Contact Number
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {enquiry.contactNumber}
                    </Text>
                  </View>
                </View>
                {enquiry.email && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="email" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Email
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {enquiry.email}
                      </Text>
                    </View>
                  </View>
                )}
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-plus" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Enquiry Date
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDate(enquiry.enquiryDate)}
                    </Text>
                  </View>
                </View>
                {enquiry.followUpDate && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="calendar-check" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Follow-up Date
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {formatDate(enquiry.followUpDate)}
                      </Text>
                    </View>
                  </View>
                )}
                {enquiry.address && ( // Updated field
                  <View style={styles.modalInfoItem}>
                    <Icon name="map-marker" size={16} color="#6b7280" /> {/* Changed icon for address */}
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Address {/* Updated text */}
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {enquiry.address} {/* Updated field */}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Notes */}
            {enquiry.notes && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Notes
                </Text>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText} allowFontScaling={false}>
                    {enquiry.notes}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const CreateEnquiryModal = ({ visible, onClose, onSave }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Add New Enquiry
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContentForm} showsVerticalScrollIndicator={false}>
            <View style={[styles.formSection, { marginTop: 16 }]}>
              {" "}
              {/* Added marginTop here */}
              <Text style={styles.formLabel} allowFontScaling={false}>
                Applicant Name <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., John Doe"
                value={newName}
                onChangeText={setNewName}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Parent Name (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Jane Doe"
                value={newParentName}
                onChangeText={setNewParentName}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Contact Number <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., +919876543210"
                value={newContactNumber}
                onChangeText={setNewContactNumber}
                keyboardType="phone-pad"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Email (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., john.doe@example.com"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Class Interested <Text style={styles.requiredIndicator}>*</Text> {/* Updated text */}
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Grade 5, Kindergarten"
                value={newClassInterested} // Updated field
                onChangeText={setNewClassInterested} // Updated setter
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Enquiry Date <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newEnquiryDate}
                onChangeText={setNewEnquiryDate}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Status <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., New, Follow-up, Admitted"
                value={newStatus}
                onChangeText={setNewStatus}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Follow-up Date (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="YYYY-MM-DD"
                value={newFollowUpDate}
                onChangeText={setNewFollowUpDate}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Address (Optional) {/* Updated text */}
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 123 School Rd, City"
                value={newAddress} // Updated field
                onChangeText={setNewAddress} // Updated setter
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Notes (Optional)
              </Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Any additional notes about the enquiry..."
                value={newNotes}
                onChangeText={setNewNotes}
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText} allowFontScaling={false}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText} allowFontScaling={false}>
                  Add Enquiry
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const StatusFilterModal = ({ visible, onClose, onSelectStatus }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Select Status
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={enquiryStatuses}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => {
                  onSelectStatus(item)
                  onClose()
                }}
              >
                <Text
                  style={[styles.filterText, selectedStatusFilter === item && styles.filterTextSelected]}
                  allowFontScaling={false}
                >
                  {item}
                </Text>
                {selectedStatusFilter === item && <Icon name="check" size={20} color="#6366f1" />}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.filterSeparator} />}
            style={styles.modalContent}
          />
        </View>
      </Modal>
    )
  }

  const ClassFilterModal = ({ visible, onClose, onSelectClass }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Select Class {/* Updated text */}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={classList} // Updated data source
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => {
                  onSelectClass(item) // Updated handler
                  onClose()
                }}
              >
                <Text
                  style={[styles.filterText, selectedClassFilter === item && styles.filterTextSelected]} // Updated filter state
                  allowFontScaling={false}
                >
                  {item}
                </Text>
                {selectedClassFilter === item && <Icon name="check" size={20} color="#6366f1" />}{" "}
                {/* Updated filter state */}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.filterSeparator} />}
            style={styles.modalContent}
          />
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle} allowFontScaling={false}>
              Admission Enquiries
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Manage prospective student enquiries
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddEnquiry}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.addButtonText} allowFontScaling={false}>
              Add Enquiry
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, contact, or class..." // Updated text
            value={searchText}
            onChangeText={setSearchText}
            allowFontScaling={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
              <Icon name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowStatusFilterModal(true)}>
            <Icon name="filter-variant" size={18} color="#6366f1" />
            <Text style={styles.filterButtonText} allowFontScaling={false}>
              Status: {selectedStatusFilter}
            </Text>
            <Icon name="chevron-down" size={18} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowClassFilterModal(true)}>
            {" "}
            {/* Updated handler */}
            <Icon name="school" size={18} color="#6366f1" />
            <Text style={styles.filterButtonText} allowFontScaling={false}>
              Class: {selectedClassFilter} {/* Updated text and state */}
            </Text>
            <Icon name="chevron-down" size={18} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredEnquiries.length} of {enquiryData.length} enquiries
          </Text>
          {(selectedStatusFilter !== "All Status" || selectedClassFilter !== "All Classes" || searchText) && ( // Updated filter state
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedStatusFilter("All Status")
                setSelectedClassFilter("All Classes") // Updated filter state
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Enquiry List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredEnquiries}
            renderItem={({ item }) => <EnquiryCard enquiry={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon} allowFontScaling={false}>
                  📝
                </Text>
                <Text style={styles.emptyTitle} allowFontScaling={false}>
                  No Enquiries Found
                </Text>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No admission enquiries match your criteria. Try adjusting your filters or add a new enquiry.
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Modals */}
      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        visible={showEnquiryDetailModal}
        onClose={closeEnquiryDetailModal}
      />
      <CreateEnquiryModal
        visible={showCreateEnquiryModal}
        onClose={closeCreateEnquiryModal}
        onSave={handleSaveNewEnquiry}
      />
      <StatusFilterModal
        visible={showStatusFilterModal}
        onClose={() => setShowStatusFilterModal(false)}
        onSelectStatus={setSelectedStatusFilter}
      />
      <ClassFilterModal // Renamed component
        visible={showClassFilterModal} // Renamed state
        onClose={() => setShowClassFilterModal(false)} // Renamed setter
        onSelectClass={setSelectedClassFilter} // Renamed setter
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  addButton: {
    backgroundColor: "#ffffff", // Changed to white
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8, // Adjusted padding
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1, // Added border
    borderColor: "#6366f1", // Added border color
    gap: 6,
  },
  addButtonText: {
    color: "#6366f1", // Changed to blue
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    includeFontPadding: false,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6366f1",
    gap: 6,
  },
  filterButtonText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  clearFiltersText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1, // Added border for consistency
    borderColor: "#e5e7eb", // Added border color for consistency
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e7ff", // Light blue for enquiries
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardDate: {
    fontSize: 13,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardStatusText: {
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  // Modal Styles (reused and adapted from Income/Expense.jsx)
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalContentForm: {
    // New style for form specific content
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40, // Added padding to ensure content above buttons is visible
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryCard: {
    backgroundColor: "#f8f9fb",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalInfoGrid: {
    gap: 12,
  },
  modalInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalInfoValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  descriptionCard: {
    backgroundColor: "#f8f9fb",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  descriptionText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  formSection: {
    marginBottom: 10, // Reduced from 16
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4, // Reduced from 8
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  requiredIndicator: {
    color: "#ef4444",
  },
  formInput: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
    ...Platform.select({
      // Added subtle shadow for elegance
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 0.5,
      },
    }),
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16, // Reduced from 20
    marginBottom: 20, // Reduced from 40
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: 16,
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterTextSelected: {
    fontWeight: "bold",
    color: "#6366f1",
  },
  filterSeparator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 20,
  },
})

export default AdmissionEnquiry
