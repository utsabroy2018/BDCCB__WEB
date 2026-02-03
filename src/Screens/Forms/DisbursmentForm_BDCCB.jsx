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


function DisbursmentForm_BDCCB({ flag }) {


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
		// loan_id: "",
		loan_ac_no: "",
		loan_to: "",
		branch_shg_id: "",

		branch_shg_SearchField: "", /// Not

		period: "",
		curr_roi: "",
		over_roi: "",
		disb_dt: "",
		disb_amt: "",
		// pay_mode: "",
	}
	const [formValues, setValues] = useState(initialValues)

	
	const validationSchema = Yup.object({
		// loan_id: Yup.string().required("Loan ID is required"),
		loan_ac_no: Yup.string().required("Loan Account No. is required"),
		loan_to: Yup.string().required("Loan To is required"),
		branch_shg_id: Yup.string().required("Select PACS or SHG is required"),
		period: Yup.string().required("Period is required"),
		curr_roi: Yup.mixed().required("Current Rate Of Intarest is required"),
		over_roi: Yup.mixed().required("Overdue Rate Of Intarest is required"),
		disb_dt: Yup.mixed().required("Disbursement Date is required"),
		// disb_amt: Yup.mixed().required("Disbursement Amount is required"),
		// disb_amt: Yup.number()
		// .typeError("Disbursement Amount must be a number")
		// .required("Disbursement Amount is required")
		// .max(remainDisburseAmt, `Disbursement Amount cannot be more than ${remainDisburseAmt}`)
		// .positive("Disbursement Amount must be greater than 0"),
		disb_amt: Yup.number()
		.typeError("Disbursement Amount must be a number")
		.required("Disbursement Amount is required")
		.positive("Disbursement Amount must be greater than 0")
		.test(
			"max-disb-amt-for-P",
			`Disbursement Amount cannot be more than ${remainDisburseAmt}`,
			function (value) {
			if (!value) return true;

			// apply condition ONLY for P
			if (userDetails?.[0]?.user_type === "P") {
				return value <= remainDisburseAmt;
			}

			return true; // no limit for other user types
			}
		)
	})




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
		initialValues: +params.id > 0 ? formValues : initialValues,
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

