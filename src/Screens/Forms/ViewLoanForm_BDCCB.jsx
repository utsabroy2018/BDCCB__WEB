import React, { useEffect, useRef, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import TDInputTemplate from "../../Components/TDInputTemplate"
import { useNavigate } from "react-router-dom"
import { FieldArray, Formik, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url, url_bdccb } from "../../Address/BaseUrl"
import { Spin, Button, Popconfirm, Tag, Timeline, Divider, Modal } from "antd"
import {
	LoadingOutlined,
	DeleteOutlined,
	PlusOutlined,
	MinusOutlined,
	FilePdfOutlined,
	MinusCircleOutlined,
	ClockCircleOutlined,
	ArrowRightOutlined,
	UserOutlined,
	EyeOutlined,
	EyeFilled,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { routePaths } from "../../Assets/Data/Routes"
import { useLocation } from "react-router"
import Sidebar from "../../Components/Sidebar"
import DialogBox from "../../Components/DialogBox"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import TimelineComp from "../../Components/TimelineComp"
import DynamicTailwindTable from "../../Components/Reports/DynamicTailwindTable"
import { disbursementDetailsHeader } from "../../Utils/Reports/headerMap"
import { getOrdinalSuffix } from "../../Utils/ordinalSuffix"
import AlertComp from "../../Components/AlertComp"
import moment from "moment"
import { getLocalStoreTokenDts } from "../../Components/getLocalforageTokenDts"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"
import { saveMasterData } from "../../services/masterService"
const formatINR = (num) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
	}).format(num || 0)
