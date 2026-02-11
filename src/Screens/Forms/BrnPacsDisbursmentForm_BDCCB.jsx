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
	CheckCircleFilled,
	ClockCircleFilled,
	SyncOutlined,
	UsergroupAddOutlined,
	UserOutlined,
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


function BrnPacsDisbursmentForm_BDCCB({ flag }) {


	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const loanAppData = location.state || {}
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
	const [groupMemberTotal, setGroupMemberTotal] = useState();
	// const [groupMemberTotal, setTotalMember] = useState();

	const [rows, setRows] = useState([
		{
			acc_no: "",
			branch_shg_id: "",
			total_member: "",
			loany_member: "",
			amount: "",
		},
	]);



	const initialValues = {
		period: "",
		curr_roi: "",
		over_roi: "",
		disb_dt: "",
		rows: [
			{
				acc_no: "",
				branch_shg_id: "",
				total_member: "",
				loany_member: "",
				amount: "",
			},
		],
	}
	const [formValues, setValues] = useState(initialValues)


	const validationSchema = Yup.object({
		period: Yup.string().required("Period is required"),
		curr_roi: Yup.mixed().required("Current Rate Of Intarest is required"),
		over_roi: Yup.mixed().required("Overdue Rate Of Intarest is required"),
		disb_dt: Yup.mixed().required("Disbursement Date is required"),
		approved_by: '',
		approved_dt: '',
		rows: Yup.array()
    .of(
      Yup.object({
        acc_no: Yup.string()
          .required("Account number is required"),

        branch_shg_id: Yup.string()
          .required("PACS / SHG is required"),

        total_member: Yup.number()
          .typeError("No. of Group must be a number")
          .required("No. of Group is required")
          .min(1, "Must be at least 1"),

        loany_member: Yup.number()
        .typeError("Loanee Member must be a number")
        .required("Loanee Member is required")
        .min(1, "Must be at least 1")
        .test(
          "not-greater-than-total",
          "Loanee Member cannot be greater than Total Member",
          function (value) {
            const { total_member } = this.parent;
            return Number(value) <= Number(total_member);
          }
        ),

        amount: Yup.number()
          .typeError("Amount must be a number")
          .required("Amount is required")
          .min(1, "Amount must be greater than 0"),
      })
    )
    .min(1, "At least one row is required"),

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
		if (params.id > 0) {
			fetchDisburseDetails()
		}
	}, [])

	useEffect(() => {
	if (Number(params?.id) > 0) {
		formik.values.rows.forEach((row, index) => {
		if (row.branch_shg_id) {
			fetchGroupData(row.branch_shg_id, index);
		}
		});
	}
	}, [formik.values.rows]);

	

	const fetchDisburseDetails = async () => {

		const formattedRows = [
			{
			acc_no: loanAppData?.loan_acc_no || "",
			branch_shg_id: loanAppData?.branch_shg_id || "",
			loany_member: loanAppData?.tot_memb || "",
			amount: loanAppData?.disb_amt || "",
			loan_id: loanAppData?.loan_id,
			tran_id: userDetails[0]?.tenant_id,
			}
		];

		setValues({
			period: loanAppData?.period || "",
			curr_roi: loanAppData?.curr_roi || "",
			over_roi: loanAppData?.penal_roi || "",
			disb_dt: loanAppData?.disb_dt
			? formatDateToYYYYMMDD_CurrentDT(new Date(loanAppData?.disb_dt))
			: "",
			rows: formattedRows,
		});

		setPACS_SHGList([
			{
			code: loanAppData?.branch_shg_id,
			name: loanAppData?.loan_to_name, // <-- this is important
			},
		]);

		};





	const editGroup = async (formData) => {

		// console.log(rows, 'formDataformDataformDataformData', formData);

		// return

		const formattedRows = formData?.rows?.map(row => ({
		loan_acc_no: row.acc_no,
		branch_shg_id: row.branch_shg_id,
		tot_memb: row.loany_member,   // or total_member if required
		disb_amt: Number(row.amount),
		loan_id: row?.loan_id,
		tran_id: row?.tran_id,
		}))

		setLoading(true)

		const ip = await getClientIP()

		const creds = {
			tenant_id: userDetails[0]?.tenant_id,
			branch_id: userDetails[0]?.brn_code,
			loan_to: 'S',
			period: formData?.period,
			curr_roi: formData?.curr_roi,
			penal_roi: formData?.over_roi,
			disb_dt: formData?.disb_dt,
			loanee_dtls: formattedRows,
			created_by: userDetails[0]?.emp_id,
			ip_address: ip,
		}



		console.log(formData, 'formDataformDataformDataformData', creds);
		// return

		await saveMasterData({
			endpoint: "loan/save_disburse_brn_pacs_shg",
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

	const saveGroupData = async (formData) => {

		console.log(rows, 'rowsrowsrowsrowsrows', formData);
		// return

		const formattedRows = formData?.rows?.map(row => ({
		loan_acc_no: row.acc_no,
		branch_shg_id: row.branch_shg_id,
		tot_memb: row.loany_member,   // or total_member if required
		disb_amt: Number(row.amount),
		loan_id: "0",
		tran_id: "0",
		}))

		setLoading(true)

		const ip = await getClientIP()

		const creds = {
			tenant_id: userDetails[0]?.tenant_id,
			branch_id: userDetails[0]?.brn_code,
			loan_to: 'S',
			period: formData?.period,
			curr_roi: formData?.curr_roi,
			penal_roi: formData?.over_roi,
			disb_dt: formData?.disb_dt,
			loanee_dtls: formattedRows,
			created_by: userDetails[0]?.emp_id,
			ip_address: ip,
		}



		// console.log(formData, 'formDataformDataformDataformData', creds, userDetails[0]);

		await saveMasterData({
			endpoint: "loan/save_disburse_brn_pacs_shg",
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

	// useEffect(() => {
	// 	if (params.id < 1) {
	// 		formik.setFieldValue("branch_shg_SearchField", "");
	// 		formik.setFieldValue("branch_shg_id", "");
	// 		setPACS_SHGList([])
	// 	}
	// }, [formik.values.loan_to])





	useEffect(() => {
		const currRoi = Number(formik.values.curr_roi);

		if (!isNaN(currRoi) && currRoi !== "") {
			if (formik.values.curr_roi > 0) {
				formik.setFieldValue("over_roi", currRoi + 2);
			}
		}
	}, [formik.values.curr_roi]);



	const handleSearchChange = async (value) => {
		if (value.length < 3) {
			// Message("error", "Minimum type 3 character")
			return;
		}

		setPACS_SHGList([])
		setLoading(true)
		const creds = {
			// loan_to : formik.values.loan_to,
			// loan_to: userDetails[0]?.user_type == 'B' ? 'S' : userDetails[0]?.user_type == 'P' ? 'S' : '',
			// branch_code: userDetails[0]?.user_type == 'B' ? 0 : userDetails[0]?.user_type == 'P' ? userDetails[0]?.brn_code : '',
			// branch_shg_id: value,
			// tenant_id: userDetails[0]?.user_type == 'B' ? userDetails[0]?.tenant_id : 0,

			loan_to: userDetails[0]?.user_type == 'B' ? 'S' : userDetails[0]?.user_type == 'P' ? 'S' : '',
			branch_code: userDetails[0]?.brn_code,
			branch_shg_id : value,
			tenant_id: 0,
		}

		const tokenValue = await getLocalStoreTokenDts(navigate);

		console.log(creds, 'ffffffffffffffffffffffff', userDetails[0]);

		await axios.post(`${url_bdccb}/loan/fetch_pacs_shg_details`, creds, {
			headers: {
				Authorization: `${tokenValue?.token}`, // example header
				"Content-Type": "application/json", // optional
			},
		})
			.then((res) => {

				if (res?.data?.success) {
					// console.log(res?.data?.data, 'mmmmmmmmmmmmmmmmmmm'); 

					// if (userDetails[0]?.user_type == 'B') {
					// 	setPACS_SHGList(res?.data?.data?.map((item, i) => ({
					// 		code: item?.branch_id,
					// 		name: item?.branch_name,
					// 	})))
					// }

					// if(formik.values.loan_to == "S" || loanAppData?.loan_to == "S"){
					// console.log(res?.data?.data, 'valueeeeeeeeeeeeeeeeeeeeeeee');
					
					// if (userDetails[0]?.user_type == 'B') {
						setPACS_SHGList(res?.data?.data?.map((item, i) => ({
							code: item?.group_code,
							name: item?.group_name,
						})))
					// }

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

	const fetchGroupData = async (value, rowIndex) => {
		console.log(value, 'valueeeeeeeeeeeeeeeeeeeeeeee');

		setLoading(true)
		const creds = {
			group_code: value,
			tenant_id: userDetails[0]?.tenant_id,
		}

		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios.post(`${url_bdccb}/loan/fetch_tot_memb`, creds, {
			headers: {
				Authorization: `${tokenValue?.token}`, // example header
				"Content-Type": "application/json", // optional
			},
		})
			.then((res) => {

				if (res?.data?.success) {
					console.log(res?.data?.data, 'valueeeeeeeeeeeeeeeeeeeeeeee', res.data.data.tot_memb);
					const totMemb = Number(res.data.data[0].tot_memb);

					// 🔥 SET VALUE INTO THAT ROW
					formik.setFieldValue(
						`rows[${rowIndex}].total_member`,
						totMemb
					);
					
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


	



	return (
		<>
			<section className=" dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className="p-5 w-4/5 min-h-screen rounded-3xl">
					<div className="w-auto mx-14 my-4">
						<FormHeader text={`${params?.id == 0 ? `Loan Disburse ${userDetails[0]?.user_type == 'B' ? 'Branch': userDetails[0]?.user_type == 'P' ? 'PACS' : ''} to SHG` : loanAppData?.approval_status == 'A' ? `View Loan Disburse ${userDetails[0]?.user_type == 'B' ? 'Branch': userDetails[0]?.user_type == 'P' ? 'Pacs' : ''} to SHG Form` : `Edit/Preview Loan Disburse ${userDetails[0]?.user_type == 'B' ? 'Branch': userDetails[0]?.user_type == 'P' ? 'Pacs' : ''} to SHG Form`}`} mode={2} />
					</div>

					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						{/* {JSON.stringify(loanAppData, 2)}  */}
						{/* {JSON.stringify(loanAppData, null, 2)} */}
						<div className="card shadow-lg bg-white border-2 p-5 mx-16 rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
							{loanAppData?.approval_status == 'A' && (<div className="accept_dis"><CheckCircleFilled style={{ color: "#fff", marginRight: 6 }} />
								Disbursement Accepted </div>)}
							{loanAppData?.approval_status == 'U' && (<div className="pending_dis"><SyncOutlined style={{ color: "#fff", marginRight: 6 }} />
								Disbursement Pending </div>)}
							<form onSubmit={formik.handleSubmit}>
								<div className="flex justify-start gap-5">
									<div className={"grid gap-4 sm:grid-cols-3 sm:gap-6 w-full mb-4"}>

										{loanAppData?.approval_status == 'A' && (
											<>
												<div>

													<TDInputTemplateBr
														placeholder="Approved By"
														type="text"
														label="Approved By"
														name="approved_by"
														formControlName={formik.values.approved_by}
														handleChange={formik.handleChange}
														handleBlur={formik.handleBlur}
														mode={1}
														disabled={params.id > 0 ? true : false}
													/>

												</div>

												<div>

													<TDInputTemplateBr
														placeholder="Approved Date"
														type="text"
														label="Approved Date"
														name="approved_dt"
														formControlName={formik.values.approved_dt}
														handleChange={formik.handleChange}
														handleBlur={formik.handleBlur}
														mode={1}
														disabled={params.id > 0 ? true : false}
													/>

												</div>
											</>

										)}

									</div>
								</div>



								<div className="flex justify-start gap-5">
									<div className={"grid gap-4 sm:grid-cols-3 sm:gap-6 w-full mb-3"}>
										<div>
											{/* {JSON.stringify(formik.values.period, 2)} */}
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
												disabled={loanAppData?.approval_status == 'A' ? true : false}
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
												disabled={loanAppData?.approval_status == 'A' ? true : false}
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
												disabled={loanAppData?.approval_status == 'A' ? true : false}
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
												max={formatDateToYYYYMMDD_CurrentDT(new Date())}
												mode={1}
												disabled={loanAppData?.approval_status == 'A' ? true : false}
											/>
											{formik.errors.disb_dt && formik.touched.disb_dt ? (
												<VError title={formik.errors.disb_dt} />
											) : null}
										</div>

										{/* <div>
											<TDInputTemplateBr
												placeholder="Disbursement Amount..."
												type="number"
												label="Disbursement Amount"
												name="disb_amt"
												formControlName={formik.values.disb_amt}
												handleChange={formik.handleChange}
												handleBlur={formik.handleBlur}
												mode={1}
												disabled={loanAppData?.approval_status == 'A' ? true : false}
											/>

											{formik.errors.disb_amt && formik.touched.disb_amt ? (
												<VError title={formik.errors.disb_amt} />
											) : null}
										</div> */}

									</div>
								</div>



								<div className="sm:col-span-3 mt-6">
									{formik.values.rows.length > 0 && (
										<Tag color="#2563eb" className="text-white mb-3 font-bold">
											Add Group Details
										</Tag>
									)}

									{formik.values.rows.map((row, index) => {
										const isRowFilled =
											row.acc_no &&
											row.branch_shg_id &&
											row.total_member &&
											row.loany_member &&
											row.amount;

										return (
											<div
												key={index}
												className="grid grid-cols-12 gap-3 mb-3 p-3 border rounded-md bg-slate-50 relative"
											>
												{/* Account Number */}
												<div className="col-span-2">
													<TDInputTemplateBr
														placeholder="Acc Number"
														label="Acc Number"
														type="text"
														name={`rows[${index}].acc_no`}
														formControlName={row.acc_no}
														handleChange={formik.handleChange}
														mode={1}
													/>
													{formik.touched.rows?.[index]?.acc_no &&
													formik.errors.rows?.[index]?.acc_no && (
													<VError title={formik.errors.rows[index].acc_no} />
													)}

												</div>

												{/* SHG / PACS */}
												<div className="col-span-3">
													<label for="loan_to" class="block mb-2 text-sm capitalize font-bold text-slate-800
				 dark:text-gray-100">
														{userDetails[0]?.user_type == 'B' ? 'Select PACS *' : userDetails[0]?.user_type == 'P' ? 'Select SHG *' : 'Select *'}
														{/* Select PACS/SHG * */}
													</label>
													<Select
														showSearch
														placeholder={
															userDetails[0]?.user_type === "B"
																? "Choose PACS"
																: userDetails[0]?.user_type === "P"
																	? "Choose SHG"
																	: "Choose"
														}
														value={row.branch_shg_id}
														style={{ width: "100%" }}
														optionFilterProp="children"
														name={`rows[${index}].branch_shg_id`}

														// 🔍 typing search
														onSearch={(value) => {
															handleSearchChange(value);
														}}

														// ✅ selecting option (ROW SAFE)
														onChange={(value) => {
															// console.log(value, 'valueeeeeeeeeeeeeeeeeeeeeeee');
															// fetchGroupData(value)
															// formik.setFieldValue(
															// 	`rows[${index}].branch_shg_id`,
															// 	value
															// );
															formik.setFieldValue(`rows[${index}].branch_shg_id`, value);

															// 🔥 fetch and auto-fill total member
															fetchGroupData(value, index);
														}}

														onBlur={() =>
															formik.setFieldTouched(
																`rows[${index}].branch_shg_id`,
																true
															)
														}

														filterOption={(input, option) =>
															option?.children
																?.toLowerCase()
																.includes(input.toLowerCase())
														}
													>
														<Select.Option value="" disabled>
															{userDetails[0]?.user_type === "B"
																? "Choose PACS"
																: userDetails[0]?.user_type === "P"
																	? "Choose SHG"
																	: "Choose"}
														</Select.Option>

														{PACS_SHGList?.map((data) => (
															<Select.Option key={data.code} value={data.code}>
																{data.name}
															</Select.Option>
														))}
													</Select>

													

													{formik.touched.rows?.[index]?.branch_shg_id &&
													formik.errors.rows?.[index]?.branch_shg_id && (
													<VError title={formik.errors.rows[index].branch_shg_id} />
													)}


												</div>

												{/* No of Group */}
												<div className="col-span-2">
													<TDInputTemplateBr
														placeholder="Total Member"
														label="Total Member"
														type="number"
														name={`rows[${index}].total_member`}
														formControlName={row.total_member}
														handleChange={formik.handleChange}
														mode={1}
														disabled
													/>
													{formik.touched.rows?.[index]?.total_member &&
													formik.errors.rows?.[index]?.total_member && (
													<VError title={formik.errors.rows[index].total_member} />
													)}


												</div>

												{/* No of Member */}
												<div className="col-span-2">
													<TDInputTemplateBr
														placeholder="Loanee Member"
														label="Loanee Member"
														type="number"
														name={`rows[${index}].loany_member`}
														formControlName={row.loany_member}
														handleChange={formik.handleChange}
														mode={1}
														max={row.total_member}
													/>
													{formik.touched.rows?.[index]?.loany_member &&
													formik.errors.rows?.[index]?.loany_member && (
													<VError title={formik.errors.rows[index].loany_member} />
													)}

												</div>

												{/* Amount */}
												<div className="col-span-3">
													<TDInputTemplateBr
														placeholder="Amount"
														label="Amount"
														type="number"
														name={`rows[${index}].amount`}
														formControlName={row.amount}
														handleChange={formik.handleChange}
														mode={1}
													/>

													{formik.touched.rows?.[index]?.amount &&
													formik.errors.rows?.[index]?.amount && (
													<VError title={formik.errors.rows[index].amount} />
													)}


												</div>

												{/* Remove */}
												<div className="col-span-1 text-center absolute right-2 top-4">
													{formik.values.rows.length > 1 && (
														<button
															type="button"
															onClick={() => {
																const updated = [...formik.values.rows];
																updated.splice(index, 1);
																formik.setFieldValue("rows", updated);
															}}
															className="text-white font-bold"
															style={{
																background: "rgb(218 65 103 / var(--tw-bg-opacity))",
																padding: "0 7px",
																height: "25px",
																lineHeight: "25px",
																borderRadius: "5px",
																fontSize: "13px",
																marginTop: -10,
																position: 'absolute',
																right: 6
															}}
														>
															✕
														</button>
													)}
												</div>
													
													{/* {JSON.stringify(params, 2)} */}
												{/* Add Button (only last row) */}
												
												{index === formik.values.rows.length - 1 &&
  												Number(params?.id) <= 0 && (
													<div className="col-span-12 text-right mt-2">
														<Button
															type="primary"
															disabled={!isRowFilled}
															icon={<UsergroupAddOutlined />}
															onClick={() =>
																formik.setFieldValue("rows", [
																	...formik.values.rows,
																	{
																		acc_no: "",
																		branch_shg_id: "",
																		total_member: "",
																		loany_member: "",
																		amount: "",
																	},
																])
															}
														>
															Add New
														</Button>
													</div>
												)}
											</div>
										);
									})}

									{/* Total */}
									<div className="text-right mt-3">
										<Tag color="blue" style={{ fontSize: 14 }}>
											Total Amount : ₹{" "}
											{formik.values.rows.reduce(
												(sum, r) => sum + Number(r.amount || 0),
												0
											)}
										</Tag>
									</div>
								</div>





								{/* </div>
					</div> */}



								{/* {userDetails?.id != 3 &&  */}
								{loanAppData?.approval_status != 'A' && (
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
						if (params?.id > 0) {
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

export default BrnPacsDisbursmentForm_BDCCB
