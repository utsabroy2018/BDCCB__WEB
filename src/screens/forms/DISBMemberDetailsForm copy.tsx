import React, { useContext, useEffect, useState } from 'react'

import { Alert, Linking, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { Checkbox, Icon, IconButton, RadioButton, Text } from "react-native-paper"
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
import { disableCondition } from '../../utils/disableCondition'
import { KeyboardAvoidingView } from "react-native";

const DISBMemberDetailsForm = ({ fetchedData, branchCode}) => {
    const theme = usePaperColorScheme()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [hasBeforeUpnapproveTransDate, setHasBeforeUpnapproveTransDate] = useState(false);
    const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "")

    const { location, error } = useGeoLocation()
    const [geolocationFetchedAddress, setGeolocationFetchedAddress] = useState(() => "")
    const [errMsg, setErrMsg] = useState(() => "")
    const [openDate2, setOpenDate2] = useState(() => false)
    const [openDate, setOpenDate] = useState(() => false)
    const { handlePrint } = useEscPosPrint()
    const [remainDisburseAmt, setRemainDisburseAmt] = useState('');
    const [memberList, setMemberList] = useState([]);

    const [members, setMembers] = useState([
    {
        id: 1,
        member_name: "",
        disb_amt: "",
        gp_leader_flag: 'Y',
    },
    ]);



    const [loading, setLoading] = useState(() => false)

    const [formData, setFormData] = useState({

        period: "",
        curr_roi: "",
        penal_roi: "",
        disb_dt: new Date(),
        grand_total: "",
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
        fetchMemberDetails()
    }, [isFocused])

    	

    const getClientIP = async () => {
    const res = await fetch("https://api.ipify.org?format=json")
    const data = await res.json()
    return data.ip
    }

    const fetchMemberDetails = async () => {

    setLoading(true)

    const creds = {
    group_code: loginStore?.emp_id,
    tenant_id: loginStore?.tenant_id,
    branch_id: loginStore?.brn_code,
    }
    console.log('start',  creds, "////////////////////////////////")

//     {
//     "branch_id" : "",
//     "tenant_id" : "",
//     "group_code" : "emp_id"
// }

    await axios.post(ADDRESSES.FETCH_MEMBER_LOAN_DETAILS, creds, {
    headers: {
    Authorization: loginStore?.token, // example header
    "Content-Type": "application/json", // optional
    }
    }
    ).then(async res => {
    console.log('start',  res?.data?.data, "Testttttttttttttttttttttttttttttttttttttttttt")
    if(res?.data?.success){
      setFormData({
            period: res?.data?.data?.period?.toString() || "",
            curr_roi: res?.data?.data?.curr_roi?.toString() || "",
            penal_roi: res?.data?.data?.penal_roi?.toString() || "",
            disb_dt: res?.data?.data?.disb_dt ? new Date(res?.data?.data?.disb_dt) : new Date(),
            grand_total: res?.data?.data?.grand_total?.toString() || "",
      })
      setMemberList(res?.data?.data?.members || [])
    
    }
    

    }).catch(err => {
    ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
    })
    setLoading(false)
    }

    useEffect(() => {
		if(loginStore?.user_type == 'S'){
			remainingDisburseAmt()
		}
		
	}, [remainDisburseAmt])

       const remainingDisburseAmt = async () => {
        // if (hasBeforeUpnapproveTransDate) {
        //     ToastAndroid.show(`There are unapproved ${errMsg} before this date. Please check and try again.`, ToastAndroid.SHORT)
        //     return;
        // }
        setLoading(true)

        const ip = await getClientIP()

        const creds = {
            pacs_shg_id : loginStore?.emp_id,
            loan_to : loginStore?.user_type,
			}


      
        console.log("PAYLOAD---RECOVERY", creds, 'PPPPPPPPPPPPPPP', loginStore)
        // return
        
        await axios.post(ADDRESSES.FETCH_MAX_BALANCE, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
        ).then(async res => {
            // console.log("RESSSSS", res?.data)
            if(res?.data?.success){
            console.log(loginStore?.user_type, "RESSSSSssssssssssssssssssssssssssssssssssss", res?.data?.data)
              if(res?.data?.data.length > 0){
                setRemainDisburseAmt(res?.data?.data[0]?.max_balance)
              } else {
                setRemainDisburseAmt("0")
              }
                
            }

        }).catch(err => {
            ToastAndroid.show("Some error occurred while submitting EMI.", ToastAndroid.SHORT)
        })
        setLoading(false)
    }



const totalDisbAmt = members.reduce(
  (sum, item) => sum + Number(item.disb_amt || 0),
  0
);


const removeRow = (id) => {
  setMembers(prev => prev.filter(item => item.id !== id));
};

const canAddMember = () => {
// return Number(totalDisbAmt) <= Number(remainDisburseAmt);
// if(Number(totalDisbAmt) >= Number(remainDisburseAmt)){
    if (Number(totalDisbAmt) > Number(remainDisburseAmt)) {
    return false;
  }

    if (members.length === 0) return true;

  const last = members[members.length - 1];
  return (
    last.member_name?.trim().length > 0 &&
    last.disb_amt?.trim().length > 0
  );

// }
  
};



const addRow = () => {
  setMembers(prev => [
    ...prev,
    {
      id: prev.length + 1,
      member_name: "",
      disb_amt: "",
    //   gp_leader_flag: false,
    gp_leader_flag: "N",
    },
  ]);
};


const selectMember = (id:any) => {
  setMembers(prev =>
    prev.map(item => ({
      ...item,
    //   gp_leader_flag: item.id === id,
    gp_leader_flag: item.id === id ? "Y" : "N",
    }))
  );
};

const isToday = (someDate: Date) => {
        const today = new Date()
        return (
            someDate.getDate() === today.getDate() &&
            someDate.getMonth() === today.getMonth() &&
            someDate.getFullYear() === today.getFullYear()
        )
    }

useEffect(() => {
  const currRoi = Number(formData.curr_roi);

  if (!isNaN(currRoi) && currRoi > 0) {
    handleFormChange("penal_roi", String(currRoi + 2));
  } else {
    handleFormChange("penal_roi", "");
  }
}, [formData.curr_roi]);



// const canAddMember = () => {
//   return totalDisbAmt <= remainDisburseAmt;
// };


    return (
        <SafeAreaView>
            <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
            <ScrollView 
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 120 }}
            // showsVerticalScrollIndicator={false}
            style={{
                backgroundColor: theme.colors.background,
            }}>
                <View style={{
                    paddingBottom: 50,
                    gap: 14
                }}>
                    
                    <InputPaper 
                    label="Group Name" keyboardType="default" 
                    leftIcon='account-group'
                    value={loginStore.emp_name}
                    onChangeText={(txt: any) => handleFormChange("emp_name", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} disabled />

                    

                  


                    <InputPaper 
                    label="Disburse Date *" keyboardType="default" 
                    leftIcon='calendar'
                    value={new Date(formData.disb_dt).toLocaleDateString("en-GB")} 
                    onChangeText={(txt: any) => handleFormChange("disb_dt", txt)} 
                    disabled
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} />
                    

                    

                    <DatePicker
                    modal
                    mode="date"
                    // minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 55))}
                    // maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                    maximumDate={new Date()} 
                    open={openDate}
                    date={formData.disb_dt}
                    onConfirm={date => {
                    setOpenDate(false)
                    handleFormChange("disb_dt", date)
                    }}
                    onCancel={() => {
                    setOpenDate(false)
                    }}
                    />

                    {/* <DatePicker
                    modal
                    mode="date"
                    open={openDate2}
                    date={formData.disb_dt ? new Date(formData.disb_dt) : new Date()}
                    onConfirm={(date) => {
                        setOpenDate2(false);
                        handleFormChange("disb_dt", date.toISOString()); // keep string
                    }}
                    onCancel={() => setOpenDate2(false)}
                    /> */}


                    <InputPaper 
                    label="Period (In Month) *" keyboardType="number-pad" 
                    leftIcon='calendar'
                    value={formData.period} 
                    onChangeText={(txt: any) => handleFormChange("period", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper 
                    label="Current ROI *" keyboardType="number-pad" 
                    leftIcon='percent'
                    value={formData.curr_roi} 
                    onChangeText={(txt: any) => handleFormChange("curr_roi", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} />

                    <InputPaper 
                    label="Ovd ROI *" keyboardType="number-pad" 
                    leftIcon='percent'
                    value={formData.penal_roi} 
                    onChangeText={(txt: any) => handleFormChange("penal_roi", txt)} 
                    customStyle={{
                    backgroundColor: theme.colors.background,
                    }} />


{/* <View>
    <Text>{JSON.stringify(loginStore, null, 2)} </Text>
     <Text>{JSON.stringify(formData, null, 2)} </Text>
     <Text>{JSON.stringify(members, null, 2)} </Text>
</View> */}



  {/* <View>
  {loginStore?.user_type === "S" && (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ECFDF5", // emerald-50
        borderColor: "#6EE7B7",     // emerald-300
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 2,              // shadow (Android)
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "500",
          color: "#065F46",         // emerald-800
          marginRight: 6,
        }}
      >
        Balance:
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#065F46",
        }}
      >
        ₹{Number(remainDisburseAmt)?.toLocaleString("en-IN")}
      </Text>
    </View>
  )}
</View> */}


<View style={{ padding: 5 }}>

  {/* Title */}
  <Text
    style={{
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
      color: theme.colors.primary,
    }}
  >
    Group Leader
  </Text>

  {/* Rows */}
  {memberList.map((item) => (
  <View
    key={item.loan_id}
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    }}
  >
    {/* Radio Button */}
    <RadioButton
      value={String(item.loan_id)}
      status={item.gp_leader_flag === "Y" ? "checked" : "unchecked"}
      disabled
    />

    {/* Member Name */}
    <InputPaper
        label="Member"
        disabled
        value={item.member_name}
        customStyle={{
          backgroundColor: theme.colors.background,
          marginRight: 6,
          flex: 2.5,
          fontSize: 13,
        }} onChangeText={function (msg: string | number): void {
          throw new Error('Function not implemented.')
        } }    />

    {/* Amount */}
    <InputPaper
        label="Amount"
        disabled
        value={String(item.disb_amt)}
        customStyle={{
          backgroundColor: theme.colors.background,
          flex: 1.5,
          fontSize: 13,
        }} onChangeText={function (msg: string | number): void {
          throw new Error('Function not implemented.')
        } }    />
  </View>
))}


  
<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  }}
>


  {/* Total Amount */}
  <View style={{flex: 1}}>
    <Text style={{ fontSize: 16, color: theme.colors.green, fontWeight: "700", textAlign: "center" }}>
      Total Amount ₹ {formData?.grand_total}
    </Text>

    {/* <Text
      style={{
        fontSize: 14,
        fontWeight: "600",
        color:
          totalDisbAmt > Number(remainDisburseAmt)
            ? theme.colors.error
            : theme.colors.primary,
      }}
    >
      ₹ {formData?.grand_total}
    </Text> */}
  </View>
</View>


</View>



                    

                    


                    {/* <ButtonPaper icon="cash-register" mode="contained" onPress={() => {
                            Alert.alert(`Submit Disbursment?`, `Are you sure, you want to submit?`, [{
                                onPress: () => null,
                                text: "No"
                            }, {
                                onPress: async () => await newDisbursement(),
                                text: "Yes"
                            }])

                        }} loading={loading} 
                        disabled={formData?.period === "" || formData?.curr_roi === "" || formData?.penal_roi === "" || members.length < 2 || !canAddMember() || loading}
                        >
                            
                            {!loading ? "Submit Disbursment" : "DON'T CLOSE THIS PAGE..."}
                        </ButtonPaper> */}

                    

                    

                </View>
            </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    )
}

export default DISBMemberDetailsForm

const styles = StyleSheet.create({})