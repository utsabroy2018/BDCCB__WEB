    import React, { useCallback, useContext, useEffect, useState } from 'react'

    import { StyleSheet, SafeAreaView, View, ScrollView, RefreshControl, ToastAndroid, Alert, Linking, BackHandler, TouchableOpacity } from 'react-native'
    import { Icon, IconButton, MD2Colors, Text } from "react-native-paper"
    import RNRestart from 'react-native-restart'
    import { usePaperColorScheme } from '../theme/theme'
    import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native'
    import HeadingComp from "../components/HeadingComp"
    import ListCard from "../components/ListCard"
    import { branchStorage, loginStorage } from '../storage/appStorage'
    import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'
    import DatePicker from 'react-native-date-picker'
    import axios from 'axios'
    import { ADDRESSES } from '../config/api_list'
    import { formattedDate, formattedDateTime } from '../utils/dateFormatter'
    import LoadingOverlay from '../components/LoadingOverlay'
    import RadioComp from '../components/RadioComp'
    import AnimatedFABPaper from "../components/AnimatedFABPaper"
    import navigationRoutes from '../routes/routes'

    import { GestureHandlerRootView } from 'react-native-gesture-handler'
    // import SlideButton from 'rn-slide-button'
    import ButtonPaper from '../components/ButtonPaper'
    import useGeoLocation from '../hooks/useGeoLocation'
    import DeviceInfo from 'react-native-device-info'
    import { AppStore } from '../context/AppContext'
    import useCurrentRouteName from '../hooks/useCurrentRoute'
    import useCheckOpenCloseDate from '../components/useCheckOpenCloseDate'

    const HomeScreen = () => {
        const theme = usePaperColorScheme()
        const navigation = useNavigation()
        const isFocused = useIsFocused()
        const currentRoute = useCurrentRouteName()
        // const appVersion = DeviceInfo.getVersion()
        const {
            fetchCurrentVersion,
        } = useContext<any>(AppStore)
        const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")
        // const branchStrore = JSON.parse(branchStorage?.getString("branch-data") ?? "")
        // const [isLocationMocked, setIsLocationMocked] = useState(() => false)
        const [branchAssign, setBranchAssign] = useState(loginStore?.branch_name ?? "")
        // const { location, error } = useGeoLocation()
        // const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")
        const { handleLogout } = useContext<any>(AppStore)
        const [refreshing, setRefreshing] = useState(() => false)
        const [loading, setLoading] = useState(() => false)

        const [currentTime, setCurrentTime] = useState(new Date());

        const [noOfGrtForms, setNoOfGrtForms] = useState(() => "")
        const [totalCashRecovery, setTotalCashRecovery] = useState(() => "")
        const [totalBankRecovery, setTotalBankRecovery] = useState(() => "")

        const [checkUser, setCheckUser] = useState(() => "O")

        const [openDate2, setOpenDate2] = useState(false)
        const [choosenDate, setChoosenDate] = useState(new Date())
        const formattedChoosenDate = formattedDate(choosenDate)

        const [isExtended, setIsExtended] = useState<boolean>(() => true)
        const [isClockedIn, setIsClockedIn] = useState<boolean>(() => false)
        const [clockedInDateTime, setClockedInDateTime] = useState(() => "")
        const [clockedInFetchedAddress, setClockedInFetchedAddress] = useState(() => "")
        const [clockInStatus, setClockInStatus] = useState<string>(() => "")
        const [checkIsAttandanceStatusPending, setAttanadanceStatusPending] = useState<boolean>(() => true)
        // const [openDtCloseDt, setOpenDtCloseDt] = useState(null)
        const [remainDisburseAmt, setRemainDisburseAmt] = useState({});


        // useEffect(() => {
        //     fetchCurrentVersion()
        //     console.log('home',loginStore?.token)
        // }, [navigation])

        useEffect(() => {
            if(loginStore?.user_type == 'S'){
                remainingDisburseAmt()
            }
            
        }, [isFocused])

        const getClientIP = async () => {
            const res = await fetch("https://api.ipify.org?format=json")
            const data = await res.json()
            return data.ip
        }

        const remainingDisburseAmt = async () => {
            setLoading(true)

            const ip = await getClientIP()

            const creds = {
                // pacs_shg_id : loginStore?.emp_id,
                // loan_to : loginStore?.user_type,
                tenant_id: loginStore?.tenant_id,
                emp_id : loginStore?.emp_id,
                // loan_to : loginStore?.user_type,
                }
            // return
            
            await axios.post(ADDRESSES.FETCH_LOAN_BALANCE, creds, {
                headers: {
                    Authorization: loginStore?.token, // example header
                    "Content-Type": "application/json", // optional
                }
            }
            ).then(async res => {
                // console.log("RESSSSS", res?.data)
                if(res?.data?.success){

                console.log(creds, "RESSSSSssssssssssssssssssssssssssssssssssss", res?.data?.data.length)

                if(res?.data?.data.length > 0){
                    setRemainDisburseAmt(res?.data?.data)
                } else {
                    setRemainDisburseAmt("0")
                }
                    
                }

            }).catch(err => {
                ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
            })
            setLoading(false)
        }


        useEffect(() => {
            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);

            return () => clearInterval(interval);
        }, []);

        const handleRefresh = () => {
            RNRestart.Restart()
        }

        const onRefresh = useCallback(() => {
            setRefreshing(true)
            handleRefresh()
            setTimeout(() => {
                setRefreshing(false)
            }, 2000)
        }, [])



        const handleFetchDashboardDetailsGRTBM = async () => {
            const creds = {
                flag: checkUser,
                emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
                datetime: formattedChoosenDate,
                branch_code: loginStore?.brn_code
            }
            await axios.post(`${ADDRESSES.DASHBOARD_DETAILS_BM}`, creds, {
                headers: {
                    Authorization: loginStore?.token, // example header
                    "Content-Type": "application/json", // optional
                }
            }).then(res => {
                if(res?.data?.suc === 0) {
                    handleLogout()
                }   
                else{
                setNoOfGrtForms(res?.data?.msg[0]?.no_of_grt)
                }
                console.log("----====----", res?.data)
            }).catch(err => {
                ToastAndroid.show("Some error occurred while fetching dashboard details BM 1.", ToastAndroid.SHORT)
                console.log("Some Errr", err)
            })
        }

        const handleFetchDashboardCashDetailsBM = async () => {
            const creds = {
                flag: checkUser,
                emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
                tr_mode: "C",
                datetime: formattedChoosenDate,
                branch_code: loginStore?.brn_code
            }
            await axios.post(`${ADDRESSES.DASHBOARD_CASH_DETAILS_BM}`, creds, {
                headers: {
                    Authorization: loginStore?.token, // example header
                    "Content-Type": "application/json", // optional
                }
            }).then(res => {
                if(res?.data?.suc === 0) {
                    handleLogout()
                }
                else{
                setTotalCashRecovery(res?.data?.msg[0]?.tot_recov_cash)
                console.log("----====----CC", res?.data)
                }
            }).catch(err => {
                ToastAndroid.show("Some error occurred while fetching dashboard details BM 2.", ToastAndroid.SHORT)
                console.log("Some Errr", err)
            })
        }

        const handleFetchDashboardBankDetailsBM = async () => {
            const creds = {
                flag: checkUser,
                emp_id: checkUser === "O" ? loginStore?.emp_id : checkUser === "A" ? 0 : 0,
                tr_mode: "B",
                datetime: formattedChoosenDate,
                branch_code: loginStore?.brn_code
            }
            await axios.post(`${ADDRESSES.DASHBOARD_BANK_DETAILS_BM}`,creds, {
                headers: {
                    Authorization: loginStore?.token, // example header
                    "Content-Type": "application/json", // optional
                }
            }).then(res => {
                if(res?.data?.suc === 0) {
                    handleLogout()
                }
                else{
                setTotalBankRecovery(res?.data?.msg[0]?.tot_recov_bank)
                }
                console.log("----====----BB", res?.data)
            }).catch(err => {
                ToastAndroid.show("Some error occurred while fetching dashboard details BM3.", ToastAndroid.SHORT)
                console.log("Some Errr", err)
            })
        }

        // useEffect(() => {
        //     if(isFocused){
        //     if (loginStore?.id === 2) { // BM
        //         handleFetchDashboardDetailsGRTBM()
        //         handleFetchDashboardCashDetailsBM()
        //         handleFetchDashboardBankDetailsBM()
        //         }
        //     }
        // }, [checkUser, isFocused])

        return (
            <SafeAreaView>
                {/* <ActivityIndicator size={'large'} /> */}
                {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={{
                        backgroundColor: theme.colors.background,
                        minHeight: SCREEN_HEIGHT,
                        // height: "auto",
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                // onScroll={onScroll}
                >
                    {/* <HeadingComp title={`Hi, ${(loginStore?.emp_name as string)?.split(" ")[0]}`}
                    subtitle={`Welcome back, ${loginStore?.id === 1 ? "Branch User" : loginStore?.id === 2 ? "Branch Admin" : loginStore?.id === 3 ? "MIS Assistant" : "Administrator"}!`} 
                    background={MD2Colors.blue100} 
                    footerText={`Branch • ${branchAssign}`} /> */}
                    <HeadingComp title={`Hi, ${(loginStore?.emp_name as string)?.split(" ")[0]}`}
                        subtitle={`Welcome back, ${loginStore?.user_type === 'P' ? "PACS" : loginStore?.user_type === 'S' ? "SHG" : loginStore?.user_type === 'B' ? "Branch" : "Head Office"}!`}
                        background={MD2Colors.blue100}
                        footerText={`Branch • ${loginStore?.branch_name}`} />
                    <View style={{
                        width: SCREEN_WIDTH,
                        alignItems: "center",
                        // minHeight: SCREEN_HEIGHT,
                        height: "auto", 
                    }}>

                        {/* {clockInStatus === "O" || clockInStatus === "E" || !clockInStatus ? <View style={{
                            backgroundColor: MD2Colors.green50,
                            width: SCREEN_WIDTH / 1.1,
                            height: "auto",
                            marginBottom: 10,
                            borderTopRightRadius: 30,
                            borderBottomLeftRadius: 30,
                            padding: 15,
                            gap: 10,
                        }}>
                            <ButtonPaper
                                icon={"clock-outline"}
                                onPress={
                                    () => {
                                        Alert.alert("Clock In", `Are you sure you want to Clock In?\nTime: ${currentTime.toLocaleTimeString("en-GB")}`, [
                                            { "text": "Cancel", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" },
                                            { "text": "CLOCK IN", "onPress": async () => await handleClockIn() }
                                        ])
                                    }
                                }
                                mode='elevated'
                                buttonColor={MD2Colors.green600}
                                textColor={MD2Colors.green50}
                                style={{
                                    borderRadius: 0,
                                    borderTopRightRadius: 15,
                                    borderBottomLeftRadius: 15,
                                    padding: 5,
                                }}
                                loading={checkIsAttandanceStatusPending}
                                disabled={checkIsAttandanceStatusPending}>
                                {!checkIsAttandanceStatusPending && "Clock In"}
                            </ButtonPaper>

                            
                        </View>
                            : <View style={{
                                backgroundColor: MD2Colors.pink50,
                                width: SCREEN_WIDTH / 1.1,
                                height: "auto",
                                marginBottom: 10,
                                borderTopRightRadius: 30,
                                borderBottomLeftRadius: 30,
                                padding: 15,
                                gap: 10,
                            }}>
                                

                                <ButtonPaper
                                    icon={"clock-out"}
                                    onPress={
                                        () => Alert.alert("Clock Out", `Are you sure you want to Clock Out?\nTime: ${currentTime.toLocaleTimeString("en-GB")}`, [
                                            { "text": "Cancel", "onPress": () => console.log("Cancel Pressed"), "style": "cancel" },
                                            { "text": "CLOCK OUT", "onPress": async () => await handleClockOut() }
                                        ])
                                    }
                                    mode='elevated'
                                    buttonColor={MD2Colors.pink600}
                                    textColor={MD2Colors.pink50}
                                    style={{
                                        borderRadius: 0,
                                        borderTopRightRadius: 15,
                                        borderBottomLeftRadius: 15,
                                    }}
                                    loading={checkIsAttandanceStatusPending}
                                    disabled={checkIsAttandanceStatusPending}
                                >{!checkIsAttandanceStatusPending && "Clock Out"}</ButtonPaper>
                                
                                <View style={{
                                    borderWidth: 1,
                                    borderColor: MD2Colors.pink900,
                                    borderStyle: "dashed",
                                    borderRadius: 15,
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    padding: 10,
                                    marginTop: 5,
                                    justifyContent: "center",
                                }}>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        gap: 10
                                    }}>
                                        <Icon source={"clock-in"} size={20} color={MD2Colors.pink900} />
                                        <Text variant='bodyLarge' style={{
                                            color: MD2Colors.pink900
                                        }}>{new Date(clockedInDateTime).toLocaleTimeString("en-GB")}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center",
                                        gap: 10,
                                    }}>
                                        <Icon source={"map-marker-outline"} size={20} color={MD2Colors.pink900} />
                                        <Text variant='bodyLarge' style={{
                                            color: MD2Colors.pink900,
                                        }}>
                                            {clockedInFetchedAddress?.length > 10 ? `${clockedInFetchedAddress?.substring(0, 30)}...` : clockedInFetchedAddress}
                                        </Text>
                                    </View>

                                </View>

                                
                            </View>} */}


                        {/* <Text variant='bodyLarge'>{JSON.stringify(loginStore)}</Text> */}


                        <View style={{
                            backgroundColor: MD2Colors.blue50,
                            width: SCREEN_WIDTH / 1.1,
                            height: "auto",
                            marginBottom: 10,
                            borderTopRightRadius: 30,
                            borderBottomLeftRadius: 30,
                            padding: 15,
                            gap: 10,
                        }}>
                            {loginStore?.id === 2 && <View>
                                <RadioComp
                                    title={checkUser === "Own" ? `Your Data` : `All User`}
                                    titleColor={MD2Colors.blue900}
                                    color={MD2Colors.blue900}
                                    radioButtonColor={MD2Colors.blue900}
                                    icon="account-convert-outline"
                                    dataArray={[
                                        {
                                            optionName: "OWN",
                                            optionState: checkUser,
                                            currentState: "O", // bm emp_id -> 
                                            optionSetStateDispathFun: (e) => setCheckUser(e)
                                        },
                                        {
                                            optionName: "ALL",
                                            optionState: checkUser,
                                            currentState: "A", // emp_id -> 0
                                            optionSetStateDispathFun: (e) => setCheckUser(e)
                                        },
                                    ]}
                                />
                            </View>}
                        

                            {/* <View style={{
                                height: 80,
                                width: "100%",
                                backgroundColor: theme.colors.surface,
                                borderRadius: 20,
                                borderBottomRightRadius: 0,
                                borderBottomLeftRadius: 0,
                                alignItems: "center",
                                paddingHorizontal: 15,
                                flexDirection: "row-reverse",
                                justifyContent: "space-between",
                                // gap: 15
                            }}>
                                <View style={{
                                    backgroundColor: theme.colors.tertiaryContainer,
                                    width: 53,
                                    height: 53,
                                    borderRadius: 150,
                                    justifyContent: 'center',
                                    alignItems: "center"
                                }}>
                                    <IconButton icon="calendar-month-outline" iconColor={theme.colors.onTertiaryContainer} onPress={() => setOpenDate2(true)} />
                                    
                                </View>
                                <View>
                                    <Icon source="arrow-left-thin" size={25} color={theme.colors.onSurface} />
                                </View>
                                <View>
                                    <Text variant='titleMedium' style={{ color: theme.colors.tertiary }}>{`TXN DATE: ${loginStore?.transaction_date}`}</Text>
                                </View>
                                
                            </View> */}

                            {/* <View style={{
                                height: 80,
                                width: "100%",
                                backgroundColor: theme.colors.surface,
                                borderRadius: 20,
                                borderBottomRightRadius: 0,
                                borderBottomLeftRadius: 0,
                                alignItems: "center",
                                paddingHorizontal: 15,
                                flexDirection: "row-reverse",
                                justifyContent: "space-between",
                                // gap: 15
                            }}>
                                <View style={{
                                    backgroundColor: theme.colors.tertiaryContainer,
                                    width: 53,
                                    height: 53,
                                    borderRadius: 150,
                                    justifyContent: 'center',
                                    alignItems: "center"
                                }}>
                                    <IconButton icon="calendar-month-outline" iconColor={theme.colors.onTertiaryContainer} onPress={() => setOpenDate2(true)} />
                                    
                                </View>
                                <View>
                                    <Icon source="arrow-left-thin" size={25} color={theme.colors.onSurface} />
                                </View>
                                <View>
                                    <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`CURRENT DATE & TIME:`}</Text>
                                    <Text variant='titleSmall' style={{ color: theme.colors.secondary }}>{`${choosenDate.toLocaleDateString("en-GB")} ${currentTime.toLocaleTimeString("en-GB")}`}</Text>
                                </View>
                                
                            </View> */}

                            
                            <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={remainDisburseAmt[0] == 0}
                            style={{
                                opacity: remainDisburseAmt[0] == 0 ? 0.8 : 1
                            }}
                            onPress={() => {
                                navigation.dispatch(
                                    CommonActions.navigate({
                                        name: navigationRoutes.disbMemberScreen,
                                         params: {
                                         group_code: remainDisburseAmt[0]?.group_code,
                                         }
                                    }),
                                )
                            }}
                            >
                            <ListCard
                                title={` ${remainDisburseAmt[0] == 0 ? "No Loan Details Found" : "Loan Member Details"}`}
                                // subtitle={`${noOfGrtForms || 0} Forms`}
                                subtitle={`Balance Rs.${remainDisburseAmt[0] == 0 ? 0 : remainDisburseAmt[0]?.loan_balance}/-` } 
                                position={0}
                                // icon='chevron-right'
                                icon='format-list-numbered'
                                iconViewColor={MD2Colors.green500}
                                iconViewBorderColor={MD2Colors.green200}
                            />
                            
                            </TouchableOpacity>
                            {/* <ListCard
                                title={`Total Cash Recovery`}
                                // subtitle={`Rs. ${totalCashRecovery || 0}/-`}
                                subtitle={`Rs. 200/-`}
                                position={0}
                                icon='cash'
                                iconViewColor={MD2Colors.pink500}
                                iconViewBorderColor={MD2Colors.pink200}
                            /> */}
                            <ListCard
                                title={`S.B.`}
                                // subtitle={`Rs. ${totalBankRecovery || 0}/-`}
                                subtitle={`Rs. 0/-`}
                                position={-1}
                                icon='bank'
                                iconViewColor={MD2Colors.blue500}
                                iconViewBorderColor={MD2Colors.blue200}
                            />

                            {/* <Text>{remainDisburseAmt[0]}</Text> */}

                        </View>


                    </View>
                </ScrollView>

                {/* <GestureHandlerRootView> */}
                {/* <SlideButton title="Slide To Unlock" /> */}


                {loginStore?.id === 2 && <AnimatedFABPaper
                    color={theme.colors.onTertiaryContainer}
                    variant="tertiary"
                    icon="form-select"
                    label="Pending Forms"
                    // disabled={openDtCloseDt === "C" ? true : false}
                    onPress={() =>
                        navigation.dispatch(
                            CommonActions.navigate({
                                name: navigationRoutes.bmPendingLoansScreen,
                            }),
                        )
                    }
                    extended={isExtended}
                    animateFrom="left"
                    iconMode="dynamic"
                    customStyle={[styles.fabStyle, { backgroundColor: theme.colors.tertiaryContainer }]}
                />}
                {/* openDtCloseDt */}
                
                {/* {loginStore?.id === 1 &&  */}
                {/* <AnimatedFABPaper
                    color={theme.colors.onTertiaryContainer}
                    variant="tertiary"
                    icon="form-select"
                    label="Disb. Form"
                    // disabled={openDtCloseDt === "C" ? true : false}
                    onPress={() =>
                        navigation.dispatch(
                            CommonActions.navigate({
                                name: navigationRoutes.disbFormScreen,
                            }),
                        )
                    }
                    extended={isExtended}
                    animateFrom="left"
                    iconMode="dynamic"
                    customStyle={[styles.fabStyle, { backgroundColor: theme.colors.tertiaryContainer }]}
                /> */}
                {/* } */}
                
            
            </SafeAreaView >
        )
    }

    export default HomeScreen

    const styles = StyleSheet.create({
        fabStyle: {
            bottom: normalize(16),
            right: normalize(16),
            position: "absolute",
        },
    })