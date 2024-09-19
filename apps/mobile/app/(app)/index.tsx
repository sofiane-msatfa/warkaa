import { Link, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/api/user";
import { UserLight } from "../../../common/dto/user-light";
import { YStack, XStack, Avatar, Button, Card, Text } from 'tamagui';
import { useAuth } from "@/contexts/auth/use-auth";

export default function Index() {
    const [user, setUser] = useState<UserLight | null>(null);
    const {isAuthenticated} = useAuth();
    const { logout } = useAuth();
    useEffect(() => {
        const currentUser = async () => {
            const response = await fetchCurrentUser();
            if (response) {
                console.log(response)
                setUser(response);
            } else {
                setUser(null);
            }
        };
        currentUser();
    }, []);

    const handleLogout = async () => {
        await logout();
        // return <Redirect href={'/auth/login'} />;
    };

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 16,
            }}
        >
            <YStack gap="$4" alignItems="center">
                <Text fontSize="$8" fontWeight="bold">Edit app/index.tsx to edit this screen.</Text>
                <Text fontSize="$6">Welcome</Text>
                {user && (
                    <Card width={300} padding="$4" borderRadius="$4" backgroundColor="$background">
                        <XStack gap="$4" alignItems="center">
                            <Avatar circular size="$6">
                                <Avatar.Image src="https://via.placeholder.com/150" />
                                <Avatar.Fallback backgroundColor="$gray10" />
                            </Avatar>
                            <YStack>
                                <Text fontSize="$6" fontWeight="bold">
                                    {user.firstname} {user.lastname}
                                </Text>
                                <Text fontSize="$4" color="$gray10">
                                    {user.email}
                                </Text>
                            </YStack>
                        </XStack>
                        <Button theme="active" marginTop="$4" onPress={handleLogout}>
                            Logout
                        </Button>
                    </Card>
                )}
                {!user && (
                    <>
                        <Link href="/auth/login">
                            Login
                        </Link>
                        <Link href="/auth/signup">
                            Signup
                        </Link>
                        <Link href="/(app)/upload">
                            Upload
                        </Link>
                    </>
                )}
            </YStack>
        </SafeAreaView>
    );
}