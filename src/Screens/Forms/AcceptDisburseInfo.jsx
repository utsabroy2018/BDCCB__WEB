// FOR BDCCB 
import React, { useEffect, useRef, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import TDInputTemplate from "../../Components/TDInputTemplate"
import { useNavigate } from "react-router-dom"
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url, url_bdccb } from "../../Address/BaseUrl"
import {
	Spin,
	Button,
	Popconfirm,
	Tag,
	Timeline,
	Divider,
	Typography,
	List,
	Select,
	Modal,
} from "antd"
import {
	LoadingOutlined,
	InfoCircleFilled,
	CheckCircleOutlined,
} from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { routePaths } from "../../Assets/Data/Routes"
import { useLocation } from "react-router"
import Sidebar from "../../Components/Sidebar"
import DialogBox from "../../Components/DialogBox"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import TimelineComp from "../../Components/TimelineComp"
import {
	PendingActionsOutlined,
	DeleteOutline,
	InfoOutlined,
} from "@mui/icons-material"
import { Checkbox } from "antd"
import { DataTable } from "primereact/datatable"
import Column from "antd/es/table/Column"
import { Toast } from "primereact/toast"
import AlertComp from "../../Components/AlertComp"
import { Map } from "lucide-react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { getLocalStoreTokenDts } from "../../Components/getLocalforageTokenDts"
// import { format } from "date-fns"
import { saveMasterData } from "../../services/masterService"
import Radiobtn from "../../Components/Radiobtn"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"



