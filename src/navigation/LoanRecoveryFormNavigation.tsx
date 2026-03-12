import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import SearchLoanRecoveryScreen from '../screens/SearchLoanRecoveryScreen'
import RecoveryGroupScreen from '../screens/RecoveryGroupScreen'
import RecoveryMemberScreen from '../screens/RecoveryMemberScreen'
import RecoveryGroupScreenResult from '../screens/RecoveryGroupScreenResult'
import RecoveryGroupFormScreen from '../screens/RecoveryGroupFormScreen'

export default function LoanRecoveryFormNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name={navigationRoutes.searchLoanRecoveryScreen} component={SearchLoanRecoveryScreen} /> */}
            <Stack.Screen name={navigationRoutes.recoveryGroupFormScreen} component={RecoveryGroupFormScreen} />
            
            {/* <Stack.Screen name={navigationRoutes.recoveryMemberScreen} component={RecoveryMemberScreen} />
            <Stack.Screen name={navigationRoutes.recoveryGroupScreenResult} component={RecoveryGroupScreenResult} /> */}
        </Stack.Navigator>
    )
}