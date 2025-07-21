import React, { useState } from 'react'
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Alert 
} from 'react-native'

const NoticeBoard = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Welcome to Notice Board',
      content: 'This is your first notice. You can add, edit, and delete notices here.',
      date: '2025-01-01',
      priority: 'medium'
    },
    {
      id: 2,
      title: 'Important Meeting',
      content: 'Team meeting scheduled for tomorrow at 10 AM in the conference room.',
      date: '2025-01-02',
      priority: 'high'
    }
  ])

  const [modalVisible, setModalVisible] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium'
  })

  const openModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice)
      setFormData({
        title: notice.title,
        content: notice.content,
        priority: notice.priority
      })
    } else {
      setEditingNotice(null)
      setFormData({
        title: '',
        content: '',
        priority: 'medium'
      })
    }
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setEditingNotice(null)
    setFormData({
      title: '',
      content: '',
      priority: 'medium'
    })
  }

  const saveNotice = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    const currentDate = new Date().toISOString().split('T')[0]

    if (editingNotice) {
      setNotices(notices.map(notice => 
        notice.id === editingNotice.id 
          ? { ...notice, ...formData }
          : notice
      ))
    } else {
      const newNotice = {
        id: Date.now(),
        ...formData,
        date: currentDate
      }
      setNotices([newNotice, ...notices])
    }

    closeModal()
  }

  const deleteNotice = (id) => {
    Alert.alert(
      'Delete Notice',
      'Are you sure you want to delete this notice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setNotices(notices.filter(notice => notice.id !== id))
        }
      ]
    )
  }

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '🟡'
    }
  }

  const getPriorityText = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  return (
    <View style={styles.container}>
      

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Notice Board</Text>
          <Text style={styles.subtitle}>{notices.length} notices found</Text>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Text style={styles.addButtonText}>+ Add New Notice</Text>
        </TouchableOpacity>

        {/* Notices List */}
        <ScrollView style={styles.noticesContainer} showsVerticalScrollIndicator={false}>
          {notices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No notices yet</Text>
              <Text style={styles.emptySubtext}>Tap "Add New Notice" to create your first notice</Text>
            </View>
          ) : (
            notices.map((notice) => (
              <View key={notice.id} style={styles.noticeCard}>
                <View style={styles.noticeHeader}>
                  <View style={styles.noticeTitleRow}>
                    <Text style={styles.noticeTitle}>{notice.title}</Text>
                    <TouchableOpacity style={styles.moreButton}>
                      <Text style={styles.moreButtonText}>⋯</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.noticeInfo}>
                    <Text style={styles.noticeDate}>{notice.date}</Text>
                    <View style={styles.priorityContainer}>
                      <Text style={styles.priorityIndicator}>{getPriorityIndicator(notice.priority)}</Text>
                      <Text style={styles.priorityText}>{getPriorityText(notice.priority)}</Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.noticeContent}>{notice.content}</Text>
                
                <View style={styles.noticeActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openModal(notice)}
                  >
                    <Text style={styles.actionButtonText}>View & Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButtonSmall}
                    onPress={() => deleteNotice(notice.id)}
                  >
                    <Text style={styles.deleteButtonSmallText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Add/Edit Notice Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingNotice ? 'Edit Notice' : 'Add New Notice'}
              </Text>
              <View style={styles.modalPlaceholder} />
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter notice title"
                  value={formData.title}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Content</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter notice content"
                  value={formData.content}
                  onChangeText={(text) => setFormData({...formData, content: text})}
                  multiline={true}
                  numberOfLines={6}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority</Text>
                <View style={styles.priorityOptions}>
                  {['low', 'medium', 'high'].map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityOption,
                        formData.priority === priority && styles.priorityOptionSelected
                      ]}
                      onPress={() => setFormData({...formData, priority})}
                    >
                      <Text style={styles.priorityOptionIndicator}>
                        {getPriorityIndicator(priority)}
                      </Text>
                      <Text style={[
                        styles.priorityOptionText,
                        formData.priority === priority && styles.priorityOptionTextSelected
                      ]}>
                        {getPriorityText(priority)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveNotice}
              >
                <Text style={styles.saveButtonText}>
                  {editingNotice ? 'Update Notice' : 'Save Notice'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleSection: {
    padding: 20,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  addButton: {
    backgroundColor: '#6c7ce7',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noticesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  noticeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  noticeHeader: {
    marginBottom: 15,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  moreButton: {
    padding: 5,
  },
  moreButtonText: {
    fontSize: 20,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  noticeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeDate: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    fontSize: 12,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  noticeContent: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 22,
    marginBottom: 20,
  },
  noticeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#6c7ce7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButtonSmall: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonSmallText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  modalClose: {
    fontSize: 20,
    color: '#7f8c8d',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalPlaceholder: {
    width: 20,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  priorityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  priorityOptionSelected: {
    backgroundColor: '#6c7ce7',
    borderColor: '#6c7ce7',
  },
  priorityOptionIndicator: {
    fontSize: 16,
    marginRight: 8,
  },
  priorityOptionText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '500',
  },
  priorityOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#6c7ce7',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default NoticeBoard;