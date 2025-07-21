import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native"

const DropdownComponent = ({ label, value, options, isOpen, onToggle, onSelect, placeholder }) => (
  <View style={styles.dropdownWrapper}>
    <Text style={styles.filterLabel} allowFontScaling={false}>
      {label}:
    </Text>
    <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
      <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]} allowFontScaling={false}>
        {value || placeholder}
      </Text>
      <Text style={styles.dropdownArrow} allowFontScaling={false}>
        {isOpen ? "▲" : "▼"}
      </Text>
    </TouchableOpacity>
    {isOpen && (
      <View style={styles.dropdownMenu}>
        <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.dropdownMenuItem, value === option && styles.dropdownMenuItemActive]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[styles.dropdownMenuText, value === option && styles.dropdownMenuTextActive]}
                allowFontScaling={false}
              >
                {option}
              </Text>
              {value === option && (
                <Text style={styles.checkmark} allowFontScaling={false}>
                  ✓
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
  </View>
)

const styles = StyleSheet.create({
  dropdownWrapper: {
    flex: 1,
    position: "relative",
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 5,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  dropdownButtonText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  placeholderText: {
    color: "#9ca3af",
    fontWeight: "400",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#6b7280",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  dropdownMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    minHeight: 44,
  },
  dropdownMenuItemActive: {
    backgroundColor: "#f0f9ff",
  },
  dropdownMenuText: {
    fontSize: 14,
    color: "#374151",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownMenuTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "bold",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})

export default DropdownComponent
