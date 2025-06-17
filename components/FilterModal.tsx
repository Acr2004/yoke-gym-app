import { Text, View, ScrollView, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { X, Check , Filter} from "lucide-react-native";
import { Colors } from "@/constants/Colors";

export interface ExerciseFilters {
    bodyParts: string[];
    difficulties: string[];
}

interface FilterModalProps {
    visible: boolean;
    filters: ExerciseFilters;
    onClose: () => void;
    setActiveFilters: (filters: ExerciseFilters) => void;
}

export default function FilterModal({ visible, onClose, filters, setActiveFilters }: FilterModalProps) {
    // Filter Options
    const bodyParts = ["chest", "back", "shoulders", "arms", "legs", "core"];
    const difficulties = ["beginner", "intermediate", "advanced"];

    // Handle Filter Selection
    const toggleBodyPart = (part: string) => {
        setActiveFilters({
        ...filters,
        bodyParts: filters.bodyParts.includes(part)
            ? filters.bodyParts.filter(item => item !== part)
            : [...filters.bodyParts, part]
        });
    };

    const toggleDifficulty = (difficulty: string) => {
        setActiveFilters({
            ...filters,
            difficulties: filters.difficulties.includes(difficulty)
                ? filters.difficulties.filter(item => item !== difficulty)
                : [...filters.difficulties, difficulty]
        });
    };

    // Clear all Filters
    const clearFilters = () => {
        setActiveFilters({
            bodyParts: [],
            difficulties: [],
        });
    };

    // Apply Filters and close Modal
    const applyFilters = () => {
        onClose();
    };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Filter size={24} color={Colors.dark.primary} />
              </View>
              <View>
                <Text style={styles.modalTitle}>Filter Exercises</Text>
                <Text style={styles.modalSubtitle}>Filter by Body Part and Difficulty</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.filtersContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {/* Body Parts Section */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Body Part</Text>
              <View style={styles.optionsContainer}>
                {bodyParts.map((part) => (
                  <TouchableOpacity 
                    key={part}
                    style={[
                      styles.filterOption,
                      filters.bodyParts.includes(part) && styles.selectedOption
                    ]}
                    onPress={() => toggleBodyPart(part)}
                  >
                    <Text 
                      style={[
                        styles.optionText,
                        filters.bodyParts.includes(part) && styles.selectedOptionText
                      ]}
                    >
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </Text>
                    {filters.bodyParts.includes(part) && (
                      <Check size={16} color={Colors.dark.white} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Difficulty Section */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Difficulty</Text>
              <View style={styles.optionsContainer}>
                {difficulties.map((difficulty) => (
                    <TouchableOpacity 
                        key={difficulty}
                        style={[
                            styles.filterOption,
                            filters.difficulties.includes(difficulty) && styles.selectedOption
                        ]}
                        onPress={() => toggleDifficulty(difficulty)}
                    >
                        <Text 
                            style={[
                                styles.optionText,
                                filters.difficulties.includes(difficulty) && styles.selectedOptionText
                            ]}
                        >
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Text>
                        {filters.difficulties.includes(difficulty) && (
                            <Check size={16} color={Colors.dark.white} />
                        )}
                    </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modalTitle: {
    color: Colors.dark.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: Colors.dark.text,
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  filtersContainer: {
    paddingHorizontal: 20,
    flexGrow: 0,
    flexShrink: 1,
  },
  filtersContent: {
    paddingVertical: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.dark.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
  },
  selectedOption: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  optionText: {
    color: Colors.dark.text,
    marginRight: 4,
  },
  selectedOptionText: {
    color: Colors.dark.white,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.tertiary,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: Colors.dark.text,
    fontWeight: "500",
  },
  applyButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 2,
    alignItems: "center",
  },
  applyButtonText: {
    color: Colors.dark.white,
    fontWeight: "600",
  },
});