function AcceptDisburseInfo({ groupDataArr }) {
// 	const markers = [
//   { id: 1, position: { lat: 40.748817, lng: -73.985428 }, title: 'Empire State Building' },
//   { id: 2, position: { lat: 40.689247, lng: -74.044502 }, title: 'Statue of Liberty' },
//   { id: 3, position: { lat: 40.706192, lng: -74.009160 }, title: 'Wall Street' },
// ];
// const center = {
//   lat: 40.748817,
//   lng: -73.985428,
// };
const containerStyle = {
  width: '100%',
  height: '400px',
};
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(() => false)
	const location = useLocation()
	const  loanAppData  = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	// const  loanAppData  = location.state || {}

	
useEffect(()=>{
console.log(loanAppData, 'loanAppData');

}, [])


const getClientIP = async () => {
	const res = await fetch("https://api.ipify.org?format=json")
	const data = await res.json()
	return data.ip
	}


const approveDisbursement = async () => {
		
		console.log('cachedPaymentIdcachedPaymentIdcachedPaymentId');
		// return;
		setLoading(true)
		const ip = await getClientIP()
		const creds = {
					tenant_id : userDetails[0]?.tenant_id,
					branch_id : userDetails[0]?.brn_code,
					voucher_dt : formatDateToYYYYMMDD(new Date()),
					voucher_id: 0,
					trans_id: loanAppData?.trans_id,
					voucher_type: "J",
					acc_code: "23101",
					trans_type: loanAppData?.trans_type,
					loan_to: loanAppData?.loan_to,
					pacs_shg_id : loanAppData?.branch_shg_id,
					dr_amt: loanAppData?.disb_amt,
					cr_amt: loanAppData?.disb_amt,
					loan_id: loanAppData?.loan_id,
					created_by : userDetails[0]?.emp_id,
					ip_address : ip,
				}
		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios
			.post(`${url_bdccb}/account/save_loan_voucher`, creds, {
			headers: {
			Authorization: `${tokenValue?.token}`, // example header
			"Content-Type": "application/json", // optional
			},
			})
			.then((res) => {

				if(res?.data?.suc === 0){
				// Message('error', res?.data?.msg)
				navigate(routePaths.LANDING)
				localStorage.clear()

				} else {
					
					// onRefresh();
					// setSelectedProducts(null)
					// // setTotalEMI(0)
					// setAmountTd_(0)
					// // setOutstanding(0)
					// setLoading(false)
					navigate(-1)

				}
				
				// Message(res?.data?.suc == 1 ? 'success' : 'error',res?.data?.suc == 1 ? 'Approve successfully' : 'We are unable to process your request!!')
				
			})
			.catch((err) => {
				console.log("ERRR approveDisbursement", err);
				setLoading(false);
				Message('err','Not able to approve transactions')
			})
		setLoading(false)
	}


// const approveDisbursement = async () => {
			
// 			setLoading(true)
		
// 			const ip = await getClientIP()
		
// 			const creds = {
// 			tenant_id : userDetails[0]?.tenant_id,
// 			branch_id : userDetails[0]?.brn_code,
// 			voucher_dt : formatDateToYYYYMMDD(new Date()),
// 			voucher_id: 0,
// 			trans_id: loanAppData?.trans_id,
// 			voucher_type: "J",
// 			acc_code: "23101",
// 			trans_type: loanAppData?.trans_type,
// 			loan_to: loanAppData?.loan_to,
// 			pacs_shg_id : loanAppData?.branch_shg_id,
// 			dr_amt: loanAppData?.disb_amt,
// 			cr_amt: loanAppData?.disb_amt,
// 			loan_id: loanAppData?.loan_id,
// 			created_by : userDetails[0]?.emp_id,
// 			ip_address : ip,
// 			}

			
// 			console.log(creds, 'formDataformDataformDataformData');

// 			await saveMasterData({
// 			endpoint: "account/save_loan_voucher",
// 			creds,
// 			navigate,
// 			successMsg: "TRansaction Accepted",
// 			onSuccess: () => navigate(-1),
		
// 			// 🔥 fully dynamic failure handling
// 			failureRedirect: routePaths.LANDING,
// 			clearStorage: true,
// 			})

// 			console.log(creds, 'formDataformDataformDataformData');
		
// 			setLoading(false)
// 			}

	return (
		<>
		{/* {
			isOverdue === 'Y' && <AlertComp 
			
			msg={<p className="text-2xl font-normal"><span className="text-lg ">Loan Overdue Amount is </span>{formatINR(overDueAmt)}</p>} />
		} */}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>	
				{/* {(userDetails.id == 4 || userDetails.id == 3 || userDetails.id == 2 || userDetails.id == 13) && 
				<Button htmlType="button" type="primary" icon={<Map />} onClick={() => showModal()} className="my-3">View Distance</Button>} */}
				
				{/* <form > */}
					<div className="flex justify-start gap-5">
						<div className={"grid gap-4 sm:grid-cols-3 sm:gap-6 w-full mb-3"}>
{/* {JSON.stringify(loanAppData, null, 2)} */}
							
							<div>
								<TDInputTemplateBr
									type="text"
									label="Transaction ID"
									formControlName={loanAppData?.trans_id} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

							<div>
								<TDInputTemplateBr
									type="text"
									label="Transaction Date"
									formControlName={new Date(loanAppData?.trans_dt).toLocaleDateString("en-GB")} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

							<div>
								
								<TDInputTemplateBr
									type="text"
									label="Loan Id"
									formControlName={loanAppData?.loan_id} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

							<div>
								
								<TDInputTemplateBr
									type="text"
									label="Loan Account No. "
									formControlName={loanAppData?.loan_acc_no} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

							<div>
								
								<TDInputTemplateBr
									type="text"
									label="Disburse Date"
									formControlName={new Date(loanAppData?.disb_dt).toLocaleDateString("en-GB")} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

							<div>
								
								<TDInputTemplateBr
									type="text"
									label="Disburse Amount"
									formControlName={loanAppData?.disb_amt} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>
						<div>
								
								<TDInputTemplateBr
									type="text"
									label="Loan To"
									formControlName={loanAppData?.loan_to == 'P'? 'Pacs' : 'SHG'} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

							<div>
								
								<TDInputTemplateBr
									type="text"
									label={loanAppData?.loan_to == 'P'? 'Pacs' : 'SHG'}
									formControlName={loanAppData?.branch_name} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

						{/* {
						
						
						"period":36,"curr_roi":"10.00",
						"penal_roi":"12.00","disb_dt":"2026-02-01T18:30:00.000Z","disb_amt":"200000.00",
						"pay_mode":"Monthly",
						"rep_start_dt":"2026-03-01T18:30:00.000Z",
						"rep_end_dt":"2029-03-01T18:30:00.000Z",
						"curr_prn":"200000.00","curr_intt":"0.00","ovd_prn":"0.00",
						"ovd_intt":"0.00","created_by":"9999",
						"created_dt":"2026-02-02T05:16:54.000Z",
						"ip_address":"122.176.27.53",
						"trans_dt":"2026-02-01T18:30:00.000Z",
						"trans_id":"1770029214966",
						"trans_type":"D"} */}

							


							</div>
							</div>

							
							

					

					{/* {userDetails?.id != 3 &&  */}
					{/* <BtnComp mode="A" param={params?.id} /> */}
					<button
														className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
														onClick={async () => {
															// await checkingBeforeApprove()
															setVisible(true)
														}}
													>
														<CheckCircleOutlined /> <span className={`ml-2`}>Approve</span>
													</button>
					{/* } */}
				{/* </form> */}

				<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={async () => {
					await approveDisbursement()
						.then(() => {
						})
						.catch((err) => {
							console.log("Err in RecoveryCoApproveTable.jsx", err)
						})
					setVisible(!visible)
				}}
				onPressNo={() => {
					setVisible(!visible)
				}}
			/>

			</Spin>

			

			{/* <DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				 onPressYes={() => {
    if (pendingValues) {
      if(params?.id > 0) {
			editMember(pendingValues);
		} else {
			saveMemberData(pendingValues) 
		}   // 🔥 pass values here
    }
    setVisible(false);
  }}
				onPressNo={() => setVisible(!visible)}
			/> */}

			

			

			

			
		</>
	)
}

export default AcceptDisburseInfo
