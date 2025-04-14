import { Tabs } from "expo-router";
import { ChefHat, Dumbbell, History, LibraryBig, UserRound } from "lucide-react-native";

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: "#0C0F14",
                },
                headerTitleStyle: {
                    color: "#E09F28",
                    fontWeight: "bold",
                },
                headerTitleAlign: "center",
                tabBarStyle: {
                    backgroundColor: "#0C0F14",
                },
                tabBarActiveTintColor: "#E09F28",
            }}
        >
            <Tabs.Screen
                name="nutrition"
                options={{
                    title: "Nutrition",
                    tabBarIcon: ({ color }) => <ChefHat color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    title: "Library",
                    tabBarIcon: ({ color }) => <LibraryBig color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Workouts",
                    tabBarIcon: ({ color }) => <Dumbbell color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color }) => <History color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <UserRound color={color} size={24} />,
                }}
            />
        </Tabs>
    );
} 