import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import appConfig from "@/tamagui.config";
import {TamaguiProvider} from 'tamagui'
import {AuthContextProvider} from "@/contexts/auth/auth-provider";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <TamaguiProvider config={appConfig}>
            <AuthContextProvider>
                <Stack
                    screenOptions={{
                        // headerShown: false
                    }}
                >
                    <Stack.Screen name="index"/>
                    <Stack.Screen name="/signup/index"/>
                    <Stack.Screen name="/auth/login"/>
                    <Stack.Screen name="/upload"/>
                     </Stack>
            </AuthContextProvider>
        </TamaguiProvider>
    );
}
