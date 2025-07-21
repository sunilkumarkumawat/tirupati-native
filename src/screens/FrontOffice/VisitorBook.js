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

const VisitorBook = () => {
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedPurpose, setSelectedPurpose] = useState("All Purposes")
  const [searchText, setSearchText] = useState("")
  const [visitorData, setVisitorData] = useState([])
  const [filteredVisitors, setFilteredVisitors] = useState([])
  const [selectedVisitor, setSelectedVisitor] = useState(null)
  const [showVisitorDetailModal, setShowVisitorDetailModal] = useState(false)
  const [showCreateVisitorModal, setShowCreateVisitorModal] = useState(false)

  // New visitor form states
  const [newVisitorName, setNewVisitorName] = useState("")
  const [newVisitorPurpose, setNewVisitorPurpose] = useState("")
  const [newVisitorHost, setNewVisitorHost] = useState("")
  const [newVisitorContactEmail, setNewVisitorContactEmail] = useState("") // Changed from newVisitorContact
  const [newVisitorContactNumber, setNewVisitorContactNumber] = useState("") // New state for contact number
  const [newVisitorCompany, setNewVisitorCompany] = useState("")
  const [newVisitorNotes, setNewVisitorNotes] = useState("")
  const [newVisitorPreRegistered, setNewVisitorPreRegistered] = useState(false)

  // Filter options
  const visitorStatuses = ["All Status", "Signed In", "Signed Out", "Pre-registered"]
  const purposes = [
    "All Purposes",
    "Meeting",
    "Interview",
    "Delivery",
    "Event",
    "Official Visit",
    "Parent Visit",
    "Other",
  ]
  const hosts = [
    "All Hosts",
    "Dr. Rajesh Kumar",
    "Mrs. Priya Sharma",
    "Mr. Amit Patel",
    "Ms. Sunita Singh",
    "Dr. Meera Joshi",
    "Mr. Vikash Kumar",
    "Mrs. Kavita Rao",
    "Mr. Deepak Gupta",
  ]

  // Sample visitor data
  const visitorDirectoryData = [
    {
      id: 1,
      name: "John Doe",
      purpose: "Meeting",
      host: "Dr. Rajesh Kumar",
      entryTime: "2024-11-15T10:00:00Z",
      exitTime: null,
      status: "Signed In",
      contactEmail: "john.doe@example.com",
      contactNumber: "9876543210", // Added contact number
      company: "ABC Corp",
      notes: "Discussed annual budget.",
      preRegistered: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      purpose: "Interview",
      host: "Mrs. Priya Sharma",
      entryTime: "2024-11-14T14:30:00Z",
      exitTime: "2024-11-14T15:30:00Z",
      status: "Signed Out",
      contactEmail: "jane.smith@example.com",
      contactNumber: "9988776655", // Added contact number
      company: "XYZ Ltd",
      notes: "Interview for English teacher position.",
      preRegistered: false,
    },
    {
      id: 3,
      name: "Alice Johnson",
      purpose: "Delivery",
      host: "Maintenance",
      entryTime: "2024-11-15T09:15:00Z",
      exitTime: "2024-11-15T09:30:00Z",
      status: "Signed Out",
      contactEmail: "alice@delivery.com",
      contactNumber: "9123456789", // Added contact number
      company: "Fast Couriers",
      notes: "Delivered new lab equipment.",
      preRegistered: false,
    },
    {
      id: 4,
      name: "Bob Williams",
      purpose: "Event",
      host: "Dr. Meera Joshi",
      entryTime: null,
      exitTime: null,
      status: "Pre-registered",
      contactEmail: "bob@example.com",
      contactNumber: "9012345678", // Added contact number
      company: "Event Planners Inc.",
      notes: "Attending Science Fair.",
      preRegistered: true,
    },
    {
      id: 5,
      name: "Charlie Brown",
      purpose: "Parent Visit",
      host: "Mr. Amit Patel",
      entryTime: "2024-11-15T11:00:00Z",
      exitTime: null,
      status: "Signed In",
      contactEmail: "charlie.b@example.com",
      contactNumber: "9765432109", // Added contact number
      company: null,
      notes: "Parent-teacher meeting for student S010.",
      preRegistered: false,
    },
    {
      id: 6,
      name: "Diana Prince",
      purpose: "Official Visit",
      host: "Board of Directors",
      entryTime: "2024-11-13T09:00:00Z",
      exitTime: "2024-11-13T17:00:00Z",
      status: "Signed Out",
      contactEmail: "diana@gov.in",
      contactNumber: "9543210987", // Added contact number
      company: "Education Ministry",
      notes: "Inspection of school facilities.",
      preRegistered: true,
    },
  ]

  useEffect(() => {
    setVisitorData(visitorDirectoryData)
    filterVisitors(visitorDirectoryData)
  }, [])

  useEffect(() => {
    filterVisitors(visitorData)
  }, [selectedStatus, selectedPurpose, searchText, visitorData])

  const filterVisitors = (data) => {
    let filtered = data

    // Filter by status
    if (selectedStatus && selectedStatus !== "All Status") {
      filtered = filtered.filter((visitor) => visitor.status === selectedStatus)
    }

    // Filter by purpose
    if (selectedPurpose && selectedPurpose !== "All Purposes") {
      filtered = filtered.filter((visitor) => visitor.purpose === selectedPurpose)
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (visitor) =>
          visitor.name.toLowerCase().includes(searchLower) ||
          visitor.purpose.toLowerCase().includes(searchLower) ||
          visitor.host.toLowerCase().includes(searchLower) ||
          (visitor.company && visitor.company.toLowerCase().includes(searchLower)) ||
          (visitor.notes && visitor.notes.toLowerCase().includes(searchLower)) ||
          (visitor.contactEmail && visitor.contactEmail.toLowerCase().includes(searchLower)) || // Search by email
          (visitor.contactNumber && visitor.contactNumber.includes(searchLower)), // Search by number
      )
    }

    setFilteredVisitors(filtered)
  }

  const getStatusColor = (status) => {
    const colors = {
      "Signed In": "#10b981", // Green
      "Signed Out": "#6b7280", // Gray
      "Pre-registered": "#3b82f6", // Blue
    }
    return colors[status] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const icons = {
      "Signed In": "login",
      "Signed Out": "logout",
      "Pre-registered": "calendar-check",
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

  const handleVisitorPress = (visitor) => {
    setSelectedVisitor(visitor)
    setShowVisitorDetailModal(true)
  }

  const closeVisitorDetailModal = () => {
    setShowVisitorDetailModal(false)
    setSelectedVisitor(null)
  }

  const handleAddVisitor = () => {
    setShowCreateVisitorModal(true)
  }

  const closeCreateVisitorModal = () => {
    setShowCreateVisitorModal(false)
    // Reset form fields
    setNewVisitorName("")
    setNewVisitorPurpose("")
    setNewVisitorHost("")
    setNewVisitorContactEmail("")
    setNewVisitorContactNumber("")
    setNewVisitorCompany("")
    setNewVisitorNotes("")
    setNewVisitorPreRegistered(false)
  }

  const handleSaveNewVisitor = () => {
    if (
      !newVisitorName ||
      !newVisitorPurpose ||
      !newVisitorHost ||
      (!newVisitorContactEmail && !newVisitorContactNumber)
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields (Name, Purpose, Host, and at least one of Contact Email or Contact Number).",
      )
      return
    }

    const newEntry = {
      id: visitorData.length + 1, // Simple ID generation
      name: newVisitorName,
      purpose: newVisitorPurpose,
      host: newVisitorHost,
      entryTime: newVisitorPreRegistered ? null : new Date().toISOString(), // Set entry time if not pre-registered
      exitTime: null,
      status: newVisitorPreRegistered ? "Pre-registered" : "Signed In",
      contactEmail: newVisitorContactEmail || null, // Store email
      contactNumber: newVisitorContactNumber || null, // Store number
      company: newVisitorCompany || null,
      notes: newVisitorNotes || null,
      preRegistered: newVisitorPreRegistered,
    }

    setVisitorData((prevData) => [...prevData, newEntry])
    Alert.alert("Success", "New visitor entry created successfully!")
    closeCreateVisitorModal()
  }

  const handleSignOut = (visitorId) => {
    Alert.alert("Sign Out Visitor", "Are you sure you want to sign out this visitor?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: () => {
          setVisitorData((prevData) =>
            prevData.map((v) =>
              v.id === visitorId ? { ...v, status: "Signed Out", exitTime: new Date().toISOString() } : v,
            ),
          )
          Alert.alert("Success", "Visitor signed out successfully!")
          closeVisitorDetailModal()
        },
      },
    ])
  }

  const VisitorCard = ({ visitor }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleVisitorPress(visitor)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Icon name="account-circle" size={28} color="#6366f1" />
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} allowFontScaling={false}>
            {visitor.name}
          </Text>
          <Text style={styles.cardSubtitle} allowFontScaling={false}>
            {visitor.purpose}
          </Text>
          <Text style={styles.cardMeta} allowFontScaling={false}>
            Visiting: {visitor.host}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <Icon name={getStatusIcon(visitor.status)} size={16} color={getStatusColor(visitor.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(visitor.status) }]} allowFontScaling={false}>
            {visitor.status}
          </Text>
        </View>
        <Text style={styles.cardTime} allowFontScaling={false}>
          {visitor.status === "Signed In"
            ? `Entry: ${formatDateTime(visitor.entryTime)}`
            : visitor.status === "Signed Out"
              ? `Exit: ${formatDateTime(visitor.exitTime)}`
              : `Pre-registered`}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const VisitorDetailModal = ({ visitor, visible, onClose, onSignOut }) => {
    if (!visitor) return null

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Visitor Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Visitor Overview */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Visitor Overview
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Name
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {visitor.name}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Purpose
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {visitor.purpose}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Host
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {visitor.host}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Status
                  </Text>
                  <View style={styles.statusContainer}>
                    <Icon name={getStatusIcon(visitor.status)} size={16} color={getStatusColor(visitor.status)} />
                    <Text
                      style={[styles.statusText, { color: getStatusColor(visitor.status) }]}
                      allowFontScaling={false}
                    >
                      {visitor.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Contact & Company */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Contact Information
              </Text>
              <View style={styles.modalInfoGrid}>
                {visitor.contactEmail && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="email" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Email
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {visitor.contactEmail}
                      </Text>
                    </View>
                  </View>
                )}
                {visitor.contactNumber && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="phone" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Phone
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {visitor.contactNumber}
                      </Text>
                    </View>
                  </View>
                )}
                {!(visitor.contactEmail || visitor.contactNumber) && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="information-outline" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        No contact information provided.
                      </Text>
                    </View>
                  </View>
                )}
                {visitor.company && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="domain" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Company
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {visitor.company}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Time Tracking */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Visit Times
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="clock-in" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Entry Time
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(visitor.entryTime)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="clock-out" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Exit Time
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(visitor.exitTime)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Notes */}
            {visitor.notes && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Notes
                </Text>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText} allowFontScaling={false}>
                    {visitor.notes}
                  </Text>
                </View>
              </View>
            )}

            {/* Actions */}
            {visitor.status === "Signed In" && (
              <View style={styles.formActions}>
                <TouchableOpacity style={styles.saveButton} onPress={() => onSignOut(visitor.id)}>
                  <Text style={styles.saveButtonText} allowFontScaling={false}>
                    Sign Out Visitor
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const CreateVisitorModal = ({ visible, onClose, onSave }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Add New Visitor
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.formSection, { marginTop: 16 }]}>
              {" "}
              {/* Added marginTop here */}
              <Text style={styles.formLabel} allowFontScaling={false}>
                Visitor Name <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., John Doe"
                value={newVisitorName}
                onChangeText={setNewVisitorName}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Purpose of Visit <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {purposes
                    .filter((p) => p !== "All Purposes")
                    .map((purpose, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.filterButton, newVisitorPurpose === purpose && styles.filterButtonActive]}
                        onPress={() => setNewVisitorPurpose(purpose)}
                      >
                        <Text
                          style={[
                            styles.filterButtonText,
                            newVisitorPurpose === purpose && styles.filterButtonTextActive,
                          ]}
                          allowFontScaling={false}
                        >
                          {purpose}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Host (Person to Visit) <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {hosts
                    .filter((h) => h !== "All Hosts")
                    .map((host, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.filterButton, newVisitorHost === host && styles.filterButtonActive]}
                        onPress={() => setNewVisitorHost(host)}
                      >
                        <Text
                          style={[styles.filterButtonText, newVisitorHost === host && styles.filterButtonTextActive]}
                          allowFontScaling={false}
                        >
                          {host}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Contact Email (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., visitor@example.com"
                value={newVisitorContactEmail}
                onChangeText={setNewVisitorContactEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Contact Number (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., +919876543210"
                value={newVisitorContactNumber}
                onChangeText={setNewVisitorContactNumber}
                keyboardType="phone-pad"
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Company (Optional)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., ABC Corp"
                value={newVisitorCompany}
                onChangeText={setNewVisitorCompany}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Notes (Optional)
              </Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Any additional notes about the visit..."
                value={newVisitorNotes}
                onChangeText={setNewVisitorNotes}
                multiline
                numberOfLines={3}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setNewVisitorPreRegistered(!newVisitorPreRegistered)}
              >
                <Icon
                  name={newVisitorPreRegistered ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={24}
                  color="#6366f1"
                />
              </TouchableOpacity>
              <Text style={styles.checkboxLabel} allowFontScaling={false}>
                Pre-registered Visitor
              </Text>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText} allowFontScaling={false}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText} allowFontScaling={false}>
                  Add Visitor
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
              Visitor Book
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Manage school visitors efficiently
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddVisitor}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.addButtonText} allowFontScaling={false}>
              Add Visitor
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
            placeholder="Search by name, purpose, or host..."
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
            {visitorStatuses.map((status, index) => (
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

          <Text style={[styles.filterLabel, { marginTop: 12 }]} allowFontScaling={false}>
            Purpose:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {purposes.map((purpose, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.filterButton, selectedPurpose === purpose && styles.filterButtonActive]}
                onPress={() => setSelectedPurpose(purpose)}
              >
                <Text
                  style={[styles.filterButtonText, selectedPurpose === purpose && styles.filterButtonTextActive]}
                  allowFontScaling={false}
                >
                  {purpose}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredVisitors.length} of {visitorData.length} visitors
          </Text>
          {(selectedStatus !== "All Status" || selectedPurpose !== "All Purposes" || searchText) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedStatus("All Status")
                setSelectedPurpose("All Purposes")
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Visitor List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredVisitors}
            renderItem={({ item }) => <VisitorCard visitor={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon} allowFontScaling={false}>
                  🚶
                </Text>
                <Text style={styles.emptyTitle} allowFontScaling={false}>
                  No Visitors Found
                </Text>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No visitors match your criteria. Try adjusting filters or add a new visitor.
                </Text>
              </View>
            )}
          />
        </View>

        {/* Visitor Detail Modal */}
        <VisitorDetailModal
          visitor={selectedVisitor}
          visible={showVisitorDetailModal}
          onClose={closeVisitorDetailModal}
          onSignOut={handleSignOut}
        />
        {/* Create Visitor Modal */}
        <CreateVisitorModal
          visible={showCreateVisitorModal}
          onClose={closeCreateVisitorModal}
          onSave={handleSaveNewVisitor}
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
    paddingRight: 12, // To ensure last item isn't cut off
  },
  filterButton: {
    backgroundColor: "#ffffff",
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
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  filterButtonText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  filterButtonTextActive: {
    color: "#ffffff",
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
    backgroundColor: "#f0f9ff",
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
})

export default VisitorBook
