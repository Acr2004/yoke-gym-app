import data from "./gymDB.json";

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

export function getAllExercises() {
    return data;
}