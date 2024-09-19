import { useAuth } from "@/contexts/auth/use-auth";
import { Redirect, Stack } from "expo-router";
import { Text } from "tamagui";
import { View } from "react-native";

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    // Afficher un indicateur de chargement tant que le token est en cours de chargement
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
    if (!isAuthenticated) {
        return <Redirect href="/auth/login" />;
    }

    // Si l'utilisateur est authentifié, rendre la navigation de l'application
    return <Stack />;
}
