import axios from "axios"
import React, { createContext, useEffect, useRef, useState } from "react"
import { AppState, ToastAndroid, BackHandler, Text, Alert } from "react-native"
import { branchStorage, loginStorage } from "../storage/appStorage"
import { ADDRESSES } from "../config/api_list"
import DeviceInfo from "react-native-device-info"
import DialogBox from "../components/DialogBox";

// ✅ Correct Firebase import
import messaging from '@react-native-firebase/messaging'

export const AppStore = createContext<any>(null)


const AppContext = ({ children }) => {
    const appState = useRef(AppState.currentState)
    const appVersion = DeviceInfo.getVersion()
    // debugging
    const uat = false
    const [branchAssign, setBranchAssign] = useState<any>([]);
    const [isLogin, setIsLogin] = useState<boolean>(() => false)
    const [isLoading, setIsLoading] = useState<boolean>(() => false)
    const [dialogVisible, setDialogVisible] = useState(false);

    // const handleLogin = async (username: string, password: string,branch:any,userId:number,branchName:string, fcmToken:string) => {
    const handleLogin = async (username: string, password: string,branch:any,userId:number,branchName:string) => {
        setIsLoading(true)
        const creds = {
            username: username,
            password: password,
            // "app_version": appVersion,
            // "flag": "A",
            // "session_id": 0,
            // "in_out_flag":"I",
            // branch_code:branch,
        }


        await axios.post(`${ADDRESSES.LOGIN}`, creds).then(res => {

            

            // if (res?.data?.suc === 1) {
            if (res?.data?.success) {    
                    ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT);
                    console.log(res?.data?.user_dtls[0], 'bbbbbbbbbbbbbbbbbbb', res?.data);
                    
                    if(userId == 2){
                        const dt = {
                            ...res?.data?.user_dtls,
                            brn_code: branch,
                            branch_name:branchName,
                            token: res?.data?.token
                        };
                        console.log('startttttttt', res?.data?.user_dtls[0], 'bbbbbbbbbbbbbbbbbbb', JSON.stringify(dt), 'endddddddd');
                        loginStorage.set("login-data", JSON.stringify(dt));
                        setIsLogin(true);
                    } else {

                        const user = res?.data?.user_dtls?.[0];

                        // const dt_ = {
                        //     ...res?.data?.user_dtls,
                        //     token: res?.data?.token
                        // };

                        const dt_ = {
                                    ...user,
                                    dist_code: user?.district_list?.[0]?.dist_code ?? null,
                                    token: res?.data?.token,
                                    };

                        console.log(res?.data?.token, 'startttttttt', 'bbbbbbbbbbbbbbbbbbb', dt_, 'endddddddd');
                        

                        loginStorage.set("login-data", JSON.stringify(dt_));
                        // loginStorage.set("login-data", JSON.stringify(res?.data?.user_dtls));
                        setIsLogin(true);
                    }
                    
                  
            } else {
                ToastAndroid.show(`${res?.data?.msg}`, ToastAndroid.SHORT)
                setIsLogin(false)
            }
        }).catch(err => {
            console.log(">>>>>", err.message)
            ToastAndroid.show(`Something went wrong while logging in.`, ToastAndroid.SHORT)
        })
        console.log('asadsasd')
        setIsLoading(false)
    }


    //   Firebase onMessage listener
//     useEffect(() => {

//     const unsubscribe = messaging().onMessage(async remoteMessage => {
        
//       console.log(remoteMessage?.notification?.body, 'remoteMessage________________________');
//       // Alert.alert('New Notification', 'lll');
      
//     //   if (logout_Storage.getString("logoutSet-data") != 'logged_out') {
//         Alert.alert('New Notification', JSON.stringify(remoteMessage?.notification?.body || ""));
//         handleLogout()
//     //   }

//     //   if (remoteMessage?.data?.title == 'force_logout') {
//     //     // logout_FireBase();
//     //     handleLogout()
//     //   }

//     })

//     messaging().setBackgroundMessageHandler(async remoteMessage => {

//     //   if (remoteMessage?.data?.title == 'force_logout') {
//         handleLogout()
//     //   }
//     });

//     return unsubscribe;



//   }, []);

    

    const fetchCurrentVersion = async () => {
        
    }

    

    useEffect(() => {
        if (appState.current === "inactive") {
            handleLogout()
        }
    }, [])



    const handleLogout = async () => {
        const loginStore = JSON.parse(loginStorage?.getString("login-data") ?? "");
        console.log(loginStore);
        const creds = {
			emp_id: loginStore?.emp_id,
			modified_by: loginStore?.emp_id,
			in_out_flag:"O",
			flag:'A',
            branch_code:loginStore?.brn_code
		}
        console.log(creds)
		await axios.post(`${ADDRESSES.LOGOUT_APP}`, creds).then(res => {
            console.log(res?.data?.msg)
            if(res?.data?.suc == 1){
                loginStorage.clearAll();
                branchStorage.clearAll();
                setIsLogin(false)
            }
            else{
                 ToastAndroid.show(`Something went wrong while logging in.`, ToastAndroid.SHORT)
            }
           
        }).catch(err=>{
            ToastAndroid.show(`Something went wrong while logging in.`, ToastAndroid.SHORT)
        })
        
    }

    const fetchAssignedBranches = async (empId) => {
            try{
                const creds = {
                    emp_id: empId
                }
                await axios.post(`${ADDRESSES.FTECH_BRN_ASSIGN}`, creds).then(res => {
                    console.log("FETCH BRANCH ASSIGN RES", res?.data)
                    if (res?.data?.suc === 1) {
                        setBranchAssign(res?.data?.msg)
                    } else {
                        ToastAndroid.show("No branches assigned to you!", ToastAndroid.SHORT)
                    }
                })
            }
            catch(err){
                    console.log(err);
                    ToastAndroid.show("We are unable to process your request, Please try again after some time", ToastAndroid.SHORT)
            }
    }

    return (
        <AppStore.Provider value={{
            isLogin,
            isLoading,
            handleLogin,
            handleLogout,
            fetchCurrentVersion,
            appVersion,
            uat
        }}>
            <>
                {children}
                <DialogBox
                    visible={dialogVisible}
                    title="Version Mismatch!"
                    btnSuccess="CLOSE APP"
                    onSuccess={() => BackHandler.exitApp()}
                    hide={() => setDialogVisible(false)}
                    dismissable={false}>
                    <Text>Please update the app to use.</Text>
                </DialogBox>
            </>
        </AppStore.Provider>
    )
}

export default AppContext