function ViewLoanForm_BDCCB({ groupDataArr }) {
	const [loanDtls,setLoanDtls] = useState([]);
	const [isOverdue, setIsOverdue] = useState('N');
	const [overDueAmt, setOverDueAmt] = useState(0);
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [count, setCount] = useState(0)
	const [groupData, setGroupData] = useState(() => [])
	const [openModal, setOpenModal] = useState(false)
	const [branches, setBranches] = useState(() => [])
	const [branch, setBranch] = useState(() => "")

	const [blocks, setBlocks] = useState(() => [])
	const [block, setBlock] = useState(() => "")

	const [groupDetails, setGroupDetails] = useState(() => [])
	const [memberDetails, setMemberDetails] = useState(() => [])
	const [visible, setVisible] = useState(() => false)
	const [period_mode, setPeriodMode] = useState("")
	const [period_mode_val, setPeriodModeVal] = useState(0)
	const [weekOfRecovery, setWeekOfRecovery] = useState(0)
	const [actionType, setActionType] = useState(""); 

	const containerRef = useRef(null)

	const [isHovered, setIsHovered] = useState(false)

	const handleWheel = (event) => {
		if (isHovered && containerRef.current) {
			containerRef.current.scrollLeft += event.deltaY
			event.preventDefault()
		}
	}

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

	{
		/* purpose,scheme name,interest rate,period,period mode,fund name,total applied amount,total disbursement amount,disbursement date,current outstanding */
	}
	const WEEKS = [
		{
			code: "1",
			name: "Sunday",
		},
		{
			code: "2",
			name: "Monday",
		},
		{
			code: "3",
			name: "Tuesday",
		},
		{
			code: "4",
			name: "Wednesday",
		},
		{
			code: "5",
			name: "Thursday",
		},
		{
			code: "6",
			name: "Friday",
		},
		{
			code: "7",
			name: "Saturday",
		},
	]

	const WEEKS_FOURT_NIGHT = [
		{
			code: "1",
			name: "Sunday",
		},
		{
			code: "2",
			name: "Monday",
		},
		{
			code: "3",
			name: "Tuesday",
		},
		{
			code: "4",
			name: "Wednesday",
		},
		{
			code: "5",
			name: "Thursday",
		},
		{
			code: "6",
			name: "Friday",
		},
		{
			code: "7",
			name: "Saturday",
		},
	]

	const Fortnight = [
	{
		code: "1",
		name: "Week (1-3)",
	},
	{
		code: "2",
		name: "Week (2-4)",
	}
	]

	const initialValues = {
		// g_co_name: "",
		g_group_name: "",
		g_address: "",
		sahayika_id: "",
		g_pin: "",
		g_phone1: "",
		dist_id: "",
		ps_id: "",
		po_id: "",
		block_id: "",
		gp_id: "",
		village_id: "",
		g_total_outstanding: "",

		// // disbursement details
		// g_purpose: "",
		// g_scheme_name: "",
		// g_interest_rate: "",
		// g_period: "",
		// g_period_mode: "",
		// g_fund_name: "",
		// g_total_applied_amt: "",
		// g_total_disbursement_amt: "",
		// g_disbursement_date: "",
		// g_current_outstanding: "",
	}
	const [formValues, setValues] = useState(initialValues)

	const validationSchema = Yup.object({
		// g_group_name: Yup.string().required("Group name is required"),
		// g_group_type: Yup.string().required("Group type is required"),
		// g_address: Yup.string().required("Group address is required"),
		// g_pin: Yup.string().required("PIN No. is required"),
		// // g_group_block: Yup.string().required("Group block is required"),
		// g_phone1: Yup.string().required("Phone 1 is required"),
		// g_phone2: Yup.string(),
		// g_email: Yup.string(),
		// g_bank_name: Yup.string(),
		// g_bank_branch: Yup.string(),
		// g_ifsc: Yup.string(),
		// g_micr: Yup.string(),
		// g_acc1: Yup.string(),
		// g_acc2: Yup.string().optional(),
	})

	const fetchGroupDetails = async () => {
		setLoading(true)
		const creds = {
			group_code: params?.id,
			branch_code: userDetails[0]?.brn_code,
			tenant_id: userDetails[0]?.tenant_id,

	// 		  "group_code" : "",
    // "branch_code" : "",
    // "tenant_id" : ""
		}

		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios
			.post(`${url_bdccb}/loan/fetch_unapprove_disburse`, creds, {
			headers: {
			Authorization: `${tokenValue?.token}`, // example header
			"Content-Type": "application/json", // optional
			},
			})
			.then((res) => {
			
			if(res?.data?.success){
							// setGroups(res?.data?.data)
							
							
			setValues({
					// g_co_name: res?.data?.data[0]?.emp_name,
					g_group_name: res?.data?.data[0]?.group_name,
					g_address: res?.data?.data[0]?.group_addr,
					sahayika_id: res?.data?.data[0]?.sahayika_name,
					g_pin: res?.data?.data[0]?.pin_no,
					g_phone1: res?.data?.data[0]?.phone1,
					dist_id: res?.data?.data[0]?.dist_name,
					ps_id: res?.data?.data[0]?.ps_name,
					po_id: res?.data?.data[0]?.post_name,
					block_id: res?.data?.data[0]?.block_name,
					gp_id: res?.data?.data[0]?.gp_name,
					village_id: res?.data?.data[0]?.vill_name,
					g_total_outstanding: res?.data?.data[0]?.total_outstanding,


					// g_address:
					// 	res?.data?.data[0]?.grp_addr + ", " + res?.data?.data[0]?.pin_no,
					// g_pin: res?.data?.data[0]?.pin_no,
					// // g_group_block: res?.data?.data[0]?.block,
					// g_group_block: res?.data?.data[0]?.block_name,
					// g_phone1: res?.data?.data[0]?.phone1,
					// g_phone2: res?.data?.data[0]?.phone2,
					// g_email: res?.data?.data[0]?.email_id,
					// g_bank_name: res?.data?.data?.bank_name?.trim(),
					// g_bank_branch: res?.data?.data?.branch_name?.trim(),
					// g_ifsc: res?.data?.data?.ifsc,
					// g_micr: res?.data?.data?.micr,
					// g_acc1: res?.data?.data?.acc_no1?.trim(),
					// g_acc2: res?.data?.data?.acc_no2?.trim(),
					// g_branch_name: res?.data?.data?.brn_name,
					// g_total_outstanding: res?.data?.data?.total_outstanding,

					// // disb dtls
					// g_purpose: res?.data?.data?.disb_details[0]?.purpose_id,
					// g_scheme_name: res?.data?.data?.disb_details[0]?.scheme_name,
					// g_interest_rate: res?.data?.data?.disb_details[0]?.curr_roi,
					// g_period: res?.data?.data?.disb_details[0]?.period,
					// g_period_mode: res?.data?.data?.disb_details[0]?.period_mode,
					// g_fund_name: res?.data?.data?.disb_details[0]?.fund_name,
					// g_total_applied_amt: res?.data?.data?.disb_details[0]?.applied_amt,
					// g_total_disbursement_amt:
					// 	res?.data?.data?.disb_details[0]?.disburse_amt,
					// g_disbursement_date: res?.data?.data?.disb_details[0]?.disb_dt
					// 	? new Date(
					// 			res?.data?.data?.disb_details[0]?.disb_dt
					// 	  ).toLocaleDateString("en-GB")
					// 	: "",
					// g_current_outstanding:
					// 	res?.data?.data?.disb_details[0]?.curr_outstanding,
				})
				setGroupData(res?.data?.data)
				// setPeriodMode(res?.data?.data.disb_details[0]?.period_mode)
				// setPeriodModeVal(res?.data?.data.disb_details[0]?.recovery_day)
				// setWeekOfRecovery(res?.data?.data.disb_details[0]?.week_no)
				// setBranch(
				// 	res?.data?.data?.disctrict + "," + res?.data?.data?.branch_code
				// )
				// setBlock(res?.data?.data?.block)
				// setIsOverdue(res?.data?.data?.overdue_flag);
				// setOverDueAmt(res?.data?.data?.overdue_amt);
			
			} else {
			navigate(routePaths.LANDING)
			localStorage.clear()
			}
							
			
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching group form")
			})
		setLoading(false)
	}

	useEffect(() => {
		fetchGroupDetails()
	}, [count])

	
	const onSubmit = async (values) => {
		console.log("onsubmit called")
		console.log(values, "onsubmit vendor")
		setLoading(true)

		setVisible(true)

		setLoading(false)
	}

	const formik = useFormik({
		initialValues: +params.id > 0 ? formValues : initialValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})

	const callAPi = async (item) =>{
			// console.log(item);
			setLoading(true);
			setLoanDtls([]);
			const tokenValue = await getLocalStoreTokenDts(navigate);
			try{
					const payload = {
						branch_code: userDetails?.brn_code,
						loan_id: item?.loan_id,
					}
					axios.post(`${url}/admin/look_overdue_details`,payload, {
					headers: {
					Authorization: `${tokenValue?.token}`, // example header
					"Content-Type": "application/json", // optional
					},
					})
					.then((res) => {
						// console.log(res?.data?.msg, 'testtttttttttt');
						
						if(res?.data?.suc === 0){
						// Message('error', res?.data?.msg)
						// navigate(routePaths.LANDING)
						// localStorage.clear()
						} else {

						// console.log("API response:", res.data);
						setOpenModal(true);
						setLoanDtls(res?.data?.msg || []);
						setLoading(false);

						}

					})
					.catch((err) => {
						setLoading(false);
						console.log("Error occurred while calling API:", err);
					});
			}
			catch(err){
				setLoading(false);
				console.log("Error occurred while calling API:", err);
			}
	}


	const getFortnightDayName = (code) => {
	const day = WEEKS_FOURT_NIGHT.find((d) => d.code === String(code));
	return day ? day.name : "";
	};

	const getWeekOfRecoveryName = (code) => {
	const day = Fortnight.find((d) => d.code === String(code));
	return day ? day.name : "--";
	};
	
	const formatDateToYYYYMMDD_CurrentDT = (date) => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);

	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
	};

	const getClientIP = async () => {
		const res = await fetch("https://api.ipify.org?format=json")
		const data = await res.json()
		return data.ip
	}

	const approveDisbursement = async () => {
	
	alert('approveDisbursement')

	setLoading(true)

	const ip = await getClientIP()

	const creds = {
	tenant_id: userDetails[0]?.tenant_id,
	branch_id: userDetails[0]?.brn_code,
	voucher_dt: formatDateToYYYYMMDD(new Date()),
	voucher_id: 0,
	// trans_id: tnxDetails[0]?.trans_id,
	voucher_type: "J",
	acc_code: "23101",
	// trans_type: tnxDetails[0]?.trans_type,
	// dr_amt: tnxDetails[0]?.disb_amt,
	// cr_amt: tnxDetails[0]?.disb_amt,
	// loan_id: tnxDetails[0]?.loan_id,
	// member_loan_id: tnxDetails[0]?.loan_id,
	created_by: userDetails[0]?.emp_id,
	ip_address: ip,
	}


	console.log(creds, 'formDataformDataformDataformData');
	return

	await saveMasterData({
	endpoint: "account/save_loan_voucher",
	creds,
	navigate,
	successMsg: "Transaction Accepted",
	onSuccess: () => navigate(-1),

	// 🔥 fully dynamic failure handling
	failureRedirect: routePaths.LANDING,
	clearStorage: true,
	})

	console.log(creds, 'formDataformDataformDataformData');

	setLoading(false)
	}

	const rejectDisbursement = async () => {
	
	alert('rejectDisbursement')

	setLoading(true)

	const ip = await getClientIP()

	const creds = {
	tenant_id: userDetails[0]?.tenant_id,
	branch_id: userDetails[0]?.brn_code,
	voucher_dt: formatDateToYYYYMMDD(new Date()),
	voucher_id: 0,
	// trans_id: tnxDetails[0]?.trans_id,
	voucher_type: "J",
	acc_code: "23101",
	// trans_type: tnxDetails[0]?.trans_type,
	// dr_amt: tnxDetails[0]?.disb_amt,
	// cr_amt: tnxDetails[0]?.disb_amt,
	// loan_id: tnxDetails[0]?.loan_id,
	// member_loan_id: tnxDetails[0]?.loan_id,
	created_by: userDetails[0]?.emp_id,
	ip_address: ip,
	}


	console.log(creds, 'formDataformDataformDataformData');
	return

	await saveMasterData({
	endpoint: "account/save_loan_voucher",
	creds,
	navigate,
	successMsg: "Transaction Accepted",
	onSuccess: () => navigate(-1),

	// 🔥 fully dynamic failure handling
	failureRedirect: routePaths.LANDING,
	clearStorage: true,
	})

	console.log(creds, 'formDataformDataformDataformData');

	setLoading(false)
	}

	const acceptReject = async (actionType)=>{
		if(actionType == 'A'){
			approveDisbursement()
		}
		if(actionType == 'R'){
			rejectDisbursement()
		}
	}

	return (
		<>
		{
					isOverdue === 'Y' && <AlertComp 
					
					msg={<p className="text-2xl font-normal"><span className="text-lg ">Loan Overdue Amount is </span>{formatINR(overDueAmt)}</p>} />
				}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={formik.handleSubmit} className={`${isOverdue == 'Y' ? 'mt-5' : ''}`}>
					<div className="flex flex-col justify-start gap-5">
						<div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
						{/* {JSON.stringify(groupData[0]?.disb_details[0]?.approval_status, 2)} */}
							<div className="text-[#DA4167] text-lg font-bold sm:col-span-3"> Society Loan Details</div>
							{/* {params?.id > 0 && (
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Form filled by / CO Name"
										type="text"
										label="Form filled by / CO Name"
										name="co_name"
										formControlName={groupData[0]?.emp_name}
										mode={1}
										disabled
									/>
								</div>
							)} */}
{/* groupData[0]?.disb_details */}


							<div className="sm:col-span-1">
							<TDInputTemplateBr
									type="text"
									label="Loan Account No. "
									name="loan_acc_no"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={groupData[0]?.disb_details[0]?.loan_acc_no}
									mode={1}
									disabled
								/>
						</div>


						{/* <div className="sm:col-span-3">

							<TDInputTemplateBr
								type="text"
								label={userDetails[0]?.user_type == 'P'? 'Pacs' : 'SHG'}
								// label={'Sector'}
								formControlName={loanAppData?.branch_name} // Default to SHG
								mode={1}
								disabled={true}
							/>
						</div> */}

						<div>

							<TDInputTemplateBr
							type="date"
							label="Sanction Date"
							name="sanction_dt"
							formControlName={formatDateToYYYYMMDD_CurrentDT(groupData[0]?.disb_details[0]?.sanction_dt)}
							mode={1}
							disabled={true}
						/>
						</div>

						<div>

							<TDInputTemplateBr
								type="text"
								// label={loanAppData?.loan_to == 'P'? 'Pacs' : 'SHG'}
								label="Sanction No."
								formControlName={groupData[0]?.disb_details[0]?.sanction_no} // Default to SHG
								mode={1}
								disabled={true}
							/>
						</div>

						<div>

							<TDInputTemplateBr
								type="text"
								// label={loanAppData?.loan_to == 'P'? 'Pacs' : 'SHG'}
								label="Period (In Month)"
								formControlName={groupData[0]?.disb_details[0]?.period} // Default to SHG
								mode={1}
								disabled={true}
							/>
						</div>

						<div>

							<TDInputTemplateBr
								type="text"
								// label={loanAppData?.loan_to == 'P'? 'Pacs' : 'SHG'}
								label="Current ROI"
								formControlName={groupData[0]?.disb_details[0]?.curr_roi} // Default to SHG
								mode={1}
								disabled={true}
							/>
						</div>
						

						<div>
								
								<TDInputTemplateBr
									type="text"
									// label={loanAppData?.loan_to == 'P'? 'Pacs' : 'SHG'}
									label="Ovd ROI"
									formControlName={groupData[0]?.disb_details[0]?.penal_roi} // Default to SHG
									mode={1}
									disabled={true}
								/>
							</div>

						<div>

							<TDInputTemplateBr
								type="date"
								label="Disburse Date"
								formControlName={formatDateToYYYYMMDD_CurrentDT(groupData[0]?.disb_details[0]?.disb_dt)} // Default to SHG
								mode={1}
								disabled={true}
							/>
						</div>

						<div>

							<TDInputTemplateBr
								type="text"
								label="Disburse Amount"
								formControlName={groupData[0]?.disb_details[0]?.disb_amt} // Default to SHG
								mode={1}
								disabled={true}
							/>
						</div>
						

						

						<div>

							<TDInputTemplateBr
								type="text"
								label="Number Of Group"
								formControlName={groupData[0]?.disb_details[0]?.tot_grp} // Default to SHG
								mode={1}
								disabled={true}
							/>
						</div>

						



						{/* ////////////////////////// Below Old ///////////////////////// */}


								{/* {JSON.stringify(formik.values, null, 2)} */}
							<div className="text-[#DA4167] text-lg font-bold sm:col-span-3"> Group Loan Details</div>
							<div className="sm:col-span-1">
								<TDInputTemplateBr
									placeholder="Group Code"
									type="text"
									label="Group Code"
									name="g_code"
									// handleChange={formik.handleChange}
									// handleBlur={formik.handleBlur}
									// formControlName={formik.values.g_co_name}
									formControlName={params.id}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_group_name && formik.touched.g_group_name ? (
									<VError title={formik.errors.g_group_name} />
								) : null} */}
							</div>
							

							<div>
								<TDInputTemplateBr
									placeholder="Group Name"
									type="text"
									label="Group Name"
									name="g_group_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_group_name}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_group_name && formik.touched.g_group_name ? (
									<VError title={formik.errors.g_group_name} />
								) : null} */}
							</div>

							<div className="sm:col-span-3">
								<TDInputTemplateBr
									placeholder="Type Address..."
									type="text"
									label={`Address`}
									name="g_address"
									formControlName={formik.values.g_address}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={3}
									disabled
								/>
								
							</div>

							{/* <div>
								<TDInputTemplateBr
									placeholder="Group Type"
									type="text"
									label="Group Type"
									name="g_group_type"
									formControlName={formik.values.g_group_type}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "S",
											name: "SHG",
										},
										{
											code: "J",
											name: "JLG",
										},
									]}
									mode={2}
									disabled
								/>
							
							</div> */}

							{/* {userDetails?.id === 3 && ( */}
							<>
								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="Sahayika Name"
										name="sahayika_id"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.sahayika_id}
										mode={1}
										disabled
									/>
								</div>

								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="PIN No."
										name="g_pin"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.g_pin}
										mode={1}
										disabled
									/>
								</div>
								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="Mobile No. Of Group Leader/Sahayika"
										name="g_phone1"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.g_phone1}
										mode={1}
										disabled
									/>
								</div>

								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="District"
										name="dist_id"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.dist_id}
										mode={1}
										disabled
									/>
								</div>

								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="Police Station"
										name="ps_id"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.ps_id}
										mode={1}
										disabled
									/>
								</div>
								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="Post Office"
										name="po_id"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.po_id}
										mode={1}
										disabled
									/>
								</div>
								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="Block"
										name="block_id"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.block_id}
										mode={1}
										disabled
									/>
								</div>

								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="GP Name"
										name="gp_id"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.gp_id}
										mode={1}
										disabled
									/>
								</div>

								<div>
									
									<TDInputTemplateBr
										// placeholder="Branch Name"
										type="text"
										label="Village Name"
										name="village_id"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.village_id}
										mode={1}
										disabled
									/>
								</div>
								

								{/* <div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Group Block"
										type="text"
										label="Group Block"
										name="g_block"
										formControlName={block}
										handleChange={(e) => setBlock(e.target.value)}
										data={blocks?.map((item, i) => ({
											code: item?.block_id,
											name: item?.block_name,
										}))}
										mode={2}
									/>
								</div> */}
							</>
							{/* )} */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="Type Block..."
									type="text"
									label={`Block`}
									name="g_group_block"
									formControlName={formik.values.g_group_block}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled
								/>
								{formik.errors.g_address && formik.touched.g_address ? (
									<VError title={formik.errors.g_address} />
								) : null}
							</div> */}

							

							

							{/* <div>
								<TDInputTemplateBr
									placeholder="Mobile No. 1"
									type="number"
									label="Mobile No. 1"
									name="g_phone1"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_phone1}
									mode={1}
									disabled
								/>
						
							</div> */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="Mobile No. 2"
									type="number"
									label="Mobile No. 2"
									name="g_phone2"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_phone2}
									mode={1}
									disabled
								/>
								
							</div> */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="Email"
									type="email"
									label="Email"
									name="g_email"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_email}
									mode={1}
								/>
								{formik.errors.g_email && formik.touched.g_email ? (
									<VError title={formik.errors.g_email} />
								) : null}
							</div> */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="Bank Name"
									type="text"
									label="Bank Name"
									name="g_bank_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_bank_name}
									mode={1}
									disabled
								/>
								
							</div> */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="Bank Branch"
									type="text"
									label="Bank Branch"
									name="g_bank_branch"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_bank_branch}
									mode={1}
									disabled
								/>
								
							</div> */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="IFSC"
									type="text"
									label="IFSC Code"
									name="g_ifsc"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_ifsc}
									mode={1}
								/>
								{formik.errors.g_ifsc && formik.touched.g_ifsc ? (
									<VError title={formik.errors.g_ifsc} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="MICR"
									type="text"
									label="MICR Code"
									name="g_micr"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_micr}
									mode={1}
								/>
								{formik.errors.g_micr && formik.touched.g_micr ? (
									<VError title={formik.errors.g_micr} />
								) : null}
							</div> */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="SB Account"
									type="text"
									label="SB Account"
									name="g_acc1"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_acc1}
									mode={1}
									disabled
								/>
								
							</div> */}

							{/* <div>
								<TDInputTemplateBr
									placeholder="Loan Account"
									type="text"
									label="Loan Account"
									name="g_acc2"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_acc2}
									mode={1}
									disabled
								/>
								
							</div> */}
						</div>
						{/* <Divider
							type="horizontal"
							style={{
								height: 5,
							}}
						/> */}
						
						{/* purpose,scheme name,interest rate,period,period mode,fund name,total applied amount,total disbursement amount,disbursement date,current outstanding */}
						{/* <div className="text-[#DA4167] text-lg font-bold">Loan Details</div>

						<div>
							<DynamicTailwindTable
								data={groupData[0]?.disb_details?.map((el) => {
									//  console.log(el.loan_cycle, ' Loan Cycle');
									 const loanCycle = 'Loan Cycle - '+ el.loan_cycle; 
									 
									//  el.loan_cycle = loanCycle;
									//  console.log(el.week_no, ' Week No');
									// let recoveryWeekNoText = el.week_no;
									// if (+el.week_no === 1) {
									// recoveryWeekNoText = "Week (1-3)";
									// } else if (+el.week_no === 2) {
									// recoveryWeekNoText = "Week (2-4)";
									// }
									const recoveryWeekNoText = getWeekOfRecoveryName(el.week_no);

									const recoveryDayText = getFortnightDayName(el.recovery_day);
									

									 return {
										...el,
										// loan_cycle:loanCycle,
										// recovery_day: recoveryWeekNoText,
										// week_no: recoveryWeekNoText,
										// recovery_day: recoveryDayText,
									 };
								})}
								pageSize={50}
								columnTotal={[15, 17, 18]}
								headersMap={disbursementDetailsHeader}
								dateTimeExceptionCols={[16]}
								colRemove={[1]}
							/>
						</div> */}

						

						{params?.id > 0 && (
							<div className="gap-3">
								<div className="w-full my-10 border-t-4 border-gray-400 border-dashed"></div>
								<div>
									<div className="text-[#DA4167] text-lg mb-2 font-bold">
										Members in this Group
									</div>


									{/* {groupData[0]?.memb_dt?.map((item, i) => (
										<Tag
											key={i}
											icon={<UserOutlined />}
											color={
												item?.approval_status === "U" ||
												(userDetails?.id == 3 && item?.approval_status === "S")
													? "geekblue"
													: "red"
											}
											className="text-lg cursor-pointer mb-5 rounded-3xl
									"
											onClick={
												userDetails?.id == 2
													? () =>
															navigate(`/homebm/editgrtform/${item?.form_no}`, {
																state: item,
															})
													: () =>
															navigate(`/homeco/editgrtform/${item?.form_no}`, {
																state: item,
															})
											}
										>
											{item?.client_name}
										</Tag>
									))} */}
									{/* {JSON.stringify(groupData[0]?.memb_dt, 2)} */}
									<Spin spinning={loading}>
										<div
											ref={containerRef}
											className={`relative overflow-x-auto shadow-md sm:rounded-lg`}
											onWheel={handleWheel}
											onMouseEnter={handleMouseEnter}
											onMouseLeave={handleMouseLeave}
										>
											<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
												<thead className="text-xs text-white uppercase bg-slate-800 dark:bg-gray-700 dark:text-gray-400">
													<tr>
														<th scope="col" className="px-6 py-3 font-semibold">
															Member Name
														</th>
														{/* <th scope="col" className="px-6 py-3 font-semibold">
															Loan ID
														</th>
														<th scope="col" className="px-6 py-3 font-semibold">
															Member Code
														</th> */}
														<th scope="col" className="px-6 py-3 font-semibold">
															SB Account
														</th>
														<th scope="col" className="px-6 py-3 font-semibold">
															Disburse Date
														</th>
														<th scope="col" className="px-6 py-3 font-semibold">
															Disburse Amount
														</th>
														{/* <th scope="col" className="px-6 py-3 font-semibold">
															<span className="sr-only">Action</span>
														</th> */}
													</tr>
												</thead>
												<tbody>
													{groupData[0]?.memb_dt?.map((item, i) => (
														<tr
															key={i}
															className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600"
														>
															<th
																scope="row"
																className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
															>
																{item?.member_name}
															</th>
															{/* <td className="px-6 py-4">
																
																{item?.loan_id}
															
																</td> */}
															{/* <td className="px-6 py-4">{item?.member_code}</td> */}
															<td className="px-6 py-4">{item?.sb_acc_no}</td>
															<td className="px-6 py-4">{formatDateToYYYYMMDD_CurrentDT(item?.disb_dt)}</td>
															<td className="px-6 py-4">{item?.disb_amt}/-</td>
															{/* <td className="px-6 py-4 text-right">
																<button
																	onClick={() => {
																		navigate(
																			`/homepacs/memberloandetails/${item?.loan_id}`
																		)
																	}}
																	className="font-medium text-teal-500 dark:text-blue-500 hover:underline"
																>
																	<EyeFilled />
																</button>
															</td> */}
														</tr>
													))}
													<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
														<td className="px-6 py-4 font-semibold" colSpan={3}>
															Total Disburse Amount
														</td>
														<td
															className="px-6 py-4 text-left font-semibold"
															colSpan={1}
														>
															{formValues?.g_total_outstanding}/-
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</Spin>
								</div>
							</div>
						)}
					</div>
					{/* <BtnComp
						mode="A"
						// rejectBtn={true}
						// onReject={() => {
						// 	setVisibleModal(false)
						// }}
						onReset={formik.resetForm}
						// sendToText="Credit Manager"
						// onSendTo={() => console.log("dsaf")}
						// condition={fetchedFileDetails?.length > 0}
						// showSave
						param={params?.id}
					/> */}

					{groupData[0]?.disb_details[0]?.approval_status == 'U' &&(
						<div className="flex justify-center  sm:gap-6 mt-8">
						<button
						className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
						onClick={async () => {
						// await checkingBeforeApprove()
						setActionType("A")
						setVisible(true)
						
						}}
						>
						<CheckCircleOutlined /> <span className={`ml-2`}>Accept Transaction</span>
						</button>

						<button
						className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-[#DA4167] border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-[#DA4167] duration-300 rounded-full  dark:focus:ring-primary-900`}
						onClick={async () => {
						// await checkingBeforeApprove()
						setActionType("R")
						setVisible(true)
						
						}}
						>
						<CloseCircleOutlined /> <span className={`ml-2`}>Reject Transaction</span>
						</button>
						</div>
						)} 

						<DialogBox
							flag={4}
							onPress={() => setVisible(!visible)}
							visible={visible}
							onPressYes={async () => {
							await acceptReject(actionType)
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
				</form>
			</Spin>

			{/* <DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					// editGroup()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/> */}

			{/* <Modal
				// width={{
				// 	xs: '90%',
				// 	sm: '80%',
				// 	md: '70%',
				// 	lg: '60%',
				// 	xl: '50%',
				// 	xxl: '40%',
				// 	}}
				title="Overdue Details"
				okButtonProps={null}
				open={openModal}
				onCancel={() => setOpenModal(false)}>
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead className="text-xs text-white uppercase bg-slate-800 dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="px-6 py-3 font-semibold">
											Overdue Amount
										</th>
										<th scope="col" className="px-6 py-3 font-semibold">
											Overdue Date
										</th>
										
									</tr>
								</thead>
								<tbody>
									{loanDtls.map((item, i) => (
										<tr
											key={i}
											className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600"
										>
											
											<td className="px-6 py-4">{item?.od_amt ? item?.od_amt : '0.00'}</td>
											<td className="px-6 py-4">
												{item?.od_date ? moment(item?.od_date).format("DD-MM-YYYY") : "N/A"}
											</td>
											
										</tr>
									))}
									
								</tbody>
							</table>
			</Modal> */}

		</>
	)
}

export default ViewLoanForm_BDCCB
