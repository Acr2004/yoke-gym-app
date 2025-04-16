import { Text, View, ScrollView, TouchableOpacity, StyleSheet, TextInput, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Search, ChevronRight, Dumbbell, Plus, Filter, Star, Clock, TrendingUp } from "lucide-react-native";
import { Exercise, getAllExercises } from "@/api/exercises";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useExercises } from "@/contexts/ExercisesContext";

export default function LibraryScreen() {
    // Search
    const [searchQuery, setSearchQuery] = useState("");
    // Loading
    const [page, setPage] = useState(1);
    const [allLoaded, setAllLoaded] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const scrollViewRef = useRef(null);
    // Exercises
    const [displayedExercises, setDisplayedExercises] = useState<Exercise[]>([]);
    // Filters
    const [activeFastFilter, setActiveFastFilter] = useState<"all" | "favorites" | "recents" | "populars">("all");

    const { exercises, favorites, handleSetFavorites } = useExercises();
    
    // Fast Filters
    const categories = [
        { name: "All Exercises", count: 554, icon: Dumbbell },
        { name: "Favorites", count: favorites.size, icon: Star },
        { name: "Recent", count: 8, icon: Clock },
        { name: "Popular", count: 24, icon: TrendingUp },
    ];

    function handleClickFastFilter(categoryName: string) {
        switch (categoryName) {
            case "Favorites":
                setActiveFastFilter("favorites");
                break;
            case "Recent":
                setActiveFastFilter("recents");
                break;
            case "Popular":
                setActiveFastFilter("populars");
                break;
            default:
                setActiveFastFilter("all");
        }
    }  

    // Get first 50 Filtered Exercises from the List
    useEffect(() => {
        let filteredExercises = exercises;

        // Check Fast Filters
        switch (activeFastFilter) {
            case "favorites":
                filteredExercises = exercises.filter((ex: Exercise) => favorites.has(ex.id));
                break;
            case "recents":
                // Aplica a lógica de exercícios recentes
                break;
            case "populars":
                // Aplica a lógica de exercícios populares
                break;
            default:
                break;
        }

        // Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredExercises = filteredExercises.filter((exercise: Exercise) => exercise.name.toLowerCase().includes(query));
        }

        filteredExercises.sort((a: Exercise, b: Exercise) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        setPage(1);
        setAllLoaded(false);

        const initialExercises = filteredExercises.slice(0, 50);
        setDisplayedExercises(initialExercises);

        if(initialExercises.length >= filteredExercises.length) {
            setAllLoaded(true);
        }
    }, [activeFastFilter, searchQuery, favorites]);

    // Load more 50 Exercises from the List
    const loadMoreExercises = () => {
        if(isLoadingMore || allLoaded) return;

        setIsLoadingMore(true);

        setTimeout(() => {
            let filteredExercises = exercises;

            switch (activeFastFilter) {
                case "favorites":
                    filteredExercises = exercises.filter((ex: Exercise) => favorites.has(ex.id));
                    break;
                case "recents":
                    // TODO RECENTS
                    break;
                case "populars":
                    // TODO POPULARS
                    break;
                default:
                    break;
            }
    
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filteredExercises = filteredExercises.filter((exercise: Exercise) => exercise.name.toLowerCase().includes(query));
            }

            filteredExercises.sort((a: Exercise, b: Exercise) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

            const endIndex = (page + 1) * 50
            const newExercises = filteredExercises.slice(0, endIndex);

            setDisplayedExercises(newExercises);
            setPage(page + 1);

            if(newExercises.length >= filteredExercises.length) {
                setAllLoaded(true);
            }

            setIsLoadingMore(false);
        }, 1);
    };

    // Check if User scrolls to load more Exercises
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const paddingToBottom = 300;

        if(layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom - (layoutMeasurement.height * 0.2)) {
            loadMoreExercises();
        }
    };

    // Toggle Favorite Exercise
    const toggleFavorite = (exerciseId: number) => {
        const newFavorites = new Set(favorites);

        if(newFavorites.has(exerciseId)) {
            newFavorites.delete(exerciseId)
            handleSetFavorites(newFavorites);
        }
        else {
            handleSetFavorites(newFavorites.add(exerciseId));
        }
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={styles.container}
            onScroll={handleScroll}
            scrollEventThrottle={32}
        >
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Search size={20} color={Colors.dark.text} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search exercises..."
                        placeholderTextColor={Colors.dark.text}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.filterButton}
                >
                    <Filter size={20} color={Colors.dark.primary} />
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.categoryItem}
                        onPress={() => handleClickFastFilter(category.name)}
                    >
                        <category.icon size={24} color={Colors.dark.primary} />
                        <Text style={styles.categoryName}>{category.name}</Text>
                        <Text style={styles.categoryCount}>{category.count}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Exercises List */}
            <View style={styles.exercisesCard}>
                <View style={styles.exercisesTopContainer}>
                    <Text style={styles.sectionTitle}>Exercises</Text>
                    {/* Add Exercise Button */}
                    <TouchableOpacity 
                        style={styles.addButton}
                    >
                        <Plus size={16} color={Colors.dark.white} />
                    </TouchableOpacity>
                </View>

                {/* Exercises */}
                {displayedExercises.map((exercise) => (
                    <TouchableOpacity 
                        key={exercise.id} 
                        style={styles.exerciseItem}
                        onPress={() => router.push(`/exercise/${exercise.id}`)}
                    >
                        {/* Favorite Icon */}
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                toggleFavorite(exercise.id);
                            }}
                            style={styles.favoriteButton}
                        >
                            <Star
                                size={20}
                                color={Colors.dark.primary}
                                fill={favorites.has(exercise.id) ? Colors.dark.primary : 'transparent'}
                            />
                        </TouchableOpacity>

                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <View style={styles.exerciseTags}>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{exercise.bodyPart.charAt(0).toUpperCase()}{exercise.bodyPart.slice(1)}</Text>
                                </View>
                                <View style={styles.tag}>
                                    <Text style={styles.tagText}>{exercise.difficulty.charAt(0).toUpperCase()}{exercise.difficulty.substring(1)}</Text>
                                </View>
                            </View>
                            <Text style={styles.exerciseDescription} numberOfLines={2}>
                                {exercise.description}
                            </Text>
                        </View>
                        <ChevronRight size={20} color={Colors.dark.text} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        padding: 16,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.dark.secondary,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: Colors.dark.white,
        marginLeft: 8,
        fontSize: 16,
    },
    filterButton: {
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
    },
    categoryName: {
        color: Colors.dark.white,
        fontSize: 14,
        fontWeight: "500",
        marginTop: 4,
    },
    categoryCount: {
        color: Colors.dark.text,
        fontSize: 12,
        marginTop: 2,
    },
    exercisesCard: {
        backgroundColor: Colors.dark.secondary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        color: Colors.dark.primary,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: Colors.dark.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        gap: 4,
        borderRadius: 8,
        marginBottom: 16,
    },
    exercisesTopContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    exerciseItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.tertiary,
    },
    exerciseInfo: {
        flex: 1,
        marginRight: 12,
        marginLeft: 8,
    },
    exerciseName: {
        color: Colors.dark.white,
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    exerciseTags: {
        flexDirection: "row",
        marginBottom: 4,
    },
    tag: {
        backgroundColor: Colors.dark.tertiary,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
    },
    tagText: {
        color: Colors.dark.primary,
        fontSize: 12,
    },
    exerciseDescription: {
        color: Colors.dark.text,
        fontSize: 14,
    },
    favoriteButton: {
        paddingHorizontal: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
    },
});