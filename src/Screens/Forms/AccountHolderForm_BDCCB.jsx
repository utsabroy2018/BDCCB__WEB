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
	EditOutlined,
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
// import { formatDateToYYYYMMDD } from "../../Utils/formateDate"


const loan_to = [
		{
		code: "P",
		name: "PACS",
		},
		{
		code: "S",
		name: "SHG",
		}
]

const loan_to_For_Pacs = [
		{
		code: "S",
		name: "SHG",
		}
]

const period_data = [
		{
		code: "12",
		name: "12",
		},
		{
		code: "6",
		name: "6",
		},
		{
		code: "3",
		name: "3",
		},
	]

const pay_mode = [
		{
		code: "Monthly",
		name: "Monthly",
		},
		{
		code: "Weekly",
		name: "Weekly",
		}
	]


function AccountHolderForm_BDCCB({ flag }) {


	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const  loanAppData  = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [districts, setDistricts] = useState(
			userDetails[0]?.district_list?.map((item, i) => ({
			code: item?.dist_code,
			name: item?.dist_name,
			}))
		)

	
	const [blocks, setBlocks] = useState(() => [])
	const [gpList, setGPList] = useState(() => [])
	const [policeStation, setPoliceStation] = useState(() => [])
	const [postOffice, setPostOffice] = useState(() => [])
	const [gpName, setGpName] = useState(() => [])
	const [villName, setVillName] = useState(() => [])
	const [branch, setBranch] = useState(() => [])

	const [groupData, setGroupData] = useState(() => [])
	const [sahayikaList, setSahayikaList] = useState(() => [])

	const [visible, setVisible] = useState(() => false)
	const [pendingValues, setPendingValues] = useState(null);
	const [PACS_SHGList, setPACS_SHGList] = useState([]);
	const [remainDisburseAmt, setRemainDisburseAmt] = useState(null);

	const initialValues = {
		branch_name: "",
		acc_open_date: "",
		loan_to: "",
		acc_no: "", /// Not
		tran_type: "",
		depo_amt: "",
	}
	const [formValues, setValues] = useState(initialValues)

	
	const validationSchema = Yup.object({
		// loan_id: Yup.string().required("Loan ID is required"),
		branch_name: Yup.string().required("Branch Name is required"),
		acc_open_date: Yup.string().required("Account Open Date is required"),
		loan_to: Yup.string().required("Loan To is required"),
		acc_no: Yup.string().required("Account No. is required"),
		tran_type: Yup.string().required("Transaction Type is required"),
		depo_amt: Yup.mixed().required("Deposit Amount is required"),
		
		})

	// const formatDateToYYYYMMDD_CurrentDT = (date) => {
	// const d = new Date(date);
	// d.setHours(0, 0, 0, 0);

	// const year = d.getFullYear();
	// const month = String(d.getMonth() + 1).padStart(2, "0");
	// const day = String(d.getDate()).padStart(2, "0");

	// return `${year}-${month}-${day}`;
	// };

	const formatDateToYYYYMMDD_CurrentDT = (date) => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);

	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
	};

	

	// wherever you open popup (e.g. on submit)
	const handleOpenConfirm = (values) => {
	setPendingValues(values);   // store formik values
	setVisible(true);           // open dialog
	};
	
	const onSubmit = async (values) => {
		
		// setVisible(true)
		// if (params?.id > 0) {
		// 	editGroup(values)
		// }
		handleOpenConfirm(values)
			
	}

	

	const formik = useFormik({
		initialValues: + params.id > 0 ? formValues : initialValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})



	const getClientIP = async () => {
	const res = await fetch("https://api.ipify.org?format=json")
	const data = await res.json()
	return data.ip
	}




	useEffect(() => {
		if(params.id > 0){
		
		handleSearchChange(loanAppData?.loan_to_name)
		fetchDisburseDetails()
		console.log(loanAppData?.loan_to_name, 'loan_to_name', userDetails[0]?.user_type);
		
		}
	}, [])

	const fetchDisburseDetails = async () => {
		setValues({
		loan_ac_no: loanAppData?.loan_acc_no,
		loan_to: loanAppData?.loan_to,
		branch_shg_id: loanAppData?.loan_to_name,
		// branch_shg_id: loanAppData?.branch_shg_id, 
		branch_shg_SearchField: '',
		period: loanAppData?.period,
		curr_roi: loanAppData?.curr_roi,
		over_roi: loanAppData?.over_roi,
		disb_dt: formatDateToYYYYMMDD_CurrentDT(new Date(loanAppData?.disb_dt)),
		disb_amt: loanAppData?.disb_amt,

		})
	}



	const editGroup = async (formData) => {
				// return;
				setLoading(true)
			
				const ip = await getClientIP()
			
				const creds = {
				loan_id : loanAppData?.loan_id,
    			tran_id : loanAppData?.trans_id,
				tenant_id: userDetails[0]?.tenant_id,
				branch_id: userDetails[0]?.brn_code,
				loan_acc_no: formData?.loan_ac_no,
				loan_to: formData?.loan_to,
				// branch_shg_id: formData?.branch_shg_id, ///////////////
				branch_shg_id: loanAppData?.branch_shg_id,
				period: formData?.period,
				curr_roi: formData?.curr_roi,
				penal_roi: formData?.over_roi,
				disb_dt: formData?.disb_dt,
				disb_amt: formData?.disb_amt,
				// pay_mode: formData?.pay_mode,
				created_by: userDetails[0]?.emp_id,
				ip_address: ip,
				}

				
				console.log(formData, 'formDataformDataformDataformData', creds, '>>>', userDetails[0]);

				// return;

				await saveMasterData({
				endpoint: "loan/save_disbursement",
				creds,
				navigate,
				successMsg: "Loan Disburse edited saved.",
				onSuccess: () => navigate(-1),
			
				// 🔥 fully dynamic failure handling
				failureRedirect: routePaths.LANDING,
				clearStorage: true,
				})
			
				setLoading(false)
				}

	const saveGroupData = async (formData) => {
				
				setLoading(true)
			
				const ip = await getClientIP()
			
				const creds = {
				tenant_id: userDetails[0]?.tenant_id,
				branch_id: userDetails[0]?.brn_code,
				loan_acc_no: formData?.loan_ac_no,
				loan_to: formData?.loan_to,
				branch_shg_id: formData?.branch_shg_id, ///////////////
				period: formData?.period,
				curr_roi: formData?.curr_roi,
				penal_roi: formData?.over_roi,
				disb_dt: formData?.disb_dt,
				disb_amt: formData?.disb_amt,
				// pay_mode: formData?.pay_mode,
				created_by: userDetails[0]?.emp_id,
				ip_address: ip,
				}

				
				console.log(formData, 'formDataformDataformDataformData', creds, userDetails[0]);

				await saveMasterData({
				endpoint: "loan/save_disbursement",
				creds,
				navigate,
				successMsg: "Loan Disburse details saved.",
				onSuccess: () => navigate(-1),
			
				// 🔥 fully dynamic failure handling
				failureRedirect: routePaths.LANDING,
				clearStorage: true,
				})
			
				setLoading(false)
				}

	useEffect(()=>{
	if(params.id < 1){
	formik.setFieldValue("branch_shg_SearchField", "");
	formik.setFieldValue("branch_shg_id", "");
	setPACS_SHGList([])
	}
	}, [formik.values.loan_to])





	useEffect(() => {
	const currRoi = Number(formik.values.curr_roi);

	if (!isNaN(currRoi) && currRoi !== "") {
	// console.log(formik.values.curr_roi, 'ccccccccccc');
	if(formik.values.curr_roi > 0){
	formik.setFieldValue("over_roi", currRoi + 2);
	}
	}
	}, [formik.values.curr_roi]);



	const handleSearchChange = async (value) => {
		if(value.length < 3){
			Message("error", "Minimum type 3 character")
			return;
		}


		setPACS_SHGList([])
		setLoading(true)
		const creds = {
		loan_to : formik.values.loan_to,
		branch_code : userDetails[0]?.brn_code,
		branch_shg_id : value,
		tenant_id: formik.values.loan_to == 'P' ? userDetails[0]?.tenant_id : 0,
		}

		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios.post(`${url_bdccb}/loan/fetch_pacs_shg_details`, creds, {
		headers: {
		Authorization: `${tokenValue?.token}`, // example header
		"Content-Type": "application/json", // optional
		},
		})
		.then((res) => {

		if(res?.data?.success){
			// console.log(res?.data?.data, 'mmmmmmmmmmmmmmmmmmm'); 
			
		if(formik.values.loan_to == "P" || loanAppData?.loan_to == "P"){
		setPACS_SHGList(res?.data?.data?.map((item, i) => ({
		code: item?.branch_id,
		name: item?.branch_name,
		})))
		}

		if(formik.values.loan_to == "S" || loanAppData?.loan_to == "S"){
		setPACS_SHGList(res?.data?.data?.map((item, i) => ({
		code: item?.group_code,
		name: item?.group_name,
		})))
		}

		// if(res?.data?.data.length > 0){
		// 	Message("success", res?.data?.msg)
		// } else {
		// 	Message("error", res?.data?.msg)
		// }
		

		} else {
		navigate(routePaths.LANDING)
		localStorage.clear()
		}
		})
		.catch((err) => {
		Message("error", "Some error occurred while fetching group form")
		})

		setLoading(false)
	};

	useEffect(() => {
		if(userDetails[0]?.user_type == 'P'){
			remainingDisburseAmt()
		}
		
	}, [formik.values.loan_to])

	const remainingDisburseAmt = async ()=>{


		setLoading(true)
		const creds = {
		pacs_shg_id : userDetails[0]?.brn_code,
		loan_to : userDetails[0]?.user_type,
		// loan_to : formik.values.loan_to,
		}

		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios.post(`${url_bdccb}/loan/fetch_max_balance`, creds, {
		headers: {
		Authorization: `${tokenValue?.token}`, // example header
		"Content-Type": "application/json", // optional
		},
		})
		.then((res) => {

		if(res?.data?.success){
		setRemainDisburseAmt(res?.data?.data[0]?.max_balance)
		console.log(res?.data?.data[0]?.max_balance, 'searchAmtsearchAmtsearchAmtsearchAmt');

		} else {
		// navigate(routePaths.LANDING)
		// localStorage.clear()
		}
		})
		.catch((err) => {
		Message("error", "Some error occurred while fetching group form")
		})

		setLoading(false)
		

	}

	return (
		<>
		<section className=" dark:bg-[#001529] flex justify-center align-middle p-5">
			<div className="p-5 w-4/5 min-h-screen rounded-3xl">
			<div className="w-auto mx-14 my-4">
			<FormHeader text={`${params?.id == 0 ? "Loan Disburse Form" : loanAppData?.approval_status == 'A' ? "View Loan Disburse Form" : "Edit/Preview Loan Disburse Form"}`} mode={2} />
			</div>

			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>	
				{/* {JSON.stringify(loanAppData?.approval_status, 2)}  */}
				<div className="card shadow-lg bg-white border-2 p-5 mx-16 rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
				<form onSubmit={formik.handleSubmit}>
					<div className="flex justify-start gap-5">
						<div className={"grid gap-4 sm:grid-cols-3 sm:gap-6 w-full mb-4"}>

					

							<div>
								{/* {JSON.stringify(userDetails[0], null, 2)} */}
								<TDInputTemplateBr
									placeholder="Branch Name"
									type="text"
									label="Branch Name"
									name="branch_name"
									formControlName={formik.values.branch_name}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									// disabled={params.id > 0 ? true : false}
								/>
								
								{formik.errors.branch_name && formik.touched.branch_name ? (
									<VError title={formik.errors.branch_name} />
								) : null}
							</div>

							<div>
							<TDInputTemplateBr
							// placeholder="Select Disbursement Date..."
							type="date"
							label="Account Open Date"
							name="acc_open_date"
							formControlName={formik.values.acc_open_date}
							handleChange={formik.handleChange} 
							handleBlur={formik.handleBlur}
							max={formatDateToYYYYMMDD_CurrentDT(new Date())}
							mode={1}
							// disabled={loanAppData?.approval_status == 'A' ? true : false}
							/>
							{formik.errors.acc_open_date && formik.touched.acc_open_date ? (
							<VError title={formik.errors.acc_open_date} />
							) : null}
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Select One"
						type="text"
						label="Loan To *"
						name="loan_to"
						handleChange={formik.handleChange}
						// handleChange={handleFormikMasterChange} 
						handleBlur={formik.handleBlur}
						formControlName={formik.values.loan_to}
						data={loan_to}
						mode={2}
						disabled={params.id > 0 ? true : false}
					/>
					{formik.errors.loan_to && formik.touched.loan_to ? (
						<VError title={formik.errors.loan_to} />
					) : null}
						</div>

						<div>
								<TDInputTemplateBr
									placeholder="Account No."
									type="number"
									label="Account No."
									name="acc_no"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.acc_no}
									// data={period_data}
									mode={1}
									// disabled={loanAppData?.approval_status == 'A' ? true : false}
								/>
								{formik.errors.acc_no && formik.touched.acc_no ? (
									<VError title={formik.errors.acc_no} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Transaction Type"
									type="text"
									label="Transaction Type"
									name="tran_type"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.tran_type || "Deposit"}
									// data={period_data}
									mode={1}
									disabled
								/>
								{formik.errors.tran_type && formik.touched.tran_type ? (
									<VError title={formik.errors.tran_type} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Deposit Amount"
									type="number"
									label="Deposit Amount"
									name="depo_amt"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.depo_amt}
									// data={period_data}
									mode={1}
									// disabled={loanAppData?.approval_status == 'A' ? true : false}
								/>
								{formik.errors.depo_amt && formik.touched.depo_amt ? (
									<VError title={formik.errors.depo_amt} />
								) : null}
							</div>



							


							</div>
							</div>

							
							
						



					{/* {userDetails?.id != 3 &&  */}
					{loanAppData?.approval_status != 'A' &&(
						<BtnComp mode="A" onReset={formik.resetForm} param={params?.id} />
					)}
					
					{/* } */}
				</form>
				</div>
			</Spin>
			</div>
			</section>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				 onPressYes={() => {
		if (pendingValues) {
		if(params?.id > 0) {
			editGroup(pendingValues);
		} else {
			saveGroupData(pendingValues) 
		}
	  
	 	// 🔥 pass values here
		}
		setVisible(false);
		}}
				onPressNo={() => setVisible(!visible)}
		/>

		</>
	)
}

export default AccountHolderForm_BDCCB
