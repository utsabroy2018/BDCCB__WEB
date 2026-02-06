import React, { useContext, useEffect, useState } from 'react'

import { Alert, Linking, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native'
import { Checkbox, Icon, Text } from "react-native-paper"
import { usePaperColorScheme } from '../../theme/theme'
import { Divider, List } from 'react-native-paper'
import InputPaper from '../../components/InputPaper'
import MenuPaper from '../../components/MenuPaper'
import ButtonPaper from '../../components/ButtonPaper'
import axios from 'axios'
import { ADDRESSES } from '../../config/api_list'
import { loginStorage } from '../../storage/appStorage'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../../routes/routes'
import useGeoLocation from '../../hooks/useGeoLocation'
import RadioComp from '../../components/RadioComp'
import DatePicker from 'react-native-date-picker'
import { formattedDate } from '../../utils/dateFormatter'
import { useEscPosPrint } from "../../hooks/useEscPosPrint"
import { BASE_URL } from '../../config/config'
import dayjs from 'dayjs'
import { AppStore } from '../../context/AppContext'

const RecoveryGroupForm = ({ fetchedData, approvalStatus = "U" }) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [hasBeforeUpnapproveTransDate, setHasBeforeUpnapproveTransDate] = useState(false);
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")
    const [errMsg, setErrMsg] = useState(() => "")
    const { handlePrint } = useEscPosPrint()

    // console.log("LOGIN DATAAA =============", loginStore)
    // console.log("4444444444444444444ffffffffffffffff", fetchedData)
    // console.log("tr_dt", fetchedData.memb_dtls[0].last_trn_dt)
    // console.log("membbbbbbbbbbbbb", fetchedData.memb_dtls[0])

    const [loading, setLoading] = useState(() => false)

    const [formData, setFormData] = useState({

        trn_id: "",
        trans_dt: "",
        loan_acc_no: "",
        loan_to: "",
        branch_name: "",
        period: "",
        curr_roi: "",
        penal_roi: "",
        disb_amt: "",
        disb_dt: "",
        loan_id: "",

    })

   

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }
   

    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ]);

                if (
                    granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                    granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Bluetooth permissions granted.');
                } else {
                    console.log('Bluetooth permissions denied.');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const requestNearbyDevicesPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Nearby devices permission granted.');
                } else {
                    console.log('Nearby devices permission denied.');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const requestPermissions = async () => {
        await requestBluetoothPermissions();
        await requestNearbyDevicesPermission();
    };

    useEffect(() => {
        requestPermissions()
    }, [])

    	

       const getClientIP = async () => {
		const res = await fetch("https://api.ipify.org?format=json")
		const data = await res.json()
		return data.ip
	}

       const approveDisbursement = async () => {
        // if (hasBeforeUpnapproveTransDate) {
        //     ToastAndroid.show(`There are unapproved ${errMsg} before this date. Please check and try again.`, ToastAndroid.SHORT)
        //     return;
        // }
        setLoading(true)

        const ip = await getClientIP()

        const creds = {
				tenant_id: loginStore?.tenant_id,
				branch_id: loginStore?.brn_code,
				voucher_dt: new Date().toLocaleDateString("en-GB"),
				voucher_id: 0,
				trans_id: fetchedData?.trans_id,
				voucher_type: "J",
				acc_code: "23101",
				trans_type: fetchedData?.trans_type,
				loan_to: fetchedData?.loan_to,
				pacs_shg_id: fetchedData?.branch_shg_id,
				dr_amt: fetchedData?.disb_amt,
				cr_amt: fetchedData?.disb_amt,
				loan_id: fetchedData?.loan_id,
				created_by: loginStore?.emp_id,
				ip_address: ip,
			}


      
        console.log("PAYLOAD---RECOVERY", creds, 'PPPPPPPPPPPPPPP')
        // return
        
        await axios.post(ADDRESSES.SAVE_LOAN_VOUCHER, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(async res => {
            console.log("RESSSSS", res?.data)
            if(res?.data?.success){
                Alert.alert("Alert", res?.data?.msg, [
                    { text: "Back", onPress: () => navigation.goBack() }
                ], {
                    cancelable: false
                })
                return
            }
            ToastAndroid.show("Loan recovery EMI installment done.", ToastAndroid.SHORT)
            // await handlePrint(res?.data?.msg)

            navigation.dispatch(
                        CommonActions.navigate({
                            name: navigationRoutes.recoveryGroupScreenResult,
                            params: {
                            resultData: res?.data?.msg,
                            not_inserted_row: res?.data?.not_inserted_row,
                            },
                        }),
                    )

        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

    useEffect(() => {
        setFormData({
            trn_id: fetchedData?.trans_id,
            trans_dt: fetchedData?.trans_dt,
            loan_acc_no: fetchedData?.loan_acc_no,
            loan_to: fetchedData?.loan_to,
            branch_name: fetchedData?.branch_name,
            period: fetchedData?.period,
            curr_roi: fetchedData?.curr_roi,
            penal_roi: fetchedData?.penal_roi,
            disb_amt: fetchedData?.disb_amt,
            disb_dt: fetchedData?.disb_dt,
            loan_id: fetchedData?.loan_id,
            })
    }, [])


    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background,
            }}>
                <View style={{
                    paddingBottom: 50,
                    gap: 14
                }}>
                    {/* <Text>{formData?.txnDate?.toLocaleDateString("en-GB")}</Text> */}
                    <InputPaper 
                    label="Transaction ID" keyboardType="default" 
                    value={formData.trn_id}
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Transaction Date" keyboardType="default" 
                    value={new Date(formData.trans_dt).toLocaleDateString("en-GB")} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Loan Account No." keyboardType="default" 
                    value={formData.loan_acc_no} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Loan To" keyboardType="default" 
                    value={formData.loan_to == 'P'? 'Pacs' : 'SHG'} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="SHG" keyboardType="default" 
                    value={formData.branch_name} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Period (In Month)" keyboardType="default" 
                    value={formData.period} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Current ROI" keyboardType="default" 
                    value={formData.curr_roi} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Ovd ROI" keyboardType="default" 
                    value={formData.penal_roi} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Disburse Date" keyboardType="default" 
                    value={new Date(formData.disb_dt).toLocaleDateString("en-GB")} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Disburse Amount" keyboardType="default" 
                    value={formData.disb_amt} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper 
                    label="Loan Id" keyboardType="default" 
                    value={formData.loan_id} 
                    onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />


                    <ButtonPaper icon="cash-register" mode="contained" onPress={() => {
                            Alert.alert(`Accept Transaction?`, `Are you sure, you want to accept this transaction?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: async () => await approveDisbursement(),
                                text: "Yes"
                            }])

                        }} loading={loading} 
                        // disabled={loading || canTxnCheckFlag === "F" || memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0) === 0 || memberDetailsArray.filter((item, _) => +item.credit > Number((Number(item?.prn_amt) + Number(item?.intt_amt)).toFixed(2))).length > 0}
                        >
                            
                            {!loading ? "Accept Transaction" : "DON'T CLOSE THIS PAGE..."}
                        </ButtonPaper>

                    

                    

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default RecoveryGroupForm

const styles = StyleSheet.create({})