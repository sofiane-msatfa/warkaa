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
import { Link, router } from "expo-router"
import { useAuth } from '@/contexts/auth/use-auth';

export default function Signup() {
    // const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleChange = (name: string, value: string) => {
        setFormData(prevData => {
            const updatedData = { ...prevData, [name]: value };
            if (name === 'password' || name === 'password_confirmation') {
                setPasswordsMatch(updatedData.password === updatedData.password_confirmation);
            }
            return updatedData;
        });
    };

    const handleSubmit = async () => {
        if (!passwordsMatch) {
            console.error('Les mots de passe ne correspondent pas.');
            return;
        }
        try {
            const { email, firstname, lastname, password } = formData;
            const response = await register({ email, firstname, lastname, password });

            if (response.status === 201) {
                router.push('/auth/login');
            }

        } catch (error) {
            console.error('Erreur de connexion:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Form
                padding="$4"
                borderRadius="$4"
                backgroundColor="$background"
                width="100%"
                maxWidth={400}
                onSubmit={handleSubmit}
            >
                <YStack gap="$4">
                    <Text fontSize="$8" fontWeight="bold" textAlign="center">
                        Créer un compte
                    </Text>
                    <XStack gap="$2">
                        <Input
                            placeholder="Prénom"
                            style={styles.input}
                            onChangeText={(value) => handleChange('firstname', value)}
                        />
                        <Input
                            placeholder="Nom"
                            onChangeText={(value) => handleChange('lastname', value)}
                            style={styles.input}
                        />
                    </XStack>

                    <Input
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(value) => handleChange('email', value)}
                    />

                    <YStack space="$2">
                        <Input
                            placeholder="Mot de passe"
                            onChangeText={(value) => handleChange('password', value)}
                        />
                        <Input
                            placeholder="Confirmer le mot de passe"
                            onChangeText={(value) => handleChange('password_confirmation', value)}
                        />
                        {!passwordsMatch && (
                            <Text color="$red10">Les mots de passe ne correspondent pas.</Text>
                        )}
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
                        disabled={!agreedToTerms || !passwordsMatch}
                        onPress={handleSubmit}
                    >
                        S'inscrire
                    </Button>

                    <XStack justifyContent="center" space="$2">
                        <Text>Déjà un compte ?</Text>
                        <Link href="/auth/login" style={{ color: "blue", fontWeight: "bold" }} >Se connecter</Link>
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
    input: {
        flex: 1,
    },
});