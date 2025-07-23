import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Modal,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

const SchedulerPreOpNoteForm = ({ route, navigation }) => {
    const patientId = route?.params?.patientId || 'N/A';
    const patientName = route?.params?.patientName || 'Unknown Patient';

    const [mode, setMode] = useState('edit');
    const [showOtScheduleModal, setShowOtScheduleModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        surgeonName: '',
        anesthetistName: '',
        assistantName: '',
        staffName: '',
        dateTimeOTStart: '',
        otComplex: '',
        technologyUsed: '',
        typeOfOperation: '',
        remarks: ''
    });

    // Dynamic lists state (kept for context, but hidden in view mode)
    const [otMedicineList, setOtMedicineList] = useState([
        { sr: 1, medicineName: 'Paracetamol', size: '500mg', quantity: '2' }
    ]);

    const [otAssetsPreparList, setOtAssetsPreparList] = useState([
        { sr: 1, assetName: 'Surgical Scalpel', size: 'N/A', quantity: '1' }
    ]);

    const [otPreparConsumableList, setOtPreparConsumableList] = useState([
        { sr: 1, item: 'Sterile Gloves', quantity: '10' }
    ]);

    const [otPreparNonConsumableList, setOtPreparNonConsumableList] = useState([
        { sr: 1, item: 'Oxygen Tank', quantity: '1' }
    ]);

    // State for OT Schedules (example data)
    const [otSchedules, setOtSchedules] = useState([
        { id: '1', date: '2025-07-20' },
        { id: '2', date: '2025-07-22' },
        { id: '3', date: '2025-07-25' },
    ]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // --- Dynamic list functions (unchanged, but now only accessible in 'edit' mode) ---
    const addMedicineRow = () => setOtMedicineList(prev => [...prev, { sr: prev.length + 1, medicineName: '', size: '', quantity: '' }]);
    const removeMedicineRow = (index) => { if (otMedicineList.length > 1) setOtMedicineList(prev => prev.filter((_, i) => i !== index)); };
    const updateMedicineRow = (index, field, value) => setOtMedicineList(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    const addAssetsRow = () => setOtAssetsPreparList(prev => [...prev, { sr: prev.length + 1, assetName: '', size: '', quantity: '' }]);
    const removeAssetsRow = (index) => { if (otAssetsPreparList.length > 1) setOtAssetsPreparList(prev => prev.filter((_, i) => i !== index)); };
    const updateAssetsRow = (index, field, value) => setOtAssetsPreparList(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    const addConsumableRow = () => setOtPreparConsumableList(prev => [...prev, { sr: prev.length + 1, item: '', quantity: '' }]);
    const removeConsumableRow = (index) => { if (otPreparConsumableList.length > 1) setOtPreparConsumableList(prev => prev.filter((_, i) => i !== index)); };
    const updateConsumableRow = (index, field, value) => setOtPreparConsumableList(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    const addNonConsumableRow = () => setOtPreparNonConsumableList(prev => [...prev, { sr: prev.length + 1, item: '', quantity: '' }]);
    const removeNonConsumableRow = (index) => { if (otPreparNonConsumableList.length > 1) setOtPreparNonConsumableList(prev => prev.filter((_, i) => i !== index)); };
    const updateNonConsumableRow = (index, field, value) => setOtPreparNonConsumableList(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    // --- End Dynamic list functions ---

    const handleSave = () => {
        if (!formData.surgeonName || !formData.anesthetistName ||
            !formData.assistantName || !formData.staffName || !formData.typeOfOperation) {
            Alert.alert('Error', 'Please fill all required fields marked with *');
            return;
        }
        Alert.alert('Success', 'Pre-operative note saved successfully!');
        setMode('edit');
    };

    const handleDelete = () => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this pre-operative note?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        Alert.alert('Deleted', 'Pre-operative note deleted successfully!');
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    const handlePrintOTSchedule = (date) => {
        Alert.alert('Print Schedule', `Printing OT Schedule for ${date}...`);
        // Add actual navigation or printing logic here
    };

    const renderIcon = (name) => {
        return <Text style={styles.headerActionButtonIcon}>{name}</Text>;
    };


    const renderHeader = () => (
        <View style={styles.header}>
            
            <Text style={styles.subtitle}>Patient: {patientName} (ID: {patientId})</Text>

            <View style={styles.headerButtonContainer}>
                <TouchableOpacity
                    style={[styles.headerActionButton, styles.viewButton]}
                    onPress={() => {
                        Keyboard.dismiss();
                        setShowOtScheduleModal(true);
                    }}
                >
                    {renderIcon('👁️')}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.headerActionButton, styles.editButton]}
                    onPress={() => setMode('edit')}
                >
                    {renderIcon('✍️')}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.headerActionButton, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    {renderIcon('🗑️')}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderOTSchedulesModal = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={showOtScheduleModal}
                onRequestClose={() => setShowOtScheduleModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowOtScheduleModal(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.sectionTitle}>OT Schedules</Text>

                                {otSchedules.length === 0 ? (
                                    <Text style={styles.emptyTableText}>No OT schedules available for this patient.</Text>
                                ) : (
                                    <>
                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
                                            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Action</Text>
                                        </View>

                                        <ScrollView style={styles.modalScrollView}>
                                            {otSchedules.map((schedule) => (
                                                <View key={schedule.id} style={styles.tableRow}>
                                                    <Text style={[styles.tableCellText, { flex: 1 }]}>{schedule.date}</Text>
                                                    <View style={[styles.tableCellText, { flex: 1.5 }]}>
                                                        <TouchableOpacity
                                                            style={styles.printScheduleButton}
                                                            onPress={() => handlePrintOTSchedule(schedule.date)}
                                                        >
                                                            <Text style={styles.printScheduleButtonText}>Print Schedule</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ))}
                                        </ScrollView>
                                    </>
                                )}
                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setShowOtScheduleModal(false)}
                                >
                                    <Text style={styles.modalCloseButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    };

    const renderBasicFields = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Surgeon Name *</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.surgeonName}
                    onChangeText={(value) => handleInputChange('surgeonName', value)}
                    editable={mode === 'edit'}
                    placeholder="Enter surgeon name"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Anesthetist Name *</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.anesthetistName}
                    onChangeText={(value) => handleInputChange('anesthetistName', value)}
                    editable={mode === 'edit'}
                    placeholder="Enter anesthetist name"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Assistant Name *</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.assistantName}
                    onChangeText={(value) => handleInputChange('assistantName', value)}
                    editable={mode === 'edit'}
                    placeholder="Enter assistant name"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Staff Name *</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.staffName}
                    onChangeText={(value) => handleInputChange('staffName', value)}
                    editable={mode === 'edit'}
                    placeholder="Enter staff name"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Date & Time Of OT Start</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.dateTimeOTStart}
                    onChangeText={(value) => handleInputChange('dateTimeOTStart', value)}
                    editable={mode === 'edit'}
                    placeholder="YYYY-MM-DD HH:MM AM/PM"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>OT Complex</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.otComplex}
                    onChangeText={(value) => handleInputChange('otComplex', value)}
                    editable={mode === 'edit'}
                    placeholder="Enter OT complex"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Technology Used During Operation</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.technologyUsed}
                    onChangeText={(value) => handleInputChange('technologyUsed', value)}
                    editable={mode === 'edit'}
                    placeholder="Enter technology used"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Type Of Operation *</Text>
                <TextInput
                    style={[styles.input, mode === 'view' && styles.disabledInput]}
                    value={formData.typeOfOperation}
                    onChangeText={(value) => handleInputChange('typeOfOperation', value)}
                    editable={mode === 'edit'}
                    placeholder="Enter type of operation"
                    placeholderTextColor="#9ca3af"
                />
            </View>
        </View>
    );

    const renderMedicineList = () => {
        if (mode !== 'edit') return null;
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">OT Medicine List (For Patient)</Text>
                    <TouchableOpacity style={styles.addItemButton} onPress={addMedicineRow}>
                        <Text style={styles.addItemButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Sr.</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Medicine Name</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Size</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Action</Text> {/* Flex 1 for Action */}
                </View>
                {otMedicineList.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.srNumber, { flex: 0.5 }]}>{item.sr}</Text>
                        <TextInput style={[styles.tableInput, { flex: 2 }]} value={item.medicineName} onChangeText={(value) => updateMedicineRow(index, 'medicineName', value)} editable={true} placeholder="Medicine name" placeholderTextColor="#9ca3af" />
                        <TextInput style={[styles.tableInput, { flex: 1 }]} value={item.size} onChangeText={(value) => updateMedicineRow(index, 'size', value)} editable={true} placeholder="Size" placeholderTextColor="#9ca3af" />
                        <TextInput style={[styles.tableInput, { flex: 1 }]} value={item.quantity} onChangeText={(value) => updateMedicineRow(index, 'quantity', value)} editable={true} placeholder="Qty" keyboardType="numeric" placeholderTextColor="#9ca3af" />
                        <TouchableOpacity style={[styles.removeButton, { flex: 1 }]} onPress={() => removeMedicineRow(index)}> {/* Flex 1 for remove button */}
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    const renderAssetsList = () => {
        if (mode !== 'edit') return null;
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">OT Assets Prepar List (For Doctor)</Text>
                    <TouchableOpacity style={styles.addItemButton} onPress={addAssetsRow}>
                        <Text style={styles.addItemButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Sr.</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Asset Name</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Size</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Action</Text> {/* Flex 1 for Action */}
                </View>
                {otAssetsPreparList.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.srNumber, { flex: 0.5 }]}>{item.sr}</Text>
                        <TextInput style={[styles.tableInput, { flex: 2 }]} value={item.assetName} onChangeText={(value) => updateAssetsRow(index, 'assetName', value)} editable={true} placeholder="Asset name" placeholderTextColor="#9ca3af" />
                        <TextInput style={[styles.tableInput, { flex: 1 }]} value={item.size} onChangeText={(value) => updateAssetsRow(index, 'size', value)} editable={true} placeholder="Size" placeholderTextColor="#9ca3af" />
                        <TextInput style={[styles.tableInput, { flex: 1 }]} value={item.quantity} onChangeText={(value) => updateAssetsRow(index, 'quantity', value)} editable={true} placeholder="Qty" keyboardType="numeric" placeholderTextColor="#9ca3af" />
                        <TouchableOpacity style={[styles.removeButton, { flex: 1 }]} onPress={() => removeAssetsRow(index)}> {/* Flex 1 for remove button */}
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    const renderConsumableList = () => {
        if (mode !== 'edit') return null;
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">OT Prepar List (Consumable Inventory)</Text>
                    <TouchableOpacity style={styles.addItemButton} onPress={addConsumableRow}>
                        <Text style={styles.addItemButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Sr.</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2.5 }]}>Item</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Action</Text> {/* Flex 1 for Action */}
                </View>
                {otPreparConsumableList.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.srNumber, { flex: 0.5 }]}>{item.sr}</Text>
                        <TextInput style={[styles.tableInput, { flex: 2.5 }]} value={item.item} onChangeText={(value) => updateConsumableRow(index, 'item', value)} editable={true} placeholder="Item name" placeholderTextColor="#9ca3af" />
                        <TextInput style={[styles.tableInput, { flex: 1 }]} value={item.quantity} onChangeText={(value) => updateConsumableRow(index, 'quantity', value)} editable={true} placeholder="Qty" keyboardType="numeric" placeholderTextColor="#9ca3af" />
                        <TouchableOpacity style={[styles.removeButton, { flex: 1 }]} onPress={() => removeConsumableRow(index)}> {/* Flex 1 for remove button */}
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    const renderNonConsumableList = () => {
        if (mode !== 'edit') return null;
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail">OT Prepar List (Non Consumable Inventory)</Text>
                    <TouchableOpacity style={styles.addItemButton} onPress={addNonConsumableRow}>
                        <Text style={styles.addItemButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Sr.</Text>
                    <Text style={[styles.tableHeaderText, { flex: 2.5 }]}>Item</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Quantity</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Action</Text> {/* Flex 1 for Action */}
                </View>
                {otPreparNonConsumableList.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.srNumber, { flex: 0.5 }]}>{item.sr}</Text>
                        <TextInput style={[styles.tableInput, { flex: 2.5 }]} value={item.item} onChangeText={(value) => updateNonConsumableRow(index, 'item', value)} editable={true} placeholder="Item name" placeholderTextColor="#9ca3af" />
                        <TextInput style={[styles.tableInput, { flex: 1 }]} value={item.quantity} onChangeText={(value) => updateNonConsumableRow(index, 'quantity', value)} editable={true} placeholder="Qty" keyboardType="numeric" placeholderTextColor="#9ca3af" />
                        <TouchableOpacity style={[styles.removeButton, { flex: 1 }]} onPress={() => removeNonConsumableRow(index)}> {/* Flex 1 for remove button */}
                            <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    const renderRemarks = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remarks</Text>
            <TextInput
                style={[styles.textArea, mode === 'view' && styles.disabledInput]}
                value={formData.remarks}
                onChangeText={(value) => handleInputChange('remarks', value)}
                editable={mode === 'edit'}
                placeholder="Enter remarks..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
            />
        </View>
    );

    const renderActionButtons = () => (
        <View style={styles.footerActionButtonsContainer}>
            {mode === 'edit' ? (
                <>
                    <TouchableOpacity style={styles.applyButtonLarge} onPress={handleSave}>
                        <Text style={styles.applyButtonLargeText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.clearButtonLarge}
                        onPress={() => setMode('edit')}
                    >
                        <Text style={styles.clearButtonLargeText}>Cancel</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity style={styles.applyButtonLarge} onPress={() => navigation.goBack()}>
                    <Text style={styles.applyButtonLargeText}>Go Back</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {renderHeader()}
                    {renderBasicFields()}
                    {renderMedicineList()}
                    {renderAssetsList()}
                    {renderConsumableList()}
                    {renderNonConsumableList()}
                    {renderRemarks()}
                    {renderActionButtons()}
                </ScrollView>
            </TouchableWithoutFeedback>

            {renderOTSchedulesModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f8f9fb",
    },
    scrollView: {
        flex: 1,
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    headerButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    headerActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    viewButton: {
        backgroundColor: '#4dd0e1',
    },
    editButton: {
        backgroundColor: '#f59e0b',
    },
    deleteButton: {
        backgroundColor: '#ef4444',
    },
    headerActionButtonIcon: {
        fontSize: 18,
        color: 'white',
    },
    section: {
        backgroundColor: 'white',
        marginHorizontal: 12,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Pushes title and button to opposite ends
        alignItems: 'center', // Vertically centers them
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        flex: 1, // Allow title to take all available space
        marginRight: 10, // Space between title and button
        overflow: 'hidden', // Crucial: ensures text won't push button out
    },
    fieldGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        backgroundColor: 'white',
        color: '#374151',
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#9ca3af',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        backgroundColor: 'white',
        height: 80,
        color: '#374151',
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    addItemButton: {
        backgroundColor: '#4dd0e1',
        width: 32, // Fixed width for the button
        height: 32, // Fixed height for the button
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        // Removed padding here as fixed width/height will handle size
    },
    addItemButtonText: {
        color: 'white',
        fontSize: 20, // Slightly larger for a standalone '+'
        fontWeight: 'bold',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginBottom: 8,
    },
    tableHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#374151',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    srNumber: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        paddingVertical: 4,
    },
    tableInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 6,
        fontSize: 14,
        marginHorizontal: 2,
        backgroundColor: 'white',
        color: '#374151',
    },
    removeButton: {
        backgroundColor: '#ef4444',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        // Fixed width and height for consistency
        width: 32,
        height: 32,
        marginHorizontal: 2,
    },
    removeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerActionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 16,
        gap: 12,
    },
    clearButtonLarge: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "white",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    clearButtonLargeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#4dd0e1",
    },
    applyButtonLarge: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#4dd0e1",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#4dd0e1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    applyButtonLargeText: {
        fontSize: 14,
        fontWeight: "600",
        color: "white",
    },
    tableCellText: {
        fontSize: 14,
        color: '#374151',
        textAlign: 'center',
        paddingVertical: 4,
    },
    printScheduleButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignSelf: 'center',
    },
    printScheduleButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyTableText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        paddingVertical: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '70%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
    },
    modalScrollView: {
        maxHeight: 300,
        marginBottom: 15,
    },
    modalCloseButton: {
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f59e0b',
        borderRadius: 8,
        alignSelf: 'center',
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SchedulerPreOpNoteForm;