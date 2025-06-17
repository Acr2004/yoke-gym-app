import { Text, View, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Platform, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { PlusCircle, Search, Coffee, UtensilsCrossed, Dumbbell, Cookie, Salad, Droplet, Plus, CalendarDays, TrendingUp, BarChart3, X, Save, Clock, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

// Define the MealEntry interface
interface MealEntry {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  type: "breakfast" | "lunch" | "dinner" | "workout" | "snack" | "water";
  date: string; // Add date field to track which day this meal belongs to
}

// Custom Time Picker Component
interface TimePickerProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  initialTime?: string;
}

function CustomTimePicker({ visible, onClose, onTimeSelect, initialTime = "12:00" }: TimePickerProps) {
  const [hours, setHours] = useState(parseInt(initialTime.split(':')[0]) || 12);
  const [minutes, setMinutes] = useState(parseInt(initialTime.split(':')[1]) || 0);
  const [period, setPeriod] = useState(hours >= 12 ? 'PM' : 'AM');

  const adjustHours = (increment: boolean) => {
    if (increment) {
      setHours(prev => prev === 12 ? 1 : prev + 1);
    } else {
      setHours(prev => prev === 1 ? 12 : prev - 1);
    }
  };

  const adjustMinutes = (increment: boolean) => {
    if (increment) {
      setMinutes(prev => prev === 59 ? 0 : prev + 1);
    } else {
      setMinutes(prev => prev === 0 ? 59 : prev - 1);
    }
  };

  const handleConfirm = () => {
    const displayHours = hours;
    const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.timePickerOverlay}>
        <View style={styles.timePickerModal}>
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerTitle}>Select Time</Text>
          </View>

          <View style={styles.timePickerContent}>
            <View style={styles.timePickerRow}>
              {/* Hours */}
              <View style={styles.timeColumn}>
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => adjustHours(true)}
                >
                  <ChevronUp size={20} color={Colors.dark.primary} />
                </TouchableOpacity>
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeText}>{hours.toString().padStart(2, '0')}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => adjustHours(false)}
                >
                  <ChevronDown size={20} color={Colors.dark.primary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.timeSeparator}>:</Text>

              {/* Minutes */}
              <View style={styles.timeColumn}>
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => adjustMinutes(true)}
                >
                  <ChevronUp size={20} color={Colors.dark.primary} />
                </TouchableOpacity>
                <View style={styles.timeDisplay}>
                  <Text style={styles.timeText}>{minutes.toString().padStart(2, '0')}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.timeButton} 
                  onPress={() => adjustMinutes(false)}
                >
                  <ChevronDown size={20} color={Colors.dark.primary} />
                </TouchableOpacity>
              </View>

              {/* AM/PM */}
              <View style={styles.periodColumn}>
                <TouchableOpacity 
                  style={[styles.periodButton, period === 'AM' && styles.periodButtonActive]}
                  onPress={() => setPeriod('AM')}
                >
                  <Text style={[styles.periodText, period === 'AM' && styles.periodTextActive]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.periodButton, period === 'PM' && styles.periodButtonActive]}
                  onPress={() => setPeriod('PM')}
                >
                  <Text style={[styles.periodText, period === 'PM' && styles.periodTextActive]}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.timePickerActions}>
            <TouchableOpacity style={styles.timeCancelButton} onPress={onClose}>
              <Text style={styles.timeCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.timeConfirmButton} onPress={handleConfirm}>
              <Text style={styles.timeConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Custom Date Picker Component
interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  initialDate: Date;
}

