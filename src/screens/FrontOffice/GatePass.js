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

const GatePass = () => {
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [searchText, setSearchText] = useState("")
  const [gatePassData, setGatePassData] = useState([])
  const [filteredGatePasses, setFilteredGatePasses] = useState([])
  const [selectedGatePass, setSelectedGatePass] = useState(null)
  const [showGatePassDetailModal, setShowGatePassDetailModal] = useState(false)
  const [showCreateGatePassModal, setShowCreateGatePassModal] = useState(false)

  // New gate pass form states
  const [newStudentName, setNewStudentName] = useState("")
  const [newStudentClass, setNewStudentClass] = useState("")
  const [newReason, setNewReason] = useState("")
  const [newDestination, setNewDestination] = useState("")
  const [newRequestedBy, setNewRequestedBy] = useState("")
  const [newApprovalStatus, setNewApprovalStatus] = useState("Pending") // Default status
  const [newNotes, setNewNotes] = useState("")

  // Filter options
  const gatePassStatuses = ["All Status", "Pending", "Approved", "Rejected", "Exited", "Returned"]
  const reasons = [
    "Medical Appointment",
    "Family Emergency",
    "Sports Event",
    "Academic Competition",
    "Personal Reason",
    "Other",
  ]
  const requestedByOptions = ["Student", "Parent", "Guardian"]

  // Sample gate pass data
  const gatePassDirectoryData = [
    {
      id: 1,
      studentName: "Aryan Sharma",
      studentClass: "Grade 10",
      reason: "Medical Appointment",
      destination: "City Hospital",
      requestDate: "2024-11-20T09:00:00Z",
      approvalDate: null,
      status: "Pending",
      approvedBy: null,
      exitTime: null,
      returnTime: null,
      notes: "Dental check-up. Will return by 1 PM.",
      requestedBy: "Parent",
    },
    {
      id: 2,
      studentName: "Siya Patel",
      studentClass: "Grade 8",
      reason: "Family Emergency",
      destination: "Home",
      requestDate: "2024-11-19T14:30:00Z",
      approvalDate: "2024-11-19T15:00:00Z",
      status: "Approved",
      approvedBy: "Principal",
      exitTime: null,
      returnTime: null,
      notes: "Urgent family matter. Will be absent for 2 days.",
      requestedBy: "Parent",
    },
    {
      id: 3,
      studentName: "Kabir Singh",
      studentClass: "Grade 12",
      reason: "Sports Event",
      destination: "District Stadium",
      requestDate: "2024-11-18T08:00:00Z",
      approvalDate: "2024-11-18T08:30:00Z",
      status: "Exited",
      approvedBy: "Sports Coordinator",
      exitTime: "2024-11-20T10:00:00Z",
      returnTime: null,
      notes: "Participating in inter-school football tournament.",
      requestedBy: "Student",
    },
    {
      id: 4,
      studentName: "Meera Devi",
      studentClass: "Grade 5",
      reason: "Personal Reason",
      destination: "Grandparent's House",
      requestDate: "2024-11-17T11:00:00Z",
      approvalDate: "2024-11-17T11:30:00Z",
      status: "Returned",
      approvedBy: "Class Teacher",
      exitTime: "2024-11-17T12:00:00Z",
      returnTime: "2024-11-17T16:00:00Z",
      notes: "Attended a family function.",
      requestedBy: "Parent",
    },
    {
      id: 5,
      studentName: "Rohan Verma",
      studentClass: "Grade 9",
      reason: "Academic Competition",
      destination: "University Campus",
      requestDate: "2024-11-16T09:30:00Z",
      approvalDate: "2024-11-16T10:00:00Z",
      status: "Approved",
      approvedBy: "Academic Head",
      exitTime: null,
      returnTime: null,
      notes: "Science Olympiad participant.",
      requestedBy: "Student",
    },
  ]

  useEffect(() => {
    setGatePassData(gatePassDirectoryData)
    filterGatePasses(gatePassDirectoryData)
  }, [])

  useEffect(() => {
    filterGatePasses(gatePassData)
  }, [selectedStatus, searchText, gatePassData])

  const filterGatePasses = (data) => {
    let filtered = data

    // Filter by status
    if (selectedStatus && selectedStatus !== "All Status") {
      filtered = filtered.filter((pass) => pass.status === selectedStatus)
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (pass) =>
          pass.studentName.toLowerCase().includes(searchLower) ||
          pass.studentClass.toLowerCase().includes(searchLower) ||
          pass.reason.toLowerCase().includes(searchLower) ||
          pass.destination.toLowerCase().includes(searchLower) ||
          (pass.notes && pass.notes.toLowerCase().includes(searchLower)),
      )
    }

    setFilteredGatePasses(filtered)
  }

  const getStatusColor = (status) => {
    const colors = {
      Pending: "#f59e0b", // Amber
      Approved: "#3b82f6", // Blue
      Rejected: "#ef4444", // Red
      Exited: "#10b981", // Green
      Returned: "#6b7280", // Gray
    }
    return colors[status] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const icons = {
      Pending: "clock-outline",
      Approved: "check-circle-outline",
      Rejected: "close-circle-outline",
      Exited: "exit-run",
      Returned: "keyboard-return",
    }
    return icons[status] || "help-circle"
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A"
    const date = new Date(dateTimeString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleGatePassPress = (pass) => {
    setSelectedGatePass(pass)
    setShowGatePassDetailModal(true)
  }

  const closeGatePassDetailModal = () => {
    setShowGatePassDetailModal(false)
    setSelectedGatePass(null)
  }

  const handleAddGatePass = () => {
    setShowCreateGatePassModal(true)
  }

  const closeCreateGatePassModal = () => {
    setShowCreateGatePassModal(false)
    // Reset form fields
    setNewStudentName("")
    setNewStudentClass("")
    setNewReason("")
    setNewDestination("")
    setNewRequestedBy("")
    setNewApprovalStatus("Pending")
    setNewNotes("")
  }

  const handleSaveNewGatePass = () => {
    if (!newStudentName || !newStudentClass || !newReason || !newDestination || !newRequestedBy) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    const newEntry = {
      id: gatePassData.length + 1, // Simple ID generation
      studentName: newStudentName,
      studentClass: newStudentClass,
      reason: newReason,
      destination: newDestination,
      requestDate: new Date().toISOString(),
      approvalDate: null,
      status: "Pending", // New gate passes start as Pending
      approvedBy: null,
      exitTime: null,
      returnTime: null,
      notes: newNotes || null,
      requestedBy: newRequestedBy,
    }

    setGatePassData((prevData) => [...prevData, newEntry])
    Alert.alert("Success", "New gate pass request created successfully!")
    closeCreateGatePassModal()
  }

  const handleUpdateGatePassStatus = (passId, newStatus, approvedBy = null) => {
    Alert.alert("Update Status", `Are you sure you want to mark this gate pass as ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          setGatePassData((prevData) =>
            prevData.map((p) =>
              p.id === passId
                ? {
                    ...p,
                    status: newStatus,
                    approvalDate: newStatus === "Approved" ? new Date().toISOString() : p.approvalDate,
                    approvedBy: newStatus === "Approved" ? approvedBy : p.approvedBy,
                    exitTime: newStatus === "Exited" ? new Date().toISOString() : p.exitTime,
                    returnTime: newStatus === "Returned" ? new Date().toISOString() : p.returnTime,
                  }
                : p,
            ),
          )
          Alert.alert("Success", `Gate pass status updated to ${newStatus}!`)
          closeGatePassDetailModal()
        },
      },
    ])
  }

  const GatePassCard = ({ pass }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleGatePassPress(pass)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Icon name="door-open" size={28} color="#6366f1" />
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} allowFontScaling={false}>
            {pass.studentName} ({pass.studentClass})
          </Text>
          <Text style={styles.cardSubtitle} allowFontScaling={false}>
            Reason: {pass.reason}
          </Text>
          <Text style={styles.cardMeta} allowFontScaling={false}>
            Destination: {pass.destination}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <Icon name={getStatusIcon(pass.status)} size={16} color={getStatusColor(pass.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(pass.status) }]} allowFontScaling={false}>
            {pass.status}
          </Text>
        </View>
        <Text style={styles.cardTime} allowFontScaling={false}>
          Requested: {formatDateTime(pass.requestDate)}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const GatePassDetailModal = ({ pass, visible, onClose, onUpdateStatus }) => {
    if (!pass) return null

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Gate Pass Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Pass Overview */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Pass Overview
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Student Name
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {pass.studentName}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Class
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {pass.studentClass}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Reason
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {pass.reason}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Destination
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {pass.destination}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Requested By
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {pass.requestedBy}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Status
                  </Text>
                  <View style={styles.statusContainer}>
                    <Icon name={getStatusIcon(pass.status)} size={16} color={getStatusColor(pass.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(pass.status) }]} allowFontScaling={false}>
                      {pass.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Timestamps & Approval */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Timeline & Approval
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-plus" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Request Date
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(pass.requestDate)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="check-decagram" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Approval Date
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(pass.approvalDate)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="account-check" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Approved By
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {pass.approvedBy || "N/A"}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="exit-run" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Exit Time
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(pass.exitTime)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="keyboard-return" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Return Time
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(pass.returnTime)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Notes */}
            {pass.notes && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Notes
                </Text>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText} allowFontScaling={false}>
                    {pass.notes}
                  </Text>
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.formActions}>
              {pass.status === "Pending" && (
                <>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => onUpdateStatus(pass.id, "Rejected")}>
                    <Text style={styles.cancelButtonText} allowFontScaling={false}>
                      Reject
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => onUpdateStatus(pass.id, "Approved", "Admin")}
                  >
                    <Text style={styles.saveButtonText} allowFontScaling={false}>
                      Approve
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {pass.status === "Approved" && (
                <TouchableOpacity style={styles.saveButton} onPress={() => onUpdateStatus(pass.id, "Exited")}>
                  <Text style={styles.saveButtonText} allowFontScaling={false}>
                    Mark Exited
                  </Text>
                </TouchableOpacity>
              )}
              {pass.status === "Exited" && (
                <TouchableOpacity style={styles.saveButton} onPress={() => onUpdateStatus(pass.id, "Returned")}>
                  <Text style={styles.saveButtonText} allowFontScaling={false}>
                    Mark Returned
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const CreateGatePassModal = ({ visible, onClose, onSave }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Request New Gate Pass
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.formSection, { marginTop: 16 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Student Name <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., John Doe"
                value={newStudentName}
                onChangeText={setNewStudentName}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Student Class <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Grade 10, Nursery"
                value={newStudentClass}
                onChangeText={setNewStudentClass}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Reason for Pass <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {reasons.map((reason, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterButton, newReason === reason && styles.filterButtonActive]}
                      onPress={() => setNewReason(reason)}
                    >
                      <Text
                        style={[styles.filterButtonText, newReason === reason && styles.filterButtonTextActive]}
                        allowFontScaling={false}
                      >
                        {reason}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Destination <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Home, Doctor's Clinic"
                value={newDestination}
                onChangeText={setNewDestination}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Requested By <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {requestedByOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterButton, newRequestedBy === option && styles.filterButtonActive]}
                      onPress={() => setNewRequestedBy(option)}
                    >
                      <Text
                        style={[styles.filterButtonText, newRequestedBy === option && styles.filterButtonTextActive]}
                        allowFontScaling={false}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Notes (Optional)
              </Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Any additional notes or instructions..."
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
                  Submit Request
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
              Gate Pass Management
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Manage student exits and returns
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddGatePass}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.addButtonText} allowFontScaling={false}>
              New Pass
            </Text> */}
          </TouchableOpacity>
        </View>4
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name, class, or reason..."
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
          <Text style={styles.filterLabel} allowFontScaling={false}>
            Status:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {gatePassStatuses.map((status, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.filterButton, selectedStatus === status && styles.filterButtonActive]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[styles.filterButtonText, selectedStatus === status && styles.filterButtonTextActive]}
                  allowFontScaling={false}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredGatePasses.length} of {gatePassData.length} gate passes
          </Text>
          {(selectedStatus !== "All Status" || searchText) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedStatus("All Status")
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Gate Pass List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredGatePasses}
            renderItem={({ item }) => <GatePassCard pass={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon} allowFontScaling={false}>
                  🚪
                </Text>
                <Text style={styles.emptyTitle} allowFontScaling={false}>
                  No Gate Passes Found
                </Text>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No gate passes match your criteria. Try adjusting filters or request a new pass.
                </Text>
              </View>
            )}
          />
        </View>

        {/* Modals */}
        <GatePassDetailModal
          pass={selectedGatePass}
          visible={showGatePassDetailModal}
          onClose={closeGatePassDetailModal}
          onUpdateStatus={handleUpdateGatePassStatus}
        />
        <CreateGatePassModal
          visible={showCreateGatePassModal}
          onClose={closeCreateGatePassModal}
          onSave={handleSaveNewGatePass}
        />
      </ScrollView>
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
    backgroundColor: "#ffffff", // Matched AdmissionEnquiry.jsx
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8, // Matched AdmissionEnquiry.jsx
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1, // Matched AdmissionEnquiry.jsx
    borderColor: "#6366f1", // Matched AdmissionEnquiry.jsx
    gap: 6,
  },
  addButtonText: {
    color: "#6366f1", // Matched AdmissionEnquiry.jsx
    fontSize: 14, // Matched AdmissionEnquiry.jsx
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
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterScrollContent: {
    paddingRight: 12,
  },
  filterButton: {
    backgroundColor: "#ffffff", // Matched AdmissionEnquiry.jsx
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  filterButtonActive: {
    backgroundColor: "#6366f1", // Matched AdmissionEnquiry.jsx
    borderColor: "#6366f1", // Matched AdmissionEnquiry.jsx
  },
  filterButtonText: {
    fontSize: 13, // Matched AdmissionEnquiry.jsx
    color: "#374151", // Matched AdmissionEnquiry.jsx
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterButtonTextActive: {
    color: "#ffffff", // Matched AdmissionEnquiry.jsx
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
    alignItems: "center",
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e7ff", // Light blue for gate passes
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
  cardMeta: {
    fontSize: 13,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardTime: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
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
  // Modal Styles (reused from previous components)
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
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
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
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  checkbox: {
    padding: 4,
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#374151",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
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
    fontSize: 12, // Matched AdmissionEnquiry.jsx
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
    fontSize: 12, // Matched AdmissionEnquiry.jsx
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default GatePass
