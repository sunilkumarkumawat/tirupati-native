import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    SafeAreaView,
    Alert,
    TouchableWithoutFeedback, // Still needed for filter dropdown keyboard dismissal
} from "react-native";
import { ScrollView } from 'react-native-gesture-handler'; // Ensure this is imported

// Define the single appointment template to match OT.js's single patient display
const appointmentTemplate = {
    id: 1,
    appointmentId: "APT001",
    panelMedicalAid: "General Panel",
    tokenNumber: "TKN001",
    salutation: "Mr",
    patientName: "Aarav Sharma",
    mobile: "+91 98765 43210",
    appStatus: "Scheduled",
    gender: "Male",
    doctor: "Dr. Priya Singh",
    createdBy: "Receptionist",
    fromDate: "2025-01-15",
    toDate: "2025-01-15",
    appointmentNo: "APPT001",
    token: "TKN001",
    address: "123 Main St, City",
    age: 25,
    dob: "1999-01-15",
    email: "aarav.sharma@email.com",
    appointmentDate: "2025-01-15",
    infoSource: "Online",
    location: "OPD Block A",
    uhidPatientId: "UHID001",
    idProof: "Aadhar",
    royaltyCard: "Gold Member",
};

const AppointmentPage = ({ navigation }) => { // Ensure navigation prop is passed
    const [appointments, setAppointments] = useState([appointmentTemplate]); // Start with only one template
    const [filters, setFilters] = useState({
        patientName: "",
        mobile: "",
        uhidPatientId: "",
        idProof: "",
        royaltyCard: "",
    });
    const [filteredAppointments, setFilteredAppointments] = useState([appointmentTemplate]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [expandedCards, setExpandedCards] = useState({});
    // Removed: const [showMenuForAppointmentId, setShowMenuForAppointmentId] = useState(null);

    useEffect(() => {
        applyFilters();
    }, [filters, appointments]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        let filtered = [...appointments];

        if (filters.patientName) {
            filtered = filtered.filter((appt) =>
                appt.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
            );
        }
        if (filters.mobile) {
            filtered = filtered.filter((appt) => appt.mobile.includes(filters.mobile));
        }
        if (filters.uhidPatientId) {
            filtered = filtered.filter((appt) =>
                appt.uhidPatientId.toLowerCase().includes(filters.uhidPatientId.toLowerCase())
            );
        }
        if (filters.idProof) {
            filtered = filtered.filter((appt) =>
                appt.idProof.toLowerCase().includes(filters.idProof.toLowerCase())
            );
        }
        if (filters.royaltyCard) {
            filtered = filtered.filter((appt) =>
                appt.royaltyCard.toLowerCase().includes(filters.royaltyCard.toLowerCase())
            );
        }

        setFilteredAppointments(filtered);
    };

    const clearFilters = () => {
        setFilters({
            patientName: "",
            mobile: "",
            uhidPatientId: "",
            idProof: "",
            royaltyCard: "",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Scheduled":
                return "#6366f1"; // Blue
            case "Completed":
                return "#10b981"; // Green
            case "Cancelled":
                return "#ef4444"; // Red
            default:
                return "#6b7280"; // Gray
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Handle add appointment - NOW NAVIGATES TO AddAppointmentForm.js
    const handleAddAppointment = () => {
        navigation.navigate('AddAppointmentForm', {
            onAppointmentAdded: (newAppt) => {
                // Generate a unique ID for the new appointment here in the parent
                const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
                const finalNewAppt = { ...newAppt, id: newId };
                setAppointments(prev => [...prev, finalNewAppt]);
                Alert.alert("Success", "Appointment added successfully!");
            },
            existingAppointments: appointments, // Pass current list for ID generation
        });
    };

    const toggleCardExpansion = (appointmentId) => {
        setExpandedCards(prev => ({
            ...prev,
            [appointmentId]: !prev[appointmentId]
        }));
    };

    // Removed: Functions for 3-dot menu (toggleMenu, navigateToForm)

    const AppointmentCard = ({ appt }) => {
        const isExpanded = expandedCards[appt.id];
        // Removed: const isMenuOpen = showMenuForAppointmentId === appt.id;

        return (
            <View style={styles.patientCard}>
                {/* Header with Appointment Basic Info */}
                <View style={styles.patientHeader}>
                    <View style={styles.patientMainInfo}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText} allowFontScaling={false}>
                                {appt.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.patientBasicDetails}>
                            <Text style={styles.patientName} allowFontScaling={false}>{appt.patientName}</Text>
                            <View style={styles.patientMetaRow}>
                                <Text style={styles.uhidText} allowFontScaling={false}>UHID: {appt.uhidPatientId}</Text>
                                <Text style={styles.doaText} allowFontScaling={false}>Apt ID: {appt.appointmentId}</Text>
                            </View>
                            <View style={styles.doctorRow}>
                                <Text style={styles.doctorText} allowFontScaling={false}>Doctor: {appt.doctor}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={[styles.statusText, { color: getStatusColor(appt.appStatus) }]} allowFontScaling={false}>
                                        {appt.appStatus}
                                    </Text>
                                </View>
                            </View>
                            {/* New row for Age and Gender */}
                            <View style={styles.patientMetaRow}>
                                <Text style={styles.uhidText} allowFontScaling={false}>Age: {appt.age}</Text>
                                <Text style={styles.doaText} allowFontScaling={false}>Gender: {appt.gender}</Text>
                            </View>
                            {/* New row for Appointment Date */}
                            <View style={styles.patientMetaRow}>
                                <Text style={styles.uhidText} allowFontScaling={false}>Apt Date: {formatDate(appt.appointmentDate)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Removed: 3-dot menu button */}
                </View>

                {/* Removed: Dropdown Menu for 3-dot button */}

                {/* Expanded Details - Only show details NOT already visible in the header */}
                {
                    isExpanded && (
                        <View style={styles.expandedDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Mobile:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.mobile}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>DOB:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{formatDate(appt.dob)}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Email:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.email}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Panel/Medical Aid:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.panelMedicalAid}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Token Number:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.tokenNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Salutation:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.salutation}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Address:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.address}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Info Source:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.infoSource}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Location:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.location}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>ID Proof:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.idProof}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel} allowFontScaling={false}>Royalty Card:</Text>
                                <Text style={styles.detailValue} allowFontScaling={false}>{appt.royaltyCard}</Text>
                            </View>
                        </View>
                    )
                }

                {/* Footer Section */}
                <View style={styles.patientCardFooter}>
                    <TouchableOpacity
                        style={styles.seeMoreButton}
                        onPress={() => toggleCardExpansion(appt.id)}
                    >
                        <Text style={styles.seeMoreText} allowFontScaling={false}>
                            {isExpanded ? "See Less" : "See More..."}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.bottomActionButtons}>
                        {/* Renamed buttons to match OT.js but kept original colors */}
                        <TouchableOpacity style={[styles.actionButton, styles.viewButton]}>
                            <Text style={styles.actionButtonIcon} allowFontScaling={false}>👁</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                            <Text style={styles.actionButtonIcon} allowFontScaling={false}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                            <Text style={styles.actionButtonIcon} allowFontScaling={false}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    };

    const hasActiveFilters = () => {
        return Object.values(filters).some(val => val !== "");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Removed: Full-screen overlay as three-dot menu is gone */}

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                overScrollMode="never"
                // Adjusted scrollEnabled as showMenuForAppointmentId is removed
                scrollEnabled={!showFilterDropdown}
            >
                {/* Filter and Add Button Row */}
                <View style={styles.searchAndAddContainer}>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity
                            style={styles.filterButton}
                            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                        >
                            <View style={styles.filterButtonContent}>
                                <Text style={styles.filterButtonText} allowFontScaling={false}>Filter Appointments</Text>
                                {hasActiveFilters() && (
                                    <View style={styles.activeFilterBadge}>
                                        <Text style={styles.activeFilterBadgeText} allowFontScaling={false}>Active</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.dropdownArrow} allowFontScaling={false}>{showFilterDropdown ? "▲" : "▼"}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.addAppointmentButton}
                        onPress={handleAddAppointment} // Now navigates to AddAppointmentForm
                    >
                        <Text style={styles.addIcon} allowFontScaling={false}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Dropdown */}
                {showFilterDropdown && (
                    <View style={styles.filtersContainer}>
                        <View style={styles.dropdownMenu}>
                            <ScrollView
                                style={styles.filterScrollView}
                                showsVerticalScrollIndicator={true}
                                nestedScrollEnabled={true}
                                contentContainerStyle={styles.filterContentContainer}
                            >
                                {/* Patient Name Filter */}
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterLabel} allowFontScaling={false}>Patient Name</Text>
                                    <TextInput
                                        style={styles.filterInput}
                                        placeholder="Enter patient name"
                                        value={filters.patientName}
                                        onChangeText={(text) => handleFilterChange("patientName", text)}
                                        placeholderTextColor="#9ca3af"
                                        allowFontScaling={false}
                                    />
                                </View>

                                {/* Mobile Filter */}
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterLabel} allowFontScaling={false}>Mobile</Text>
                                    <TextInput
                                        style={styles.filterInput}
                                        placeholder="Enter mobile number"
                                        value={filters.mobile}
                                        onChangeText={(text) => handleFilterChange("mobile", text)}
                                        placeholderTextColor="#9ca3af"
                                        keyboardType="phone-pad"
                                        allowFontScaling={false}
                                    />
                                </View>

                                {/* UHID/Patient ID Filter */}
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterLabel} allowFontScaling={false}>UHID/Patient ID</Text>
                                    <TextInput
                                        style={styles.filterInput}
                                        placeholder="Enter UHID or Patient ID"
                                        value={filters.uhidPatientId}
                                        onChangeText={(text) => handleFilterChange("uhidPatientId", text)}
                                        placeholderTextColor="#9ca3af"
                                        allowFontScaling={false}
                                    />
                                </View>

                                {/* ID Proof Filter */}
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterLabel} allowFontScaling={false}>ID Proof</Text>
                                    <TextInput
                                        style={styles.filterInput}
                                        placeholder="Enter ID proof type"
                                        value={filters.idProof}
                                        onChangeText={(text) => handleFilterChange("idProof", text)}
                                        placeholderTextColor="#9ca3af"
                                        allowFontScaling={false}
                                    />
                                </View>

                                {/* Royalty Card Filter */}
                                <View style={styles.filterSection}>
                                    <Text style={styles.filterLabel} allowFontScaling={false}>Royalty Card</Text>
                                    <TextInput
                                        style={styles.filterInput}
                                        placeholder="Enter royalty card type"
                                        value={filters.royaltyCard}
                                        onChangeText={(text) => handleFilterChange("royaltyCard", text)}
                                        placeholderTextColor="#9ca3af"
                                        allowFontScaling={false}
                                    />
                                </View>

                                {/* Filter Action Buttons */}
                                <View style={styles.filterActions}>
                                    <TouchableOpacity style={styles.clearButtonLarge} onPress={clearFilters}>
                                        <Text style={styles.clearButtonLargeText} allowFontScaling={false}>Clear All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.applyButtonLarge}
                                        onPress={() => setShowFilterDropdown(false)}
                                    >
                                        <Text style={styles.applyButtonLargeText} allowFontScaling={false}>Apply Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* Appointment List */}
                <View style={styles.patientsList}>
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appt, index) => (
                            <View key={appt.id.toString()}>
                                <AppointmentCard appt={appt} />
                                {index < filteredAppointments.length - 1 && <View style={styles.separator} />}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText} allowFontScaling={false}>No appointments found</Text>
                            <Text style={styles.emptySubtext} allowFontScaling={false}>Try adjusting your filter criteria</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f8f9fb",
    },
    container: {
        flex: 1,
        padding: 12,
        paddingTop: 16,
    },

    // Search and Add Button Row (now Filter and Add) - Copied from OT.js
    searchAndAddContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    searchContainer: {
        flex: 1, // Allow the filter button to take up remaining space
    },
    filterButton: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    filterButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    filterButtonText: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "500",
    },
    dropdownArrow: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "bold",
    },
    activeFilterBadge: {
        marginLeft: 8,
        backgroundColor: "#4dd0e1",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    activeFilterBadgeText: {
        fontSize: 10,
        color: "white",
        fontWeight: "600",
    },
    addAppointmentButton: {
        width: 50, // Fixed width for the button
        height: 50, // Fixed height for the button
        borderRadius: 8,
        backgroundColor: "#4dd0e1",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    addIcon: {
        fontSize: 28, // Increased font size for better visibility in a fixed button
        color: "white",
        fontWeight: "bold",
    },

    // Filter Dropdown - Copied from OT.js
    filtersContainer: {
        marginBottom: 16,
        position: "relative",
        zIndex: 999, // Ensure dropdown is on top
    },
    dropdownMenu: {
        position: "absolute",
        top: 0, // Position relative to its parent (filtersContainer)
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 8,
        marginTop: 4,
        height: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 10,
        zIndex: 1000,
        minWidth: 200,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    filterScrollView: {
        flex: 1,
        paddingRight: 2, // Added for scroll indicator
    },
    filterContentContainer: {
        padding: 14,
        paddingBottom: 24,
        paddingRight: 12, // Added for scroll indicator
    },
    filterSection: {
        marginBottom: 12,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6b7280",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    filterInput: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "white",
        color: "#374151",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    dateFiltersRow: { // Added from OT.js for consistency, even if not used by Appointment filters
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    dateFilterSection: { // Added from OT.js for consistency
        flex: 1,
    },
    filterActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        gap: 12,
    },
    clearButtonLarge: {
        flex: 1,
        paddingVertical: 10, // Adjusted from 12 for OT.js consistency
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
        paddingVertical: 10, // Adjusted from 12 for OT.js consistency
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

    // Patient card styles - Copied and adapted from OT.js
    patientsList: {
        paddingBottom: 20,
    },
    separator: {
        height: 8,
    },
    patientCard: {
        backgroundColor: "#ffffff",
        borderRadius: 12, // Adjusted from 8 to match OT.js
        padding: 12, // Adjusted from 10 to match OT.js
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 }, // Adjusted for stronger shadow
        shadowOpacity: 0.1,
        shadowRadius: 6, // Adjusted for stronger shadow
        elevation: 3, // Adjusted for stronger shadow
        borderLeftWidth: 4, // Adjusted from 2
        borderLeftColor: "#4dd0e1",
        position: 'relative',
    },
    patientHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    patientMainInfo: { // Renamed from patientInfo
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
    },
    avatarPlaceholder: {
        width: 55, // Adjusted from 50
        height: 55, // Adjusted from 50
        borderRadius: 27.5, // Adjusted from 25
        backgroundColor: "#4dd0e1",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16, // Adjusted from 15
        shadowColor: "#4dd0e1", // Added shadow from OT.js
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarText: {
        color: "white",
        fontSize: 22, // Adjusted from 20
        fontWeight: "800", // Adjusted from 700
    },
    patientBasicDetails: { // Renamed from studentDetails
        flex: 1,
    },
    patientName: { // Renamed from studentName
        fontSize: 18, // Adjusted from 16
        fontWeight: "700",
        color: "#1f2937", // Adjusted from #111827
        marginBottom: 6, // Adjusted from 4
    },
    patientMetaRow: { // New style from OT.js
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    uhidText: { // New style from OT.js
        fontSize: 12,
        color: "#6b7280",
        fontWeight: "500",
    },
    doaText: { // New style from OT.js (repurposed for Apt ID/Doctor)
        fontSize: 12,
        color: "#6b7280",
        fontWeight: "500",
        marginHorizontal: 8,
    },
    doctorRow: { // New style from OT.js
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    doctorText: { // New style from OT.js
        fontSize: 13,
        color: "#4b5563",
        fontWeight: "500",
        flex: 1,
    },
    statusBadge: { // New style from OT.js
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: "#f3f4f6",
        marginLeft: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
        textTransform: "uppercase",
    },

    // Removed: Three dot menu button and its styles
    // Removed: Dropdown menu for three dots and its styles
    fullScreenOverlay: { // Still needed for filter dropdown keyboard dismissal
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 5,
    },

    // Expanded details - Copied from OT.js
    expandedDetails: {
        marginBottom: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#f9fafb",
    },
    detailLabel: {
        fontSize: 13, // Adjusted from 12
        color: "#6b7280",
        fontWeight: "600",
        flex: 0.4, // Adjusted from 1
    },
    detailValue: {
        fontSize: 13, // Adjusted from 12
        color: "#374151",
        fontWeight: "500",
        flex: 0.6, // Adjusted from 1
        textAlign: "right",
    },
    // Patient card footer - Copied from OT.js
    patientCardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
    },
    seeMoreButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: "flex-end", // Ensure it aligns to the right if not using full row
    },
    seeMoreText: {
        fontSize: 12,
        color: "#4dd0e1",
        fontWeight: "600",
    },
    bottomActionButtons: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    viewButton: { // Reschedule in Appointment.js now maps to View in OT.js
        backgroundColor: "#4dd0e1",
    },
    editButton: { // Complete in Appointment.js now maps to Edit in OT.js
        backgroundColor: "#f59e0b",
    },
    deleteButton: { // Cancel in Appointment.js now maps to Delete in OT.js
        backgroundColor: "#ef4444",
    },
    actionButtonIcon: {
        fontSize: 14,
    },
    // Empty state - Copied from OT.js
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60, // Adjusted from 40
        paddingHorizontal: 20, // Added
    },
    emptyText: {
        fontSize: 18, // Adjusted from 16
        fontWeight: "600",
        color: "#6b7280",
        marginBottom: 8,
        textAlign: "center", // Added
    },
    emptySubtext: {
        fontSize: 14, // Adjusted from 13
        color: "#9ca3af",
        textAlign: "center", // Added
        lineHeight: 20, // Added
    },
});

export default AppointmentPage;