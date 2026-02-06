import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import GRTFormScreen from "../screens/GRTFormScreen"
import DISBMemberScreen from '../screens/DISBMemberScreen'

export default function DISBMemberNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.disbMemberScreen} component={DISBMemberScreen} />
        </Stack.Navigator>
    )
}