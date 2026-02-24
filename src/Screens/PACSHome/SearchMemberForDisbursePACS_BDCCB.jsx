import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url, url_bdccb } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin, Button } from "antd"
import { LoadingOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import LoanApplicationsTableViewBr from "../../Components/LoanApplicationsTableViewBr.jsx__BDCCB"
import Radiobtn from "../../Components/Radiobtn"
import LoanApplicationsDisburseTable from "../../Components/LoanApplicationsDisburseTable"
import { getLocalStoreTokenDts } from "../../Components/getLocalforageTokenDts"
import { useNavigate } from "react-router"
import { routePaths } from "../../Assets/Data/Routes"
import DisbursmentForm_BDCCB from "../Forms/DisbursmentForm_BDCCB"
import LoanApplicationsDisburseTable_BDCCB from "../../Components/LoanApplicationsDisburseTable_BDCCB"
import { motion } from "framer-motion"

const options_Disburs = [
	{
		label: "Acceptance Pending",
		value: "U",
	},
	{
		label: "Accepted",
		value: "A",
	}
]

function SearchMemberForDisburseBM_BDCCB() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [searchKeywords, setSearchKeywords] = useState(() => "")
	const [loanApplications, setLoanApplications] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])

	const [disbursementStatus, setDisbursementStatus] = useState("U")
	const navigate = useNavigate()

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setDisbursementStatus(e)
	}

	useEffect(() => {
		fetchApproveUapprove()
	}, [disbursementStatus])


	const fetchApproveUapprove = async () => {
		setLoading(true)
		const creds = {
			branch_id: userDetails[0]?.brn_code,
			approval_status: disbursementStatus,
			loan_to : "P"
		}
		const tokenValue = await getLocalStoreTokenDts(navigate);
		await axios
			// .post(`${url}/admin/fetch_loan_application_dtls`, creds)
			.post(`${url_bdccb}/loan/show_loan_status`, creds, {
				headers: {
					Authorization: `${tokenValue?.token}`, // example header
					"Content-Type": "application/json", // optional
				},
			})
			.then((res) => {

				if(res?.data?.success){
					console.log(res?.data?.data, 'dataaaaaaaaaaa', creds);
					
					setLoanApplications(res?.data?.data)
					setCopyLoanApplications(res?.data?.data)
				} else {
					Message('error', res?.data?.msg)
					navigate(routePaths.LANDING)
					localStorage.clear()
					
				}
				

			})
			.catch((err) => {
				Message("error", "Some error occurred while searching...")
			})
		setLoading(false)
	}

		const setSearch = (word) => {
		console.log(word, "wordwordwordword")
		setLoanApplications(
			copyLoanApplications?.filter(
				(e) =>
					e?.loan_acc_no
						?.toString()
						?.toLowerCase()
						.includes(word?.toLowerCase()) ||
					e?.loan_acc_no
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
	}



	return (
		<div>
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-10 mx-32">

					<Radiobtn
						data={options_Disburs}
						val={disbursementStatus}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>

					<motion.section
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
								>
									<div
										className={`flex flex-col bg-slate-800
										 rounded-lg my-3 dark:bg-slate-800
										 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-1.5`}
									>
										<div className="w-full flex flex-row-reverse justify-between items-center mx-4">
											{/* <div className="flex items-center justify-between"> */}
												
												
					
												{/* <label htmlFor="simple-search" className="sr-only">
													Search
												</label> */}
												<button
												className="bg-slate-100 p-3 h-11 rounded-full float-right text-center ml-3"
												onClick={() => {
													navigate(`/homepacs/disburseloan/0`)
												}}
											>
												<PlusOutlined className="text-xl" />
											</button>
												{/* {showSearch && ( */}
													<div className="relative w-full">
														<div className="absolute inset-y-0 left-0 flex items-center md:ml-4 pl-3 pointer-events-none">
															<svg
																aria-hidden="true"
																className="w-5 h-5 text-gray-500 dark:text-gray-400"
																fill="currentColor"
																viewBox="0 0 20 20"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	fillRule="evenodd"
																	d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
														<motion.input
															type="text"
															id="simple-search"
															initial={{ opacity: 0, width: 0 }}
															animate={{ opacity: 1, width: "95%" }}
															transition={{ delay: 1.1, type: "just" }}
															className={`bg-white border rounded-lg  border-slate-700 bg-slate-300"
															 text-gray-800 block w-full h-12 pl-10 dark:bg-gray-800 md:ml-4 duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-lg `}
															placeholder="Search By Loan Account No."
															required=""
															onChange={(text) => setSearch(text.target.value)}
														/>
													</div>
												{/* )} */}
					
												<motion.h2
													initial={{ opacity: 0, y: -50 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ delay: 1, type: "just" }}
													className="text-xl capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-4"
												>
													{"Indirect Loan"}
												</motion.h2>
											{/* </div> */}
										</div>
									</div>
								</motion.section>

					{/* <div className="mt-0">
						<label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
						<div className="relative mt-5">
							<div className="absolute inset-y-0  start-0 flex items-center ps-3 pointer-events-none">
								<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
								</svg>
							</div>
							<input type="search" id="default-search" className="block mt-5 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500" placeholder="Search by Group No./Group Name"

								
								onChange={(e) => setSearch(e.target.value)}
							/>
							<button type="submit" className="text-white absolute end-2.5 disabled:bg-slate-800 bottom-2.5 bg-slate-800 bg-slate-800 focus:ring-4 
		focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								
								onClick={() => {
									navigate(`/homepacs/disburseloan/0`)
								}}
							><PlusOutlined className="text-xl" /> New Disburse </button>



						</div>
					</div> */}


					{/* <DisbursmentForm_BDCCB /> */}
					{/* {JSON.stringify(loanApplications, 2)} */}
					<LoanApplicationsDisburseTable_BDCCB
						flag="BM"
						loanAppData={loanApplications}
						title="Disburse Loan"
					showSearch={true}
					disbursementStatus={disbursementStatus}
					setSearch={(data) => setSearch(data)}
					/>

					

					{/* <DialogBox
					visible={visible}
					flag={flag}
					onPress={() => setVisible(false)}
				/> */}
				</main>
			</Spin>
		</div>
	)
}

export default SearchMemberForDisburseBM_BDCCB
