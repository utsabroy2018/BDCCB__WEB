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
import { SCREEN_HEIGHT } from 'react-native-normalize'

// const RecoveryGroupFormMain = ({ fetchedData, approvalStatus = "U" }) => {
const RecoveryGroupFormMain = () => {
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
        groupName: "",
        ccb_loan_acc_no: "",
        loan_acc_no: "",
        pacs_name: "",
        sanction_dt: "",
        sanction_no: "",
        period: "",
        curr_roi: "",
        penal_roi: "",
        disb_dt: "",
        disb_amt: "",
        // loan_amt: "",
        // sb_amt: "",
        txnDate: new Date(),
    })

    const [memberDetailsArray, setMemberDetailsArray] = useState<any[]>(() => [])
    const [banks, setBanks] = useState([])
    // const [last_trn_dt, setLastTrnDt] = useState(fetchedData.memb_dtls[0].last_trn_dt)
    const [last_trn_dt, setLastTrnDt] = useState()
    const [openDate, setOpenDate] = useState(() => false)
    const [openDate2, setOpenDate2] = useState(() => false)
    // const formattedTnxDate = formattedDate(formData?.txnDate)
    const [canTxnCheckFlag, setCanTxnCheckFlag] = useState<"D" | "F">(() => "F")
    const { handleLogout } = useContext<any>(AppStore)
    const [fetchedData, setFetchedData] = useState<any>(() => ({}))

    // const groupTypes = [
    //     {
    //         title: "SHG",
    //         func: () => {
    //             handleFormChange("groupType", "S");
    //             handleFormChange("groupTypeName", "SHG")
    //         }
    //     },
    //     {
    //         title: "JLG",
    //         func: () => {
    //             handleFormChange("groupType", "J");
    //             handleFormChange("groupTypeName", "JLG")
    //         }
    //     }
    // ]

    const handleFormChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }
    // useEffect(() => {
    //     console.log("Recovery Group Form useEffect called")
    // }, [])
    // useEffect(() => {
    //     if (error) {
    //         Alert.alert("Turn on Geolocation", "Give access to Location or Turn on GPS from app settings.", [{
    //             text: "Go to Settings",
    //             onPress: () => { navigation.dispatch(CommonActions.goBack()); Linking.openSettings() }
    //         }])
    //     }
    // }, [isFocused, error])


    // useEffect(() => {
    //     console.log("APPROVAL STATUS", approvalStatus)
    //     if (location?.latitude && location.longitude && approvalStatus === "A") {
    //         console.log("LOCATION CHANGED, FETCHING GEO ADDRESS...")
    //         // fetchGeoLocaltionAddress()
    //     }
    // }, [location])

    // const requestBluetoothPermissions = async () => {
    //     if (Platform.OS === 'android') {
    //         try {
    //             const granted = await PermissionsAndroid.requestMultiple([
    //                 PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    //                 PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //             ]);

    //             if (
    //                 granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
    //                 granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
    //             ) {
    //                 console.log('Bluetooth permissions granted.');
    //             } else {
    //                 console.log('Bluetooth permissions denied.');
    //             }
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    // };

    // const requestNearbyDevicesPermission = async () => {
    //     if (Platform.OS === 'android') {
    //         try {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES
    //             );
    //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                 console.log('Nearby devices permission granted.');
    //             } else {
    //                 console.log('Nearby devices permission denied.');
    //             }
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     }
    // };

    // const requestPermissions = async () => {
    //     await requestBluetoothPermissions();
    //     await requestNearbyDevicesPermission();
    // };

    // useEffect(() => {
    //     requestPermissions()
    // }, [])


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
            console.log("LALALALLA syart", res?.data?.data[0],  'endddddddddd')
            console.log("Array LALALALLA syart", res?.data?.data[0]?.members, 'Array endddddddddd')

            if(res?.data?.success) {
                setFetchedData(res?.data?.data[0])
                //  setMemberDetailsArray(res?.data?.data[0]?.members)
                setMemberDetailsArray(
                res?.data?.data[0]?.members.map(m => ({
                    ...m,
                    loan_amt: m.cr_amt || "",
                    sb_amt: m.sb_amt || "",
                }))
                );

                 setFormData({
                groupName: loginStore?.emp_name || "",
                ccb_loan_acc_no: fetchedData?.ccb_loan_acc_no || "",
                loan_acc_no: fetchedData?.society_acc_no || "",
                pacs_name: fetchedData?.pacs_name || "",
                sanction_dt: fetchedData?.sanction_dt || "",
                sanction_no: fetchedData?.sanction_no || "",
                period: fetchedData?.period || "",
                curr_roi: fetchedData?.curr_roi || "",
                penal_roi: fetchedData?.penal_roi || "",
                disb_dt: fetchedData?.disb_dt || "",
                disb_amt: fetchedData?.disb_amt || "",
                // loan_amt: "",
                // sb_amt: "",
                txnDate: new Date(),

                ////////////////////////////////////////

            // last_trn_dt: "",
            // groupType: "",
            // groupTypeName: "",
            // totalPrincipleAmount: "",
            // totalInterestAmount: "",
            // totalAmount: "",
            // // //////////////////////
            // // prn_amt: "",
            // roi: "",
            // periodMode: "",
            // txnMode: "C",
            
            // // txnDate: loginStore?.transaction_date,
            // chequeDate: new Date(),
            // bankName: "",
            // chequeId: "",
            
        })

               
                
                } else{
                // handleLogout()
                
            }
        }).catch(err => {
            ToastAndroid.show("Some error while fetching Sub Purposes of Loan!", ToastAndroid.SHORT)
        })
        // setLoading(false)
    }

    useEffect(() => {
        if(isFocused){
        fetchLoanDetailsData()
        }
    }, [isFocused])

    useEffect(() => {
        // setFormData({
        //     groupName: loginStore?.emp_name || "",
        //     ccb_loan_acc_no: fetchedData?.ccb_loan_acc_no || "",
        //     loan_acc_no: fetchedData?.society_acc_no || "",
        //     pacs_name: fetchedData?.pacs_name || "",
        //     sanction_dt: fetchedData?.sanction_dt || "",
        //     sanction_no: fetchedData?.sanction_no || "",
        //     period: fetchedData?.period || "",
        //     curr_roi: fetchedData?.curr_roi || "",
        //     penal_roi: fetchedData?.penal_roi || "",
        //     disb_dt: fetchedData?.disb_dt || "",
        //     disb_amt: fetchedData?.disb_amt || "",
        //     loan_amt: "",
        //     sb_amt: "",
        //     txnDate: new Date(),

        //     ////////////////////////////////////////

        //     last_trn_dt: "",
        // groupType: "",
        // groupTypeName: "",
        // totalPrincipleAmount: "",
        // totalInterestAmount: "",
        // totalAmount: "",
        // // //////////////////////
        // // prn_amt: "",
        // roi: "",
        // periodMode: "",
        // txnMode: "C",
        
        // // txnDate: loginStore?.transaction_date,
        // chequeDate: new Date(),
        // bankName: "",
        // chequeId: "",
            
        // })

        
    }, [memberDetailsArray])

    // const [totalEMI, setTotalEMI] = useState(() => "")

    const handleEMIChange = (txt: string, i: any) => {

        setMemberDetailsArray(prevArray =>
            prevArray.map((member, index) =>
                index === i ? { 
                    ...member, 
                    credit: txt, 
                    // intt_emi: currentInterestCalculate(+txt), 
                    // prn_emi: currentPrincipalCalculate(+txt), 
                    instl_paid: 0 
                } : member
            )
        )
    }

   

    const checkCanTxn = async () => {
        setLoading(true);
        setHasBeforeUpnapproveTransDate(false);
        const payload = {
            branch_code: loginStore?.brn_code,
            transaction_date: dayjs(formData?.txnDate).format('YYYY-MM-DD'),
        }
        axios.post(`${BASE_URL}/admin/fetch_unapprove_dtls_before_trns_dt`, payload, {headers: {
                                Authorization: loginStore?.token, // example header
                                "Content-Type": "application/json", // optional
                            }
                        }).then((res) => {
            // console.log('res?.data?.msg');

            // console.log(res?.data, 'fffffffffffffffffffffffffff', res?.data?.msg);
            if(res?.data?.suc === 0) {

                handleLogout()
            } else{
                if (res?.data?.msg?.length > 0) {
                    const hasNonZero = res?.data?.msg.some(item => Object.values(item).some(value => value != 0));
                    setHasBeforeUpnapproveTransDate(hasNonZero);
                    if (hasNonZero) {
                        setLoading(false);
                        let txt = `${res?.data?.msg[0]?.transactions > 0 ? 'transaction(s),' : ''} ${res?.data?.msg[0]?.group_migrate > 0 ? 'group migrate(s),' : ''} ${res?.data?.msg[0]?.member_migrate > 0 ? 'member migrate(s)' : ''} `;
                        setErrMsg(txt);
                        Alert.alert(`Cannot proceed`, `There are unapproved ${txt}before this date. Please check and try again.`, [
                            {
                                text: "OK", onPress: () => null
                            }
                        ])
                        // ToastAndroid.show(`There are unapproved ${txt} before this date. Please check and try again.`, ToastAndroid.SHORT)
                    }
                    else {
                        const transformedObj = memberDetailsArray.filter((item, i) => item.isChecked && item.credit > 0).map((item) => ({
                            loan_id: item.loan_id,
                            last_trn_dt: formattedDate(formData.txnDate),
                        }));


                        axios.post(`${ADDRESSES.CHECK_CAN_TXN}`, {
                            checkdatedtls: transformedObj
                        }, {
                            headers: {
                                Authorization: loginStore?.token, // example header
                                "Content-Type": "application/json", // optional
                            }
                        }
                        ).then(res => {

                            // console.log(res?.data, 'NNNNNNNNNNNNNNNNNNNNN', {checkdatedtls: transformedObj});

                            
                            setLoading(false);
                            // console.log("CAN TXN", res?.data)
                            if(res?.data?.suc === 0) {
                                handleLogout()
                            }
                            else{
                            setCanTxnCheckFlag(res?.data?.tr_flag)
                            if (res?.data?.tr_flag === "F") {
                                Alert.alert("Cannot proceed", "Some future transactions found! You cannot proceed this transaction. Try changing Txn Date instead.", [
                                    {
                                        text: "OK", onPress: () => null
                                    }
                                ])
                            } else if (res?.data?.tr_flag === "D") {
                                Alert.alert("Approved", "Now you can collect amount.", [
                                    {
                                        text: "OK", onPress: () => null
                                    }
                                ])
                            }
                        }
                        }
                        ).catch(err => {
                            setLoading(false);
                            console.log("CAN TXN ERR", err)
                            setCanTxnCheckFlag("F")
                        })
                    }
                }
            }
        }).
            catch((err) => {
                setLoading(false);
                Alert.alert("Cannot proceed", "We are unable to process your request!! Please try again later", [
                    {
                        text: "OK", onPress: () => null
                    }
                ])
            })

        //

        //
    }

    // useEffect(() => {
    //     setCanTxnCheckFlag('F')
    // }, [memberDetailsArray, formData.txnDate])

     const getClientIP = async () => {
        const res = await fetch("https://api.ipify.org?format=json")
        const data = await res.json()
        return data.ip
      }

    const sendRecoveryEMI = async () => {

        setLoading(true)

        const ip = await getClientIP()

        const payload = {
        tenant_id : loginStore?.tenant_id,
        branch_id : loginStore?.brn_code,
        loan_acc_no : fetchedData?.society_acc_no,
        loan_to : "S",
        branch_shg_id : fetchedData?.branch_shg_id,
        loan_id : fetchedData?.loan_id,
        created_by : loginStore?.emp_id,
        ip_address: ip,

        members: memberDetailsArray.map(m => ({
            mem_trn_id: 0,
            mem_loan_id: m.mem_loan_id,
            principal_amt: m.principal_amt,
            cr_amt: m.loan_amt,
            sb_amt: m.sb_amt,
        }))
    };




    console.log("===== EMI RECOVERY DATA =====", memberDetailsArray);
    console.log(JSON.stringify(payload, null, 2));


    // return;

        // if (hasBeforeUpnapproveTransDate) {
        //     ToastAndroid.show(`There are unapproved ${errMsg} before this date. Please check and try again.`, ToastAndroid.SHORT)
        //     return;
        // }
        
        // const transformedObj = memberDetailsArray.filter((item, i) => item.isChecked && item.credit > 0).map((item) => ({
        //     // loan_id: item.loan_id,
        //     // credit: item.credit,
        //     // // credit: isNaN,
        //     // intt_cal_amt: item.intt_cal_amt,
        //     // prn_emi: item.prn_emi,
        //     // intt_emi: item.intt_emi,
        //     // instl_paid: item.instl_paid,
        //     // // balance:item.balance,
        //     // group_code: fetchedData.group_code,
        //     // prn_amt: item?.prn_amt,
        //     // // prn_amt: 'aaa',
        //     // intt_amt: item?.intt_amt,
        //     // last_trn_dt: formattedDate(formData.txnDate),
        //     // upload_on: new Date().toLocaleTimeString("en-GB")
        // }));


        // const creds = {
        //     "branch_code": loginStore?.brn_code,
        //     "created_by": loginStore?.emp_id,
        //     "modified_by": loginStore?.emp_id,
        //     // "trn_lat": location.latitude,
        //     // "trn_long": location.longitude,
        //     // "trn_addr": geolocationFetchedAddress,
        //     "trn_lat": 0,
        //     "trn_long": 0,
        //     "trn_addr": "",
        //     "tr_mode": formData.txnMode,
        //     "bank_name": formData?.bankName || "",
        //     "cheque_id": formData?.chequeId || 0,
        //     // "cheque_id": 0,
        //     "chq_dt": formattedDate(formData?.chequeDate) || "",
        //     "group_code": fetchedData?.group_code,
        //     // "prn_amt":formData?.prn_amt,
        //     // "balance": fetchedData?.balance,
        //     // "recovdtls": [{
        //     //     "loan_id": "",
        //     //     "credit": "",
        //     //     "balance": "",
        //     //     "intt_cal_amt": "",
        //     //     "prn_emi": "",
        //     //     "intt_emi": "",
        //     //     "instl_paid": "",
        //     //     "last_trn_dt": ""
        //     // }],
        //     "recovdtls": transformedObj
        // }

        // console.log("PAYLOAD---RECOVERY", creds, 'PPPPPPPPPPPPPPP')
        // // return
        
        await axios.post(ADDRESSES.SAVE_GRP_RECOVERY, payload, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(async res => {
            console.log("RESSSSS", res?.data)
            if (res?.data?.suc === 0) {
                Alert.alert("Alert", res?.data?.msg, [
                    { text: "Back", onPress: () => navigation.goBack() }
                ], {
                    cancelable: false
                })
                return
            }
            ToastAndroid.show("Loan recovery EMI installment done.", ToastAndroid.SHORT)
            // console.log("Loan recovery EMI installment done.", res?.data)
            // await handlePrint(res?.data?.msg)

            // console.log('lllll', res?.data?.msg, 'dddddddddddddddd', res?.data?.not_inserted_row);
            

            // navigation.dispatch(
            //             CommonActions.navigate({
            //                 name: navigationRoutes.recoveryGroupScreenResult,
            //                 params: {
            //                 resultData: res?.data?.msg,
            //                 not_inserted_row: res?.data?.not_inserted_row,
            //                 },
            //             }),
            //         )

            // navigation.goBack()
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
            console.log("Some error occurred while submitting EMI.", err)
        })
        // বিঃ দ্রঃ - দোয়া করে এই রিসিটটির একটি ফটোকপি রাখবেন। 

        // console.log("JJJJJJJJJJJJJJJJJJJJ", transformedObj)
        setLoading(false)
    }


    const editeRecoveryEMI = async () => {

        setLoading(true)

        const ip = await getClientIP()

        const payload = {
        tenant_id : loginStore?.tenant_id,
        branch_id : loginStore?.brn_code,
        loan_acc_no : fetchedData?.society_acc_no,
        loan_to : "S",
        branch_shg_id : fetchedData?.branch_shg_id,
        loan_id : fetchedData?.loan_id,
        created_by : loginStore?.emp_id,
        ip_address: ip,

        members: memberDetailsArray.map(m => ({
            mem_trn_id: m.recov_trans_id,
            mem_loan_id: m.mem_loan_id,
            principal_amt: m.principal_amt,
            cr_amt: m.loan_amt,
            sb_amt: m.sb_amt,
        }))
    };


    console.log("===== EMI RECOVERY DATA =====", memberDetailsArray);
    console.log(JSON.stringify(payload, null, 2));

        await axios.post(ADDRESSES.SAVE_GRP_RECOVERY, payload, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(async res => {
            console.log("RESSSSS", res?.data)
            if(res?.data?.success) {

                
                Alert.alert("Alert", res?.data?.msg, [
                    { text: "Back", onPress: () => navigation.goBack() }
                ], {
                    cancelable: false
                })
                return
            }
            ToastAndroid.show("Loan recovery EMI installment done.", ToastAndroid.SHORT)
            // console.log("Loan recovery EMI installment done.", res?.data)
            // await handlePrint(res?.data?.msg)

            // console.log('lllll', res?.data?.msg, 'dddddddddddddddd', res?.data?.not_inserted_row);
            

            // navigation.dispatch(
            //             CommonActions.navigate({
            //                 name: navigationRoutes.recoveryGroupScreenResult,
            //                 params: {
            //                 resultData: res?.data?.msg,
            //                 not_inserted_row: res?.data?.not_inserted_row,
            //                 },
            //             }),
            //         )

            // navigation.goBack()
        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
            console.log("Some error occurred while submitting EMI.", err)
        })
        // বিঃ দ্রঃ - দোয়া করে এই রিসিটটির একটি ফটোকপি রাখবেন। 

        // console.log("JJJJJJJJJJJJJJJJJJJJ", transformedObj)
        setLoading(false)
    }

    const inputDisableLogic = () => {
        // return approvalStatus === "U"
    }

    const handleLoanChange = (txt: string | number, index: number) => {
  setMemberDetailsArray(prev => {
    const updated = [...prev];

    const maxAmt = parseFloat(updated[index].principal_amt);
    const enteredAmt = parseFloat(String(txt) || "0");

    if (enteredAmt > maxAmt) {
      ToastAndroid.show(
        "Loan amount cannot exceed outstanding",
        ToastAndroid.SHORT
      );
      return prev; // prevent update
    }

    updated[index].loan_amt = txt;
    return updated;
  });
};


const handleSBChange = (txt, index) => {
  setMemberDetailsArray(prev => {
    const updated = [...prev];
    updated[index].sb_amt = txt;
    return updated;
  });
};

const isAmountEmpty = memberDetailsArray.some(
  item =>
    item.loan_amt === "" ||
    item.loan_amt === undefined ||
    item.sb_amt === "" ||
    item.sb_amt === undefined
);

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handled" style={{
                backgroundColor: theme.colors.background,
            }}>
                <View style={{
                    // paddingBottom: 10,
                    // gap: 14
                    // minHeight: SCREEN_HEIGHT,
                    height: "auto",
                    paddingHorizontal: 20,
                    paddingBottom: 80
                }}>
                    {/* <Text>{formData?.txnDate?.toLocaleDateString("en-GB")}</Text> */}
                    {/* <InputPaper label="Last Transaction Date" leftIcon='account-group-outline' keyboardType="default" value={new Date(last_trn_dt).toLocaleDateString("en-GB")} onChangeText={(txt: any) => handleFormChange("last_trn_dt", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />
                    <Divider /> */}
                    {/* <Text>{JSON.stringify(memberDetailsArray[0]?.approval_status, null, 2)}</Text>
                    <Text>{JSON.stringify(fetchedData, null, 2)}</Text> */}
                    <InputPaper label="Group Name*" leftIcon='account-group-outline' keyboardType="default" value={formData.groupName} onChangeText={(txt: any) => handleFormChange("groupName", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                   

                    <InputPaper label="Society Loan A/C No." maxLength={15} leftIcon='folder-account' keyboardType="default" value={formData.ccb_loan_acc_no} onChangeText={(txt: any) => handleFormChange("ccb_loan_acc_no", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Loan Account No." maxLength={15} leftIcon='folder-account' keyboardType="default" value={formData.loan_acc_no} onChangeText={(txt: any) => handleFormChange("loan_acc_no", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Sanction Date" maxLength={15} leftIcon='calendar' keyboardType="default" value={formData.sanction_dt} onChangeText={(txt: any) => handleFormChange("sanction_dt", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Sanction No." maxLength={15} leftIcon='folder-account' keyboardType="default" value={formData.sanction_no} onChangeText={(txt: any) => handleFormChange("sanction_no", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Period (In Month)" maxLength={15} leftIcon='clock-time-five-outline' keyboardType="default" value={formData.period} onChangeText={(txt: any) => handleFormChange("period", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Current ROI" maxLength={15} leftIcon='percent-outline' keyboardType="default" value={formData.curr_roi} onChangeText={(txt: any) => handleFormChange("curr_roi", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Ovd ROI" maxLength={15} leftIcon='percent-outline' keyboardType="default" value={formData.penal_roi} onChangeText={(txt: any) => handleFormChange("penal_roi", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Disburse Date" maxLength={15} leftIcon='calendar' keyboardType="default" value={formData.disb_dt} onChangeText={(txt: any) => handleFormChange("disb_dt", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    <InputPaper label="Total Disbursement*" maxLength={15} leftIcon='cash-100' keyboardType="numeric" value={formData.disb_amt} onChangeText={(txt: any) => handleFormChange("disb_amt", txt)} customStyle={{
                        backgroundColor: theme.colors.background,
                    }} disabled />

                    

                    <Divider />

                    {/* <RadioComp
                        title="Txn. Mode*"
                        icon="bank-transfer"
                        dataArray={[
                            {
                                optionName: "CASH",
                                optionState: formData.txnMode,
                                currentState: "C",
                                optionSetStateDispathFun: (e) => handleFormChange("txnMode", e)
                            },
                            {
                                optionName: "UPI",
                                optionState: formData.txnMode,
                                currentState: "B",
                                optionSetStateDispathFun: (e) => handleFormChange("txnMode", e)
                            },
                        ]}
                    /> */}

                   

                    <View style={{
                        marginHorizontal: 3, marginTop:20
                    }}>
                        <ButtonPaper
                            textColor={theme.colors.primary}
                            onPress={() => setOpenDate(true)}
                            mode="elevated"
                            icon="calendar"
                            disabled={true}
                     
                        >
                           
                            TXN. DATE:   {formData.txnDate?.toLocaleDateString("en-GB")}
                          

                        </ButtonPaper>
                    </View>
                    {/* <DatePicker
                        maximumDate={new Date()}
                        modal
                        mode="date"
                        open={openDate}
                        date={formData.txnDate}
                        onConfirm={date => {
                            setOpenDate(false)
                            handleFormChange("txnDate", date)
                        }}
                        onCancel={() => {
                            setOpenDate(false)
                        }}
                    /> */}




                    {/* <ButtonPaper icon="alert-circle-check-outline" mode="contained" style={{
                        backgroundColor: theme.colors.tertiary,
                    }} onPress={async () => await checkCanTxn()} loading={loading}
                        // disabled={loading || memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0) === 0 || memberDetailsArray.filter((item, _) => +item.credit > (+item.prn_amt + +item.intt_amt)).length > 0}>
                        disabled={loading || memberDetailsArray.reduce((sum, item) => sum + +item.credit, 0) === 0 || memberDetailsArray.filter((item, _) => +item.credit > Number((Number(item?.prn_amt) + Number(item?.intt_amt)).toFixed(2))).length > 0}
                        >
                        {"Check TXN Availability"}
                    </ButtonPaper> */}

                    {/* <View style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        gap: 3,
                        width: "100%",
                    }}>
                        <Icon source={"information-outline"} size={20} color={theme.colors.tertiary} />
                        <Text variant='bodySmall' style={{
                            color: theme.colors.onTertiaryContainer,
                            fontStyle: "italic",
                        }}>
                            Always click above button to check if you can proceed the transaction, even after changing the members or txn date. If not, please change the Txn Date and re-check.
                        </Text>
                    </View> */}

                    <View style={{marginTop:20}}>
                        <Text variant="labelLarge" style={{
                            marginBottom: 10,
                            color: theme.colors.primary
                        }}>Members</Text>
                        <View style={{
                            flexDirection: "column",
                            gap: 8,
                            flexWrap: "wrap"
                        }}>
                            {memberDetailsArray?.map((item, i) => (
                                <View key={i} style={{ width: "100%", padding:0 }}>
                                <List.Item
                                key={i}
                                title={() => (
                                // 🔹 Row 1 — Name + Outstanding
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <Text style={{ color: theme.colors.primary }}>
                                {item?.member_name}
                                </Text>

                                <Text style={{ color: theme.colors.green, fontSize: 12 }}>
                                Outstanding - {item?.principal_amt + "/-"}
                                </Text>
                                </View>
                                )}

                                description={() => (
                                // 🔹 Row 2 — Loan Amt + SB Amt inputs
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>

                                <View style={{ flex: 1, marginRight: 6 }}>
                                <InputPaper
                                selectTextOnFocus
                                label="Loan Amt."
                                maxLength={8}
                                keyboardType="numeric"
                                value={item?.loan_amt}
                                onChangeText={(txt) => handleLoanChange(txt, i)}
                                customStyle={{
                                backgroundColor: theme.colors.background,
                                padding: 0,
                                margin: 0,
                                }}
                                />
                                </View>

                                <View style={{ flex: 1, marginLeft: 6 }}>
                                <InputPaper
                                selectTextOnFocus
                                label="SB Amt."
                                maxLength={8}
                                keyboardType="numeric"
                                value={item?.sb_amt}
                                // onChangeText={(txt) => handleEMIChange(txt, i)}
                                onChangeText={(txt) => handleSBChange(txt, i)}
                                customStyle={{
                                backgroundColor: theme.colors.background,
                                padding: 0,
                                margin: 0,
                                }}
                                />
                                </View>

                                </View>
                                )}
                                />

                                <Divider />
                                </View>
                            ))}





                            {/* Total Calculated EMI */}
                            {/* <View style={{ width: "100%" }}>
                                <List.Item
                                    titleStyle={{
                                        color: theme.colors.primary,
                                    }}
                                    descriptionStyle={{
                                        color: theme.colors.secondary,
                                    }}
                                    title={`TOTAL AMOUNT`}
                                    // left={props => <List.Icon {...props} icon="account-circle-outline" />}
                                    right={() => (
                                        <Text>fdgfdgdfg/-</Text>
                                    )}
                                />
                                <Divider />
                            </View> */}
                        </View>
                        {/* <View style={{ width: "100%" }}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary,
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary,
                                }}
                                title={`TOTAL AMOUNT`}
                                // left={props => <List.Icon {...props} icon="account-circle-outline" />}
                                right={() => (
                                    <Text variant='titleMedium'>{formData.disb_amt}/-</Text>
                                )}
                            />
                            <Divider />
                        </View> */}
                    </View>

                    
                    {fetchedData?.approval_status == 'U' &&(
                    <>
                    {fetchedData?.is_editable ?(
                        <View style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="cash-register" mode="contained" onPress={() => {
                            Alert.alert(`Collect Loan Amount ${memberDetailsArray.reduce((sum, item) => sum + +item.loan_amt, 0)}/-?`, `Are you sure, you want to deposit this amount?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: async () => await editeRecoveryEMI(),
                                text: "Yes"
                            }])

                        }} loading={loading} 
                    //    disabled={
                    //         loading ||
                    //         memberDetailsArray.every(
                    //         item =>
                    //             (!item.loan_amt && Number(item.loan_amt) === 0) &&
                    //             (!item.sb_amt && Number(item.sb_amt) === 0)
                    //         )
                    //     }
                    disabled={loading || isAmountEmpty}
                        >
                            
                            {!loading ? "Edit Collect Amount" : "DON'T CLOSE THIS PAGE..."}
                        </ButtonPaper>
                    </View>
                    ) : (
                        <View style={{
                        flexDirection: "row",
                        marginTop: 10,
                        justifyContent: "center",
                        gap: 10
                    }}>
                        <ButtonPaper icon="cash-register" mode="contained" onPress={() => {
                            Alert.alert(`Collect Loan Amount ${memberDetailsArray.reduce((sum, item) => sum + +item.loan_amt, 0)}/-?`, `Are you sure, you want to deposit this amount?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: async () => await sendRecoveryEMI(),
                                text: "Yes"
                            }])

                        }} loading={loading} 
                        disabled={loading || isAmountEmpty}
                        >
                            
                            {!loading ? "Collect Amount" : "DON'T CLOSE THIS PAGE..."}
                        </ButtonPaper>
                    </View>
                    )}
                    </>
                    )}
                    

                    {/* <View>
                        <Divider />
                    </View> */}

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default RecoveryGroupFormMain

const styles = StyleSheet.create({})