import { Colors } from "@/constants/Colors";
import { Tabs } from "expo-router";
import { ChefHat, Dumbbell, History, LibraryBig, UserRound } from "lucide-react-native";

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: Colors.dark.background,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    color: Colors.dark.primary,
                    fontWeight: "bold",
                },
                headerTitleAlign: "center",
                tabBarStyle: {
                    backgroundColor: Colors.dark.background,
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: Colors.dark.primary,
                tabBarHideOnKeyboard: true,
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