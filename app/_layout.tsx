import * as SystemUI from "expo-system-ui";
import { ExercisesProvider } from "@/contexts/ExercisesContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

SystemUI.setBackgroundColorAsync("#0C0F14");

export default function RootLayout() {
    return (
        <ExercisesProvider>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
            </Stack>  
            <StatusBar style="light" />
        </ExercisesProvider>
    );
}