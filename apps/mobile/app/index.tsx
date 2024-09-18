import {Text} from "react-native";
import {Link} from "expo-router"
import {SafeAreaView} from "react-native-safe-area-context"
import {useEffect, useState} from "react";
import {fetchCurrentUser} from "@/api/user";
import {UserLight} from "../../common/dto/user-light";

export default function Index() {
const [user, setUser] = useState<UserLight | null>(null)

    useEffect(() => {
        const currentUser = async () => {
            const user = await fetchCurrentUser()
            if(!user) {
            console.log('User not found')
                return
            }

            setUser(user)
        }    }, []);

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/signup">Signup</Link>
            <Link href="/auth/upload">Upload</Link>
        </SafeAreaView>
    );
}
