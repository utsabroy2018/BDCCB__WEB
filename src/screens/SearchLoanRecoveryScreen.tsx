import React, { useContext, useEffect, useState } from 'react'

import { StyleSheet, SafeAreaView, ScrollView, View, ToastAndroid, Alert } from 'react-native'
import { usePaperColorScheme } from '../theme/theme'
import { SCREEN_HEIGHT } from 'react-native-normalize'
import HeadingComp from '../components/HeadingComp'
import { Divider, Icon, IconButton, List, Searchbar, Text } from 'react-native-paper'
import axios from 'axios'
import { ADDRESSES } from '../config/api_list'
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
import navigationRoutes from '../routes/routes'
import { loginStorage } from '../storage/appStorage'
import RadioComp from '../components/RadioComp'
import DatePicker from 'react-native-date-picker'
import ButtonPaper from '../components/ButtonPaper'
import { formattedDate } from '../utils/dateFormatter'
import { AppStore } from '../context/AppContext'

const SearchLoanRecoveryScreen = () => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [openFromDate, setOpenFromDate] = useState(() => false);
    const [reportData, setReportData] = useState(() => [])
    const [fromDate, setFromDate] = useState(() => new Date());
    const { handleLogout } = useContext<any>(AppStore)
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
    const [loading, setLoading] = useState(() => false)
    const [isDisabled, setDisabled] = useState(() => false)
    const [search, setSearch] = useState(() => "")
    const [demand_click, setDemandClick] = useState(() => false)
    const [formsData, setFormsData] = useState<any[]>(() => [])
    const [group_code, setGroupCode] = useState([])
    const [alreadyRecovered, setAlreadyRecovered] = useState(() => false)

    // const [isApproved, setIsApproved] = useState<string>(() => "U")

    

    useEffect(() => {
        setSearch("")
        setFormsData(() => [])

        console.log(loginStore, 'loginStoreloginStoreloginStoreloginStore');
        
    }, [isFocused])

    useEffect(() => {
        handleSearch()
    }, [isFocused])

   

    const handleSearch = async () => {
        setLoading(true)
        setDemandClick(false)
        const creds = {
            // grp_dtls: src,
            // get_date: new Date(),
            // branch_code: loginStore?.brn_code

            branch_id : loginStore?.user_type == 'P' ? loginStore?.brn_code : loginStore?.user_type == 'S' ? loginStore?.emp_id : "",
			tenant_id : loginStore?.tenant_id,
			loan_to : loginStore?.user_type == 'P' ? "P" : loginStore?.user_type == 'S' ? "S" : "",
			approval_status: "U",
        }

        await axios.post(`${ADDRESSES.FETCH_DISBURS_DTLS}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(res => {

            // console.log(res?.data?.data, 'ggggggggggggggggggggggggggggg');
            
            if(res?.data?.success){
            setFormsData(res?.data?.data)

            } else {
            handleLogout() 
            }

           

        }).catch(err => {
            ToastAndroid.show("Some error while searching groups!", ToastAndroid.SHORT)
        })
        setLoading(false)
    }

   

    

    return (
        <SafeAreaView>
            <ScrollView style={{
                backgroundColor: theme.colors.background,
                minHeight: SCREEN_HEIGHT,
                height: 'auto',
            }} keyboardShouldPersistTaps="handled">
                <HeadingComp title="Accept Transaction" subtitle="Find Disburse" />
                {/* <View style={{
                    paddingHorizontal: 20
                }}>

                    

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        gap: 5
                    }}>

                        <Searchbar
                            autoFocus
                            placeholder={"Search by Group Name/Code"}
                            onChangeText={onChangeSearch}
                            value={search}
                            elevation={search ? 2 : 0}
                            keyboardType={"default"}
                            maxLength={30}
                            style={{
                                backgroundColor: theme.colors.tertiaryContainer,
                                color: theme.colors.onTertiaryContainer,
                                width: "84%",
                                paddingVertical: 1,
                                alignItems: "center",
                                alignSelf: "center"
                            }}
                            loading={loading ? true : false}
                            onClearIconPress={() => {
                                setSearch(() => "")
                                setFormsData(() => [])
                            }}
                        />

                       
                       
                        <IconButton icon={"magnify"} mode='contained' onPress={() => search && handleSearch()} size={35} style={{
                            borderTopLeftRadius: 10
                        }} />

                    </View>
                </View> */}

                {!demand_click && <View style={{
                    padding: 20,
                    paddingBottom: 120
                }}>
                    {/* <View>
                        <Text>{JSON.stringify(formsData, null, 2)} </Text>
                    </View> */}

                    {/* {formsData?.map((item, i) => (
                        <React.Fragment key={i}>
                            <List.Item
                                titleStyle={{
                                    color: theme.colors.primary, fontSize: 13
                                }}
                                descriptionStyle={{
                                    color: theme.colors.secondary, fontSize: 13
                                }}
                                key={i}
                                title={`Loan Id: ${item?.loan_id} - Txn. ${new Date(item?.trans_dt).toLocaleDateString("en-GB")}`}
                                description={
                                    <View>
                                        <Text style={{fontSize: 13}}>Loan A/C No.: {item?.loan_acc_no}</Text>
                                        <Text style={{
                                            color: theme.colors.green,  fontSize: 13
                                        }}>Disb. Amt. - {item?.disb_amt} </Text>
                                        <Text style={{
                                            color: theme.colors.green,  fontSize: 13
                                        }}>Disb. Date - {new Date(item?.disb_dt).toLocaleDateString("en-GB")}</Text>
                                    </View>
                                }
                                onPress={async () => {
                                    if (item?.memb_dtls?.length === 0) {
                                        Alert.alert("Alert", "No members with ongoing outstanding found.")
                                        return
                                    }

                                    await axios.post(ADDRESSES.VERIFY_RECOVERY, {
                                        "group_code": item?.group_code
                                    }, {
                                        headers: {
                                            Authorization: loginStore?.token, // example header
                                            "Content-Type": "application/json", // optional
                                        }
                                    }
                                    ).then(res => {
                                        console.log("VERIFY_RECOV", res?.data)
                                        if (res?.data?.suc === 1) {
                                            Alert.alert("Alert", "Recovery already done today. Do you want to recover again?", [
                                                {
                                                    text: "YES", onPress: () => navigation.dispatch(CommonActions.navigate({
                                                        name: navigationRoutes.recoveryGroupScreen,
                                                        params: {
                                                            group_details: item,
                                                            // approvalFlag: isApproved
                                                        }
                                                    }))
                                                },
                                                { text: "NO", onPress: () => null },
                                            ])
                                        } else {
                                            navigation.dispatch(CommonActions.navigate({
                                                name: navigationRoutes.recoveryGroupScreen,
                                                params: {
                                                    group_details: item,
                                                    // approvalFlag: isApproved
                                                }
                                            }))
                                        }
                                    }).catch(err => {
                                        console.log("VERIFY_RECOV ERRRRRRRR", err)
                                    })
                                }}
                                left={props => <List.Icon {...props} icon="form-select" />}
                                // console.log("------XXX", item?.branch_code, item?.form_no, item?.member_code)
                                right={props => (
                                    <View style={{
                                        alignSelf: 'center'
                                    }}>
                                        <Icon
                                            source={item?.status === "U" ? "alpha-u-circle-outline" : "alpha-a-circle-outline"}
                                            size={28}
                                            color={item?.status === "U" ? theme.colors.error : theme.colors.green}
                                        />
                                    </View>
                                )}
                            />
                            <Divider />
                        </React.Fragment>
                    ))} */}
                    {formsData?.length === 0 ? (
                    <View style={{ padding: 20, alignItems: "center" }}>
                        <Text style={{ fontSize: 14, color: theme.colors.secondary }}>
                        No data found
                        </Text>
                    </View>
                    ) : (
                        <>
                        {formsData?.map((item, i) => (
                    <React.Fragment key={i}>
                        <List.Item
                        titleStyle={{ color: theme.colors.primary, fontSize: 13 }}
                        descriptionStyle={{ color: theme.colors.secondary, fontSize: 13 }}
                        title={`Loan Id: ${item?.loan_id} - Txn. ${new Date(item?.trans_dt).toLocaleDateString("en-GB")}`}
                        description={
                            <View>
                            <Text style={{ fontSize: 13 }}>
                                Loan A/C No.: {item?.loan_acc_no}
                            </Text>
                            <Text style={{ color: theme.colors.green, fontSize: 13 }}>
                                Disb. Amt. - {item?.disb_amt}
                            </Text>
                            <Text style={{ color: theme.colors.green, fontSize: 13 }}>
                                Disb. Date - {new Date(item?.disb_dt).toLocaleDateString("en-GB")}
                            </Text>
                            </View>
                        }
                        onPress={() => {
                            if (item?.memb_dtls?.length === 0) {
                            Alert.alert("Alert", "No members with ongoing outstanding found.");
                            return;
                            }

                            navigation.dispatch(
                            CommonActions.navigate({
                                name: navigationRoutes.recoveryGroupScreen,
                                params: {
                                group_details: item,
                                },
                            })
                            );
                        }}
                        left={props => <List.Icon {...props} icon="file-document-outline" />}
                        right={props => (
                            <View style={{ alignSelf: "center" }}>
                            <Icon
                                source={"check-circle-outline"}
                                size={28}
                                color={theme.colors.green}
                            />
                            </View>
                        )}
                        />
                        <Divider />
                    </React.Fragment>
                    ))}
                        </>
                    )}
                    


                </View>}
                
            </ScrollView>
            {/* {loading && <LoadingOverlay />} */}
        </SafeAreaView>
    )
}

export default SearchLoanRecoveryScreen

const styles = StyleSheet.create({})