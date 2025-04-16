import { Exercise, getAllExercises } from '@/api/exercises';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useContext, useEffect } from 'react';

type ExerciseContextType = {
    exercises: Exercise[];
    favorites: Set<number>;
    handleSetFavorites: (newFavorites: Set<number>) => void;
};

const ExercisesContext = createContext<ExerciseContextType | null>(null);

export const ExercisesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [favorites, setFavorites] = useState<Set<number>>(new Set);

    async function handleSetFavorites(newFavorites: Set<number>) {
        await AsyncStorage.setItem("@yoke-favoritedExercises", JSON.stringify(Array.from(newFavorites)));
        setFavorites(newFavorites);
    }

    useEffect(() => {
        const loadFavorites = async () => {
            const exercisesJSON = getAllExercises();
            setExercises(exercisesJSON);

            try {
                const storedFavorites = await AsyncStorage.getItem("@yoke-favoritedExercises");
                if (storedFavorites) {
                    setFavorites(new Set(JSON.parse(storedFavorites)));
                }
            } catch (error) {
                console.error("Failed to load favorites:", error);
            }
        };
    
        loadFavorites();
    }, []);

    return (
        <ExercisesContext.Provider value={{ exercises, favorites, handleSetFavorites }}>
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