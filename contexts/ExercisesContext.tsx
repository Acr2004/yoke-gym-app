import { Exercise, getAllExercises } from '@/api/exercises';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';

type ExerciseContextType = {
    exercises: Exercise[];
    favorites: Set<number>;
    recentExercises: number[];
    popularExercises: number[];
    handleSetFavorites: (newFavorites: Set<number>) => void;
    handleSetRecents: (newRecents: number[]) => void;
    selectedExercise: Exercise | null;
    handleSetSelectedExercise: (exercise: Exercise) => void;
    handleAddExercise: (newExercise: Omit<Exercise, "id">) => Promise<void>;
};

const ExercisesContext = createContext<ExerciseContextType | null>(null);

export const ExercisesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [favorites, setFavorites] = useState<Set<number>>(new Set);
    const [recentExercises, setRecentExercises] = useState<number[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

    const popularExercises = [
        212, 213, 215, 216, 238, 271, 276, 300, 341, 344, 
    ];

    async function handleSetFavorites(newFavorites: Set<number>) {
        await AsyncStorage.setItem("@yoke-favoritedExercises", JSON.stringify(Array.from(newFavorites)));
        setFavorites(newFavorites);
    }

    async function handleSetRecents(newRecents: number[]) {
        await AsyncStorage.setItem("@yoke-recentExercises", JSON.stringify(newRecents));
        setRecentExercises(newRecents);
    }

    async function handleSetSelectedExercise(exercise: Exercise) {
        setSelectedExercise(exercise);
    }

    // Load Exercises, Favorites and Recents
    useEffect(() => {
        const loadData = async () => {
            const exercisesJSON = await getAllExercises();
            setExercises(exercisesJSON);

            try {
                const storedFavorites = await AsyncStorage.getItem("@yoke-favoritedExercises");
                if (storedFavorites) {
                    setFavorites(new Set(JSON.parse(storedFavorites)));
                }
            }
            catch (error) {
                console.error("Failed to load favorites:", error);
            }

            try {
                const storedRecents = await AsyncStorage.getItem("@yoke-recentExercises");
                if (storedRecents) {
                    setRecentExercises(JSON.parse(storedRecents));
                }
            }
            catch (error) {
                console.error("Failed to load recents:", error);
            }
        };
    
        loadData();
    }, []);

    // Update Exercises
    async function handleAddExercise(newExercise: Omit<Exercise, "id">) {
        try {
            const storedExercises = await AsyncStorage.getItem("@yoke-customExercises");
            let customExercises: Exercise[] = storedExercises ? JSON.parse(storedExercises) : [];
    
            const newId = Math.max(...exercises.map(ex => ex.id), ...customExercises.map(ex => ex.id)) + 1;
    
            const completeExercise: Exercise = {
                id: newId,
                ...newExercise
            };

            customExercises.push(completeExercise);
            await AsyncStorage.setItem("@yoke-customExercises", JSON.stringify(customExercises));

            const updatedExercises = [...exercises, completeExercise];
            setExercises(updatedExercises);
        } catch (error) {
            console.error("Failed to add exercise:", error);
        }
    }    
    
    return (
        <ExercisesContext.Provider
            value={{
                exercises, favorites, recentExercises, popularExercises,
                handleSetFavorites, handleSetRecents,
                selectedExercise, handleSetSelectedExercise, handleAddExercise,
            }}
        >
            {children}
        </ExercisesContext.Provider>
    );
};

export const useExercises = (): ExerciseContextType => {
    const context = useContext(ExercisesContext);
    if (!context) {
        throw new Error('useExercises deve ser usado dentro de ExercisesProvider');
    }
    return context;
};