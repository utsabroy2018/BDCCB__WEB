import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import GRTFormScreen from "../screens/GRTFormScreen"
import DISBFormScreen from '../screens/DISBFormScreen'

export default function DISBNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.disbFormScreen} component={DISBFormScreen} />
        </Stack.Navigator>
    )
}