function CustomDatePicker({ visible, onClose, onDateSelect, initialDate }: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    // Fill remaining cells to complete the grid (6 rows × 7 days = 42 cells)
    const totalCells = 42;
    while (days.length < totalCells) {
      days.push(null);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(currentYear - 1);
    } else {
      newDate.setFullYear(currentYear + 1);
    }
    setCurrentDate(newDate);
  };

  const selectDate = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    // Don't allow future dates
    if (selectedDate > today) return;
    
    onDateSelect(selectedDate);
    onClose();
  };

  const selectMonth = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setViewMode('day');
  };

  const selectYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setViewMode('month');
  };

  const isDateSelected = (day: number) => {
    const testDate = new Date(currentYear, currentMonth, day);
    return testDate.toDateString() === initialDate.toDateString();
  };

  const isDateToday = (day: number) => {
    const testDate = new Date(currentYear, currentMonth, day);
    return testDate.toDateString() === today.toDateString();
  };

  const isDateFuture = (day: number) => {
    const testDate = new Date(currentYear, currentMonth, day);
    return testDate > today;
  };

  const renderDayView = () => (
    <View style={styles.calendarContainer}>
      {/* Month/Year Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity style={styles.calendarNavButton} onPress={() => navigateMonth('prev')}>
          <ChevronLeft size={20} color={Colors.dark.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.calendarHeaderText} onPress={() => setViewMode('month')}>
          <Text style={styles.calendarHeaderTitle}>
            {months[currentMonth]} {currentYear}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.calendarNavButton} onPress={() => navigateMonth('next')}>
          <ChevronRight size={20} color={Colors.dark.primary} />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Days */}
      <View style={styles.calendarGrid}>
        {generateCalendarDays().map((day, index) => {
          const dayStyles = [
            styles.calendarDay,
            !day ? styles.calendarDayEmpty : null,
            day && isDateSelected(day) ? styles.calendarDaySelected : null,
            day && isDateToday(day) && !isDateSelected(day) ? styles.calendarDayToday : null,
            day && isDateFuture(day) ? styles.calendarDayFuture : null,
          ].filter((style) => style !== null);

          const textStyles = [
            styles.calendarDayText,
            day && isDateSelected(day) ? styles.calendarDayTextSelected : null,
            day && isDateToday(day) && !isDateSelected(day) ? styles.calendarDayTextToday : null,
            day && isDateFuture(day) ? styles.calendarDayTextFuture : null,
          ].filter((style) => style !== null);

          return (
            <TouchableOpacity
              key={index}
              style={dayStyles}
              onPress={() => day && selectDate(day)}
              disabled={!day || isDateFuture(day)}
            >
              {day && (
                <Text style={textStyles}>
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderMonthView = () => (
    <View style={styles.calendarContainer}>
      {/* Year Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity style={styles.calendarNavButton} onPress={() => navigateYear('prev')}>
          <ChevronLeft size={20} color={Colors.dark.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.calendarHeaderText} onPress={() => setViewMode('year')}>
          <Text style={styles.calendarHeaderTitle}>{currentYear}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.calendarNavButton} onPress={() => navigateYear('next')}>
          <ChevronRight size={20} color={Colors.dark.primary} />
        </TouchableOpacity>
      </View>

      {/* Months Grid */}
      <View style={styles.monthsGrid}>
        {months.map((month, index) => (
          <TouchableOpacity
            key={month}
            style={[
              styles.monthCell,
              index === currentMonth && styles.monthCellSelected,
            ]}
            onPress={() => selectMonth(index)}
          >
            <Text style={[
              styles.monthText,
              index === currentMonth && styles.monthTextSelected,
            ]}>
              {month.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderYearView = () => {
    const startYear = Math.floor(currentYear / 10) * 10;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <View style={styles.calendarContainer}>
        {/* Decade Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.calendarNavButton} 
            onPress={() => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(startYear - 10);
              setCurrentDate(newDate);
            }}
          >
            <ChevronLeft size={20} color={Colors.dark.primary} />
          </TouchableOpacity>
          
          <View style={styles.calendarHeaderText}>
            <Text style={styles.calendarHeaderTitle}>
              {startYear} - {startYear + 9}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.calendarNavButton} 
            onPress={() => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(startYear + 10);
              setCurrentDate(newDate);
            }}
          >
            <ChevronRight size={20} color={Colors.dark.primary} />
          </TouchableOpacity>
        </View>

        {/* Years Grid */}
        <View style={styles.yearsGrid}>
          {years.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearCell,
                year === currentYear && styles.yearCellSelected,
              ]}
              onPress={() => selectYear(year)}
            >
              <Text style={[
                styles.yearText,
                year === currentYear && styles.yearTextSelected,
              ]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.datePickerOverlay}>
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
          </View>

          <View style={styles.datePickerContent}>
            {viewMode === 'day' && renderDayView()}
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'year' && renderYearView()}
          </View>

          <View style={styles.datePickerActions}>
            <TouchableOpacity style={styles.dateCancelButton} onPress={onClose}>
              <Text style={styles.dateCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateTodayButton} 
              onPress={() => {
                onDateSelect(today);
                onClose();
              }}
            >
              <Text style={styles.dateTodayText}>Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Add Meal Modal Component
interface AddMealModalProps {
  visible: boolean;
  mealType: string;
  selectedDate: Date;
  onClose: () => void;
  onSave: (meal: Omit<MealEntry, 'id'>) => void;
}

function AddMealModal({ visible, mealType, selectedDate, onClose, onSave }: AddMealModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Initialize with current time when modal opens
  useState(() => {
    if (visible && !selectedTime) {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);
      setSelectedTime(timeString);
    }
  });

  const handleSave = () => {
    if (!name.trim() || !calories.trim()) return;

    const timeToUse = selectedTime || new Date().toTimeString().slice(0, 5);

    const newMeal: Omit<MealEntry, 'id'> = {
      name: name.trim(),
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      time: timeToUse,
      type: mealType.toLowerCase() as MealEntry['type'],
      date: selectedDate.toDateString(),
    };

    onSave(newMeal);
    
    // Reset form
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSelectedTime('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSelectedTime('');
    onClose();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle water separately
  if (mealType.toLowerCase() === 'water') {
    const handleAddWater = () => {
      const timeToUse = selectedTime || new Date().toTimeString().slice(0, 5);
      
      const waterEntry: Omit<MealEntry, 'id'> = {
        name: 'Water (250ml)',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        time: timeToUse,
        type: 'water',
        date: selectedDate.toDateString(),
      };
      
      onSave(waterEntry);
      setSelectedTime('');
      onClose();
    };

    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.waterModal}>
            <Text style={styles.waterModalTitle}>Add Water</Text>
            <Text style={styles.waterModalText}>Add 250ml of water to your daily intake?</Text>
            
            {/* Time Selection for Water */}
            <View style={styles.waterTimeSection}>
              <Text style={styles.waterTimeLabel}>Time:</Text>
              <TouchableOpacity 
                style={styles.timeSelectButton} 
                onPress={() => setShowTimePicker(true)}
              >
                <Clock size={16} color={Colors.dark.primary} />
                <Text style={styles.timeSelectText}>
                  {selectedTime || new Date().toTimeString().slice(0, 5)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.waterModalButtons}>
              <TouchableOpacity style={styles.waterModalCancel} onPress={handleClose}>
                <Text style={styles.waterModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.waterModalAdd} onPress={handleAddWater}>
                <Text style={styles.waterModalAddText}>Add Water</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <CustomTimePicker
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onTimeSelect={handleTimeSelect}
          initialTime={selectedTime || new Date().toTimeString().slice(0, 5)}
        />
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={0}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addMealModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add {mealType}</Text>
            </View>

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              keyboardDismissMode="interactive"
            >
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Food Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g., Grilled Chicken Breast"
                  placeholderTextColor={Colors.dark.text}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time</Text>
                <TouchableOpacity 
                  style={styles.timeSelectButton} 
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={16} color={Colors.dark.primary} />
                  <Text style={styles.timeSelectText}>
                    {selectedTime || new Date().toTimeString().slice(0, 5)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Calories</Text>
                <TextInput
                  style={styles.textInput}
                  value={calories}
                  onChangeText={setCalories}
                  placeholder="250"
                  placeholderTextColor={Colors.dark.text}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.macroRow}>
                <View style={styles.macroInput}>
                  <Text style={styles.inputLabel}>Protein (g)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={protein}
                    onChangeText={setProtein}
                    placeholder="25"
                    placeholderTextColor={Colors.dark.text}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.macroInput}>
                  <Text style={styles.inputLabel}>Carbs (g)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={carbs}
                    onChangeText={setCarbs}
                    placeholder="30"
                    placeholderTextColor={Colors.dark.text}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.macroInput}>
                  <Text style={styles.inputLabel}>Fat (g)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={fat}
                    onChangeText={setFat}
                    placeholder="10"
                    placeholderTextColor={Colors.dark.text}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              
              {/* Add action buttons inside scroll view for keyboard accessibility */}
              <View style={styles.inlineActions}>
                <TouchableOpacity style={styles.inlineCancelButton} onPress={handleClose}>
                  <Text style={styles.inlineCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.inlineSaveButton, (!name.trim() || !calories.trim()) && styles.disabledButton]} 
                  onPress={handleSave}
                  disabled={!name.trim() || !calories.trim()}
                >
                  <Save size={18} color={Colors.dark.white} />
                  <Text style={styles.inlineSaveText}>Add Meal</Text>
                </TouchableOpacity>
              </View>
              
              {/* Add extra bottom padding to ensure buttons are always accessible */}
              <View style={styles.modalContentPadding} />
            </ScrollView>
          </View>
        </View>

        <CustomTimePicker
          visible={showTimePicker}
          onClose={() => setShowTimePicker(false)}
          onTimeSelect={handleTimeSelect}
          initialTime={selectedTime || new Date().toTimeString().slice(0, 5)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function NutritionScreen() {
  // Modal state
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // User's daily goals
  const dailyGoals = {
    calories: 2500,
    protein: 180,
    carbs: 250,
    fat: 80,
    water: 3000, // ml
  };
  
  // Sample data for the day's entries - now with dates
  const [mealEntries, setMealEntries] = useState<MealEntry[]>([
    { 
      id: 1, 
      name: "Oatmeal with Berries", 
      calories: 350, 
      protein: 12, 
      carbs: 60, 
      fat: 7, 
      time: "07:30", 
      type: "breakfast",
      date: new Date().toDateString()
    },
    { 
      id: 2, 
      name: "Pre-workout Shake", 
      calories: 200, 
      protein: 30, 
      carbs: 5, 
      fat: 2, 
      time: "10:00", 
      type: "workout",
      date: new Date().toDateString()
    },
    { 
      id: 3, 
      name: "Grilled Chicken Salad", 
      calories: 450, 
      protein: 35, 
      carbs: 25, 
      fat: 20, 
      time: "13:00", 
      type: "lunch",
      date: new Date().toDateString()
    },
    { 
      id: 4, 
      name: "Water (250ml)", 
      calories: 0, 
      protein: 0, 
      carbs: 0, 
      fat: 0, 
      time: "14:30", 
      type: "water",
      date: new Date().toDateString()
    },
    { 
      id: 5, 
      name: "Protein Bar", 
      calories: 230, 
      protein: 20, 
      carbs: 25, 
      fat: 7, 
      time: "16:00", 
      type: "snack",
      date: new Date().toDateString()
    }
  ]);

  // Handle adding a new meal
  const handleAddMeal = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowAddMealModal(true);
  };

  const handleSaveMeal = (newMeal: Omit<MealEntry, 'id'>) => {
    const newId = Math.max(...mealEntries.map(entry => entry.id), 0) + 1;
    const mealWithId = { 
      ...newMeal, 
      id: newId,
      date: selectedDate.toDateString() // Save with selected date
    };
    setMealEntries([...mealEntries, mealWithId]);
  };

  // Filter meals for selected date
  const selectedDateString = selectedDate.toDateString();
  const todaysMeals = mealEntries.filter(entry => entry.date === selectedDateString);

  // Calculate totals for selected date
  const totalCalories = todaysMeals.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = todaysMeals.reduce((sum, entry) => sum + entry.fat, 0);
  const totalWater = todaysMeals
    .filter(entry => entry.type === "water")
    .reduce((sum, entry) => sum + 250, 0); // Assuming each water entry is 250ml
  
  // Calculate progress percentages (capped at 100%)
  const caloriesProgress = Math.min(100, (totalCalories / dailyGoals.calories) * 100);
  const proteinProgress = Math.min(100, (totalProtein / dailyGoals.protein) * 100);
  const carbsProgress = Math.min(100, (totalCarbs / dailyGoals.carbs) * 100);
  const fatProgress = Math.min(100, (totalFat / dailyGoals.fat) * 100);
  const waterProgress = Math.min(100, (totalWater / dailyGoals.water) * 100);
  
  // Quick add meal options
  const mealTypes = [
    { name: "Breakfast", icon: Coffee },
    { name: "Lunch", icon: UtensilsCrossed },
    { name: "Dinner", icon: Salad },
    { name: "Workout", icon: Dumbbell },
    { name: "Snack", icon: Cookie },
    { name: "Water", icon: Droplet },
  ];

  // Function to get icon based on meal type
  const getMealIcon = (type: string) => {
    switch(type) {
      case "breakfast": return Coffee;
      case "lunch": return UtensilsCrossed;
      case "dinner": return Salad;
      case "workout": return Dumbbell;
      case "snack": return Cookie;
      case "water": return Droplet;
      default: return UtensilsCrossed;
    }
  };
  
  // Format selected date
  const getSelectedDateString = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return selectedDate.toLocaleDateString('en-GB', options);
  };

  // Handle date change
  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDateButtonPress = () => {
    setShowDatePicker(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title Bar */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{getSelectedDateString()}</Text>
        <TouchableOpacity style={styles.dateButton} onPress={handleDateButtonPress}>
          <CalendarDays size={20} color={Colors.dark.primary} />
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <CustomDatePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setShowDatePicker(false);
          }}
          initialDate={selectedDate}
        />
      )}

      {/* Quick Add Options */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {mealTypes.map((meal, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => handleAddMeal(meal.name)}
          >
            <meal.icon size={24} color={Colors.dark.primary} />
            <Text style={styles.categoryName}>{meal.name}</Text>
            <PlusCircle size={16} color={Colors.dark.primary} style={styles.addIcon} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Daily Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.sectionTitle}>Daily Summary</Text>
          <TouchableOpacity style={styles.summaryButton}>
            <BarChart3 size={16} color={Colors.dark.white} />
          </TouchableOpacity>
        </View>

        {/* Calories */}
        <View style={styles.macroItem}>
          <View style={styles.macroInfo}>
            <Text style={styles.macroName}>Calories</Text>
            <Text style={styles.macroValue}>
              {totalCalories} / {dailyGoals.calories} kcal
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${caloriesProgress}%` }]} />
          </View>
        </View>

        {/* Protein */}
        <View style={styles.macroItem}>
          <View style={styles.macroInfo}>
            <Text style={styles.macroName}>Protein</Text>
            <Text style={styles.macroValue}>
              {totalProtein} / {dailyGoals.protein} g
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${proteinProgress}%` }]} />
          </View>
        </View>

        {/* Carbs */}
        <View style={styles.macroItem}>
          <View style={styles.macroInfo}>
            <Text style={styles.macroName}>Carbs</Text>
            <Text style={styles.macroValue}>
              {totalCarbs} / {dailyGoals.carbs} g
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${carbsProgress}%` }]} />
          </View>
        </View>

        {/* Fat */}
        <View style={styles.macroItem}>
          <View style={styles.macroInfo}>
            <Text style={styles.macroName}>Fat</Text>
            <Text style={styles.macroValue}>
              {totalFat} / {dailyGoals.fat} g
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${fatProgress}%` }]} />
          </View>
        </View>

        {/* Water */}
        <View style={styles.macroItem}>
          <View style={styles.macroInfo}>
            <Text style={styles.macroName}>Water</Text>
            <Text style={styles.macroValue}>
              {totalWater} / {dailyGoals.water} ml
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${waterProgress}%` }]} />
          </View>
        </View>
      </View>

      {/* Today's Meals */}
      <View style={styles.mealsCard}>
        <View style={styles.mealsTopContainer}>
          <Text style={styles.sectionTitle}>Meals for Selected Date</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddMeal('Meal')}>
            <Plus size={16} color={Colors.dark.white} />
          </TouchableOpacity>
        </View>

        {todaysMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No meals logged for this date</Text>
            <Text style={styles.emptyStateSubtext}>Tap the + button above to add a meal</Text>
          </View>
        ) : (
          todaysMeals.map((entry) => {
            const EntryIcon = getMealIcon(entry.type);
            return (
              <TouchableOpacity
                key={entry.id}
                style={styles.mealItem}
                onPress={() => alert(`View ${entry.name} details - Feature coming soon!`)}
              >
                <View style={styles.mealIconContainer}>
                  <EntryIcon size={20} color={Colors.dark.primary} />
                </View>
                
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{entry.name}</Text>
                  <Text style={styles.mealTime}>{entry.time}</Text>
                </View>
                
                <View style={styles.mealMacro}>
                  <Text style={styles.mealCalories}>{entry.calories} kcal</Text>
                  <View style={styles.macroDetails}>
                    <Text style={styles.macroText}>P: {entry.protein}g</Text>
                    <Text style={styles.macroText}>C: {entry.carbs}g</Text>
                    <Text style={styles.macroText}>F: {entry.fat}g</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Weekly Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.sectionTitle}>Weekly Stats</Text>
          <TouchableOpacity style={styles.statsButton}>
            <TrendingUp size={16} color={Colors.dark.white} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.statsSubheading}>Average Daily Calories</Text>
        <Text style={styles.statsBigValue}>2,340 kcal</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Protein</Text>
            <Text style={styles.statValue}>175g</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Carbs</Text>
            <Text style={styles.statValue}>230g</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Fat</Text>
            <Text style={styles.statValue}>75g</Text>
          </View>
        </View>
      </View>

      {/* Add Meal Modal */}
      <AddMealModal
        visible={showAddMealModal}
        mealType={selectedMealType}
        selectedDate={selectedDate}
        onClose={() => setShowAddMealModal(false)}
        onSave={handleSaveMeal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20, // Add vertical padding for keyboard scenarios
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.white,
  },
  dateButton: {
    backgroundColor: Colors.dark.secondary,
    padding: 8,
    borderRadius: 12,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryItem: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    alignItems: "center",
    minWidth: 100,
    height: 90,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  categoryName: {
    color: Colors.dark.white,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  addIcon: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  summaryCard: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryButton: {
    backgroundColor: Colors.dark.primary,
    padding: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    color: Colors.dark.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  macroItem: {
    marginBottom: 12,
  },
  macroInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  macroName: {
    color: Colors.dark.white,
    fontSize: 14,
    fontWeight: "500",
  },
  macroValue: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.dark.tertiary,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.dark.primary,
  },
  mealsCard: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mealsTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.dark.primary,
    padding: 8,
    borderRadius: 8,
  },
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
  },
  mealIconContainer: {
    backgroundColor: `${Colors.dark.primary}20`,
    padding: 8,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "500",
  },
  mealTime: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  mealMacro: {
    alignItems: "flex-end",
  },
  mealCalories: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "500",
  },
  macroDetails: {
    flexDirection: "row",
    marginTop: 2,
  },
  macroText: {
    color: Colors.dark.text,
    fontSize: 12,
    marginLeft: 6,
  },
  statsCard: {
    backgroundColor: Colors.dark.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsButton: {
    backgroundColor: Colors.dark.primary,
    padding: 8,
    borderRadius: 8,
  },
  statsSubheading: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  statsBigValue: {
    color: Colors.dark.white,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  statValue: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "500",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    color: Colors.dark.text,
    fontSize: 14,
    textAlign: "center",
  },
  // Modal Styles - Made compact and centered like water modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  addMealModal: {
    backgroundColor: Colors.dark.background,
    borderRadius: 24, // Rounded all corners like water modal
    height: 600, // Fixed height instead of maxHeight
    maxWidth: 400, // Maximum width for larger screens
    alignSelf: "center",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center", // Center the title since no close button
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
    height: 80, // Fixed header height
  },
  modalTitle: {
    color: Colors.dark.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  modalContent: {
    flex: 1, // Take remaining space after header
    paddingHorizontal: 0, // Remove padding here since it's in container
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80, // Increased bottom padding for better keyboard space
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
    borderRadius: 12,
    padding: 16,
    color: Colors.dark.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    height: 52, // Fixed input height
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // Increase gap for better spacing
    marginBottom: 20, // Add bottom margin for keyboard space
  },
  macroInput: {
    flex: 1,
    minWidth: 0, // Prevent overflow issues
  },
  disabledButton: {
    backgroundColor: Colors.dark.tertiary,
    opacity: 0.7,
  },
  // Water Modal Styles - Made more compact
  waterModal: {
    backgroundColor: Colors.dark.background,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
    maxHeight: 400, // Limit height
  },
  waterModalTitle: {
    color: Colors.dark.primary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  waterModalText: {
    color: Colors.dark.white,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  waterModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  waterModalCancel: {
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    marginRight: 12,
    alignItems: "center",
    height: 44,
    justifyContent: "center",
  },
  waterModalCancelText: {
    color: Colors.dark.white,
    fontWeight: "600",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  waterModalAdd: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    height: 44,
    justifyContent: "center",
  },
  waterModalAddText: {
    color: Colors.dark.white,
    fontWeight: "600",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  // Time Picker Styles - Made more compact and mobile-friendly
  timePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center", // Center instead of flex-end
    paddingHorizontal: 20,
  },
  timePickerModal: {
    backgroundColor: Colors.dark.background,
    borderRadius: 24,
    height: 400, // Fixed height
    maxWidth: 400, // Maximum width
    alignSelf: "center",
    width: "100%",
  },
  timePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
    height: 70, // Fixed height
  },
  timePickerTitle: {
    color: Colors.dark.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  timePickerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  timePickerContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeColumn: {
    alignItems: "center",
    marginHorizontal: 15,
  },
  timeButton: {
    backgroundColor: Colors.dark.secondary,
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
    width: 40, // Fixed width
    height: 40, // Fixed height
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
  },
  timeDisplay: {
    backgroundColor: Colors.dark.tertiary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
    width: 70, // Fixed width
    height: 60, // Fixed height
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  timeText: {
    color: Colors.dark.white,
    fontSize: 20, // Reduced font size
    fontWeight: "bold",
  },
  timeSeparator: {
    color: Colors.dark.primary,
    fontSize: 24, // Reduced font size
    fontWeight: "bold",
    marginHorizontal: 8, // Reduced margin
  },
  periodColumn: {
    alignItems: "center",
    marginLeft: 15,
  },
  periodButton: {
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    width: 50, // Fixed width
    height: 36, // Fixed height
    alignItems: "center",
    justifyContent: "center",
  },
  periodButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  periodText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: "600",
  },
  periodTextActive: {
    color: Colors.dark.white,
  },
  timePickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.tertiary,
    height: 80, // Fixed height
  },
  timeCancelButton: {
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  timeCancelText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  timeConfirmButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  timeConfirmText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  timeSelectButton: {
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52, // Fixed height to match other inputs
  },
  timeSelectText: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  waterTimeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    justifyContent: "space-between",
  },
  waterTimeLabel: {
    color: Colors.dark.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // Date Picker Styles - Completely redesigned for mobile
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  datePickerModal: {
    backgroundColor: Colors.dark.background,
    borderRadius: 24,
    height: 500, // Fixed height
    maxWidth: 400, // Maximum width
    alignSelf: "center",
    width: "100%",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.tertiary,
    height: 70, // Fixed height
  },
  datePickerTitle: {
    color: Colors.dark.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  datePickerCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  datePickerContent: {
    flex: 1,
    padding: 16,
  },
  calendarContainer: {
    width: '100%',
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    height: 50, // Fixed height
  },
  calendarNavButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
    width: 40, // Fixed width
    height: 40, // Fixed height
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
  },
  calendarHeaderText: {
    flex: 1,
    marginHorizontal: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.dark.secondary,
    alignItems: "center",
    justifyContent: "center",
    height: 40, // Fixed height
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
  },
  calendarHeaderTitle: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  weekDaysContainer: {
    flexDirection: "row",
    marginBottom: 8,
    height: 30, // Fixed height
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  weekDayCell: {
    width: "13.5%", // Match calendar day width
    alignItems: "center",
    justifyContent: "center",
  },
  weekDayText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: "600",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  calendarDay: {
    width: "13.5%", // Slightly smaller to ensure 7 fit per row with margins
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: Colors.dark.secondary,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    marginBottom: 2,
    marginHorizontal: 1,
  },
  calendarDayEmpty: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  calendarDaySelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  calendarDayToday: {
    backgroundColor: Colors.dark.tertiary,
    borderColor: Colors.dark.primary,
    borderWidth: 2,
  },
  calendarDayText: {
    color: Colors.dark.white,
    fontSize: 14,
    fontWeight: "500",
  },
  calendarDayTextSelected: {
    color: Colors.dark.white,
    fontWeight: "700",
  },
  calendarDayTextToday: {
    color: Colors.dark.primary,
    fontWeight: "700",
  },
  calendarDayFuture: {
    backgroundColor: Colors.dark.tertiary,
    opacity: 0.5,
  },
  calendarDayTextFuture: {
    color: Colors.dark.text,
    opacity: 0.5,
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  monthCell: {
    width: "31%", // 3 months per row with gaps
    height: 50, // Fixed height
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.dark.secondary,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    marginBottom: 8,
  },
  monthCellSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  monthText: {
    color: Colors.dark.white,
    fontSize: 14,
    fontWeight: "600",
  },
  monthTextSelected: {
    color: Colors.dark.white,
    fontWeight: "700",
  },
  yearsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  yearCell: {
    width: "31%", // 3 years per row with gaps
    height: 50, // Fixed height
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: Colors.dark.secondary,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    marginBottom: 8,
  },
  yearCellSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  yearText: {
    color: Colors.dark.white,
    fontSize: 14,
    fontWeight: "600",
  },
  yearTextSelected: {
    color: Colors.dark.white,
    fontWeight: "700",
  },
  datePickerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.tertiary,
    height: 80, // Fixed height
  },
  dateCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    marginRight: 12,
    alignItems: "center",
    backgroundColor: Colors.dark.secondary,
    height: 44,
    justifyContent: "center",
  },
  dateCancelText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  dateTodayButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.dark.primary,
    height: 44,
    justifyContent: "center",
  },
  dateTodayText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  modalContentPadding: {
    height: 60, // Increased padding for better keyboard clearance
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inlineActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.tertiary,
    height: 120,
  },
  inlineCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.tertiary,
    flex: 1,
    marginRight: 12,
    alignItems: "center",
    backgroundColor: Colors.dark.secondary,
    height: 50,
    justifyContent: "center",
  },
  inlineCancelText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
  },
  inlineSaveButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    minHeight: 50,
  },
  inlineSaveText: {
    color: Colors.dark.white,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
});