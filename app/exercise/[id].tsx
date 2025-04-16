import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { Exercise, getAllExercises } from "@/api/exercises";
import { Colors } from "@/constants/Colors";
import { ArrowLeft, Star } from "lucide-react-native";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExercises } from "@/contexts/ExercisesContext";

export default function ExerciseDetailScreen() {
    const { id } = useLocalSearchParams();
    const { exercises, favorites, handleSetFavorites } = useExercises();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);

    // Load Exercise Data
    useEffect(() => {
        const foundExercise = exercises.find(ex => ex.id === Number(id));
        setExercise(foundExercise || null);
    }, [id]);

    // Load Favorite Status
    useEffect(() => {
        if(exercise) {
            setIsFavorited(favorites.has(exercise.id));
        }
    }, [exercise, favorites]);

    // Toggle Favorite Status
    const toggleFavorite = async () => {
        if (!exercise) return;

        const newFavorites = new Set(favorites);

        if(newFavorites.has(exercise.id)) {
            newFavorites.delete(exercise.id)
            handleSetFavorites(newFavorites);
        }
        else {
            handleSetFavorites(newFavorites.add(exercise.id));
        }
    };

    if (!exercise) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Exercise not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.topBar}>
                <TouchableOpacity 
                    onPress={() => router.back()}
                    style={styles.headerButton}
                >
                    <ArrowLeft size={28} color={Colors.dark.primary} />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={toggleFavorite}
                    style={styles.headerButton}
                >
                    <Star
                        size={28}
                        color={Colors.dark.primary}
                        fill={isFavorited ? Colors.dark.primary : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{exercise.name}</Text>
                    <View style={styles.titleTags}>
                        <View style={[styles.pillTag, { backgroundColor: Colors.dark.primary + '20' }]}>
                            <Text style={styles.pillTagText}>
                                {exercise.bodyPart.charAt(0).toUpperCase() + exercise.bodyPart.slice(1)}
                            </Text>
                        </View>
                        <View style={[styles.pillTag, { backgroundColor: Colors.dark.primary + '20' }]}>
                            <Text style={styles.pillTagText}>
                                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{exercise.description}</Text>
                </View>

                {/* Muscles */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Muscles</Text>
                    <View style={styles.muscleRow}>
                        <Text style={styles.muscleLabel}>Target:</Text>
                        <Text style={styles.muscleText}>
                            {exercise.target.charAt(0).toUpperCase() + exercise.target.slice(1)}
                        </Text>
                    </View>
                    <View style={styles.muscleRow}>
                        <Text style={styles.muscleLabel}>Secondary:</Text>
                        <Text style={styles.muscleText}>
                            {exercise.secondaryMuscles
                                .map(muscle => muscle.charAt(0).toUpperCase() + muscle.slice(1))
                                .join(", ")}
                        </Text>
                    </View>
                </View>

                {/* Equipment */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Equipment</Text>
                    <Text style={styles.equipmentText}>
                        {exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}
                    </Text>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {exercise.instructions.map((instruction, index) => (
                        <View key={index} style={styles.instructionItem}>
                            <Text style={styles.instructionNumber}>{index + 1}.</Text>
                            <Text style={styles.instructionText}>{instruction}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    topBar: {
        marginTop: 40,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        padding: 20,
    },
    headerButton: {
        padding: 16,
    },
    errorText: {
        color: Colors.dark.white,
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
    titleSection: {
        marginBottom: 32,
    },
    title: {
        color: Colors.dark.white,
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 12,
    },
    titleTags: {
        flexDirection: "row",
        gap: 8,
    },
    pillTag: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pillTagText: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontWeight: "500",
    },
    section: {
        marginBottom: 32,
        backgroundColor: Colors.dark.secondary,
        borderRadius: 16,
        padding: 16,
    },
    sectionTitle: {
        color: Colors.dark.primary,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    description: {
        color: Colors.dark.white,
        fontSize: 16,
        lineHeight: 24,
    },
    muscleRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    muscleLabel: {
        color: Colors.dark.primary,
        fontSize: 16,
        fontWeight: "600",
        width: 100,
    },
    muscleText: {
        color: Colors.dark.white,
        fontSize: 16,
        flex: 1,
    },
    equipmentText: {
        color: Colors.dark.white,
        fontSize: 16,
    },
    instructionItem: {
        flexDirection: "row",
        marginBottom: 16,
        gap: 12,
    },
    instructionNumber: {
        color: Colors.dark.primary,
        fontSize: 16,
        fontWeight: "bold",
        minWidth: 30,
    },
    instructionText: {
        color: Colors.dark.white,
        fontSize: 16,
        flex: 1,
        lineHeight: 24,
    },
}); 