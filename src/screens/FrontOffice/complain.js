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

const Complain = () => {
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedType, setSelectedType] = useState("All Types")
  const [searchText, setSearchText] = useState("")
  const [complainData, setComplainData] = useState([])
  const [filteredComplains, setFilteredComplains] = useState([])
  const [selectedComplain, setSelectedComplain] = useState(null)
  const [showComplainDetailModal, setShowComplainDetailModal] = useState(false)
  const [showCreateComplainModal, setShowCreateComplainModal] = useState(false)

  // New complain form states
  const [newComplainTitle, setNewComplainTitle] = useState("")
  const [newComplainDescription, setNewComplainDescription] = useState("")
  const [newComplainRaisedBy, setNewComplainRaisedBy] = useState("")
  const [newComplainAssignedTo, setNewComplainAssignedTo] = useState("")
  const [newComplainPriority, setNewComplainPriority] = useState("Medium") // Default priority
  const [newComplainType, setNewComplainType] = useState("Other") // Declare newComplainType variable

  // Filter options
  const complainStatuses = ["All Status", "Pending", "In Progress", "Resolved", "Closed"]
  const complainTypes = ["All Types", "Academic", "Infrastructure", "Staff Behavior", "Bullying", "Facilities", "Other"]
  const raisedByOptions = ["Student", "Parent", "Teacher", "Staff", "Other"]
  const assignedToOptions = ["Admin", "Principal", "Head of Department", "Counselor", "Maintenance"]
  const priorityOptions = ["Low", "Medium", "High", "Urgent"]

  // Sample complain data
  const complainDirectoryData = [
    {
      id: 1,
      title: "Leaky Roof in Classroom 101",
      description: "Water dripping from the ceiling near the window during rain.",
      raisedBy: "Teacher",
      raisedByName: "Mrs. Priya Sharma",
      raisedDate: "2024-11-10T09:00:00Z",
      status: "In Progress",
      type: "Infrastructure",
      priority: "High",
      assignedTo: "Maintenance",
      resolutionNotes: null,
      lastUpdated: "2024-11-12T14:30:00Z",
    },
    {
      id: 2,
      title: "Issue with Library Computer",
      description: "Computer in the library (PC-05) is not turning on.",
      raisedBy: "Student",
      raisedByName: "Rahul Singh",
      raisedDate: "2024-11-08T11:15:00Z",
      status: "Resolved",
      type: "Infrastructure",
      priority: "Medium",
      assignedTo: "IT Support",
      resolutionNotes: "Replaced power supply unit. Computer is now functional.",
      lastUpdated: "2024-11-09T16:00:00Z",
    },
    {
      id: 3,
      title: "Request for Extra Classes - Math",
      description: "Students in Class 10B need extra math classes for upcoming exams.",
      raisedBy: "Parent",
      raisedByName: "Mr. Anil Kumar",
      raisedDate: "2024-11-13T10:30:00Z",
      status: "Pending",
      type: "Academic",
      priority: "Low",
      assignedTo: "Head of Department",
      resolutionNotes: null,
      lastUpdated: "2024-11-13T10:30:00Z",
    },
    {
      id: 4,
      title: "Cafeteria Food Quality",
      description: "Concerns about the hygiene and taste of food served in the cafeteria.",
      raisedBy: "Student",
      raisedByName: "Priya Verma",
      raisedDate: "2024-11-14T13:00:00Z",
      status: "Pending",
      type: "Facilities",
      priority: "Medium",
      assignedTo: "Admin",
      resolutionNotes: null,
      lastUpdated: "2024-11-14T13:00:00Z",
    },
    {
      id: 5,
      title: "Misbehavior by a Staff Member",
      description: "A non-teaching staff member was rude to a student during lunch break.",
      raisedBy: "Parent",
      raisedByName: "Mrs. Geeta Devi",
      raisedDate: "2024-11-15T09:45:00Z",
      status: "Pending",
      type: "Staff Behavior",
      priority: "High",
      assignedTo: "Principal",
      resolutionNotes: null,
      lastUpdated: "2024-11-15T09:45:00Z",
    },
  ]

  useEffect(() => {
    setComplainData(complainDirectoryData)
    filterComplains(complainDirectoryData)
  }, [])

  useEffect(() => {
    filterComplains(complainData)
  }, [selectedStatus, selectedType, searchText, complainData])

  const filterComplains = (data) => {
    let filtered = data

    // Filter by status
    if (selectedStatus && selectedStatus !== "All Status") {
      filtered = filtered.filter((complain) => complain.status === selectedStatus)
    }

    // Filter by type
    if (selectedType && selectedType !== "All Types") {
      filtered = filtered.filter((complain) => complain.type === selectedType)
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (complain) =>
          complain.title.toLowerCase().includes(searchLower) ||
          complain.description.toLowerCase().includes(searchLower) ||
          complain.raisedByName.toLowerCase().includes(searchLower) ||
          complain.assignedTo.toLowerCase().includes(searchLower) ||
          complain.type.toLowerCase().includes(searchLower),
      )
    }

    setFilteredComplains(filtered)
  }

  const getStatusColor = (status) => {
    const colors = {
      Pending: "#f59e0b", // Amber
      "In Progress": "#3b82f6", // Blue
      Resolved: "#10b981", // Green
      Closed: "#6b7280", // Gray
    }
    return colors[status] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const icons = {
      Pending: "clock-outline",
      "In Progress": "progress-wrench",
      Resolved: "check-circle-outline",
      Closed: "close-circle-outline",
    }
    return icons[status] || "help-circle"
  }

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "#10b981", // Green
      Medium: "#f59e0b", // Amber
      High: "#ef4444", // Red
      Urgent: "#dc2626", // Darker Red
    }
    return colors[priority] || "#6b7280"
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

  const handleComplainPress = (complain) => {
    setSelectedComplain(complain)
    setShowComplainDetailModal(true)
  }

  const closeComplainDetailModal = () => {
    setShowComplainDetailModal(false)
    setSelectedComplain(null)
  }

  const handleAddComplain = () => {
    setShowCreateComplainModal(true)
  }

  const closeCreateComplainModal = () => {
    setShowCreateComplainModal(false)
    // Reset form fields
    setNewComplainTitle("")
    setNewComplainDescription("")
    setNewComplainRaisedBy("")
    setNewComplainAssignedTo("")
    setNewComplainPriority("Medium")
    setNewComplainType("Other") // Reset newComplainType
  }

  const handleSaveNewComplain = () => {
    if (!newComplainTitle || !newComplainDescription || !newComplainRaisedBy || !newComplainAssignedTo) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    const newEntry = {
      id: complainData.length + 1, // Simple ID generation
      title: newComplainTitle,
      description: newComplainDescription,
      raisedBy: newComplainRaisedBy,
      raisedByName: newComplainRaisedBy, // For simplicity, using raisedBy as name
      raisedDate: new Date().toISOString(),
      status: "Pending", // New complaints start as Pending
      type: newComplainType, // Use newComplainType directly
      priority: newComplainPriority,
      assignedTo: newComplainAssignedTo,
      resolutionNotes: null,
      lastUpdated: new Date().toISOString(),
    }

    setComplainData((prevData) => [...prevData, newEntry])
    Alert.alert("Success", "New complaint registered successfully!")
    closeCreateComplainModal()
  }

  const handleUpdateComplainStatus = (complainId, newStatus) => {
    Alert.alert("Update Status", `Are you sure you want to mark this complaint as ${newStatus}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          setComplainData((prevData) =>
            prevData.map((c) =>
              c.id === complainId
                ? {
                    ...c,
                    status: newStatus,
                    lastUpdated: new Date().toISOString(),
                    resolutionNotes:
                      newStatus === "Resolved" || newStatus === "Closed"
                        ? "Resolution notes here..."
                        : c.resolutionNotes, // Placeholder
                  }
                : c,
            ),
          )
          Alert.alert("Success", `Complaint status updated to ${newStatus}!`)
          closeComplainDetailModal()
        },
      },
    ])
  }

  const ComplainCard = ({ complain }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleComplainPress(complain)} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Icon name="alert-circle-outline" size={28} color="#6366f1" />
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle} allowFontScaling={false}>
            {complain.title}
          </Text>
          <Text style={styles.cardSubtitle} allowFontScaling={false}>
            Raised by: {complain.raisedByName} ({complain.raisedBy})
          </Text>
          <Text style={styles.cardMeta} allowFontScaling={false}>
            Assigned to: {complain.assignedTo}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.statusContainer}>
          <Icon name={getStatusIcon(complain.status)} size={16} color={getStatusColor(complain.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(complain.status) }]} allowFontScaling={false}>
            {complain.status}
          </Text>
        </View>
        <View style={styles.priorityContainer}>
          <Text style={[styles.priorityText, { color: getPriorityColor(complain.priority) }]} allowFontScaling={false}>
            {complain.priority} Priority
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const ComplainDetailModal = ({ complain, visible, onClose, onUpdateStatus }) => {
    if (!complain) return null

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Complaint Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Complain Overview */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Complaint Overview
              </Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Title
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {complain.title}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Type
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {complain.type}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Raised By
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {complain.raisedByName} ({complain.raisedBy})
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Assigned To
                  </Text>
                  <Text style={styles.summaryValue} allowFontScaling={false}>
                    {complain.assignedTo}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Priority
                  </Text>
                  <Text
                    style={[styles.summaryValue, { color: getPriorityColor(complain.priority) }]}
                    allowFontScaling={false}
                  >
                    {complain.priority}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text style={styles.summaryLabel} allowFontScaling={false}>
                    Status
                  </Text>
                  <View style={styles.statusContainer}>
                    <Icon name={getStatusIcon(complain.status)} size={16} color={getStatusColor(complain.status)} />
                    <Text
                      style={[styles.statusText, { color: getStatusColor(complain.status) }]}
                      allowFontScaling={false}
                    >
                      {complain.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Description
              </Text>
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionText} allowFontScaling={false}>
                  {complain.description}
                </Text>
              </View>
            </View>

            {/* Timestamps */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Timeline
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-plus" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Raised Date
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(complain.raisedDate)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="update" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Last Updated
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDateTime(complain.lastUpdated)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Resolution Notes */}
            {complain.resolutionNotes && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Resolution Notes
                </Text>
                <View style={styles.descriptionCard}>
                  <Text style={styles.descriptionText} allowFontScaling={false}>
                    {complain.resolutionNotes}
                  </Text>
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.formActions}>
              {complain.status === "Pending" && (
                <TouchableOpacity style={styles.saveButton} onPress={() => onUpdateStatus(complain.id, "In Progress")}>
                  <Text style={styles.saveButtonText} allowFontScaling={false}>
                    Mark In Progress
                  </Text>
                </TouchableOpacity>
              )}
              {(complain.status === "In Progress" || complain.status === "Pending") && (
                <TouchableOpacity style={styles.saveButton} onPress={() => onUpdateStatus(complain.id, "Resolved")}>
                  <Text style={styles.saveButtonText} allowFontScaling={false}>
                    Mark Resolved
                  </Text>
                </TouchableOpacity>
              )}
              {complain.status === "Resolved" && (
                <TouchableOpacity style={styles.saveButton} onPress={() => onUpdateStatus(complain.id, "Closed")}>
                  <Text style={styles.saveButtonText} allowFontScaling={false}>
                    Mark Closed
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const CreateComplainModal = ({ visible, onClose, onSave }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Register New Complaint
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.formSection, { marginTop: 16 }]}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Complaint Title <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Broken chair in lab"
                value={newComplainTitle}
                onChangeText={setNewComplainTitle}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Description <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Provide detailed description of the issue..."
                value={newComplainDescription}
                onChangeText={setNewComplainDescription}
                multiline
                numberOfLines={4}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Raised By <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {raisedByOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterButton, newComplainRaisedBy === option && styles.filterButtonActive]}
                      onPress={() => setNewComplainRaisedBy(option)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          newComplainRaisedBy === option && styles.filterButtonTextActive,
                        ]}
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
                Assigned To <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {assignedToOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterButton, newComplainAssignedTo === option && styles.filterButtonActive]}
                      onPress={() => setNewComplainAssignedTo(option)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          newComplainAssignedTo === option && styles.filterButtonTextActive,
                        ]}
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
                Priority
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {priorityOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterButton, newComplainPriority === option && styles.filterButtonActive]}
                      onPress={() => setNewComplainPriority(option)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          newComplainPriority === option && styles.filterButtonTextActive,
                        ]}
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
                Type
              </Text>
              <View style={styles.filterOptionsContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  {complainTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterButton, newComplainType === type && styles.filterButtonActive]}
                      onPress={() => setNewComplainType(type)}
                    >
                      <Text
                        style={[styles.filterButtonText, newComplainType === type && styles.filterButtonTextActive]}
                        allowFontScaling={false}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText} allowFontScaling={false}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText} allowFontScaling={false}>
                  Register Complaint
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
              Complaint Management
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Track and resolve school complaints
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddComplain}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.addButtonText} allowFontScaling={false}>
              Add Complaint
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
            placeholder="Search by title, description, or raised by..."
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
            {complainStatuses.map((status, index) => (
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
            Type:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {complainTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.filterButton, selectedType === type && styles.filterButtonActive]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[styles.filterButtonText, selectedType === type && styles.filterButtonTextActive]}
                  allowFontScaling={false}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredComplains.length} of {complainData.length} complaints
          </Text>
          {(selectedStatus !== "All Status" || selectedType !== "All Types" || searchText) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedStatus("All Status")
                setSelectedType("All Types")
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Complain List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredComplains}
            renderItem={({ item }) => <ComplainCard complain={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon} allowFontScaling={false}>
                  📝
                </Text>
                <Text style={styles.emptyTitle} allowFontScaling={false}>
                  No Complaints Found
                </Text>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No complaints match your criteria. Try adjusting filters or register a new complaint.
                </Text>
              </View>
            )}
          />
        </View>

        {/* Complain Detail Modal */}
        <ComplainDetailModal
          complain={selectedComplain}
          visible={showComplainDetailModal}
          onClose={closeComplainDetailModal}
          onUpdateStatus={handleUpdateComplainStatus}
        />
        {/* Create Complain Modal */}
        <CreateComplainModal
          visible={showCreateComplainModal}
          onClose={closeCreateComplainModal}
          onSave={handleSaveNewComplain}
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
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6366f1",
    gap: 6,
  },
  addButtonText: {
    color: "#6366f1",
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
    paddingRight: 12,
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
  priorityContainer: {
    // No specific styles needed if just text
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
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

export default Complain
