import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Colors } from "@/constants/Colors";
import { X, Save, Plus, ChevronDown, Check } from "lucide-react-native";
import { Exercise } from "@/api/exercises";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (exercise: Omit<Exercise, 'id'>) => void;
}

interface Option {
  label: string;
  value: string;
}

const { height: screenHeight } = Dimensions.get('window');

export default function AddExerciseModal({ visible, onClose, onSave }: AddExerciseModalProps) {
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [equipment, setEquipment] = useState('');
  const [target, setTarget] = useState('');
  const [secondaryMuscles, setSecondaryMuscles] = useState('');

  // Picker States
  const [showBodyPartPicker, setShowBodyPartPicker] = useState(false);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);

  // Options
  const bodyPartOptions: Option[] = [
    { label: 'Chest', value: 'chest' },
    { label: 'Back', value: 'back' },
    { label: 'Shoulders', value: 'shoulders' },
    { label: 'Arms', value: 'arms' },
    { label: 'Upper Arms', value: 'upper arms' },
    { label: 'Forearms', value: 'forearms' },
    { label: 'Core', value: 'core' },
    { label: 'Abs', value: 'abs' },
    { label: 'Legs', value: 'legs' },
    { label: 'Upper Legs', value: 'upper legs' },
    { label: 'Lower Legs', value: 'lower legs' },
    { label: 'Glutes', value: 'glutes' },
    { label: 'Cardio', value: 'cardio' },
    { label: 'Full Body', value: 'full body' },
    { label: 'Neck', value: 'neck' },
  ];

  const difficultyOptions: Option[] = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  const equipmentOptions: Option[] = [
    { label: 'Body Weight', value: 'body weight' },
    { label: 'Dumbbells', value: 'dumbbells' },
    { label: 'Barbell', value: 'barbell' },
    { label: 'Kettlebell', value: 'kettlebell' },
    { label: 'Resistance Bands', value: 'resistance bands' },
    { label: 'Cable Machine', value: 'cable machine' },
    { label: 'Pull-up Bar', value: 'pull-up bar' },
    { label: 'Bench', value: 'bench' },
    { label: 'None', value: 'none' },
  ];

  // Form Validation
  const isFormValid = name.trim() && description.trim() && bodyPart.trim() && difficulty.trim();
  
  // Handle Save
  const handleSave = () => {
    if (!isFormValid) return;
    
    const newExercise: Omit<Exercise, 'id'> = {
      name: name.trim(),
      description: description.trim(),
      bodyPart: bodyPart.trim().toLowerCase(),
      difficulty: difficulty.trim().toLowerCase(),
      equipment: equipment.trim() || 'No Equipment',
      target: target.trim() || 'No Target',
      secondaryMuscles: secondaryMuscles.trim() ? [secondaryMuscles.trim()] : [],
      instructions: instructions.trim() ? instructions.split('\n').filter(item => item.trim()).map(item => item.trim()) : [],
    };
    
    onSave(newExercise);
    resetForm();
    onClose();
  };
  
  // Reset Form
  const resetForm = () => {
    setName('');
    setDescription('');
    setBodyPart('');
    setDifficulty('');
    setEquipment('');
    setTarget('');
    setSecondaryMuscles('');
    setInstructions('');
    setShowBodyPartPicker(false);
    setShowDifficultyPicker(false);
    setShowEquipmentPicker(false);
  };

  // Handle picker selections
  const handleBodyPartSelect = (value: string) => {
    setBodyPart(value);
    setShowBodyPartPicker(false);
  };

  const handleDifficultySelect = (value: string) => {
    setDifficulty(value);
    setShowDifficultyPicker(false);
  };

  const handleEquipmentSelect = (value: string) => {
    setEquipment(value);
    setShowEquipmentPicker(false);
  };

  // Get display label for selected values
  const getBodyPartLabel = () => {
    const option = bodyPartOptions.find(opt => opt.value === bodyPart);
    return option ? option.label : bodyPart || 'Select body part...';
  };

  const getDifficultyLabel = () => {
    const option = difficultyOptions.find(opt => opt.value === difficulty);
    return option ? option.label : 'Select difficulty level...';
  };

  const getEquipmentLabel = () => {
    const option = equipmentOptions.find(opt => opt.value === equipment);
    return option ? option.label : equipment || 'Select equipment...';
  };

  // Render picker modal
  const renderPickerModal = (
    visible: boolean,
    title: string,
    options: Option[],
    selectedValue: string,
    onSelect: (value: string) => void,
    onClose: () => void,
    allowCustom: boolean = false
  ) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerModal}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.pickerCloseButton}>
              <X size={20} color={Colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.pickerOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.pickerOption,
                  selectedValue === option.value && styles.pickerOptionSelected
                ]}
                onPress={() => onSelect(option.value)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  selectedValue === option.value && styles.pickerOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Check size={16} color={Colors.dark.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {allowCustom && (
            <View style={styles.customInputSection}>
              <Text style={styles.customInputLabel}>Or enter custom:</Text>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  placeholder="Type custom option..."
                  placeholderTextColor={Colors.dark.text}
                  onSubmitEditing={(event) => {
                    const customValue = event.nativeEvent.text.trim();
                    if (customValue) {
                      onSelect(customValue.toLowerCase());
                    }
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerContent}>
                <View style={styles.headerIcon}>
                  <Plus size={24} color={Colors.dark.primary} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Add New Exercise</Text>
                  <Text style={styles.modalSubtitle}>Create your custom exercise</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Exercise Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Exercise Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Push-ups, Squats, Deadlifts..."
                  placeholderTextColor={Colors.dark.text}
                />
              </View>
              
              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Brief description of what this exercise targets and how to perform it..."
                  placeholderTextColor={Colors.dark.text}
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              {/* Body Part Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Body Part</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowBodyPartPicker(true)}
                >
                  <Text style={[
                    styles.pickerButtonText,
                    !bodyPart && styles.pickerButtonPlaceholder
                  ]}>
                    {getBodyPartLabel()}
                  </Text>
                  <ChevronDown size={20} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>
              
              {/* Difficulty Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Difficulty Level</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowDifficultyPicker(true)}
                >
                  <Text style={[
                    styles.pickerButtonText,
                    !difficulty && styles.pickerButtonPlaceholder
                  ]}>
                    {getDifficultyLabel()}
                  </Text>
                  <ChevronDown size={20} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>

              {/* Equipment Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Equipment <Text style={styles.optionalText}>(Optional)</Text></Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowEquipmentPicker(true)}
                >
                  <Text style={[
                    styles.pickerButtonText,
                    !equipment && styles.pickerButtonPlaceholder
                  ]}>
                    {getEquipmentLabel()}
                  </Text>
                  <ChevronDown size={20} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>

              {/* Target Muscle */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Primary Target <Text style={styles.optionalText}>(Optional)</Text></Text>
                <TextInput
                  style={styles.textInput}
                  value={target}
                  onChangeText={setTarget}
                  placeholder="e.g., biceps, quadriceps, deltoids..."
                  placeholderTextColor={Colors.dark.text}
                />
              </View>

              {/* Secondary Muscles */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Secondary Muscles <Text style={styles.optionalText}>(Optional)</Text></Text>
                <TextInput
                  style={styles.textInput}
                  value={secondaryMuscles}
                  onChangeText={setSecondaryMuscles}
                  placeholder="e.g., triceps, core, stabilizers..."
                  placeholderTextColor={Colors.dark.text}
                />
              </View>
              
              {/* Instructions */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Instructions <Text style={styles.optionalText}>(Optional)</Text></Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder={`1. Starting position and setup\n2. Movement execution\n3. Breathing technique\n4. Common mistakes to avoid`}
                  placeholderTextColor={Colors.dark.text}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.spacer} />
            </ScrollView>
            
            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, !isFormValid && styles.disabledButton]}
                onPress={handleSave}
                disabled={!isFormValid}
              >
                <Save size={18} color={Colors.dark.white} />
                <Text style={styles.saveButtonText}>Save Exercise</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Picker Modals */}
        {renderPickerModal(
          showBodyPartPicker,
          'Select Body Part',
          bodyPartOptions,
          bodyPart,
          handleBodyPartSelect,
          () => setShowBodyPartPicker(false),
          true
        )}

        {renderPickerModal(
          showDifficultyPicker,
          'Select Difficulty',
          difficultyOptions,
          difficulty,
          handleDifficultySelect,
          () => setShowDifficultyPicker(false),
          false
        )}

        {renderPickerModal(
          showEquipmentPicker,
          'Select Equipment',
          equipmentOptions,
          equipment,
          handleEquipmentSelect,
          () => setShowEquipmentPicker(false),
          true
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
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
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.7,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    marginBottom: 8,
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
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  optionalText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "400",
  },
  textInput: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
    color: Colors.dark.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  pickerButton: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: Colors.dark.white,
    fontSize: 16,
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: Colors.dark.text,
  },
  spacer: {
    height: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.tertiary,
    backgroundColor: Colors.dark.background,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    marginRight: 12,
    alignItems: "center",
    backgroundColor: Colors.dark.secondary,
  },
  cancelButtonText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: Colors.dark.tertiary,
    opacity: 0.7,
  },
  // Picker Modal Styles
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  pickerModal: {
    backgroundColor: Colors.dark.background,
    borderRadius: 16,
    width: "100%",
    maxHeight: screenHeight * 0.6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    borderStyle: "solid",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
  },
  pickerTitle: {
    color: Colors.dark.white,
    fontSize: 18,
    fontWeight: "600",
  },
  pickerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerOptions: {
    maxHeight: screenHeight * 0.3,
  },
  pickerOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.dark.secondary,
  },
  pickerOptionText: {
    color: Colors.dark.white,
    fontSize: 16,
    flex: 1,
  },
  pickerOptionTextSelected: {
    color: Colors.dark.primary,
    fontWeight: "600",
  },
  customInputSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.tertiary,
  },
  customInputLabel: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 8,
  },
  customInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  customInput: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.white,
    fontSize: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
  },
});