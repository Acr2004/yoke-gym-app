import data from "./gymDB.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Exercise {
    id: number;
    name: string;
    description: string;
    bodyPart: string;
    target: string;
    secondaryMuscles: string[];
    equipment: string;
    difficulty: string;
    instructions: string[];
}

export async function getAllExercises() {
    try {
        const storedExercises = await AsyncStorage.getItem("@yoke-customExercises");
        let customExercises: Exercise[] = [];
    
        if (storedExercises) {
          customExercises = JSON.parse(storedExercises);
        }

        return [...data, ...customExercises];
    } catch (error) {
        console.error("Failed to load custom exercises:", error);
        return data;
    }
}