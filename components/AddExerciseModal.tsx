import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Colors } from "@/constants/Colors";
import { X, Save } from "lucide-react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { Exercise } from "@/api/exercises";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (exercise: Omit<Exercise, 'id'>) => void;
}

export default function AddExerciseModal({ visible, onClose, onSave }: AddExerciseModalProps) {
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Dropdown States for Body Part
  const [bodyPartOpen, setBodyPartOpen] = useState(false);
  const [bodyPart, setBodyPart] = useState('');
  const bodyPartOptions = [
    { label: 'Shoulders', value: 'shoulders' },
    { label: 'Hips', value: 'hips' },
    { label: 'Upper Legs', value: 'upper legs' },
    { label: 'Lower body', value: 'lower body' },
    { label: 'Waist', value: 'Waist' },
    { label: 'Lower Legs', value: 'lower legs' },
    { label: 'Forearms', value: 'forearms' },
    { label: 'Neck', value: 'neck' },
    { label: 'Upper Back', value: 'upper back' },
    { label: 'Spine', value: 'spine' },
    { label: 'Back', value: 'back' },
    { label: 'Full Body', value: 'full body' },
    { label: 'Chest', value: 'chest' },
    { label: 'Core', value: 'core' },
    { label: 'Glutes', value: 'glutes' },
    { label: 'Cardio', value: 'cardio' },
    { label: 'Upper Arms', value: 'upper arms' },
  ];

  // Dropdown States for Difficulty
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const difficultyOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  // Dropdown States for Equipment
  const [equipment, setEquipment] = useState('');

  // Dropdown States for Target
  const [target, setTarget] = useState("");

  // Dropdown States for Secondary Muscles
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
  


  // Form Validation
  const isFormValid = name && description && bodyPart && difficulty && equipment;
  
  // Handle Save
  const handleSave = () => {
    if (!isFormValid) return;
    
    const newExercise: Omit<Exercise, 'id'> = {
      name,
      description,
      bodyPart,
      difficulty,
      equipment,
      target,
      secondaryMuscles,
      instructions: instructions ? instructions.split('\n').filter(item => item.trim()) : [],
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
    setInstructions('');
  };

  const handleSecondaryMuscleChange = (text: string) => {
    setSecondaryMuscles([text]);
  };

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
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Exercise</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.dark.white} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Exercise name"
                placeholderTextColor={Colors.dark.text}
              />
            </View>
            
            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Brief description of the exercise"
                placeholderTextColor={Colors.dark.text}
                multiline
                numberOfLines={3}
              />
            </View>
            
            {/* Body Part */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Body Part *</Text>
              <DropDownPicker
                open={bodyPartOpen}
                value={bodyPart}
                items={bodyPartOptions}
                setOpen={setBodyPartOpen}
                setValue={setBodyPart}
                style={styles.dropdownStyle}
                textStyle={styles.dropdownTextStyle}
                dropDownContainerStyle={styles.dropdownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
                placeholder="Select body part"
                listMode='SCROLLVIEW'
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
            
            {/* Difficulty */}
            <View style={[styles.inputGroup, { zIndex: bodyPartOpen ? 1 : 2000 }]}>
              <Text style={styles.inputLabel}>Difficulty *</Text>
              <DropDownPicker
                open={difficultyOpen}
                value={difficulty}
                items={difficultyOptions}
                setOpen={setDifficultyOpen}
                setValue={setDifficulty}
                style={styles.dropdownStyle}
                textStyle={styles.dropdownTextStyle}
                dropDownContainerStyle={styles.dropdownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
                placeholder="Select difficulty"
                listMode='SCROLLVIEW'
                zIndex={2000}
                zIndexInverse={2000}
              />
            </View>

            {/* Target */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target *</Text>
              <TextInput
                style={styles.textInput}
                value={target}
                onChangeText={setTarget}
                placeholder="Target name"
                placeholderTextColor={Colors.dark.text}
              />
            </View>
            
            {/* Equipment */}
            <View style={[styles.inputGroup, { zIndex: (bodyPartOpen || difficultyOpen) ? 1 : 1000 }]}>
              <Text style={styles.inputLabel}>Equipment *</Text>
              <TextInput
                style={styles.textInput}
                value={equipment}
                onChangeText={setEquipment}
                placeholder="Equipment name"
                placeholderTextColor={Colors.dark.text}
              />
            </View>

            {/* Secondary Muscles */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Secondary Muscles *</Text>
              <TextInput
                style={styles.textInput}
                value={secondaryMuscles[0]}
                onChangeText={handleSecondaryMuscleChange}
                placeholder="Secondary Muscles names"
                placeholderTextColor={Colors.dark.text}
              />
            </View>
            
            {/* Instructions */}
            <View style={[styles.inputGroup, { zIndex: 1 }]}>
              <Text style={styles.inputLabel}>Instructions (one per line)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={instructions}
                onChangeText={setInstructions}
                placeholder={`Step 1\nStep 2\nStep 3\n...`}
                placeholderTextColor={Colors.dark.text}
                multiline
                numberOfLines={4}
              />
            </View>
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    backgroundColor: Colors.dark.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
  },
  modalTitle: {
    color: Colors.dark.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    maxHeight: "70%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.white,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdownStyle: {
    backgroundColor: Colors.dark.secondary,
    borderWidth: 0,
    borderRadius: 8,
    minHeight: 50,
  },
  dropdownTextStyle: {
    color: Colors.dark.white,
    fontSize: 16,
  },
  dropdownContainerStyle: {
    backgroundColor: Colors.dark.tertiary,
    borderWidth: 0,
    borderRadius: 8,
  },
  placeholderStyle: {
    color: Colors.dark.text,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.tertiary,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.dark.text,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: Colors.dark.white,
    fontWeight: "600",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: Colors.dark.tertiary,
    opacity: 0.7,
  },
});