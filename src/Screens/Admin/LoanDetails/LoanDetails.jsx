import React, { useEffect, useMemo, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url, url_bdccb } from "../../../Address/BaseUrl"
import { Message } from "../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker, Popconfirm, Tag } from "antd"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { printTableRegular } from "../../../Utils/printTableRegular"
import { exportToExcel } from "../../../Utils/exportToExcel"
import {
	absenteesReportHeader,
	attendanceReportHeader,
} from "../../../Utils/Reports/headerMap"
import DynamicTailwindAccordion from "../../../Components/Reports/DynamicTailwindAccordion"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import Radiobtn from "../../../Components/Radiobtn"
import { printTableReport } from "../../../Utils/printTableReport"
import { useNavigate } from "react-router"
import { routePaths } from "../../../Assets/Data/Routes"
import { getLocalStoreTokenDts } from "../../../Components/getLocalforageTokenDts"
import { useFormik } from "formik"
import * as Yup from "yup"
import VError from "../../../Components/VError"
import BtnComp from "../../../Components/BtnComp"

// const { RangePicker } = DatePicker
// const dateFormat = "YYYY/MM/DD"

const options = [
	{
		label: "All",
		value: "",
	},
	{
		label: "Late In",
		value: "L",
	},
	{
		label: "Early Out",
		value: "E",
	},
	// {
	// 	label: "Absent",
	// 	value: "A",
	// },
]

