import { ExercisesProvider } from "@/contexts/ExercisesContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <ExercisesProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>  
            <StatusBar style="light" />
        </ExercisesProvider>
    );
}