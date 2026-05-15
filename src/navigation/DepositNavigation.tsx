import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import navigationRoutes from "../routes/routes"
import ReportsChooseScreen from '../screens/reports/ReportsChooseScreen'
import RecoveryReportScreen from '../screens/reports/RecoveryReportScreen'
import DisbursementReportScreen from '../screens/reports/DisbursementReportScreen'
import GroupwiseRecovery from '../screens/reports/GroupwiseRecovery'
import DemandReport from '../screens/reports/DemandReport'
import AttendanceReportScreen from '../screens/reports/AttendanceReportScreen'
import DeopositChooseScreen from '../screens/reports/DeopositChooseScreen'
import DepositWithdrawScreen from '../screens/deposit/DepositWithdrawScreen'
import TransactionDepositScreen from '../screens/deposit/TransactionDepositScreen'

export default function DepositNavigation() {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={navigationRoutes.depositChooseScreen} component={DeopositChooseScreen} />
            {/* <Stack.Screen name={navigationRoutes.recoveryReportScreen} component={RecoveryReportScreen} /> */}
            {/* <Stack.Screen name={navigationRoutes.disbursementReportScreen} component={DisbursementReportScreen} />
            <Stack.Screen name={navigationRoutes.groupwiseRecovery} component={GroupwiseRecovery} />
            <Stack.Screen name={navigationRoutes.demandReport} component={DemandReport} /> */}
            {/* <Stack.Screen name={navigationRoutes.attendanceReportScreen} component={AttendanceReportScreen} /> */}
            <Stack.Screen name={navigationRoutes.depositWithdrawScreen} component={DepositWithdrawScreen} />
            <Stack.Screen name={navigationRoutes.transactionDepositScreen} component={TransactionDepositScreen} />

        </Stack.Navigator>
    )
}