useEffect(()=>{
	console.log(flag, 'flagflagflagflagflagflag');
	
}, [])


	const editGroup = async (formData) => {
		return;
				setLoading(true)
			
				const ip = await getClientIP()
			
				const creds = {
				// group_code: groupDataArr?.group_code,
				// branch_code: userDetails[0]?.brn_code,
				// group_name: formData?.loan_id,
				// // gp_leader_id: 2, ///////////////
				// phone1: formData?.branch_shg_id,
				// loan_ac_no: formData?.loan_ac_no, ///////////////
				// curr_roi: formData?.curr_roi,
				// pay_mode: formData?.pay_mode,
				// disb_dt: formData?.disb_dt,
				// disb_amt: formData?.disb_amt,
				// gp_id: formData?.gp_id,
				// village_id: formData?.village_id,
				// pin_no: formData?.loan_to,
				// sb_ac_no: formData?.period,
				// created_by: userDetails[0]?.emp_id,
				// ip_address: ip,
				}


				console.log(formData, 'credscredscredscreds', userDetails[0]);
				
			
				await saveMasterData({
				endpoint: "group/save_group",
				creds,
				navigate,
				successMsg: "Group details saved.",
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

		console.log(userDetails[0], 'userDetailsuserDetailsuserDetails');
		
	formik.setFieldValue("branch_shg_SearchField", "");
	formik.setFieldValue("branch_shg_id", "");
	setPACS_SHGList([])
	
	}, [formik.values.loan_to])



	const search_PACS_SHG = async (loan_toDroupDown, searchTxt)=>{

		if(searchTxt.length < 3){
			Message("error", "Minimum type 3 character")
			return;
		}

		console.log(searchTxt, 'Calllllllllllllllllllll', loan_toDroupDown); // API Call

	setPACS_SHGList([])
	setLoading(true)
	const creds = {
	loan_to : loan_toDroupDown,
    branch_code : userDetails[0]?.brn_code,
    branch_shg_id : searchTxt,
	tenant_id: loan_toDroupDown == 'P' ? userDetails[0]?.tenant_id : 0,
	}

	const tokenValue = await getLocalStoreTokenDts(navigate);

	await axios.post(`${url_bdccb}/loan/fetch_pacs_shg_details`, creds, {
	headers: {
	Authorization: `${tokenValue?.token}`, // example header
	"Content-Type": "application/json", // optional
	},
	})
	.then((res) => {

		console.log(res?.data, 'mmmmmmmmmmmmmmmmmmmmmmmmmmm');
		
	if(res?.data?.success){
	if(loan_toDroupDown == "P"){
	setPACS_SHGList(res?.data?.data?.map((item, i) => ({
		code: item?.branch_id,
		name: item?.branch_name,
		})))
	}

	if(loan_toDroupDown == "S"){
		setPACS_SHGList(res?.data?.data?.map((item, i) => ({
			code: item?.group_code,
			name: item?.group_name,
			})))
	}

	if(res?.data?.data.length > 0){
		Message("success", res?.data?.msg)
	} else {
		Message("error", res?.data?.msg)
	}
	

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
  const currRoi = Number(formik.values.curr_roi);

  if (!isNaN(currRoi) && currRoi !== "") {
	console.log(formik.values.curr_roi, 'ccccccccccc');
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
	if(formik.values.loan_to == "P"){
	setPACS_SHGList(res?.data?.data?.map((item, i) => ({
	code: item?.branch_id,
	name: item?.branch_name,
	})))
	}

	if(formik.values.loan_to == "S"){
	setPACS_SHGList(res?.data?.data?.map((item, i) => ({
	code: item?.group_code,
	name: item?.group_name,
	})))
	}

	if(res?.data?.data.length > 0){
		Message("success", res?.data?.msg)
	} else {
		Message("error", res?.data?.msg)
	}
	

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
	// pacs_shg_id : formik.values.loan_to,
    // loan_to : userDetails[0]?.brn_code,
    // branch_shg_id : value,
	// tenant_id: formik.values.loan_to == 'P' ? userDetails[0]?.tenant_id : 0,

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
				
				<form onSubmit={formik.handleSubmit}>
					<div className="flex justify-start gap-5">
						<div className={"grid gap-4 sm:grid-cols-3 sm:gap-6 w-full mb-4"}>

							<div>
								{/* {JSON.stringify(sahayikaList, null, 2)} */}
								<TDInputTemplateBr
									placeholder="Loan Account No."
									type="text"
									label="Loan Account No."
									name="loan_ac_no"
									formControlName={formik.values.loan_ac_no}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									// data={sahayikaList}
									// setSahayikaList
								/>
								

								{formik.errors.loan_ac_no && formik.touched.loan_ac_no ? (
									<VError title={formik.errors.loan_ac_no} />
								) : null}
							</div>



							<div>
								{/* {loan_toDroupDown} */}
								{flag == 'BM' ? (
									<>
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
								/>
								{formik.errors.loan_to && formik.touched.loan_to ? (
									<VError title={formik.errors.loan_to} />
								) : null}
									</>
								) : (
									<>
									<TDInputTemplateBr
									placeholder="Select One"
									type="text"
									label="Loan To *"
									name="loan_to"
									handleChange={formik.handleChange}
									// handleChange={handleFormikMasterChange} 
									handleBlur={formik.handleBlur}
									formControlName={formik.values.loan_to}
									data={loan_to_For_Pacs}
									mode={2}
								/>
								{formik.errors.loan_to && formik.touched.loan_to ? (
									<VError title={formik.errors.loan_to} />
								) : null}
									</>
								)}
								
							</div>

							<div className="pt-6">
							{userDetails[0]?.user_type == 'P'&& (
								<div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-lg shadow-sm">
							<span className="text-sm font-medium">
								Balance:</span>
							<span className="text-base font-semibold">₹{remainDisburseAmt?.toLocaleString("en-IN")}
							</span>
							</div>
							)}
							


							</div>

							</div>
							</div>

							<div className="flex justify-start gap-5">
						<div className={"grid gap-4 sm:grid-cols-1 sm:gap-6 w-full mb-3"}>

							<div>
								<label for="loan_to" class="block mb-2 text-sm capitalize font-bold text-slate-800
				 dark:text-gray-100"> 
				 {formik.values.loan_to === 'P' ? 'Select PACS *' : formik.values.loan_to === 'S' ? 'Select SHG *' : 'Select *'} 
				 {/* Select PACS/SHG * */}
				 </label>
								<Select
									showSearch
									placeholder={formik.values.loan_to === 'P' ? 'Choose PACS ' : formik.values.loan_to === 'S' ? 'Choose SHG ' : 'Choose '}
									value={formik.values.branch_shg_id || undefined}
									style={{ width: "100%" }}
									optionFilterProp="children"
									name="branch_shg_id"
									// 🔍 typing search
									onSearch={(value) => {
									handleSearchChange(value);   // your search function
									}}
									disabled={formik.values.loan_to.length > 0 ? false : true}
									// ✅ selecting option
									onChange={(value) => {formik.setFieldValue("branch_shg_id", value)}}

									onBlur={formik.handleBlur}
									filterOption={(input, option) =>
									option?.children?.toLowerCase().includes(input.toLowerCase())
									}
									>
									<Select.Option value="" disabled>Choose Sector</Select.Option>

									{PACS_SHGList?.map((data) => (
									<Select.Option key={data.code} value={data.code}>
									{data.name}
									</Select.Option>
									))}
									</Select>

								
									{formik.errors.branch_shg_id && formik.touched.branch_shg_id ? (
										<VError title={formik.errors.branch_shg_id} />
									) : null}


								
								
							</div>
							{/* <div>

							<button type="button" onClick={()=>{
								search_PACS_SHG(formik.values.loan_to, formik.values.branch_shg_SearchField)
							}}
							disabled={formik.values.branch_shg_SearchField.length > 0 ? false : true}
								className="inline-flex items-center px-5 py-2.5 mt-4 ml-2 sm:mt-6 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900"
							>
								Search
							</button>
							</div> */}

							{/* <div>
								
							</div> */}


						</div>
						</div>
							
						<div className="flex justify-start gap-5">
						<div className={"grid gap-4 sm:grid-cols-3 sm:gap-6 w-full mb-3"}>
							<div>
								<TDInputTemplateBr
									placeholder="Period"
									type="number"
									label="Period (In Month)"
									name="period"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.period}
									data={period_data}
									mode={1}
								/>
								{formik.errors.period && formik.touched.period ? (
									<VError title={formik.errors.period} />
								) : null}
							</div>


							<div>
							<TDInputTemplateBr
							placeholder="Type Current ROI"
							type="number"
							label="Current ROI"
							name="curr_roi"
							formControlName={formik.values.curr_roi}
							handleChange={formik.handleChange}
							handleBlur={formik.handleBlur}
							mode={1}
							/>
							{formik.errors.curr_roi && formik.touched.curr_roi ? (
									<VError title={formik.errors.curr_roi} />
								) : null}
							</div>

							<div>
							<TDInputTemplateBr
							placeholder="Ovd ROI"
							type="number"
							label="Ovd ROI"
							name="over_roi"
							formControlName={formik.values.over_roi}
							handleChange={formik.handleChange}
							handleBlur={formik.handleBlur}
							mode={1}
							/>
							{formik.errors.over_roi && formik.touched.over_roi ? (
									<VError title={formik.errors.over_roi} />
								) : null}
							</div>

							

						<div>
						<TDInputTemplateBr
						// placeholder="Select Disbursement Date..."
						type="date"
						label="Disbursement Date"
						name="disb_dt"
						formControlName={formik.values.disb_dt}
						handleChange={formik.handleChange} 
						handleBlur={formik.handleBlur}
						min={formatDateToYYYYMMDD_CurrentDT(new Date())}
						mode={1}
						/>
						{formik.errors.disb_dt && formik.touched.disb_dt ? (
									<VError title={formik.errors.disb_dt} />
								) : null}
					</div>

					<div>
						<TDInputTemplateBr
						placeholder="Disbursement Amount..."
						type="number"
						label="Disbursement Amount"
						name="disb_amt"
						formControlName={formik.values.disb_amt}
						// handleChange={(e) => {
						// formik.handleChange(e);                 // keep Formik in sync
						// remainingDisburseAmt(e.target.value);   // trigger on typing
						// }}

						// handleChange={(e) => {
						// 	const value = Number(e.target.value);

						// 	if (value <= remainDisburseAmt || e.target.value === "") {
						// 	formik.handleChange(e);
						// 	}
						// }}
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						mode={1}
						/>

						{formik.errors.disb_amt && formik.touched.disb_amt ? (
									<VError title={formik.errors.disb_amt} />
								) : null}
					</div>

							{/* <div>
						<TDInputTemplateBr
						placeholder="Select Pay Mode..."
						type="text"
						label="Pay Mode"
						name="pay_mode"
						formControlName={formik.values.pay_mode}
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						data={pay_mode}
						mode={2}
						/>
						{formik.errors.pay_mode && formik.touched.pay_mode ? (
									<VError title={formik.errors.pay_mode} />
								) : null}
					</div> */}

					

					
					{/* {JSON.stringify(villName, null, 2)} */}

						</div>
					</div>



					{/* {userDetails?.id != 3 &&  */}
					<BtnComp mode="A" onReset={formik.resetForm} param={params?.id} />
					{/* } */}
				</form>
			</Spin>

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

export default DisbursmentForm_BDCCB
