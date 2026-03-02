import { StyleSheet, SafeAreaView, View, ScrollView, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { usePaperColorScheme } from '../theme/theme'
import HeadingComp from "../components/HeadingComp"
import RecoveryGroupForm from './forms/RecoveryGroupForm'
import { CommonActions, useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import { Button } from 'react-native-paper'
import navigationRoutes from '../routes/routes'
import RecoveryGroupFormMain from './forms/RecoveryGroupFormMain'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { loginStorage } from '../storage/appStorage'



const RecoveryGroupFormScreen = () => {
    const theme = usePaperColorScheme()
    const { params } = useRoute<any>()
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    const isFocused = useIsFocused();

        const fetchLoanDetailsData = async () => {
        // setBanks([]);
        // setLoading(true)

        const creds = {
            tenant_id : loginStore?.tenant_id,
            branch_id : loginStore?.brn_code,
            emp_id : loginStore?.emp_id,
        }

        await axios.post(ADDRESSES.FETCH_LOAN_DETAILS, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(async res => {
            // console.log("LALALALLA syart", res?.data?.data[0],  'endddddddddd')
            console.log("LALALALLA syart", res?.data,  'endddddddddd')
            console.log("Array LALALALLA syart", res?.data?.data[0]?.members, 'Array endddddddddd')

            if(res?.data?.success) {

                
                } else{
                // handleLogout()
                // res?.data?.msg?.map((item, _) => (
                //     // setBanks(prev => [...prev, { title: item?.bank_name, func: () => { handleFormChange("bankName", item?.bank_name); handleFormChange("bankId", item?.bank_code) } }])
                // ))
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching Sub Purposes of Loan!", ToastAndroid.SHORT)
        })
        // setLoading(false)
    }

    // useEffect(() => {
    //     if(isFocused){
    //     fetchLoanDetailsData()
    //     }
    // }, [isFocused])

    const navigation = useNavigation()

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background
            }}>
                <HeadingComp title="Recovery Group Details" subtitle="View recovery details and members" isBackEnabled />
                <View style={{
                    minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    paddingBottom: 30
                }}>
                    {/* <RecoveryGroupForm fetchedData={params.group_details} approvalStatus={params?.group_details?.status} /> */}
                    {/* <RecoveryGroupFormMain fetchedData={'params.group_details'} approvalStatus={'params?.group_details?.status'} /> */}
                    <RecoveryGroupFormMain />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default RecoveryGroupFormScreen

const styles = StyleSheet.create({})