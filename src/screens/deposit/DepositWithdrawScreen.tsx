import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';

import {
  Chip,
  Text,
  RadioButton,
  HelperText,
  ActivityIndicator,
  Card,
} from 'react-native-paper';

import axios from 'axios';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { loginStorage } from '../../storage/appStorage';
import { ADDRESSES } from '../../config/api_list';
import { AppStore } from '../../context/AppContext';
import { usePaperColorScheme } from '../../theme/theme';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import HeadingComp from '../../components/HeadingComp';
import normalize, { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize';
import ButtonPaper from '../../components/ButtonPaper';

const DepositWithdrawScreen = () => {
  const theme = usePaperColorScheme();
  const navigation = useNavigation();
  const loginStore = JSON.parse(loginStorage?.getString('login-data') ?? '');
  const [isLoading, setIsLoading] = useState(() => false);
  const [isDisabled, setIsDisabled] = useState(() => false);
  const { handleLogout } = useContext<any>(AppStore)
  

  const [visible, setVisible] = React.useState(false);
  const hide = () => setVisible(false);

  const [depositWithdrawStatus, setDepositWithdrawStatus] = useState('D');
  const [societyLoanNo, setSocietyLoanNo] = useState('');
  const [groupDetails, setGroupDetails] = useState<any[]>([]);
  const [memberRows, setMemberRows] = useState<any[]>([]);
  const [societySrchMsg, setSocietySrchMsg] = useState('');
  const [loading, setLoading] = useState(false);

// Direct / Member removed
// By default always Member
const directMember = 'M';

  const defaultStyles = useDefaultStyles();

  const titleTextStyle: TextStyle = {
    color: theme.colors.onPrimaryContainer,
  };

  const titleStyle: ViewStyle = {
    backgroundColor: theme.colors.primaryContainer,
  };

  const fetchGroupDetails = async () => {

      // setLoading(true);
      setGroupDetails([]);
      setMemberRows([]);
      setSocietySrchMsg('');

      setIsLoading(true);

      const creds = {
      branch_code: loginStore?.brn_code,
      pacs_id: loginStore?.user_type == 'B' ? '111' : '0',
      // sb_ac_no: societyLoanNo,
      sb_ac_no: loginStore?.sb_ac_no,
      branch_type: loginStore?.branch_type,
      };

      
      await axios.post(`${ADDRESSES.FTECH_GP_DTLS}`, creds, {
      headers: {
      Authorization: loginStore?.token, // example header
      "Content-Type": "application/json", // optional
      }
      }
      ).then(res => {
        
      if(res?.data?.success){
        setGroupDetails(res?.data?.data || []);

        if (res?.data?.data?.[0]?.memb_dt?.length > 0) {
          const updatedRows = res?.data?.data?.[0]?.memb_dt?.map(
            (item: any) => ({
              ...item,
              member_amount: '',
            }),
          );

          setMemberRows(updatedRows);
        } else {
          setSocietySrchMsg('Member not found');
        }
      } else {
        setSocietySrchMsg(res?.data?.msg);
      }
        
      })
      .catch(err => {
      console.log('<<<<<<', err);
      });
      setIsLoading(false);

};



  const updateMemberAmount = (index: number, value: string) => {
    const updatedRows = [...memberRows];

    let amount = Number(value || 0);

    const balance = Number(updatedRows[index]?.member_balance || 0);

    // Withdrawal validation
    if (depositWithdrawStatus === 'W') {
      if (amount > balance) {
        amount = balance;

        Alert.alert(
          'Invalid Amount',
          `Amount cannot be greater than Member Balance (${balance})`,
        );
      }
    }

    updatedRows[index].member_amount = amount;

    setMemberRows(updatedRows);
  };



const submitTransaction = async () => {

  setIsLoading(true);

    const formattedRows = memberRows?.map((row: any) => ({
      member_id: row?.member_id,
      sb_acc_no: row?.sb_acc_no,
      member_balance: row?.member_balance,
      amount: row?.member_amount || 0,
    }));

    const total_cr_amt = memberRows?.reduce(
      (sum: number, r: any) =>
        sum + Number(r.member_amount || 0),
      0,
    );
    

    const creds = {
      flag: directMember, // Always Member
      tenant_id: loginStore?.tenant_id,
      branch_id: loginStore?.brn_code,
      shg_id: groupDetails?.[0]?.group_code,
      grp_acc_no: groupDetails?.[0]?.sb_ac_no,
      dep_with_flag: depositWithdrawStatus,
      cr_amt: total_cr_amt,
      created_by: loginStore?.emp_id,
      created_ip: '0.0.0.0',
      members: formattedRows,
    };

    console.log('credscreds', '>>>>>', creds, '<<<<<<');

    // return

    await axios.post(`${ADDRESSES.SAVE_SB_TRANSACTION}`, creds, {
            headers: {
                Authorization: loginStore?.token, // example header
                "Content-Type": "application/json", // optional
            }
        }
      ).then(res => {

        if (res?.data?.success) {
        Alert.alert('Success', res?.data?.msg);

        navigation.dispatch(
        CommonActions.goBack(),
        );
        } else {
        Alert.alert('Error', res?.data?.msg);
        }

      })
      .catch(err => {
        console.log('<<<<<<', err);
      });
    setIsLoading(false);
    
};

useEffect(() => {
  // if (groupDetails?.[0]?.memb_dt?.length > 0) {
    setMemberRows(
      groupDetails?.[0]?.memb_dt?.map((item: any) => ({
        ...item,
        member_amount: '',
      })),
    );
  // }
}, [depositWithdrawStatus]);

useEffect(() => {
fetchGroupDetails()
}, []);



  return (
    <SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <HeadingComp
          title="Deposit & Withdraw"
          subtitle="Create New Deposit or Withdraw"
          isBackEnabled
        />
        <View
          style={{
            minHeight: SCREEN_HEIGHT,
            height: 'auto',
            paddingHorizontal: 20,
            gap: 10,
          }}>
          <View
            style={{
              backgroundColor: theme.colors.onSecondary,
              gap: 10,
              padding: 10,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 20,
            }}>
           
            <View
  style={{
    gap: 15,
  }}>

  {/* Group SB Account Number */}

  <View>
    
   <Chip
  style={{
    alignSelf: 'center', width: '100%'
  }}
  textStyle={{
    textAlign: 'center',
  }}>
  Group SB Account No.: {loginStore?.sb_ac_no}
</Chip>

    {/* <TextInput
      value={societyLoanNo}
      onChangeText={setSocietyLoanNo}
      placeholder="Enter Group SB Account No."
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#fff',
      }}
    /> */}
    {/* <Text> {JSON.stringify(loginStore?.sb_ac_no, null, 2)} </Text> */}
  </View>

  {/* Search Button */}

  {/* <ButtonPaper
    mode="contained"
    onPress={fetchGroupDetails}
    loading={loading}>
    SEARCH
  </ButtonPaper> */}

  {societySrchMsg?.length > 0 && (
    <HelperText type="error">
      {societySrchMsg}
    </HelperText>
  )}

  {/* Group Details */}


  {groupDetails?.length > 0 && (
    <Card
  style={{
    padding: 12,
  }}>
  
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>

    {/* Group Name */}

    <View
      style={{
        flex: 1,
      }}>
      <Text variant="titleSmall">
        Group Name
      </Text>

      <Text>
        {groupDetails?.[0]?.group_name}
      </Text>
    </View>

    {/* Group Balance */}

    <View
      style={{
        flex: 1,
        alignItems: 'flex-end',
      }}>
      <Text variant="titleSmall">
        Group Balance
      </Text>

      <Text>
        ₹ {groupDetails?.[0]?.grp_balance}
      </Text>
    </View>

  </View>
</Card>
  )}

  {/* Deposit / Withdraw */}

  {groupDetails?.[0]?.memb_dt?.length > 0 && (
    <View>

      <Text
        style={{
          marginBottom: 10,
          fontWeight: '700',
        }}>
        Transaction Type
      </Text>

      <RadioButton.Group
        onValueChange={value =>
          setDepositWithdrawStatus(value)
        }
        value={depositWithdrawStatus}>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <RadioButton value="D" />
          <Text>Deposit</Text>

          <RadioButton value="W" />
          <Text>Withdrawal</Text>
        </View>
      </RadioButton.Group>
    </View>
  )}

  {/* Member Details */}

  {memberRows?.length > 0 && (
    <View
  style={{
    gap: 10,
  }}>

  <Chip icon="account-group">
    Member Details
  </Chip>

  {memberRows?.map((item: any, index: number) => (
    <Card
      key={index}
      style={{
        padding: 10,
      }}>

      <View
        style={{
          gap: 10,
        }}>

        {/* Top Row */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>

          {/* SB Account */}

          <View
            style={{
              flex: 1,
            }}>
            <Text variant="titleSmall">
              SB Acc No.
            </Text>

            <Text numberOfLines={1} style={{fontSize: 11,}}>
              {item?.sb_acc_no}
            </Text>
          </View>

          {/* Member Name */}

          <View
            style={{
              flex: 1.2,
              paddingHorizontal: 10,
            }}>
            <Text variant="titleSmall">
              Member Name
            </Text>

            <Text numberOfLines={1} style={{fontSize: 11,}}>
              {item?.member_name}
            </Text>
          </View>

          {/* Balance */}

          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <Text variant="titleSmall">
              Balance
            </Text>

            <Text numberOfLines={1} style={{fontSize: 11,}}>
              ₹ {item?.member_balance}
            </Text>
          </View>
        </View>

        {/* Amount Full Width */}

        <View>
          <Text
            style={{
              marginBottom: 5,
              fontWeight: '700',
            }}>
            Member Amount
          </Text>

          <TextInput
            keyboardType="numeric"
            value={String(
              item?.member_amount || '',
            )}
            onChangeText={value =>
              updateMemberAmount(
                index,
                value,
              )
            }
            placeholder="Enter Amount"
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              paddingHorizontal: 12,
              height: 50,
              backgroundColor: '#fff',
              width: '100%',
            }}
          />
        </View>

      </View>
    </Card>
  ))}

  {/* Total */}

  <Chip icon="currency-inr">
    Total Amount : ₹{' '}
    {memberRows?.reduce(
      (sum: number, r: any) =>
        sum +
        Number(r.member_amount || 0),
      0,
    )}
  </Chip>
</View>
  )}
</View>
            <View>
              <ButtonPaper
                onPress={() => submitTransaction()}
                mode="contained-tonal"
                buttonColor={theme.colors.secondary}
                textColor={theme.colors.onSecondary}
                loading={isLoading}
                disabled={isDisabled}>
                SUBMIT
              </ButtonPaper>
            </View>
          </View>

        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default DepositWithdrawScreen;

const styles = StyleSheet.create({});
