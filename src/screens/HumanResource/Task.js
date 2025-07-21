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
import DropdownComponent from "./DropdownComponent" // Import DropdownComponent

const { width } = Dimensions.get("window")

const Task = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedAssignee, setSelectedAssignee] = useState("")
  const [searchText, setSearchText] = useState("")
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)
  const [taskData, setTaskData] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("") // Added selectedMonth state

  // Filter options
  const departments = [
    "All Departments",
    "Administration",
    "Academic",
    "Science",
    "Mathematics",
    "English",
    "Social Studies",
    "Physical Education",
    "Arts & Crafts",
    "Library",
    "IT Department",
    "Counseling",
    "Support Staff",
    "Maintenance",
  ]

  const priorities = ["All Priorities", "Low", "Medium", "High", "Urgent"]

  const taskStatuses = ["All Status", "Not Started", "In Progress", "Completed", "Overdue", "On Hold"]

  const assignees = [
    "All Assignees",
    "Dr. Rajesh Kumar",
    "Mrs. Priya Sharma",
    "Mr. Amit Patel",
    "Ms. Sunita Singh",
    "Dr. Meera Joshi",
    "Mr. Vikash Kumar",
    "Mrs. Kavita Rao",
    "Mr. Deepak Gupta",
    "Support Staff", // Added Support Staff as an assignee
  ]

  // Sample task data
  const taskDirectoryData = [
    {
      id: 1,
      title: "Prepare Annual Budget Report",
      description:
        "Compile and analyze the annual budget report for the academic year 2024-25, including all departmental expenses and revenue projections.",
      category: "Administrative",
      department: "Administration",
      priority: "High",
      status: "In Progress",
      assignedTo: "Dr. Rajesh Kumar",
      assignedBy: "Board of Directors",
      createdDate: "2024-11-01",
      dueDate: "2024-12-15",
      completedDate: null,
      progress: 65,
      tags: ["Budget", "Finance", "Annual Report"],
      comments: [
        {
          id: 1,
          author: "Dr. Rajesh Kumar",
          message: "Started working on revenue analysis section",
          timestamp: "2024-11-10 10:30 AM",
        },
        {
          id: 2,
          author: "Mrs. Priya Sharma",
          message: "Please include sports department expenses",
          timestamp: "2024-11-12 02:15 PM",
        },
      ],
      attachments: ["budget_template.xlsx", "previous_year_report.pdf"],
      estimatedHours: 40,
      actualHours: 26,
    },
    {
      id: 2,
      title: "Organize Science Fair 2024",
      description:
        "Plan and execute the annual science fair including venue booking, judge coordination, and student registration management.",
      category: "Event Planning",
      department: "Science",
      priority: "Medium",
      status: "Not Started",
      assignedTo: "Dr. Meera Joshi",
      assignedBy: "Dr. Rajesh Kumar",
      createdDate: "2024-11-05",
      dueDate: "2024-12-20",
      completedDate: null,
      progress: 0,
      tags: ["Science Fair", "Event", "Students"],
      comments: [],
      attachments: ["science_fair_guidelines.pdf"],
      estimatedHours: 30,
      actualHours: 0,
    },
    {
      id: 3,
      title: "Update Library Management System",
      description: "Upgrade the current library management software and migrate all book records to the new system.",
      category: "IT & Technology",
      department: "Library",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Mrs. Kavita Rao",
      assignedBy: "Dr. Rajesh Kumar",
      createdDate: "2024-10-15",
      dueDate: "2024-11-30",
      completedDate: null,
      progress: 80,
      tags: ["Library", "Software", "Upgrade"],
      comments: [
        {
          id: 1,
          author: "Mrs. Kavita Rao",
          message: "Data migration is 80% complete",
          timestamp: "2024-11-14 11:00 AM",
        },
      ],
      attachments: ["system_requirements.pdf", "migration_plan.docx"],
      estimatedHours: 25,
      actualHours: 20,
    },
    {
      id: 4,
      title: "Conduct Fire Safety Drill",
      description: "Organize and conduct quarterly fire safety drill for all students and staff members.",
      category: "Safety & Security",
      department: "Administration",
      priority: "Urgent",
      status: "Overdue",
      assignedTo: "Mr. Vikash Kumar",
      assignedBy: "Mrs. Priya Sharma",
      createdDate: "2024-10-01",
      dueDate: "2024-11-10",
      completedDate: null,
      progress: 30,
      tags: ["Safety", "Drill", "Emergency"],
      comments: [
        {
          id: 1,
          author: "Mr. Vikash Kumar",
          message: "Waiting for fire department coordination",
          timestamp: "2024-11-08 09:00 AM",
        },
      ],
      attachments: ["safety_protocol.pdf"],
      estimatedHours: 8,
      actualHours: 2,
    },
    {
      id: 5,
      title: "Prepare Mid-term Exam Schedule",
      description:
        "Create comprehensive mid-term examination schedule for all classes and coordinate with subject teachers.",
      category: "Academic",
      department: "Academic",
      priority: "High",
      status: "Completed",
      assignedTo: "Mrs. Priya Sharma",
      assignedBy: "Dr. Rajesh Kumar",
      createdDate: "2024-10-20",
      dueDate: "2024-11-15",
      completedDate: "2024-11-12",
      progress: 100,
      tags: ["Exam", "Schedule", "Academic"],
      comments: [
        {
          id: 1,
          author: "Mrs. Priya Sharma",
          message: "Schedule finalized and distributed to all teachers",
          timestamp: "2024-11-12 04:30 PM",
        },
      ],
      attachments: ["exam_schedule.pdf", "teacher_guidelines.docx"],
      estimatedHours: 15,
      actualHours: 12,
    },
    {
      id: 6,
      title: "Repair Classroom Air Conditioners",
      description: "Service and repair air conditioning units in classrooms 101, 205, and 308.",
      category: "Maintenance",
      department: "Maintenance",
      priority: "Medium",
      status: "On Hold",
      assignedTo: "Support Staff",
      assignedBy: "Mrs. Priya Sharma",
      createdDate: "2024-11-08",
      dueDate: "2024-11-25",
      completedDate: null,
      progress: 20,
      tags: ["Maintenance", "AC Repair", "Classroom"],
      comments: [
        {
          id: 1,
          author: "Support Staff",
          message: "Waiting for spare parts delivery",
          timestamp: "2024-11-13 01:00 PM",
        },
      ],
      attachments: ["maintenance_request.pdf"],
      estimatedHours: 12,
      actualHours: 2,
    },
    {
      id: 7,
      title: "Student Counseling Session Planning",
      description:
        "Plan and schedule individual counseling sessions for students requiring academic and personal guidance.",
      category: "Student Support",
      department: "Counseling",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Mr. Deepak Gupta",
      assignedBy: "Mrs. Priya Sharma",
      createdDate: "2024-11-01",
      dueDate: "2024-12-01",
      completedDate: null,
      progress: 45,
      tags: ["Counseling", "Students", "Support"],
      comments: [
        {
          id: 1,
          author: "Mr. Deepak Gupta",
          message: "Scheduled sessions for 15 students so far",
          timestamp: "2024-11-14 10:15 AM",
        },
      ],
      attachments: ["counseling_plan.docx"],
      estimatedHours: 20,
      actualHours: 9,
    },
    {
      id: 8,
      title: "Mathematics Olympiad Preparation",
      description:
        "Prepare students for the upcoming Mathematics Olympiad competition and coordinate training sessions.",
      category: "Academic",
      department: "Mathematics",
      priority: "High",
      status: "In Progress",
      assignedTo: "Mr. Amit Patel",
      assignedBy: "Dr. Rajesh Kumar",
      createdDate: "2024-10-25",
      dueDate: "2024-12-10",
      completedDate: null,
      progress: 70,
      tags: ["Mathematics", "Competition", "Students"],
      comments: [
        {
          id: 1,
          author: "Mr. Amit Patel",
          message: "Training sessions going well, students showing good progress",
          timestamp: "2024-11-13 03:45 PM",
        },
      ],
      attachments: ["olympiad_syllabus.pdf", "practice_problems.pdf"],
      estimatedHours: 35,
      actualHours: 24,
    },
  ]

  const taskCategories = [
    "Administrative",
    "Academic",
    "Event Planning",
    "IT & Technology",
    "Safety & Security",
    "Maintenance",
    "Student Support",
  ]

  useEffect(() => {
    setTaskData(taskDirectoryData)
    filterTasks(taskDirectoryData)
  }, [])

  useEffect(() => {
    filterTasks(taskData)
  }, [selectedDepartment, selectedMonth, selectedStatus, selectedAssignee, searchText, taskData])

  const filterTasks = (data) => {
    let filtered = data

    // Filter by department
    if (selectedDepartment && selectedDepartment !== "All Departments") {
      filtered = filtered.filter((task) => task.department === selectedDepartment)
    }

    // Filter by priority
    if (selectedPriority && selectedPriority !== "All Priorities") {
      filtered = filtered.filter((task) => task.priority === selectedPriority)
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "All Status") {
      filtered = filtered.filter((task) => task.status === selectedStatus)
    }

    // Filter by assignee
    if (selectedAssignee && selectedAssignee !== "All Assignees") {
      filtered = filtered.filter((task) => task.assignedTo === selectedAssignee)
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.category.toLowerCase().includes(searchLower) ||
          task.assignedTo.toLowerCase().includes(searchLower) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    setFilteredTasks(filtered)
  }

  const closeAllDropdowns = () => {
    setShowDepartmentDropdown(false)
    setShowPriorityDropdown(false)
    setShowStatusDropdown(false)
    setShowAssigneeDropdown(false)
  }

  const getPriorityColor = (priority) => {
    const colors = {
      Low: "#10b981",
      Medium: "#f59e0b",
      High: "#ef4444",
      Urgent: "#dc2626",
    }
    return colors[priority] || "#6b7280"
  }

  const getStatusColor = (status) => {
    const colors = {
      "Not Started": "#6b7280",
      "In Progress": "#3b82f6",
      Completed: "#10b981",
      Overdue: "#ef4444",
      "On Hold": "#f59e0b",
    }
    return colors[status] || "#6b7280"
  }

  const getStatusIcon = (status) => {
    const icons = {
      "Not Started": "clock-outline",
      "In Progress": "progress-clock",
      Completed: "check-circle",
      Overdue: "alert-circle",
      "On Hold": "pause-circle",
    }
    return icons[status] || "help-circle"
  }

  const getPriorityIcon = (priority) => {
    const icons = {
      Low: "arrow-down",
      Medium: "minus",
      High: "arrow-up",
      Urgent: "fire",
    }
    return icons[priority] || "help-circle"
  }

  const getCategoryIcon = (category) => {
    const icons = {
      Administrative: "briefcase",
      Academic: "school",
      "Event Planning": "calendar-star",
      "IT & Technology": "laptop",
      "Safety & Security": "shield-check",
      Maintenance: "wrench",
      "Student Support": "account-heart",
    }
    return icons[category] || "folder"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysRemaining = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleTaskPress = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const closeTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  const handleCreateTask = () => {
    setShowCreateModal(true)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
  }

  const handleAddNewTask = (newTask) => {
    const newId = taskData.length > 0 ? Math.max(...taskData.map((t) => t.id)) + 1 : 1
    const taskToAdd = {
      id: newId,
      createdDate: new Date().toISOString().split("T")[0],
      completedDate: null,
      progress: 0,
      comments: [],
      attachments: [],
      actualHours: 0,
      assignedBy: "Admin", // Default for new tasks
      ...newTask,
      tags: newTask.tags ? newTask.tags.split(",").map((tag) => tag.trim()) : [],
    }
    setTaskData((prevData) => [...prevData, taskToAdd])
    filterTasks([...taskData, taskToAdd]) // Re-filter with new data
    Alert.alert("Success", `Task "${newTask.title}" added successfully!`)
    closeCreateModal()
  }

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    Alert.alert("Update Status", `Change task status to "${newStatus}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: () => {
          setTaskData((prevData) =>
            prevData.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    status: newStatus,
                    completedDate: newStatus === "Completed" ? new Date().toISOString().split("T")[0] : null,
                    progress: newStatus === "Completed" ? 100 : task.progress,
                  }
                : task,
            ),
          )
          Alert.alert("Success", `Task status updated to "${newStatus}"`)
          closeTaskModal()
        },
      },
    ])
  }

  const TaskCard = ({ task }) => {
    const daysRemaining = getDaysRemaining(task.dueDate)
    const isOverdue = daysRemaining < 0 && task.status !== "Completed"

    return (
      <TouchableOpacity style={styles.taskCard} onPress={() => handleTaskPress(task)} activeOpacity={0.7}>
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <View style={styles.taskTitleRow}>
              <View style={styles.categoryContainer}>
                <Icon name={getCategoryIcon(task.category)} size={16} color="#6366f1" />
                <Text style={styles.categoryText} allowFontScaling={false}>
                  {task.category}
                </Text>
              </View>
              <View style={styles.priorityContainer}>
                <Icon name={getPriorityIcon(task.priority)} size={14} color={getPriorityColor(task.priority)} />
                <Text
                  style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}
                  allowFontScaling={false}
                >
                  {task.priority}
                </Text>
              </View>
            </View>
            <Text style={styles.taskTitle} allowFontScaling={false}>
              {task.title}
            </Text>
            <Text style={styles.taskDescription} allowFontScaling={false} numberOfLines={2}>
              {task.description}
            </Text>
            <View style={styles.taskMeta}>
              <View style={styles.assigneeInfo}>
                <Icon name="account" size={14} color="#6b7280" />
                <Text style={styles.assigneeText} allowFontScaling={false}>
                  {task.assignedTo}
                </Text>
              </View>
              <View style={styles.departmentInfo}>
                <Icon name="domain" size={14} color="#6b7280" />
                <Text style={styles.departmentText} allowFontScaling={false}>
                  {task.department}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.taskFooter}>
          <View style={styles.statusContainer}>
            <Icon name={getStatusIcon(task.status)} size={16} color={getStatusColor(task.status)} />
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]} allowFontScaling={false}>
              {task.status}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
            </View>
            <Text style={styles.progressText} allowFontScaling={false}>
              {task.progress}%
            </Text>
          </View>
          <View style={styles.dueDateContainer}>
            <Icon name="calendar" size={14} color={isOverdue ? "#ef4444" : "#6b7280"} />
            <Text style={[styles.dueDateText, { color: isOverdue ? "#ef4444" : "#6b7280" }]} allowFontScaling={false}>
              {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const TaskDetailModal = ({ task, visible, onClose }) => {
    if (!task) return null

    const daysRemaining = getDaysRemaining(task.dueDate)
    const isOverdue = daysRemaining < 0 && task.status !== "Completed"

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Task Details
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Task Header */}
            <View style={styles.modalTaskHeader}>
              <View style={styles.modalCategoryRow}>
                <View style={styles.modalCategoryContainer}>
                  <Icon name={getCategoryIcon(task.category)} size={20} color="#6366f1" />
                  <Text style={styles.modalCategoryText} allowFontScaling={false}>
                    {task.category}
                  </Text>
                </View>
                <View style={styles.modalPriorityContainer}>
                  <Icon name={getPriorityIcon(task.priority)} size={16} color={getPriorityColor(task.priority)} />
                  <Text
                    style={[styles.modalPriorityText, { color: getPriorityColor(task.priority) }]}
                    allowFontScaling={false}
                  >
                    {task.priority}
                  </Text>
                </View>
              </View>
              <Text style={styles.modalTaskTitle} allowFontScaling={false}>
                {task.title}
              </Text>
              <Text style={styles.modalTaskDescription} allowFontScaling={false}>
                {task.description}
              </Text>
            </View>

            {/* Status and Progress */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Status & Progress
              </Text>
              <View style={styles.statusProgressCard}>
                <View style={styles.statusProgressRow}>
                  <View style={styles.modalStatusContainer}>
                    <Icon name={getStatusIcon(task.status)} size={18} color={getStatusColor(task.status)} />
                    <Text
                      style={[styles.modalStatusText, { color: getStatusColor(task.status) }]}
                      allowFontScaling={false}
                    >
                      {task.status}
                    </Text>
                  </View>
                  <View style={styles.modalProgressContainer}>
                    <View style={styles.modalProgressBar}>
                      <View style={[styles.modalProgressFill, { width: `${task.progress}%` }]} />
                    </View>
                    <Text style={styles.modalProgressText} allowFontScaling={false}>
                      {task.progress}%
                    </Text>
                  </View>
                </View>
                <View style={styles.statusActions}>
                  <TouchableOpacity
                    style={[styles.statusActionButton, { backgroundColor: "#3b82f6" }]}
                    onPress={() => handleUpdateTaskStatus(task.id, "In Progress")}
                  >
                    <Text style={styles.statusActionText} allowFontScaling={false}>
                      Start
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusActionButton, { backgroundColor: "#10b981" }]}
                    onPress={() => handleUpdateTaskStatus(task.id, "Completed")}
                  >
                    <Text style={styles.statusActionText} allowFontScaling={false}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusActionButton, { backgroundColor: "#f59e0b" }]}
                    onPress={() => handleUpdateTaskStatus(task.id, "On Hold")}
                  >
                    <Text style={styles.statusActionText} allowFontScaling={false}>
                      Hold
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Task Information */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Task Information
              </Text>
              <View style={styles.modalInfoGrid}>
                <View style={styles.modalInfoItem}>
                  <Icon name="account" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Assigned To
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {task.assignedTo}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="account-supervisor" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Assigned By
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {task.assignedBy}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="domain" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Department
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {task.department}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-plus" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Created Date
                    </Text>
                    <Text style={styles.modalInfoValue} allowFontScaling={false}>
                      {formatDate(task.createdDate)}
                    </Text>
                  </View>
                </View>
                <View style={styles.modalInfoItem}>
                  <Icon name="calendar-clock" size={16} color="#6b7280" />
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                      Due Date
                    </Text>
                    <Text
                      style={[styles.modalInfoValue, { color: isOverdue ? "#ef4444" : "#111827" }]}
                      allowFontScaling={false}
                    >
                      {formatDate(task.dueDate)}
                      {isOverdue && " (Overdue)"}
                    </Text>
                  </View>
                </View>
                {task.completedDate && (
                  <View style={styles.modalInfoItem}>
                    <Icon name="calendar-check" size={16} color="#6b7280" />
                    <View style={styles.modalInfoText}>
                      <Text style={styles.modalInfoLabel} allowFontScaling={false}>
                        Completed Date
                      </Text>
                      <Text style={styles.modalInfoValue} allowFontScaling={false}>
                        {formatDate(task.completedDate)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Time Tracking */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                Time Tracking
              </Text>
              <View style={styles.timeTrackingCard}>
                <View style={styles.timeTrackingRow}>
                  <View style={styles.timeTrackingItem}>
                    <Icon name="clock-outline" size={18} color="#6b7280" />
                    <Text style={styles.timeTrackingLabel} allowFontScaling={false}>
                      Estimated
                    </Text>
                    <Text style={styles.timeTrackingValue} allowFontScaling={false}>
                      {task.estimatedHours}h
                    </Text>
                  </View>
                  <View style={styles.timeTrackingItem}>
                    <Icon name="clock" size={18} color="#6b7280" />
                    <Text style={styles.timeTrackingLabel} allowFontScaling={false}>
                      Actual
                    </Text>
                    <Text style={styles.timeTrackingValue} allowFontScaling={false}>
                      {task.actualHours}h
                    </Text>
                  </View>
                  <View style={styles.timeTrackingItem}>
                    <Icon name="clock-fast" size={18} color="#6b7280" />
                    <Text style={styles.timeTrackingLabel} allowFontScaling={false}>
                      Remaining
                    </Text>
                    <Text style={styles.timeTrackingValue} allowFontScaling={false}>
                      {Math.max(0, task.estimatedHours - task.actualHours)}h
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Tags */}
            {task.tags.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Tags
                </Text>
                <View style={styles.tagsContainer}>
                  {task.tags.map((tag, index) => (
                    <View key={index} style={styles.tagBadge}>
                      <Text style={styles.tagText} allowFontScaling={false}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Attachments */}
            {task.attachments.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Attachments
                </Text>
                <View style={styles.attachmentsList}>
                  {task.attachments.map((attachment, index) => (
                    <TouchableOpacity key={index} style={styles.attachmentItem}>
                      <Icon name="file-document" size={16} color="#6366f1" />
                      <Text style={styles.attachmentText} allowFontScaling={false}>
                        {attachment}
                      </Text>
                      <Icon name="download" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Comments */}
            {task.comments.length > 0 && (
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle} allowFontScaling={false}>
                  Comments
                </Text>
                <View style={styles.commentsList}>
                  {task.comments.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor} allowFontScaling={false}>
                          {comment.author}
                        </Text>
                        <Text style={styles.commentTimestamp} allowFontScaling={false}>
                          {comment.timestamp}
                        </Text>
                      </View>
                      <Text style={styles.commentMessage} allowFontScaling={false}>
                        {comment.message}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  const CreateTaskModal = ({
    visible,
    onClose,
    onSubmit,
    departments,
    priorities,
    taskStatuses,
    assignees,
    taskCategories,
  }) => {
    const [newTask, setNewTask] = useState({
      title: "",
      description: "",
      category: "",
      department: "",
      priority: "Medium", // Default priority
      status: "Not Started", // Default status
      assignedTo: "",
      dueDate: "",
      estimatedHours: "",
      tags: "",
    })

    // State for each dropdown's open/close status
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
    const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false)
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
    const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false)

    const closeAllModalDropdowns = () => {
      setIsCategoryDropdownOpen(false)
      setIsDepartmentDropdownOpen(false)
      setIsPriorityDropdownOpen(false)
      setIsAssigneeDropdownOpen(false)
    }

    const handleInputChange = (field, value) => {
      setNewTask((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
      if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.dueDate) {
        Alert.alert("Error", "Please fill in all required fields (Title, Description, Assigned To, Due Date).")
        return
      }
      onSubmit(newTask)
      setNewTask({
        title: "",
        description: "",
        category: "",
        department: "",
        priority: "Medium",
        status: "Not Started",
        assignedTo: "",
        dueDate: "",
        estimatedHours: "",
        tags: "",
      })
    }

    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} allowFontScaling={false}>
              Create New Task
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Task Title <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Prepare Q4 Financial Report"
                value={newTask.title}
                onChangeText={(text) => handleInputChange("title", text)}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Description <Text style={styles.requiredIndicator}>*</Text>
              </Text>
              <TextInput
                style={[styles.formInput, styles.multilineInput]}
                placeholder="Provide a detailed description of the task..."
                value={newTask.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline
                numberOfLines={4}
                allowFontScaling={false}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel} allowFontScaling={false}>
                  Category
                </Text>
                <DropdownComponent
                  label=""
                  value={newTask.category}
                  options={["", ...taskCategories]} // Add empty option for placeholder
                  isOpen={isCategoryDropdownOpen}
                  onToggle={() => {
                    closeAllModalDropdowns()
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }}
                  onSelect={(value) => {
                    handleInputChange("category", value)
                    setIsCategoryDropdownOpen(false)
                  }}
                  placeholder="Select Category"
                  style={styles.formDropdown}
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel} allowFontScaling={false}>
                  Department
                </Text>
                <DropdownComponent
                  label=""
                  value={newTask.department}
                  options={["", ...departments.filter((d) => d !== "All Departments")]}
                  isOpen={isDepartmentDropdownOpen}
                  onToggle={() => {
                    closeAllModalDropdowns()
                    setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)
                  }}
                  onSelect={(value) => {
                    handleInputChange("department", value)
                    setIsDepartmentDropdownOpen(false)
                  }}
                  placeholder="Select Department"
                  style={styles.formDropdown}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel} allowFontScaling={false}>
                  Priority
                </Text>
                <DropdownComponent
                  label=""
                  value={newTask.priority}
                  options={priorities.filter((p) => p !== "All Priorities")}
                  isOpen={isPriorityDropdownOpen}
                  onToggle={() => {
                    closeAllModalDropdowns()
                    setIsPriorityDropdownOpen(!isPriorityDropdownOpen)
                  }}
                  onSelect={(value) => {
                    handleInputChange("priority", value)
                    setIsPriorityDropdownOpen(false)
                  }}
                  placeholder="Select Priority"
                  style={styles.formDropdown}
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel} allowFontScaling={false}>
                  Assigned To <Text style={styles.requiredIndicator}>*</Text>
                </Text>
                <DropdownComponent
                  label=""
                  value={newTask.assignedTo}
                  options={assignees.filter((a) => a !== "All Assignees")}
                  isOpen={isAssigneeDropdownOpen}
                  onToggle={() => {
                    closeAllModalDropdowns()
                    setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)
                  }}
                  onSelect={(value) => {
                    handleInputChange("assignedTo", value)
                    setIsAssigneeDropdownOpen(false)
                  }}
                  placeholder="Select Assignee"
                  style={styles.formDropdown}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel} allowFontScaling={false}>
                  Due Date <Text style={styles.requiredIndicator}>*</Text>
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="YYYY-MM-DD"
                  keyboardType="number-pad"
                  value={newTask.dueDate}
                  onChangeText={(text) => handleInputChange("dueDate", text)}
                  allowFontScaling={false}
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.formLabel} allowFontScaling={false}>
                  Estimated Hours
                </Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., 8"
                  keyboardType="numeric"
                  value={newTask.estimatedHours.toString()}
                  onChangeText={(text) => handleInputChange("estimatedHours", text)}
                  allowFontScaling={false}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel} allowFontScaling={false}>
                Tags (comma-separated)
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., report, finance, admin"
                value={newTask.tags}
                onChangeText={(text) => handleInputChange("tags", text)}
                allowFontScaling={false}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Icon name="content-save" size={20} color="#ffffff" />
              <Text style={styles.submitButtonText} allowFontScaling={false}>
                Add Task
              </Text>
            </TouchableOpacity>
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
              Task Management
            </Text>
            <Text style={styles.headerSubtitle} allowFontScaling={false}>
              Track and manage school tasks efficiently
            </Text>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
            <Icon name="plus" size={18} color="#6366f1" />
            {/* <Text style={styles.createButtonText} allowFontScaling={false}>
              New Task
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
            placeholder="Search tasks by title, description, or tags..."
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
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Department"
              value={selectedDepartment}
              options={departments}
              isOpen={showDepartmentDropdown}
              onToggle={() => {
                setShowDepartmentDropdown(!showDepartmentDropdown)
                setShowPriorityDropdown(false)
                setShowStatusDropdown(false)
                setShowAssigneeDropdown(false)
              }}
              onSelect={(department) => {
                setSelectedDepartment(department)
                setShowDepartmentDropdown(false)
              }}
              placeholder="All Departments"
            />
            <DropdownComponent
              label="Priority"
              value={selectedPriority}
              options={priorities}
              isOpen={showPriorityDropdown}
              onToggle={() => {
                setShowPriorityDropdown(!showPriorityDropdown)
                setShowDepartmentDropdown(false)
                setShowStatusDropdown(false)
                setShowAssigneeDropdown(false)
              }}
              onSelect={(priority) => {
                setSelectedPriority(priority)
                setShowPriorityDropdown(false)
              }}
              placeholder="All Priorities"
            />
          </View>
          <View style={styles.dropdownRow}>
            <DropdownComponent
              label="Status"
              value={selectedStatus}
              options={taskStatuses}
              isOpen={showStatusDropdown}
              onToggle={() => {
                setShowStatusDropdown(!showStatusDropdown)
                setShowDepartmentDropdown(false)
                setShowPriorityDropdown(false)
                setShowAssigneeDropdown(false)
              }}
              onSelect={(status) => {
                setSelectedStatus(status)
                setShowStatusDropdown(false)
              }}
              placeholder="All Status"
            />
            <DropdownComponent
              label="Assignee"
              value={selectedAssignee}
              options={assignees}
              isOpen={showAssigneeDropdown}
              onToggle={() => {
                setShowAssigneeDropdown(!showAssigneeDropdown)
                setShowDepartmentDropdown(false)
                setShowPriorityDropdown(false)
                setShowStatusDropdown(false)
              }}
              onSelect={(assignee) => {
                setSelectedAssignee(assignee)
                setShowAssigneeDropdown(false)
              }}
              placeholder="All Assignees"
            />
          </View>
        </View>

        {/* Results Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText} allowFontScaling={false}>
            Showing {filteredTasks.length} of {taskData.length} tasks
          </Text>
          {(selectedDepartment || selectedPriority || selectedStatus || selectedAssignee || searchText) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedDepartment("")
                setSelectedPriority("")
                setSelectedStatus("")
                setSelectedAssignee("")
                setSearchText("")
              }}
            >
              <Text style={styles.clearFiltersText} allowFontScaling={false}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeAllDropdowns}>
          {/* Task List */}
          <View style={styles.taskContainer}>
            <FlatList
              data={filteredTasks}
              renderItem={({ item }) => <TaskCard task={item} />}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon} allowFontScaling={false}>
                    📋
                  </Text>
                  <Text style={styles.emptyTitle} allowFontScaling={false}>
                    No Tasks Found
                  </Text>
                  <Text style={styles.emptyText} allowFontScaling={false}>
                    No tasks match your search criteria. Try adjusting your filters or create a new task.
                  </Text>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>

        {/* Task Detail Modal */}
        <TaskDetailModal task={selectedTask} visible={showTaskModal} onClose={closeTaskModal} />
        {/* Create Task Modal */}
        <CreateTaskModal
          visible={showCreateModal}
          onClose={closeCreateModal}
          onSubmit={handleAddNewTask}
          departments={departments}
          priorities={priorities}
          taskStatuses={taskStatuses}
          assignees={assignees}
          taskCategories={taskCategories}
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
  createButton: {
    backgroundColor: "#ffffffff",
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
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
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
  overlay: {
    flex: 1,
  },
  taskContainer: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  separator: {
    height: 12,
  },
  taskCard: {
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
  taskHeader: {
    marginBottom: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  taskDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  assigneeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  assigneeText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  departmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  departmentText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  taskFooter: {
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
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginHorizontal: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
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
  // Modal Styles
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
  modalTaskHeader: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 20,
  },
  modalCategoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  modalCategoryText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalPriorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalPriorityText: {
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalTaskTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalTaskDescription: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: "center",
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
  statusProgressCard: {
    backgroundColor: "#f8f9fb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalStatusText: {
    fontSize: 16,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  modalProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginLeft: 16,
  },
  modalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  modalProgressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  modalProgressText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  statusActions: {
    flexDirection: "row",
    gap: 8,
  },
  statusActionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  statusActionText: {
    color: "#ffffff",
    fontSize: 12,
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
    padding: 12,
    borderRadius: 8,
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
  timeTrackingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  timeTrackingRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  timeTrackingItem: {
    alignItems: "center",
    gap: 4,
  },
  timeTrackingLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  timeTrackingValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: "#3730a3",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  attachmentsList: {
    gap: 8,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  attachmentText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  commentsList: {
    gap: 12,
  },
  commentItem: {
    backgroundColor: "#f8f9fb",
    padding: 12,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  commentMessage: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  // New Task Form Styles
  formSection: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  formColumn: {
    flex: 1,
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
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#374151",
    minHeight: 44,
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
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  formDropdown: {
    // Styles for the dropdown component itself, if needed
  },
  submitButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
    marginBottom: 40, // Add some bottom margin for scrollability
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default Task
