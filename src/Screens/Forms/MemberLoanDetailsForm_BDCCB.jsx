import React, { useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import { useNavigate } from "react-router-dom"
// import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url, url_bdccb } from "../../Address/BaseUrl"
import { Badge, Spin, Card, Tooltip } from "antd"
import {
	CheckCircleOutlined,
	FileExcelOutlined,
	LoadingOutlined,
	PrinterOutlined,
} from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"
import DialogBox from "../../Components/DialogBox"
// import { disableInputArray } from "./disableInputArray"
import { disableCondition } from "./disableCondition"
import { getOrdinalSuffix } from "../../Utils/ordinalSuffix"
import { txnDetailsHeader } from "../../Utils/Reports/headerMap"
import { exportToExcel } from "../../Utils/exportToExcel"
import { printTableReport } from "../../Utils/printTableReport"
import moment from "moment"
import { getLocalStoreTokenDts } from "../../Components/getLocalforageTokenDts"
import { routePaths } from "../../Assets/Data/Routes"
import { saveMasterData } from "../../services/masterService"

function MemberLoanDetailsForm_BDCCB() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const personalDetails = {}
	const loanType = "R"

	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [visible, setVisible] = useState(() => false)
	const [visible2, setVisible2] = useState(() => false)
	const [visible3, setVisible3] = useState(() => false)

	const [disburseOrNot, setDisburseOrNot] = useState(() => false)
	const [maxDisburseAmountForAScheme, setMaxDisburseAmountForAScheme] =
		useState(() => "")

	const [purposeOfLoan, setPurposeOfLoan] = useState(() => [])
	const [subPurposeOfLoan, setSubPurposeOfLoan] = useState(() => [])

	const [schemes, setSchemes] = useState(() => [])
	const [funds, setFunds] = useState(() => [])
	const [tnxTypes, setTnxTypes] = useState(() => [])
	const [tnxModes, setTnxModes] = useState(() => [])
	const [banks, setBanks] = useState(() => [])

	const [fetchedLoanData, setFetchedLoanData] = useState(() => Object)
	const [fetchedTnxData, setFetchedTnxData] = useState(() => Object)
	const [tnxDetails, setTnxDetails] = useState([])
	const [changedPayment, setChangedPayment] = useState(null)

	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)

	console.log(params, "params")
	console.log(location, "location")
	// console.log(memberDetails, "memberDetails")
	console.log("U/A", loanType)

	const [memberLoanDetailsData, setMemberLoanDetailsData] = useState({
		loan_id: "",
		trans_id: "",
		trans_dt: "",
		trans_type: "",
		dr_amt: "",
		cr_amt: "",
		curr_prn: "",
		approval_status: ""
	})

	const handleChangeMemberLoanDetails = (e) => {
		const { name, value } = e.target
		setMemberLoanDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	// const [memberTxnDetailsData, setMemberTxnDetailsData] = useState([
	// 	{
	// 		payment_id: "",
	// 		txn_date: "",
	// 	},
	// ])

	const handleChangeTxnDetails = (index, e) => {
		const { name, value } = e.target
		setTnxDetails((prevData) => {
			const updatedData = [...prevData]
			updatedData[index][name] = value
			return updatedData
		})

		// If the changed field is "payment_date", capture the new date and the payment_id.
		if (name === "payment_date") {
			// Note: payment_id is assumed to be already present in tnxDetails.
			setChangedPayment({
				payment_date: value,
				payment_id: tnxDetails[index]?.payment_id,
				tr_type: tnxDetails[index]?.tr_type,
			})
		}
	}

	const handleFetchMemberLoanDetails = async () => {
		setLoading(true)
		const creds = {
			loan_id: params?.id,
			branch_code: userDetails[0]?.brn_code,
			tenant_id: userDetails[0]?.tenant_id,
		}


		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios
			.post(`${url_bdccb}/loan/fetch_trans_dtls`, creds, {
			headers: {
			Authorization: `${tokenValue?.token}`, // example header
			"Content-Type": "application/json", // optional
			},
			})
			.then((res) => {
				
				// if(res?.data?.suc === 0){
				// // Message('error', res?.data?.msg)
				// // navigate(routePaths.LANDING)
				// // localStorage.clear()
				// } else {
				if(res?.data?.success){
				// console.log(res?.data?.data[0], 'ddddddddddddddddddddd', creds);
				// setMemberLoanDetailsData({
				// 	loan_id: res?.data?.data[0]?.loan_id,
				// 	trans_id: "",
				// 	trans_dt: "",
				// 	trans_type: "",
				// 	dr_amt: "",
				// 	cr_amt: "",
				// 	curr_prn: "",
				// 	approval_status: ""
				// })
				setTnxDetails(res?.data?.data || [])

				} else {
				// Message('error', res?.data?.msg)
				navigate(routePaths.LANDING)
				localStorage.clear()
				}
				
			})
			.catch((err) => {
				console.log("&&& ERR", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		handleFetchMemberLoanDetails()
	}, [])

	const getPurposeOfLoan = async () => {
		setLoading(true)

		const tokenValue = await getLocalStoreTokenDts(navigate);

		await axios
			.get(`${url}/get_purpose`, {
			headers: {
			Authorization: `${tokenValue?.token}`, // example header
			"Content-Type": "application/json", // optional
			},
			})

			.then((res) => {
				
				if(res?.data?.suc === 0){
				// Message('error', res?.data?.msg)
				// navigate(routePaths.LANDING)
				// localStorage.clear()
				} else {
				setPurposeOfLoan(res?.data?.msg)
				}

			})
			.catch((err) => {
				console.log("+==========+", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		getPurposeOfLoan()
	}, [])

	

	const getFunds = async () => {
		setLoading(true)
		const tokenValue = await getLocalStoreTokenDts(navigate);
		await axios
			.get(`${url}/get_fund`, {
headers: {
Authorization: `${tokenValue?.token}`, // example header
"Content-Type": "application/json", // optional
},
})
			.then((res) => {
				
if(res?.data?.suc === 0){
// Message('error', res?.data?.msg)
// navigate(routePaths.LANDING)
// localStorage.clear()
} else {
				setFunds(res?.data?.msg)
}
			})
			.catch((err) => {
				console.log("err", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		getFunds()
	}, [])

	const saveLoanDetails = async () => {
		const creds = {
			purpose: memberLoanDetailsData?.purposeId,
			// sub_purpose: memberLoanDetailsData?.subPurposeId,
			// sub_purpose: 0,
			// fund_id: memberLoanDetailsData?.fundId,
			// tot_emi: memberLoanDetailsData?.totalEMI,
			disb_dt: formatDateToYYYYMMDD(memberLoanDetailsData?.disbursementDate),
			modified_by: userDetails?.emp_id,
			loan_id: params?.id,
		}
		console.log("DSDS", creds)
		await axios
			.post(`${url}/admin/save_loan_details`, creds)
			.then((res) => {
				console.log("SAVE LOAN DTLSSSS", res?.data)
				Message("success", res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRR:S:S:S", err)
			})
	}

	

	// Save the transaction details by calling the API.
	const saveTxnDetails = async (payment_date, payment_id, tr_type) => {
		setLoading(true)
		const creds = {
			payment_date,
			payment_id,
			loan_id: params?.id,
			modified_by: userDetails?.emp_id,
			tr_type,
		}

		console.log("Saving transaction details:", creds)
		try {
			const res = await axios.post(`${url}/admin/change_loan_trans_date`, creds)
			console.log("Transaction details saved:", res?.data)
			Message("success", res?.data?.msg)
		} catch (err) {
			console.log("Error saving transaction details:", err)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (changedPayment) {
			saveTxnDetails(
				changedPayment.payment_date,
				changedPayment.payment_id,
				changedPayment.tr_type
			)

			setChangedPayment(null)
		}
	}, [changedPayment])

	//////////////////////////////////////////////////
	//////////////////////////////////////////////////

	const onSubmit = (e) => {
		e.preventDefault()

		setVisible(true)
	}

	let totalCredit = 0
	let totalDebit = 0

	const disableCondition = () => {
		return userDetails?.id === 4
	}

	const dataToExport = tnxDetails

	const headersToExport = txnDetailsHeader

	const fileName = `Txn_Details_${new Date().toLocaleString("en-GB")}.xlsx`


	const getClientIP = async () => {
		const res = await fetch("https://api.ipify.org?format=json")
		const data = await res.json()
		return data.ip
	}

		const approveDisbursement = async () => {

			setLoading(true)
	
					const ip = await getClientIP()
	
					const creds = {
					tenant_id: userDetails[0]?.tenant_id,
					branch_id: userDetails[0]?.brn_code,
					voucher_dt: formatDateToYYYYMMDD(new Date()),
					voucher_id: 0,
					trans_id: tnxDetails[0]?.trans_id,
					voucher_type: "J",
					acc_code: "23101",
					trans_type: tnxDetails[0]?.trans_type,
					dr_amt: tnxDetails[0]?.disb_amt,
					cr_amt: tnxDetails[0]?.disb_amt,
					loan_id: tnxDetails[0]?.loan_id,
					// member_loan_id: tnxDetails[0]?.loan_id,
					created_by: userDetails[0]?.emp_id,
					ip_address: ip,
				}
	
	
					// console.log(creds, 'formDataformDataformDataformData', tnxDetails[0]?.main_trans_id);
					// return
	
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

	return (
		<>
			{/* {disburseOrNot && (
				<Badge.Ribbon
					className="bg-slate-500 absolute top-10 z-10"
					text={<div className="font-bold">Recovery Initiated</div>}
					style={{
						fontSize: 17,
						width: 200,
						height: 28,
						justifyContent: "start",
						alignItems: "center",
						textAlign: "center",
					}}
				></Badge.Ribbon>
			)} */}
			{/* <div className="ml-14 mt-5 flex flex-col justify-start align-middle items-start gap-2">
				<div className="text-sm text-wrap w-96 italic text-blue-800">
					CO: {recoveryDetailsData?.b_coName || "Nil"}, AT:{" "}
					{new Date(recoveryDetailsData?.b_coCreatedAt || "Nil").toLocaleString(
						"en-GB"
					)}
				</div>
				<div className="text-sm text-wrap w-96 italic text-blue-800">
					CO Location: {recoveryDetailsData?.b_coLocation || "Nil"}
				</div>
			</div> */}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={onSubmit}>
					<div>
						{/* ///////////////////////// */}

						{/* ///////////////////////// */}

						<div>
							{/* <div className="w-full my-10 border-t-4 border-gray-500 border-dashed"></div> */}
							<div className="text-xl mb-2 mt-5 text-[#DA4167] font-semibold underline">
								Transaction Details
							</div>
						</div>

						<div>
							<Spin spinning={loading}>
								<div
									className={`relative overflow-x-auto shadow-md sm:rounded-lg`}
								>
									{/* {JSON.stringify(tnxDetails, 2)} */}
										{/* ////
									{JSON.stringify(dataToExport, 2)} */}

									<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
										<thead className="text-xs text-slate-50 uppercase bg-slate-700 dark:bg-gray-700 dark:text-gray-400">
											<tr>
												<th scope="col" className="px-6 py-3 font-semibold">
													Sl. No.
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Loan Id
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Transaction ID
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Transaction Date
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Transaction Type
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Debit Amount 
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Credit Amount 
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Outstanding Amount
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Approval Status
												</th>
												
												{/* <th scope="col" className="px-6 py-3 font-semibold">
													Approve Details
												</th> */}
												
											</tr>
										</thead>
										<tbody>

											

											{tnxDetails?.map((item, i) => {
												totalCredit += item?.credit
												totalDebit += item?.debit

												if (item?.tr_type === "I" && userDetails?.id !== 4) {
													return null
												}

												return (
													<>
														<tr
															key={i}
															className={`bg-slate-50 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600`}
														>
															<td
																scope="row"
																className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
															>
																{i + 1}
															</td>
															<td className="px-6 py-4">
																{item?.loan_id}
																{/* {new Date(item?.payment_date).toLocaleDateString(
																"en-GB"
															) || ""} */}

																{/* <div>
																	<TDInputTemplateBr
																		placeholder="Payment Date..."
																		type="date"
																		name="payment_date"
																		formControlName={formatDateToYYYYMMDD(
																			new Date(item?.payment_date)
																		)}
																		handleChange={(e) =>
																			handleChangeTxnDetails(i, e)
																		}
																		mode={1}
																		disabled={
																			// !(
																			// 	item?.tr_type === "I" ||
																			// 	item?.tr_type === "R" ||
																			// 	item?.tr_type === "D"
																			// ) || userDetails?.id !== 4
																			true
																		}
																	/>
																</div> */}
															</td>
															<td className="px-6 py-4">{item?.trans_id}</td>
															<td className="px-6 py-4">{item?.trans_dt}</td>
															<td className="px-6 py-4">{item?.trans_type == 'D' ? 'Disbursement' : ''}</td>
															<td className="px-6 py-4">{item?.dr_amt || 0}/-</td>
															<td className="px-6 py-4">{item?.cr_amt || 0}/-</td>
															<td className="px-6 py-4">{item?.curr_prn || 0}/-</td>
															<td className="px-6 py-4">{item?.approval_status}</td>
{/* 															
															<td
																className={`px-6 py-4 ${
																	item?.status === "A"
																		? "text-green-600"
																		: item?.status === "U"
																		? "text-red-600"
																		: ""
																}`}
															>
																{item?.status === "A"
																	? "Approved"
																	: item?.status === "U"
																	? "Unapproved"
																	: "Error"}
															</td>
															
													<td>
														{item?.approved_by && `${item?.approved_by} - `}
														{item?.approved_at && `${moment(item?.approved_at).format('DD/MM/YYYY')}`}

													</td> */}
														</tr>
													</>
												)
											})}
											{/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
												<td className="px-6 py-4 font-medium" colSpan={3}>
													Total Outstanding
												</td>
												<td className="px-6 py-4 text-left" colSpan={2}>
													564654
												</td>
											</tr> */}
											{/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600">
												<td colSpan={4} className="px-6 py-4 font-semibold">
													Total
												</td>
												<td
													colSpan={1}
													className="px-6 py-4 text-left font-semibold"
												>
													{totalDebit?.toFixed(2)}/-
												</td>
												<td
													colSpan={5}
													className="px-6 py-4 text-left font-semibold"
												>
													{totalCredit?.toFixed(2)}/-
												</td>
											</tr> */}
										</tbody>
									</table>
								</div>
							</Spin>
						</div>
						{tnxDetails[0]?.approval_status == 'Unapproved' &&(
						<div className="flex justify-center mt-8">
						<button
						className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
						onClick={async () => {
						// await checkingBeforeApprove()
						setVisible(true)
						}}
						>
						<CheckCircleOutlined /> <span className={`ml-2`}>Accept Transaction</span>
						</button>
						</div>
						)}
						

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

						{/* {!disableCondition() && (
							<div className="text-center mt-6">
								<button
									className="p-2 px-6 bg-teal-500 text-slate-50 rounded-xl hover:bg-green-500 active:ring-2 active:ring-slate-500"
									type="button"
									onClick={() => setVisible2(true)}
								>
									SAVE TRANSACTION DETAILS
								</button>
							</div>
						)} */}

						{/* ////////////////////////////////////////////////////// */}
					</div>
				</form>
				<div className="flex gap-4">
					<Tooltip title="Export to Excel">
						<button
							onClick={() =>{
								const dt = dataToExport.map(el => {
									 el.approve_details = `${el.approved_by ? el.approved_by + ' - ' : ''}` +  `${el.approved_at ? moment(el.approved_at).format('DD/MM/YYYY') : ''}`;
									 return el;
								});
								exportToExcel(dt, headersToExport, fileName, [0]);
							}
							}
							className={
								dataToExport?.length > 0
									? "mt-5 justify-center items-center rounded-full text-green-900"
									: "mt-5 justify-center items-center rounded-full text-green-300"
							}
							disabled={dataToExport?.length === 0}
						>
							<FileExcelOutlined
								style={{
									fontSize: 30,
								}}
							/>
						</button>
					</Tooltip>
					<Tooltip title="Print">
						<button
							onClick={() =>
								printTableReport(
									dataToExport,
									headersToExport,
									fileName?.split(".")[0],
									[0]
								)
							}
							className={
								dataToExport?.length > 0
									? "mt-5 justify-center items-center rounded-full text-pink-600"
									: "mt-5 justify-center items-center rounded-full text-pink-300"
							}
							disabled={dataToExport?.length === 0}
						>
							<PrinterOutlined
								style={{
									fontSize: 30,
								}}
							/>
						</button>
					</Tooltip>
				</div>
			</Spin>

			{/* For Approve */}
			{/* <DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={async () => {
					// recoveryLoanApprove()
					await saveLoanDetails()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/> */}

			{/* For Reject */}
			<DialogBox
				flag={4}
				onPress={() => setVisible2(!visible2)}
				visible={visible2}
				onPressYes={async () => {
					// handleApproveLoanDisbursement()
					// recoveryLoanReject()
					await saveTxnDetails()
					setVisible2(!visible2)
				}}
				onPressNo={() => setVisible2(!visible2)}
			/>

			{/* <DialogBox
				flag={4}
				onPress={() => setVisible3(!visible3)}
				visible={visible3}
				onPressYes={() => {
					// handleRejectLoanDisbursement()
					setVisible3(!visible3)
				}}
				onPressNo={() => setVisible3(!visible3)}
			/> */}
		</>
	)
}

export default MemberLoanDetailsForm_BDCCB
