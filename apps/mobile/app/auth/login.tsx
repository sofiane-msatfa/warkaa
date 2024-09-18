import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Form, H4, Spinner, Input, YStack, XStack, Text} from 'tamagui';
import {useAuth} from "@/contexts/auth/use-auth";
import {router} from 'expo-router';

export default function Login() {
    const auth = useAuth();
    const [status, setStatus] = useState('off');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (name: string, value: string) => {
        console.log("Name et value", name, value)
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setStatus('submitting');
        try {
            await auth.login({email: formData.email, password: formData.password})

            setStatus('submitted');
            router.push('/')
        } catch (error) {
            console.error('Erreur de connexion:', error);
            setStatus('error');
        }
    };

    const isFormValid = formData.email && formData.password;

    return (
        <View style={styles.container}>
            <Form
                alignItems="center"
                minWidth={300}
                gap="$4"
                onSubmit={handleSubmit}
                borderWidth={1}
                borderRadius="$4"
                backgroundColor="$background"
                borderColor="$borderColor"
                padding="$8"
            >
                <H4>Connexion</H4>

                <YStack width="100%" gap="$4">
                    <Input
                        placeholder="email@example.com"
                        value={formData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <XStack width="100%" alignItems="center">
                        <Input
                            flex={1}
                            placeholder="Mot de passe"
                            value={formData.password}
                            onChangeText={(value) => handleChange('password', value)}
                            secureTextEntry={!showPassword}
                        />
                    </XStack>
                </YStack>

                <Button
                    icon={status === 'submitting' ? () => <Spinner/> : undefined}
                    onPress={handleSubmit}
                    disabled={status === 'submitting' || !isFormValid}
                >
                    <Text>{status === 'submitting' ? 'Connexion...' : 'Se connecter'}</Text>
                </Button>

                {status === 'submitted' && (
                    <Text color="$green10">Connexion réussie !</Text>
                )}
                {status === 'error' && (
                    <Text color="$red10">Erreur de connexion. Veuillez réessayer.</Text>
                )}
            </Form>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});