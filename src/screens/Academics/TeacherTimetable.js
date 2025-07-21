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
// DropdownComponent is not used as per previous request for static inputs in form

const { width } = Dimensions.get("window")

const TeacherTimetable = () => {
  const [selectedDay, setSelectedDay] = useState("All Days") // Default to show all days initially
  const [selectedClassFilter, setSelectedClassFilter] = useState("All Classes") // New state for class filter
  const [timetableData, setTimetableData] = useState([])
  const [filteredTimetable, setFilteredTimetable] = useState([])
  const [showCreateTimetableModal, setShowCreateTimetableModal] = useState(false)
  const [showClassFilterModal, setShowClassFilterModal] = useState(false) // New state for class filter modal

  // New state for create form
  const [newEntryDay, setNewEntryDay] = useState("")
  const [newEntryTime, setNewEntryTime] = useState("")
  const [newEntrySubject, setNewEntrySubject] = useState("")
  const [newEntryClass, setNewEntryClass] = useState("")
  const [newEntryRoom, setNewEntryRoom] = useState("")
  const [newEntryTeacher, setNewEntryTeacher] = useState("")

  const daysOfWeek = ["All Days", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const classesList = [
    "All Classes",
    "Grade 7",
    "Grade 8",
    "Grade 9 A",
    "Grade 9 B",
    "Grade 9 C",
    "Grade 10 A",
    "Grade 10 B",
    "Grade 11 A",
    "Grade 11 B",
    "Grade 11 C",
    "Grade 12 A",
    "Grade 12 B",
    "Grade 12 C",
    "All Grades",
  ]

  const teachersList = [
    "Mr. Amit Patel",
    "Dr. Meera Joshi",
    "Ms. Sunita Singh",
    "Mr. Vikash Kumar",
    "Mrs. Kavita Rao",
    "Mr. Deepak Gupta",
  ]

  // Sample timetable data
  const fullTimetableData = [
    {
      id: 1,
      day: "Monday",
      time: "09:00 AM - 10:00 AM",
      subject: "Mathematics",
      class: "Grade 10 A",
      room: "Room 301",
      teacher: "Mr. Amit Patel",
    },
    {
      id: 2,
      day: "Monday",
      time: "10:00 AM - 11:00 AM",
      subject: "Physics",
      class: "Grade 12 B",
      room: "Lab 2",
      teacher: "Dr. Meera Joshi",
    },
    {
      id: 3,
      day: "Monday",
      time: "11:00 AM - 12:00 PM",
      subject: "English Literature",
      class: "Grade 9 C",
      room: "Room 205",
      teacher: "Ms. Sunita Singh",
    },
    {
      id: 4,
      day: "Monday",
      time: "01:00 PM - 02:00 PM",
      subject: "Chemistry",
      class: "Grade 11 A",
      room: "Lab 1",
      teacher: "Dr. Meera Joshi",
    },
    {
      id: 5,
      day: "Tuesday",
      time: "09:00 AM - 10:00 AM",
      subject: "Biology",
      class: "Grade 10 B",
      room: "Lab 3",
      teacher: "Dr. Meera Joshi",
    },
    {
      id: 6,
      day: "Tuesday",
      time: "10:00 AM - 11:00 AM",
      subject: "History",
      class: "Grade 11 C",
      room: "Room 402",
      teacher: "Mr. Vikash Kumar",
    },
    {
      id: 7,
      day: "Tuesday",
      time: "11:00 AM - 12:00 PM",
      subject: "Algebra",
      class: "Grade 9 A",
      room: "Room 302",
      teacher: "Mr. Amit Patel",
    },
    {
      id: 8,
      day: "Wednesday",
      time: "09:00 AM - 10:00 AM",
      subject: "Computer Science",
      class: "Grade 12 A",
      room: "Computer Lab",
      teacher: "Mrs. Kavita Rao",
    },
    {
      id: 9,
      day: "Wednesday",
      time: "10:00 AM - 11:00 AM",
      subject: "Physical Education",
      class: "Grade 8",
      room: "Playground",
      teacher: "Mr. Vikash Kumar",
    },
    {
      id: 10,
      day: "Thursday",
      time: "09:00 AM - 10:00 AM",
      subject: "Economics",
      class: "Grade 12 C",
      room: "Room 401",
      teacher: "Mr. Deepak Gupta",
    },
    {
      id: 11,
      day: "Thursday",
      time: "10:00 AM - 11:00 AM",
      subject: "Geometry",
      class: "Grade 10 B",
      room: "Room 303",
      teacher: "Mr. Amit Patel",
    },
    {
      id: 12,
      day: "Friday",
      time: "09:00 AM - 10:00 AM",
      subject: "Art & Craft",
      class: "Grade 7",
      room: "Art Studio",
      teacher: "Ms. Sunita Singh",
    },
    {
      id: 13,
      day: "Friday",
      time: "10:00 AM - 11:00 AM",
      subject: "Social Studies",
      class: "Grade 9 B",
      room: "Room 201",
      teacher: "Mr. Vikash Kumar",
    },
    {
      id: 14,
      day: "Saturday",
      time: "09:00 AM - 12:00 PM",
      subject: "Extra Curricular Activities",
      class: "All Grades",
      room: "Auditorium",
      teacher: "Various",
    },
  ]

  useEffect(() => {
    setTimetableData(fullTimetableData)
    filterTimetable(fullTimetableData, selectedDay, selectedClassFilter)
  }, [])

  useEffect(() => {
    filterTimetable(timetableData, selectedDay, selectedClassFilter)
  }, [selectedDay, selectedClassFilter, timetableData])

  const filterTimetable = (data, day, classFilter) => {
    let filtered = data

    if (day !== "All Days") {
      filtered = filtered.filter((entry) => entry.day === day)
    }

    if (classFilter !== "All Classes") {
      filtered = filtered.filter((entry) => entry.class === classFilter)
    }

    // Sort by day, then by class, then by time for a more organized view
    filtered.sort((a, b) => {
      const dayOrder = daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day)
      if (dayOrder !== 0) return dayOrder

      const classComparison = a.class.localeCompare(b.class)
      if (classComparison !== 0) return classComparison

      return a.time.localeCompare(b.time)
    })
    setFilteredTimetable(filtered)
  }

  const handleCreateTimetable = () => {
    setShowCreateTimetableModal(true)
  }

  const closeCreateTimetableModal = () => {
    setShowCreateTimetableModal(false)
    // Reset form fields
    setNewEntryDay("")
    setNewEntryTime("")
    setNewEntrySubject("")
    setNewEntryClass("")
    setNewEntryRoom("")
    setNewEntryTeacher("")
  }

  const handleSaveTimetableEntry = () => {
    if (!newEntryDay || !newEntryTime || !newEntrySubject || !newEntryClass || !newEntryRoom || !newEntryTeacher) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    const newEntry = {
      id: timetableData.length + 1, // Simple ID generation
      day: newEntryDay,
      time: newEntryTime,
      subject: newEntrySubject,
      class: newEntryClass,
      room: newEntryRoom,
      teacher: newEntryTeacher,
    }

    setTimetableData((prevData) => [...prevData, newEntry])
    Alert.alert("Success", "New timetable entry created successfully!")
    closeCreateTimetableModal()
  }

  const TimetableCard = ({ entry }) => (
    <View style={styles.timetableCard}>
      <View style={styles.cardTimeContainer}>
        <Icon name="clock-outline" size={18} color="#6366f1" />
        <Text style={styles.cardTime} allowFontScaling={false}>
          {entry.time}
        </Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardSubject} allowFontScaling={false}>
          {entry.subject}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.cardMetaItem}>
            <Icon name="google-classroom" size={14} color="#6b7280" />
            <Text style={styles.cardMetaText} allowFontScaling={false}>
              {entry.class}
            </Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Icon name="map-marker" size={14} color="#6b7280" />
            <Text style={styles.cardMetaText} allowFontScaling={false}>
              {entry.room}
            </Text>
          </View>
          <View style={styles.cardMetaItem}>
            <Icon name="account" size={14} color="#6b7280" />
            <Text style={styles.cardMetaText} allowFontScaling={false}>
              {entry.teacher}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )

  const CreateTimetableModal = ({ visible, onClose, onSave }) => {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Create New Timetable Entry
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Day <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Monday"
                value={newEntryDay}
                onChangeText={setNewEntryDay}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Time Slot <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 09:00 AM - 10:00 AM"
                value={newEntryTime}
                onChangeText={setNewEntryTime}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Subject <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Advanced Physics"
                value={newEntrySubject}
                onChangeText={setNewEntrySubject}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Class <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Grade 10 A"
                value={newEntryClass}
                onChangeText={setNewEntryClass}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Room <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Room 203 / Lab 5"
                value={newEntryRoom}
                onChangeText={setNewEntryRoom}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Teacher <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Mr. Amit Patel"
                value={newEntryTeacher}
                onChangeText={setNewEntryTeacher}
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
                  Create Entry
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
              Select Class
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={classesList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.classFilterItem}
                onPress={() => {
                  onSelectClass(item)
                  onClose()
                }}
              >
                <Text
                  style={[styles.classFilterText, selectedClassFilter === item && styles.classFilterTextSelected]}
                  allowFontScaling={false}
                >
                  {item}
                </Text>
                {selectedClassFilter === item && <Icon name="check" size={20} color="#6366f1" />}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.classFilterSeparator} />}
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
              Teacher Timetable
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              View and manage daily class schedules
            </Text>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTimetable}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.createButtonText} allowFontScaling={false}>
              New Entry
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Day Selector */}
        <View style={styles.daySelectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daySelector}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, selectedDay === day && styles.dayButtonSelected]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[styles.dayButtonText, selectedDay === day && styles.dayButtonTextSelected]}
                  allowFontScaling={false}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Class Filter Button */}
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowClassFilterModal(true)}>
            <Icon name="filter-variant" size={18} color="#6366f1" />
            <Text style={styles.filterButtonText} allowFontScaling={false}>
              Class: {selectedClassFilter}
            </Text>
            <Icon name="chevron-down" size={18} color="#6366f1" />
          </TouchableOpacity>
          {(selectedDay !== "All Days" || selectedClassFilter !== "All Classes") && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedDay("All Days")
                setSelectedClassFilter("All Classes")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Timetable List */}
        <View style={styles.timetableListContainer}>
          <FlatList
            data={filteredTimetable}
            renderItem={({ item }) => <TimetableCard entry={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon} allowFontScaling={false}>
                  🗓️
                </Text>
                <Text style={styles.emptyTitle} allowFontScaling={false}>
                  No Classes Scheduled
                </Text>
                <Text style={styles.emptyText} allowFontScaling={false}>
                  No classes match your selected filters. Try adjusting them or create a new entry.
                </Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Create Timetable Modal */}
      <CreateTimetableModal
        visible={showCreateTimetableModal}
        onClose={closeCreateTimetableModal}
        onSave={handleSaveTimetableEntry}
      />

      {/* Class Filter Modal */}
      <ClassFilterModal
        visible={showClassFilterModal}
        onClose={() => setShowClassFilterModal(false)}
        onSelectClass={setSelectedClassFilter}
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
  createButton: {
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
  createButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  content: {
    flex: 1,
  },
  daySelectorContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
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
  daySelector: {
    paddingHorizontal: 12,
    alignItems: "center",
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginHorizontal: 4,
  },
  dayButtonSelected: {
    backgroundColor: "#6366f1",
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dayButtonTextSelected: {
    color: "#ffffff",
  },
  filterButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#f8f9fb", // Match background
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
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
  timetableListContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 80, // To ensure content is not hidden by bottom navigation if any
  },
  separator: {
    height: 12,
  },
  timetableCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
     borderWidth:1,
    borderColor:'#00000020'
  },
  cardTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  cardTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardDetails: {
    flex: 1,
  },
  cardSubject: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  cardMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  cardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardMetaText: {
    fontSize: 13,
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
  // Modal Styles (reused from Task.jsx)
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  classFilterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  classFilterText: {
    fontSize: 16,
    color: "#111827",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  classFilterTextSelected: {
    fontWeight: "bold",
    color: "#6366f1",
  },
  classFilterSeparator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 20,
  },
})

export default TeacherTimetable