function LoanDetails() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)
	const [societyLoanNo, setSocietyLoanNo] = useState('')
	const [loanDetails, setLoanDetails] = useState([])

	const navigate = useNavigate()


	const initialValues = {
		principal_amount: "",
		interest_amount: "",
		members: [
				{
				loan_id : "",
				member_code: "",
				member_name: "",
				ccb_loan_id: "",
				cr_amt: "",
				mem_outstanding: "",
				princAmt: "",
				intAmt: "",
				},
			],
	}

	const [formValues, setValues] = useState(initialValues)


	// const validationSchema = Yup.object({
	// 		socie_loan_ac_no: Yup.string().required("Type Society Loan A/C No. is required"),
	// 	})

	const validationSchema = Yup.object({
	// socie_loan_ac_no: Yup.string().required("Type Society Loan A/C No. is required"),

	principal_amount: Yup.number().required("Principal amount is required"),
		// .test(
		// "principal-check",
		// "Principal amount must be less than Interest amount",
		// function (value) {
		// 	const { interest_amount } = this.parent
		// 	return Number(value) < Number(interest_amount)
		// }
		// ),

	interest_amount: Yup.number().required("Interest amount is required"),

	})

	const onSubmit = async (values) => {
		// setVisible(true)
		// if (params?.id > 0) {
		// 	editGroup(values)
		// }
		
		handleSubmit(values)
			
	}


	const formik = useFormik({
		initialValues: formValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})


	const handleSubmit = async () => {
		console.log(societyLoanNo, 'formDataformDataformDataformDataccccccccccc');

		setLoading(true)

		const creds = {
			tenant_id: userDetails[0]?.tenant_id,
			branch_id: userDetails[0]?.brn_code,
			society_acc_no: societyLoanNo,
			loan_to : userDetails[0]?.user_type
		}

		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios.post(`${url_bdccb}/loan/fetch_loan_dtls_based_socacc_no`, creds, {
			headers: {
			Authorization: `${tokenValue?.token}`, // example header
			"Content-Type": "application/json", // optional
			},
			})
			.then((res) => {
				
				
				if(res?.data?.success){
					
					setLoanDetails(res?.data?.data || [])

					const members = (res?.data?.data[0]?.member_list || []).map(item => ({
						...item,
						princAmt: "",
						intAmt: ""  // replace mem_amount with cr_amt
					}))

					// console.log(res?.data?.data, 'resresresresresresres/////////////', creds, 'lllll', members);

					setValues({
						...formValues,
						principal_amount: "",
    					interest_amount: "",
						// members: res?.data?.data[0]?.member_list || []
						members: members || []
					})
					// setValues({
					// 	g_group_name: res?.data?.data[0]?.group_name || "",
					// 	disburse_date: res?.data?.data[0]?.disb_dt || "",
					// 	period_month: res?.data?.data[0]?.period || "",
					// 	current_roi: res?.data?.data[0]?.curr_roi || "",
					// 	ovd_roi: res?.data?.data[0]?.penal_roi || "",
					// 	disbursed_amount: res?.data?.data[0]?.disb_amt || "",
					// 	loan_outstanding: res?.data?.data[0]?.loan_outstanding || "",
					// })
					
				
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

	const getClientIP = async () => {
	const res = await fetch("https://api.ipify.org?format=json")
	const data = await res.json()
	return data.ip
	}

	const calculatePrincIntarest = async () => {
		
		const princAmt = formik.values.principal_amount || 0
		const intAmt = formik.values.interest_amount || 0	
		console.log(Number(princAmt), 'ffffffffffffff', intAmt);
		
		// if(princAmt.length < 1 &&  intAmt.length < 1){
		// 	return Message("error", "Principal amount or Interest amount cannot be empty")
		// }

		if(!princAmt || !intAmt){
			return Message("error", "Principal amount or Interest amount cannot be empty")
		}

		const member_list = loanDetails[0]?.member_list.map(item => ({
		loan_id: item.loan_id,
		member_name: item.member_name,
		mem_amount: item.cr_amt,
		mem_outstanding: item.mem_outstanding,
		}));

		setLoading(true)

		const ip = await getClientIP()

		const creds = {
		curr_prn : loanDetails[0]?.loan_outstanding,
		prn_amt: formik.values.principal_amount,
		intt_amt : formik.values.interest_amount,
		created_by: userDetails[0]?.emp_id,
		ip_address : ip,
		memb_loan :  member_list
		}

		// console.log(member_list, 'ffffffffffffffffffffffffffff', creds);

		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios.post(`${url_bdccb}/loan/calculate_prn_intt_amt`, creds, {
			headers: {
			Authorization: `${tokenValue?.token}`, // example header
			"Content-Type": "application/json", // optional
			},
			})
			.then((res) => {
				
				
				if(res?.data?.success){
					console.log(res?.data?.data, 'resresresresresresres', creds);
					// setLoanDetails(res?.data?.data || [])
					const members = (res?.data?.data || []).map(item => ({
						...item,
						cr_amt: item.mem_amount ,
						mem_outstanding: item.mem_outstanding ,
						princAmt: item.principal_amount,
						intAmt: item.interest_amount  // replace mem_amount with cr_amt
					}))

					setValues({
						...formValues,
						principal_amount: princAmt || "",
    					interest_amount: intAmt || "",
						members: members
						// members: {
						// 	loan_id : res?.data?.data?.loan_id,
						// }
					})
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
	

	return (
		<div>
			{/* <Sidebar mode={2} /> */}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32">
					<div className="flex flex-row gap-3 py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							Loan Details
						</div>
					</div>

					

					<div className="grid grid-cols-3 gap-5 mt-5">
						<div>
							<TDInputTemplateBr
								placeholder="Society Loan A/C No..."
								type="text"
								label="Type Society Loan A/C No."
								name="soci_loan_no"
								formControlName={societyLoanNo}
								handleChange={(e) => setSocietyLoanNo(e.target.value)}
								mode={1}
							/>

						</div>
						{/* )} */}
						

						<div className="mt-7">
							{/* <button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
								onClick={formik.handleSubmit}
							>
								<SearchOutlined /> <span className={`ml-2`}>Search</span>
							</button> */}

							<button
							className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
							onClick={() => {
							handleSubmit()
							// if (searchType2 !== "A") {
							// handleSubmit()
							// } else {
							// handleFetchAbsentList()
							// }
							}}
							>
							<SearchOutlined /> <span className={`ml-2`}>Search</span>
							</button>
							{/* <BtnComp mode="A" onReset={formik.resetForm} /> */}
						</div>
					</div>
					{/* {JSON.stringify(loanDetails[0], null, 2)} llllllll
					{JSON.stringify(formik.values.members, null, 2)} */}

					{loanDetails.length > 0 && (
					<>
					{/* <div className="border-2 border-slate-500/50 bg-blue-100 rounded-lg p-5 mt-5"> */}
					<div className="grid grid-cols-4 gap-3 mt-5">
						
						{/* <div>
						<TDInputTemplateBr
						placeholder="Group Name"
						type="text"
						label="Group Name"
						name="g_group_name"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						formControlName={loanDetails[0]?.group_name}
						disabled={true}
						mode={1}
						/>
						{formik.errors.g_group_name && formik.touched.g_group_name ? (
						<VError title={formik.errors.g_group_name} />
						) : null}
						</div> */}

						{/* <div className="sm:col-span-4 text-slate text-lg font-bold sm:col-span-3"> Loan Details</div> */}

						<div>
						<TDInputTemplateBr
						placeholder="Disburse Date"
						type="date"
						label="Disburse Date"
						name="disburse_date"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						formControlName={loanDetails[0]?.disb_dt ? formatDateToYYYYMMDD(loanDetails[0]?.disb_dt) : ""}
						disabled={true}
						mode={1}
						/>
					
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Period (In Month)"
						type="number"
						label="Period (In Month)"
						name="period_month"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						formControlName={loanDetails[0]?.period || ""}
						disabled={true}
						mode={1}
						/>
					
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Current ROI"
						type="number"
						label="Current ROI"
						name="current_roi"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						formControlName={loanDetails[0]?.curr_roi || ""}
						disabled={true}
						mode={1}
						/>
						
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Ovd ROI"
						type="number"
						label="Ovd ROI"
						name="ovd_roi"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						formControlName={loanDetails[0]?.penal_roi || ""}
						disabled={true}
						mode={1}
						/>
						
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Total Disbursed Amount"
						type="number"
						label="Total Disbursed Amount"
						name="disbursed_amount"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						formControlName={loanDetails[0]?.disb_amt || ""}
						disabled={true}
						mode={1}
						/>
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Loan Outstanding"
						type="number"
						label="Loan Outstanding"
						name="loan_outstanding"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						formControlName={loanDetails[0]?.loan_outstanding || ""}
						disabled={true}
						mode={1}
						/>
						</div>

						</div>
						{/* </div> */}

						<div className="border-2 border-pink-500/50 bg-pink-100 rounded-lg p-5 mt-5">
						<div className="grid grid-cols-4 gap-5 mt-0">
						<div className="sm:col-span-1">
						<TDInputTemplateBr
						placeholder="Principal Amount"
						type="number"
						label="Principal Amount"
						name="principal_amount"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						// formControlName={loanDetails[0]?.principal_amount}
						formControlName={formik.values.principal_amount || ""}
						// disabled={true}
						mode={1}
						/>
						{formik.errors.principal_amount && formik.touched.principal_amount ? (
						<VError title={formik.errors.principal_amount} />
						) : null}
						</div>

						<div className="sm:col-span-1">
						<TDInputTemplateBr
						placeholder="Interest Amount"
						type="number"
						label="Interest Amount"
						name="interest_amount"
						handleChange={formik.handleChange}
						handleBlur={formik.handleBlur}
						// formControlName={loanDetails[0]?.interest_amount}
						formControlName={formik.values.interest_amount || ""}
						// disabled={true}
						mode={1}
						/>
						{formik.errors.interest_amount && formik.touched.interest_amount ? (
						<VError title={formik.errors.interest_amount} />
						) : null}
						</div>

						<div className="sm:col-span-1 mt-7">
							<button
							className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-slate-600 border-slate-500 bg-slate-700 transition ease-in-out hover:bg-slate-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
							onClick={() => {
							calculatePrincIntarest()
							}}
							>
							<SearchOutlined /> <span className={`ml-2`}>Calculate</span>
							</button>
						</div>

						</div>
						</div>

						{/* <div className="grid grid-cols-4 gap-5 mt-5"> */}

						{formik.values.members?.length > 0 && (
						<>
						{/* <div className="border-2 border-slate-500/50 bg-green-50 rounded-lg p-5 mt-5"> */}

						<div className="text-[#DA4167] text-lg font-bold mb-0 mt-5">
						Member Loan List
						</div>

						{formik.values.members.map((member, index) => (

						<div key={index} className="grid grid-cols-6 gap-5 mt-2">

						<div>
						<TDInputTemplateBr
						placeholder="Loan ID"
						type="text"
						label="Loan ID"
						name={`members.${index}.loan_id`}
						formControlName={member.loan_id}
						disabled={true}
						mode={1}
						/>
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Member Name"
						type="text"
						label="Member Name"
						name={`members.${index}.member_name`}
						formControlName={member.member_name}
						disabled={true}
						mode={1}
						/>
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Amount"
						type="number"
						label="Amount"
						name={`members.${index}.cr_amt`}
						formControlName={member.cr_amt}
						disabled={true}
						mode={1}
						/>
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Outstanding Amount"
						type="number"
						label="Outstanding Amount"
						name={`members.${index}.mem_outstanding`}
						formControlName={member.mem_outstanding}
						disabled={true}
						mode={1}
						/>
						</div>

						<div>
						<TDInputTemplateBr
						placeholder="Principal Amount"
						type="text"
						label="Principal Amount"
						name={`members.${index}.princAmt`}
						formControlName={member.princAmt}
						// disabled={true}
						mode={1}
						/>
						</div>

						<div>
						<TDInputTemplateBr
						placeholder=" Interest Amount"
						type="text"
						label=" Interest Amount"
						name={`members.${index}.intAmt`}
						formControlName={member.intAmt}
						// disabled={true}
						mode={1}
						/>
						</div>

						</div>

						))}

						<div className="grid grid-cols-6 gap-2 mt-2 bg-slate-100 p-2 rounded-lg bg-slate-200">
							<div className="text-black font-semibold text-base">Total</div>
							<div></div>
							<div className="pl-3 text-base">
							{formik.values.members.reduce(
                            (sum, item) => sum + Number(item.cr_amt || 0),
                            0
                            )}
							</div>
							<div className="pl-3 text-base">
							{formik.values.members.reduce(
                            (sum, item) => sum + Number(item.mem_outstanding || 0),
                            0
                            )}
							</div>
							<div className="pl-3 text-base">
							{formik.values.members.reduce(
                            (sum, item) => sum + Number(item.princAmt || 0),
                            0
                            )}
							</div>
							<div className="pl-3 text-base">
							{formik.values.members.reduce(
                            (sum, item) => sum + Number(item.intAmt || 0),
                            0
                            )}
							</div>
						</div>

						{/* </div> */}
						</>
						)}

						

						{/* </div> */}
					
					</>
					)}
					
					
				</main>
			</Spin>
		</div>
	)
}

export default LoanDetails
