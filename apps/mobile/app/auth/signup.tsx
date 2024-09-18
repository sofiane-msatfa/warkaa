import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from 'react-native';
import {
    YStack,
    XStack,
    Text,
    Input,
    Button,
    Form,
    Separator,
    Switch,
} from 'tamagui';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import {Link} from "expo-router"

export default function Signup() {
    // const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <Form
                // bordered
                padding="$4"
                borderRadius="$4"
                backgroundColor="$background"
                width="100%"
                maxWidth={400}
            >
                <YStack space="$4">
                    <Text fontSize="$8" fontWeight="bold" textAlign="center">
                        Créer un compte
                    </Text>

                    <Input
                        placeholder="Nom complet"
                        // leftElement={<User size={20} color="$gray10" />}
                    />

                    <Input
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        // leftElement={<Mail size={20} color="$gray10" />}
                    />

                    <YStack space="$2">
                        <Input
                            placeholder="Mot de passe"
                            // secureTextEntry={!showPassword}
                        />
                        <Input

                        placeholder="Confirmer le mot de passe"
                        // secureTextEntry={!showPassword}
                    />
                        {/*<Button*/}
                        {/*    size="$3"*/}
                        {/*    circular*/}
                        {/*    marginLeft="$2"*/}
                        {/*    icon={showPassword ? <EyeOff /> : <Eye />}*/}
                        {/*    onPress={() => setShowPassword(!showPassword)}*/}
                        {/*/>*/}
                    </YStack>

                    <XStack alignItems="center" space="$2">
                        <Switch
                            checked={agreedToTerms}
                            onCheckedChange={setAgreedToTerms}
                        />
                        <Text fontSize="$2">J'accepte les termes et conditions</Text>
                    </XStack>

                    <Separator />

                    <Button
                        theme="active"
                        disabled={!agreedToTerms}
                    >
                        S'inscrire
                    </Button>

                    <XStack justifyContent="center" space="$2">
                        <Text>Déjà un compte ?</Text>
                        <Link href="/auth/login" style={{color: "blue", fontWeight: "bold"}} >Se connecter</Link>
                    </XStack>
                </YStack>
            </Form>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '$background',
    },
});