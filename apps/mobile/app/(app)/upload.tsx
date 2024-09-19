import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Text, Button, YStack, XStack } from "tamagui";
import * as DocumentPicker from 'expo-document-picker';
import { Trash2 } from "lucide-react";

export default function Upload() {
    const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                multiple: true,
            });

            if (!result.canceled) {
                const successResult = result as DocumentPicker.DocumentPickerSuccessResult;

                if (selectedDocuments.length + successResult.assets.length <= 10) {
                    setSelectedDocuments((prevSelectedDocuments) => [
                        ...prevSelectedDocuments,
                        ...successResult.assets,
                    ]);
                } else {
                    alert("Maximum de 10 documents autorisés.");
                }
            }
        } catch (error) {
            console.error("Erreur lors de la sélection des documents:", error);
        }
    };

    const removeDocument = (index: number) => {
        setSelectedDocuments((prevDocs) => prevDocs.filter((_, i) => i !== index));
    };

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" width="100%" maxWidth={400}>
                <Text fontSize="$6" fontWeight="bold" textAlign="center">
                    Upload de Documents
                </Text>

                <Button onPress={pickDocuments} theme="active">
                    Sélectionner des documents
                </Button>

                <Text fontSize="$4" fontWeight="bold">
                    Documents sélectionnés ({selectedDocuments.length}/10):
                </Text>

                <ScrollView style={styles.scrollView}>
                    {selectedDocuments.map((doc, index) => (
                        <XStack key={index} space="$2" alignItems="center" paddingVertical="$2">
                            <Text numberOfLines={1} flex={1}>{doc.name}</Text>
                            <Button
                                icon={<Trash2 size={20} />}
                                onPress={() => removeDocument(index)}
                                variant="outlined"
                                circular
                            />
                        </XStack>
                    ))}
                </ScrollView>

                <Button
                    onPress={() => console.log("Upload documents", selectedDocuments)}
                    theme="active"
                    disabled={selectedDocuments.length === 0}
                >
                   <Text> Uploader les documents</Text>
                </Button>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    scrollView: {
        maxHeight: 200,
        width: '100%',
    },
});